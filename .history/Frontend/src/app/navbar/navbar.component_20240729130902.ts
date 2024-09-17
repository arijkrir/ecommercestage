import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { Produit } from '../models/produit.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public showAccountOptions = false;
  public cartItems: Produit[] = [];
  public searchQuery: string = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  toggleAccountOptions(): void {
    this.showAccountOptions = !this.showAccountOptions;
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  navigateToProducts(): void {
    this.searchQuery = '';  // Réinitialiser la recherche
    this.router.navigate(['/produits'], { queryParams: {} });  // Naviguer vers la page des produits sans terme de recherche
  }

  getCartItemCount(): number {
    return this.cartItems.length;
  }

  login(): void {
    console.log('Se connecter...');
    this.showAccountOptions = false;
    this.router.navigate(['/login']);
  }

  register(): void {
    console.log('Créer un compte...');
    this.showAccountOptions = false;
    this.router.navigate(['/signup']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/produits'], {
        queryParams: { search: this.searchQuery, source: 'details' }
      });
    }
  }
}