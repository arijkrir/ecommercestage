import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Produit } from '../models/produit.model';

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

  increaseQuantity(produit: Produit): void {
    if (produit.quantity < produit.stock) { // Vérifiez que la quantité ne dépasse pas le stock
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
    return this.cartItems.reduce((total, produit) => total + produit.quantity * (produit.promoPrice ?? 0), 0);
  }
  
  confirmOrder(): void {
    // Logique pour confirmer la commande
    console.log('Commande confirmée');
  }

  updateAvailability(): void {
    // Mettez à jour la disponibilité des produits en fonction du stock
    this.cartItems.forEach(produit => {
      produit.available = produit.stock > 0;
    });
  }
}