import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { StepsModule } from 'primeng/steps';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'primeng/accordion';
import { GoogleChartsModule } from 'angular-google-charts';
import { TableModule } from 'primeng/table';




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
import { LivraisonComponent } from './livraison/livraison.component';
import { ProfileComponent } from './profile/profile.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ProductDetailsComponent } from './product-details/product-details.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductlistScrollableComponent,
    CartComponent,
    NavbarComponent,
    SignupComponent,
    LoginComponent,
    LivraisonComponent,
    ProfileComponent,
    StatisticsComponent,
    ProductDetailsComponent,
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
    CardModule,
    StepsModule,
    DialogModule,
    BrowserAnimationsModule,
    AccordionModule,
    GoogleChartsModule,
    TableModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
