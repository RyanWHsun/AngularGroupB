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
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
// 引入 AgGridModule
import { AgGridModule } from 'ag-grid-angular';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { MyProductComponent } from './components/my-product/my-product.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { MyarticlesComponent } from './components/myarticles/myarticles.component';
import { LayoutComponent } from './components/layout/layout.component';

@NgModule({
  declarations: [
    AppComponent,
    SocialmediaComponent,
    AttractionComponent,
    ProductsComponent,
    UserComponent,
    EventComponent,
    HomeComponent,
    LoginComponent,
    ProductDetailComponent,
    MyProductComponent,
    UserAddComponent,
    UserLoginComponent,
    UserEditComponent,
    UserPageComponent,
    MyarticlesComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AgGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
