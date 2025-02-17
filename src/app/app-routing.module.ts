import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AttractionComponent } from './components/attraction/attraction.component';
import { EventComponent } from './components/event/event.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component'; // ✅ 修正為頁面
import { EventManagementComponent } from './components/event-management/event-management.component';
import { ProductsComponent } from './components/products/products.component';
import { SocialmediaComponent } from './components/socialmedia/socialmedia.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { MyProductComponent } from './components/my-product/my-product.component';
import { UserAddComponent } from './components/user-add/user-add.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { MyarticlesComponent } from './components/myarticles/myarticles.component';
import { LayoutComponent } from './components/layout/layout.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentComponent } from './components/payment/payment.component';
import { AttractionTicketComponent } from './components/attraction-ticket/attraction-ticket.component';
import { AttractionAdminComponent } from './components/attraction-admin/attraction-admin.component';
import { SellerOrderComponent } from './components/seller-order/seller-order.component';
import { SellerCenterComponent } from './components/seller-center/seller-center.component';
import { BuyerOrderComponent } from './components/buyer-order/buyer-order.component';
import { WalletComponent } from './components/wallet/wallet.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'attraction',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: AttractionComponent,
      }, {
        path: 'admin',
        component: AttractionAdminComponent,
      }, {
        path: 'tickets',
        component: AttractionTicketComponent,
      }]
  },
  {
    path: 'events',
    component: EventManagementComponent
  }, // ✅ 讓 /events 直接對應到管理頁面
  {
    path: 'event',
    component: LayoutComponent,
    children: [{
      path: '',
      component: EventComponent
    },
    {
      path: 'detail/:id',
      component: EventDetailComponent
    }]
  },
  {
    path: 'products',
    component: LayoutComponent,
    children: [{
      path: '',
      component: ProductsComponent
    },
    {
      path: 'myProduct',
      component: MyProductComponent
    }, {
      path: 'createProduct',
      component: CreateProductComponent
    }, {
      path: 'editProduct/:id',
      component: CreateProductComponent
    }, {
      path: 'cart',
      component: CartComponent
    }, {
      path: 'payment',
      component: PaymentComponent
    }, {
      path: 'sellerOrder',
      component: SellerOrderComponent
    }, {
      path: 'sellerCenter',
      component: SellerCenterComponent
    }, {
      path: 'buyerOrder',
      component: BuyerOrderComponent
    }]
  },
  {
    path: 'socialmedia',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: SocialmediaComponent,
      },
      {
        path: 'articles',
        component: MyarticlesComponent,
      },
    ],
  },
  {
    path: 'user',
    component: LayoutComponent,
    children: [{
      path: '',
      component: UserLoginComponent
    },
    {
      path: 'add',
      component: UserAddComponent
    },
    {
      path: 'edit',
      component: UserEditComponent
    },
    {
      path: 'login',
      component: UserLoginComponent
    },
    {
      path: 'page',
      component: UserPageComponent
    },
    {
      path: 'editPassword',
      component: UserComponent
    },
    {
      path: 'wallet',
      component: WalletComponent
    }]
  },
  {
    path: '**',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
