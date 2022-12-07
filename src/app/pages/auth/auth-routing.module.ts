import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';

const subroutes: Routes = [
      { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
      { path: 'login', loadChildren: () => import('./subpages/login/login.module').then(m => m.LoginModule) },
      { path: 'register', loadChildren: () => import('./subpages/register/register.module').then(m => m.RegisterModule) },
      { path: 'reset-password', loadChildren: () => import('./subpages/reset-password/reset-password.module').then(m => m.ResetPasswordModule) }
];

const routes: Routes = [
      { path: '', component: AuthComponent, children: subroutes },
];

@NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
})
export class AuthRoutingModule { }
