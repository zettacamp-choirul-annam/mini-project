import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRoutingModule } from './cart-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { CartComponent } from './cart.component';
import { CartCardComponent } from './components/cart-card/cart-card.component';

@NgModule({
      declarations: [
            CartComponent,
            CartCardComponent
      ],
      imports: [
            CommonModule,
            CartRoutingModule,
            SharedModule
      ]
})
export class CartModule { }
