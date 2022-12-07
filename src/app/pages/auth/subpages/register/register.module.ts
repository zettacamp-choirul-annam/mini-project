import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterComponent } from './register.component';

@NgModule({
      declarations: [
            RegisterComponent
      ],
      imports: [
            CommonModule,
            RegisterRoutingModule,
            SharedModule
      ]
})
export class RegisterModule { }
