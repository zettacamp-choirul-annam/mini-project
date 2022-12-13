import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionRoutingModule } from './transaction-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { TransactionComponent } from './transaction.component';
import { TransactionDialogComponent } from './components/transaction-dialog/transaction-dialog.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { TransactionRatingComponent } from './components/transaction-rating/transaction-rating.component';
import { TransactionRateInputComponent } from './components/transaction-rate-input/transaction-rate-input.component';

@NgModule({
      declarations: [
            TransactionComponent,
            TransactionDialogComponent,
            TransactionHistoryComponent,
            TransactionRatingComponent,
            TransactionRateInputComponent
      ],
      imports: [
            CommonModule,
            TransactionRoutingModule,
            SharedModule
      ]
})
export class TransactionModule { }
