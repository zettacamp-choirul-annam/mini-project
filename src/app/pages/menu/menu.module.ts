import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { MenuComponent } from './menu.component';
import { MenuDialogComponent } from './components/menu-dialog/menu-dialog.component';

@NgModule({
      declarations: [
            MenuComponent,
            MenuDialogComponent
      ],
      imports: [
            CommonModule,
            MenuRoutingModule,
            SharedModule
      ]
})
export class MenuModule { }
