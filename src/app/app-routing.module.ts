import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AttractionComponent } from './components/attraction/attraction.component';
import { EventComponent } from './components/event/event.component';
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

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'attraction',
    component: AttractionComponent,
    children: []
  },
  {
    path: 'event',
    component: EventComponent,
    children: []
  },
  {
    path: 'products',
    component: ProductsComponent,
    children: []
  },
  {
    path: 'myProduct',
    component: MyProductComponent
  },
  {
    path: 'socialmedia',
    component: LayoutComponent,
    children: [{
      path: '',
      component: SocialmediaComponent
    },
    {
      path: 'articles',
      component: MyarticlesComponent
    }]
  },
  {
    path: 'user',
    component: UserComponent,
    children: [{
      path: 'add',
      component: UserAddComponent
    }, {
      path: 'edit',
      component: UserEditComponent
    }, {
      path: 'login',
      component: UserLoginComponent
    }, {
      path: 'page',
      component: UserPageComponent
    }, {
      path: '**',
      component: UserLoginComponent
    }]
  },
  {
    path: '**',
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
