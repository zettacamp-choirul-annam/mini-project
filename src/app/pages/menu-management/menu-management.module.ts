import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuManagementRoutingModule } from './menu-management-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuManagementComponent } from './menu-management.component';
import { DialogComponent } from './components/dialog/dialog.component';

@NgModule({
      declarations: [
            MenuManagementComponent,
            DialogComponent
      ],
      imports: [
            CommonModule,
            ReactiveFormsModule,
            MenuManagementRoutingModule,
            SharedModule
      ]
})
export class MenuManagementModule { }
