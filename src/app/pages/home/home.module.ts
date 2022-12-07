import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { HeroComponent } from './sections/hero/hero.component';
import { OffersComponent } from './sections/offers/offers.component';
import { HighlightComponent } from './sections/highlight/highlight.component';
import { AboutComponent } from './sections/about/about.component';

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
