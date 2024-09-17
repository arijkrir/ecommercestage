import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Ajout de FormsModule
import { AppRoutingModule } from './app-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LazyLoadImageModule } from 'ng-lazyload-image';


import { AppComponent } from './app.component';
import { ProductlistScrollableComponent } from './produits/produits.component';
import { ProductService } from './produits.service';
import { CartComponent } from './cart/cart.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [
    AppComponent,
    ProductlistScrollableComponent,
    CartComponent,
    NavbarComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    LazyLoadImageModule,
    InputTextModule,
    ButtonModule,
    CardModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }