import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Produit } from '../models/produit.model';
import { ProductService } from '../produits.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Produit[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.updateAvailability(); // Assurez-vous que la disponibilité est mise à jour lors de l'initialisation
    });
  }
  loadProductQuantities(ids: number[]): void {
    this.productService.getProductDetailsFromFTPByIds(ids).subscribe(
      (produitsFTP: Produit[]) => {
        produitsFTP.forEach(productFTP => {
          const existingProduct = this.produits.find(p => p.id === productFTP.id);
          if (existingProduct) {
            existingProduct.stock = productFTP.quantity;
            existingProduct.available = existingProduct.stock > 0;
          }
        });
        this.cd.detectChanges(); // Forcer la détection des changements
      },
      (error) => {
        console.error('Error loading product quantities from FTP', error);
      }
    );
  }


  increaseQuantity(produit: Produit): void {
    // Assurez-vous que stock n'est pas undefined et ne dépasse pas la valeur
    if (produit.stock !== undefined && produit.quantity < produit.stock) {
      produit.quantity++;
      this.updateCart(produit);
    }
  }

  decreaseQuantity(produit: Produit): void {
    if (produit.quantity > 1) {
      produit.quantity--;
      this.updateCart(produit);
    }
  }

  removeFromCart(produit: Produit): void {
    this.cartService.removeFromCart(produit);
    this.cartItems = this.cartItems.filter(item => item !== produit); 
  }

  updateCart(produit: Produit): void {
    this.cartService.updateCart(produit);
  }

  calculateTotal(): number {
    return this.cartItems.reduce((total, produit) => 
      total + produit.quantity * (produit.promoPrice ?? 0), 0);
  }

  confirmOrder(): void {
    // Logique pour confirmer la commande
    console.log('Commande confirmée');
  }

  updateAvailability(): void {
    this.cartItems.forEach(produit => {
      produit.available =  produit.stock > 0 : false;
    });
  }
}
