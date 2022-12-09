import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

const subroutes: Routes = [
      { path: '', pathMatch: 'full', redirectTo: '/home' },
      { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
      { path: 'menu', loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuModule) },
      { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule) },
      { path: 'transaction', loadChildren: () => import('./pages/transaction/transaction.module').then(m => m.TransactionModule) },
];

const routes: Routes = [
      { path: '', component: ShellComponent, children: subroutes },
      { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule]
})
export class AppRoutingModule { }
