import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

const subroutes: Routes = [
      { path: '', pathMatch: 'full', redirectTo: '/home' },
      { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
      { path: 'menu', loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuModule) },
      { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule) },
      { path: 'transaction', loadChildren: () => import('./pages/transaction/transaction.module').then(m => m.TransactionModule) },
      { path: 'menu-management', loadChildren: () => import('./pages/menu-management/menu-management.module').then(m => m.MenuManagementModule) },
      { path: 'stock-management', loadChildren: () => import('./pages/stock-management/stock-management.module').then(m => m.StockManagementModule) },
];

const routes: Routes = [
      { path: '', component: ShellComponent, children: subroutes },
      { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
      imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
      exports: [RouterModule]
})
export class AppRoutingModule { }
