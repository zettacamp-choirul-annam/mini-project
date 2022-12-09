import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRoutingModule } from './cart-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CartComponent } from './cart.component';
import { CardComponent } from './components/card/card.component';

@NgModule({
      declarations: [
            CartComponent,
            CardComponent
      ],
      imports: [
            CommonModule,
            CartRoutingModule,
            SharedModule
      ]
})
export class CartModule { }
