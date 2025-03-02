import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

// Import your components
import { OrderFormComponent } from './components/order-form/order-form.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';

export const routes: Routes = [
  { path: '', redirectTo: 'chleb/formularz', pathMatch: 'full' }, // Default route
  { path: 'chleb/formularz', component: OrderFormComponent },
  { path: 'chleb/zamowienia', component: OrderSummaryComponent }
];

// Provide routes in your app
export const appRouter = provideRouter(routes);
