import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
// import { HomeComponent } from './Components/home/home.component';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        // HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule, // Assurez-vous que AppRoutingModule est importé ici
        HttpClientModule,
        InputTextModule,
        ButtonModule,
        ToolbarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
