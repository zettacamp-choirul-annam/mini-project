import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerComponent } from './components/container/container.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ContentComponent } from './components/content/content.component';

import { SpinbarComponent } from './components/spinbar/spinbar.component';
import { MenuCardComponent } from './components/menu-card/menu-card.component';

import { MaterialsModule } from './modules/materials.module';
import { IconsModule } from './modules/icons.module';
import { QuantityInputComponent } from './components/quantity-input/quantity-input.component';

@NgModule({
      declarations: [
            ContainerComponent,
            ToolbarComponent,
            ContentComponent,
            SpinbarComponent,
            MenuCardComponent,
            QuantityInputComponent,
            ContainerComponent,
      ],
      imports: [
            CommonModule,
            MaterialsModule,
            IconsModule
      ],
      exports: [
            ContainerComponent,
            ToolbarComponent,
            ContentComponent,
            
            SpinbarComponent,
            MenuCardComponent,
            QuantityInputComponent,
            
            MaterialsModule,
            IconsModule
      ]
})
export class SharedModule { }
