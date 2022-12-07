import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { ShellComponent } from './shell/shell.component';

import { HeaderModule } from './shell/header/header.module';
import { FooterModule } from './shell/footer/footer.module';

@NgModule({
      declarations: [
            AppComponent,
            ShellComponent
      ],
      imports: [
            BrowserModule,
            BrowserAnimationsModule,
            HttpClientModule,
            AppRoutingModule,
            GraphQLModule,
            SharedModule,
            HeaderModule,
            FooterModule
      ],
      providers: [],
      bootstrap: [AppComponent]
})
export class AppModule { }
