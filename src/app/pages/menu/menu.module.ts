import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuComponent } from './menu.component';
import { DialogComponent } from './components/dialog/dialog.component';

@NgModule({
      declarations: [
            MenuComponent,
            DialogComponent
      ],
      imports: [
            CommonModule,
            MenuRoutingModule,
            SharedModule
      ]
})
export class MenuModule { }
