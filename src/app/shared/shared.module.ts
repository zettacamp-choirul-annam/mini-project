import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinbarComponent } from './components/spinbar/spinbar.component';
import { MenuCardComponent } from './components/menu-card/menu-card.component';

import { MaterialsModule } from './modules/materials.module';
import { IconsModule } from './modules/icons.module';
import { QuantityInputComponent } from './components/quantity-input/quantity-input.component';

@NgModule({
      declarations: [
            SpinbarComponent,
            MenuCardComponent,
            QuantityInputComponent
      ],
      imports: [
            CommonModule,
            MaterialsModule,
            IconsModule
      ],
      exports: [
            SpinbarComponent,
            MenuCardComponent,
            QuantityInputComponent,
            
            MaterialsModule,
            IconsModule
      ]
})
export class SharedModule { }
