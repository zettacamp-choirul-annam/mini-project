import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthComponent } from './auth.component';

@NgModule({
      declarations: [
            AuthComponent
      ],
      imports: [
            CommonModule,
            AuthRoutingModule,
            SharedModule
      ]
})
export class AuthModule { }
