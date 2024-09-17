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
  }

  register(): void {
    console.log('Créer un compte...');
    this.showAccountOptions = false;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Call all search methods
      this.productService.searchProducts(this.searchQuery.trim()).subscribe(
        (result: Produit[]) => {
          this.router.navigate(['/produits'], {
            queryParams: { search: this.searchQuery.trim(), source: 'details' }
          });
        },
        (error) => {
          console.error('Error searching products', error);
        }
      );
  
      this.productService.searchProductscsv(this.searchQuery.trim()).subscribe(
        (result: Produit[]) => {
          this.router.navigate(['/produits'], {
            queryParams: { search: this.searchQuery.trim(), source: 'csv' }
          });
        },
        (error) => {
          console.error('Error searching products from CSV', error);
        }
      );
  
      this.productService.searchProductsftp(this.searchQuery.trim()).subscribe(
        (result: Produit[]) => {
          this.router.navigate(['/produits'], {
            queryParams: { search: this.searchQuery.trim(), source: 'ftp' }
          });
        },
        (error) => {
          console.error('Error searching products from FTP', error);
        }
      );
  }
  
  
  }
}
