import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderComponent } from './header.component';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { HeaderCartComponent } from './components/header-cart/header-cart.component';
import { HeaderProfileComponent } from './components/header-profile/header-profile.component';

@NgModule({
      declarations: [
            HeaderComponent,
            HeaderNavComponent,
            HeaderCartComponent,
            HeaderProfileComponent
      ],
      imports: [
            CommonModule,
            RouterModule,
            SharedModule
      ],
      exports: [
            HeaderComponent
      ]
})
export class HeaderModule { }
