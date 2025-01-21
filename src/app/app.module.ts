import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocialmediaComponent } from './components/socialmedia/socialmedia.component';
import { AttractionComponent } from './components/attraction/attraction.component';
import { ProductsComponent } from './components/products/products.component';
import { UserComponent } from './components/user/user.component';
import { EventComponent } from './components/event/event.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    SocialmediaComponent,
    AttractionComponent,
    ProductsComponent,
    UserComponent,
    EventComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
