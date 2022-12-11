import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { HomeComponent } from './home.component';
import { HeroComponent } from './components/hero/hero.component';
import { OffersComponent } from './components/offers/offers.component';
import { HighlightComponent } from './components/highlight/highlight.component';
import { AboutComponent } from './components/about/about.component';

@NgModule({
      declarations: [
            HomeComponent,
            HeroComponent,
            OffersComponent,
            HighlightComponent,
            AboutComponent
      ],
      imports: [
            CommonModule,
            HomeRoutingModule,
            SharedModule
      ]
})
export class HomeModule { }
