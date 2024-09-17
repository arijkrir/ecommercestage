import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LivraisonComponent } from './livraison.component';

@NgModule({
  declarations: [LivraisonComponent],
  imports: [
    CommonModule,
    FormsModule,
    StepsModule,
    ButtonModule,
    InputTextModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LivraisonModule { }
