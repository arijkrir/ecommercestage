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
      // Assurez-vous que chaque produit a une valeur pour stock
      this.cartItems = items.map(item => ({
        ...item,
        stock: item.stock ?? 0 // Définit stock à 0 si non défini
      }));
      console.log(this.cartItems); 
      this.updateAvailability(); // Met à jour la disponibilité lors de l'initialisation
    });
  }
  
  

  increaseQuantity(produit: Produit): void {
    // Vérifiez que stock est défini et ne dépasse pas la valeur
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
      // Assurez-vous que produit.stock est défini avant de l'utiliser
      produit.available = (produit.stock !== undefined) ? produit.stock > 0 : false;
    });
  }
}
