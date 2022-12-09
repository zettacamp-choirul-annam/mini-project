import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionRoutingModule } from './transaction-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TransactionComponent } from './transaction.component';
import { CardComponent } from './components/card/card.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { RateComponent } from './components/rate/rate.component';
import { MenuRateComponent } from './components/menu-rate/menu-rate.component';

@NgModule({
      declarations: [
            TransactionComponent,
            CardComponent,
            DialogComponent,
            RateComponent,
            MenuRateComponent
      ],
      imports: [
            CommonModule,
            TransactionRoutingModule,
            SharedModule
      ]
})
export class TransactionModule { }
