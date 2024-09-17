import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { Produit } from '../models/produit.model';
import { ProductService } from '../produits.service'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showAccountOptions = false;
  cartItems: Produit[] = [];
  searchQuery: string = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private productService: ProductService // Inject your product service
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
    this.router.navigate(['/produits']);
  }

  getCartItemCount(): number {
    return this.cartItems.length;
  }

  login(): void {
    console.log('Se connecter...');
    this.showAccountOptions = false;
    this.router.navigate(['/login']); // Naviguer vers la page de connexion
  }

  register(): void {
    console.log('Créer un compte...');
    this.showAccountOptions = false;
    this.router.navigate(['/signup']); // Naviguer vers la page de création de compte
  }

  // Méthode de recherche
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery.trim()).subscribe(
        (result: Produit[]) => {
          // Redirection vers produits avec les résultats de recherche
          this.router.navigate(['/produits'], {
            queryParams: { search: this.searchQuery.trim() }
          });
        },
        (error) => {
          console.error('Error searching products', error);
        }
      );
    }
  }
}
