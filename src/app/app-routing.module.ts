import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CartGuard } from './guards/cart.guard';
import { MenuManagementGuard } from './guards/menu-management.guard';
import { MenuGuard } from './guards/menu.guard';
import { StockManagementGuard } from './guards/stock-management.guard';
import { TransactionGuard } from './guards/transaction.guard';
import { ShellComponent } from './shell/shell.component';

const subroutes: Routes = [
      { path: '', pathMatch: 'full', redirectTo: '/home' },
      { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
      { path: 'menu', canActivate: [MenuGuard], loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuModule) },
      { path: 'cart', canActivate: [CartGuard], loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule) },
      { path: 'transaction', canActivate: [TransactionGuard], loadChildren: () => import('./pages/transaction/transaction.module').then(m => m.TransactionModule) },
      { path: 'menu-management', canActivate: [MenuManagementGuard], loadChildren: () => import('./pages/menu-management/menu-management.module').then(m => m.MenuManagementModule) },
      { path: 'stock-management', canActivate: [StockManagementGuard], loadChildren: () => import('./pages/stock-management/stock-management.module').then(m => m.StockManagementModule) },
];

const routes: Routes = [
      { path: '', component: ShellComponent, children: subroutes },
      { path: 'auth', canActivate: [AuthGuard], loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
      imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
      exports: [RouterModule]
})
export class AppRoutingModule { }
