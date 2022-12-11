import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerComponent } from './components/container/container.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ContentComponent } from './components/content/content.component';

import { SpinbarComponent } from './components/spinbar/spinbar.component';
import { MenuCardComponent } from './components/menu-card/menu-card.component';
import { QuantityInputComponent } from './components/quantity-input/quantity-input.component';
import { LangSwitchComponent } from './components/lang-switch/lang-switch.component';

import { MaterialsModule } from './modules/materials.module';
import { IconsModule } from './modules/icons.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
      declarations: [
            ContainerComponent,
            ToolbarComponent,
            ContentComponent,
            SpinbarComponent,
            MenuCardComponent,
            QuantityInputComponent,
            LangSwitchComponent,
            ContainerComponent,
      ],
      imports: [
            CommonModule,
            MaterialsModule,
            IconsModule,
            NgxSkeletonLoaderModule,
            TranslateModule
      ],
      exports: [
            ContainerComponent,
            ToolbarComponent,
            ContentComponent,
            
            SpinbarComponent,
            MenuCardComponent,
            QuantityInputComponent,
            LangSwitchComponent,
            
            MaterialsModule,
            IconsModule,
            NgxSkeletonLoaderModule,
            TranslateModule
      ]
})
export class SharedModule { }
