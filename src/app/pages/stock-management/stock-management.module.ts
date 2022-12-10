import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StockManagementRoutingModule } from './stock-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StockManagementComponent } from './stock-management.component';
import { DialogComponent } from './components/dialog/dialog.component';

@NgModule({
      declarations: [
            StockManagementComponent,
            DialogComponent
      ],
      imports: [
            CommonModule,
            ReactiveFormsModule,
            StockManagementRoutingModule,
            SharedModule
      ]
})
export class StockManagementModule { }
