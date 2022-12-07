import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialsModule } from './modules/materials.module';
import { IconsModule } from './modules/icons.module';

@NgModule({
      declarations: [],
      imports: [
            CommonModule,
            MaterialsModule,
            IconsModule
      ],
      exports: [
            MaterialsModule,
            IconsModule
      ]
})
export class SharedModule { }
