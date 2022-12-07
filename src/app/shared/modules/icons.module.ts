import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import * as feather from 'angular-feather/icons';

@NgModule({
      imports: [FeatherModule.pick(feather.allIcons)],
      exports: [FeatherModule]
})
export class IconsModule { }
