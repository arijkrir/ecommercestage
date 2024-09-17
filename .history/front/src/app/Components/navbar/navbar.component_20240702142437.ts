// navbar.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  items = [
    { label: 'Accueil', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Produits', icon: 'pi pi-tag', routerLink: '/products' },
    // Ajoutez d'autres liens et options de menu ici
  ];

  constructor() { }

}
