import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login.component';

@NgModule({
      declarations: [
            LoginComponent
      ],
      imports: [
            CommonModule,
            ReactiveFormsModule,
            LoginRoutingModule,
            SharedModule
      ]
})
export class LoginModule { }
