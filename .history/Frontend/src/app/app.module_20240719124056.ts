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

@NgModule({
  declarations: [
    AppComponent,
    ProductlistScrollableComponent,
    CartComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    InfiniteScrollModule,
    FormsModule,
    LazyLoadImageModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
