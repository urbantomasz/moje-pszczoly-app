import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { BreadService } from '../../services/bread.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Bread } from '../../models/bread';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css',
})
export class OrderFormComponent implements OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.loadBreads();
  }
  @Input() order!: Order;
  @Input() breadTypes: Bread[] = [];  
  @Input() availableDates: { label: string; value: Date }[] = [];
  availableBreads: Bread[] = [];
  showValidationErrors = true;

  formatDate(date: Date): string {
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  
  getNextWeekday(currentDate: Date, targetDay: number): Date {
    const date = new Date(currentDate);
    const diff = (targetDay + 7 - date.getDay()) % 7 || 7;
    date.setDate(date.getDate() + diff);
    return date;
  }

  updateAvailableBreads() {
    // Get selected bread IDs
    const selectedBreadIds = this.order.items.map(b => b.breadId);
  
    // Update availableBreads but DO NOT REMOVE items, just mark them as disabled
    this.availableBreads = this.breadTypes.map(bread => ({
      ...bread,
      disabled: selectedBreadIds.includes(bread.breadId) // ✅ Mark as disabled
    }));
  }
  
  onBreadSelectionChange(index: number, newBreadId: number) {
    this.updateAvailableBreads();
  }
  
  loadBreads() {
        this.updateAvailableBreads();
        if(this.order.items.length === 0){
          this.addBreadChoice();
        }
  }

  addBreadChoice() {
    const firstAvailable = this.availableBreads.find(b => !b.disabled);
    if (!firstAvailable) return;

    // Select the first available bread that isn't already chosen
    const newBread: OrderItem = { breadId: firstAvailable.breadId, name: firstAvailable.name, quantity: 1 };
    this.order.items.push(newBread);
    this.updateAvailableBreads();
  }


  removeBreadChoice(index: number) {
    this.order.items.splice(index, 1);
    this.updateAvailableBreads();
  }

  increaseQuantity(index: number) {
    if (this.order.items[index].quantity < 30) {
      this.order.items[index].quantity++;
    }
  }

  decreaseQuantity(index: number) {
    if (this.order.items[index].quantity > 1) {
      this.order.items[index].quantity--;
    }
  }

  openConfirmationModal() {
    if (!this.isFormValid()) {
      this.showValidationErrors = true;
      return;
    }
  }

  resetForm() {
    this.order = {
      customerName: '',
      phone: undefined,
      orderDate: this.availableDates[0].value,
      note: undefined,
      items: []
    };
    this.showValidationErrors = false;
  }

  isFormValid(): boolean {
    return this.order.customerName.trim() !== '' &&
           this.order.phone?.toString().length === 9 &&
           this.order.orderDate !== undefined &&
           this.order.items.length > 0;
  }
}
