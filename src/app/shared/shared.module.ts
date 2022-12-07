import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinbarComponent } from './components/spinbar/spinbar.component';

import { MaterialsModule } from './modules/materials.module';
import { IconsModule } from './modules/icons.module';

@NgModule({
      declarations: [
            SpinbarComponent
      ],
      imports: [
            CommonModule,
            MaterialsModule,
            IconsModule
      ],
      exports: [
            SpinbarComponent,
            
            MaterialsModule,
            IconsModule
      ]
})
export class SharedModule { }
