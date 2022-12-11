import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerComponent } from './components/container/container.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ContentComponent } from './components/content/content.component';

import { SpinbarComponent } from './components/spinbar/spinbar.component';
import { MenuCardComponent } from './components/menu-card/menu-card.component';
import { QuantityInputComponent } from './components/quantity-input/quantity-input.component';

import { MaterialsModule } from './modules/materials.module';
import { IconsModule } from './modules/icons.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

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
            IconsModule,
            NgxSkeletonLoaderModule
      ],
      exports: [
            ContainerComponent,
            ToolbarComponent,
            ContentComponent,
            
            SpinbarComponent,
            MenuCardComponent,
            QuantityInputComponent,
            
            MaterialsModule,
            IconsModule,
            NgxSkeletonLoaderModule
      ]
})
export class SharedModule { }
