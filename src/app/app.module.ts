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
// ✅ 引入 MatDialogModule
import { MatDialogModule } from '@angular/material/dialog';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { MyProductComponent } from './components/my-product/my-product.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { MyarticlesComponent } from './components/myarticles/myarticles.component';
import { LayoutComponent } from './components/layout/layout.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventManagementComponent } from './components/event-management/event-management.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './components/cart/cart.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ProductPipe } from './pipes/product.pipe';
import { AttractionTicketComponent } from './components/attraction-ticket/attraction-ticket.component';
import { AttractionAdminComponent } from './components/attraction-admin/attraction-admin.component';
import { SellerOrderComponent } from './components/seller-order/seller-order.component';
import { SellerCenterComponent } from './components/seller-center/seller-center.component';
import { BuyerOrderComponent } from './components/buyer-order/buyer-order.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EventEditDialogComponent } from './components/event-edit-dialog/event-edit-dialog.component';
import { EventFormComponent } from './components/event-form/event-form.component';

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
    EventDetailComponent,
    EventManagementComponent,
    CreateProductComponent,
    CartComponent,
    PaymentComponent,
    ProductPipe,
    AttractionTicketComponent,
    AttractionAdminComponent,
    SellerOrderComponent,
    SellerCenterComponent,
    BuyerOrderComponent,
    WalletComponent,
    EventEditDialogComponent,
    EventFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AgGridModule,
    CKEditorModule,
    MatDialogModule,
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
