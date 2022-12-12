import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { HomeComponent } from './home.component';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { HomeOffersComponent } from './components/home-offers/home-offers.component';
import { HomeHighlightComponent } from './components/home-highlight/home-highlight.component';
import { HomeAboutComponent } from './components/home-about/home-about.component';

@NgModule({
      declarations: [
            HomeComponent,
            HomeHeroComponent,
            HomeOffersComponent,
            HomeHighlightComponent,
            HomeAboutComponent
      ],
      imports: [
            CommonModule,
            HomeRoutingModule,
            SharedModule
      ]
})
export class HomeModule { }
