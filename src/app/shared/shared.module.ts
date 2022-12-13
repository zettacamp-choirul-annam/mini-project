import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerComponent } from './components/container/container.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ContentComponent } from './components/content/content.component';

import { SpinbarComponent } from './components/spinbar/spinbar.component';
import { MenuCardComponent } from './components/menu-card/menu-card.component';
import { QuantityInputComponent } from './components/quantity-input/quantity-input.component';
import { LangSwitchComponent } from './components/lang-switch/lang-switch.component';
import { TabComponent } from './components/tab/tab.component';
import { RateInputComponent } from './components/rate-input/rate-input.component';

import { MaterialsModule } from './modules/materials.module';
import { IconsModule } from './modules/icons.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
      declarations: [
            ContainerComponent,
            ContainerComponent,
            ToolbarComponent,
            ContentComponent,
            
            SpinbarComponent,
            MenuCardComponent,
            QuantityInputComponent,
            LangSwitchComponent,
            TabComponent,
            RateInputComponent
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
            TabComponent,
            RateInputComponent,
            
            MaterialsModule,
            IconsModule,
            NgxSkeletonLoaderModule,
            TranslateModule
      ]
})
export class SharedModule { }
