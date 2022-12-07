import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderComponent } from './header.component';
import { NavComponent } from './components/nav/nav.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CartComponent } from './components/cart/cart.component';

@NgModule({
      declarations: [
            HeaderComponent,
            NavComponent,
            ProfileComponent,
            CartComponent
      ],
      imports: [
            CommonModule,
            RouterModule,
            SharedModule
      ],
      exports: [
            HeaderComponent
      ]
})
export class HeaderModule { }
