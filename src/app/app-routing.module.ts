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
    children: []
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
