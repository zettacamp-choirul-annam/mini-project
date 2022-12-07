import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
      declarations: [
            ResetPasswordComponent
      ],
      imports: [
            CommonModule,
            ResetPasswordRoutingModule,
            SharedModule
      ]
})
export class ResetPasswordModule { }
