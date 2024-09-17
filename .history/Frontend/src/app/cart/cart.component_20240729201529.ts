import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { Produit } from '../models/produit.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Produit[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items.map(item => ({
        ...item,
        stock: item.stock ?? 0 // Définit stock à 0 si non défini
      }));
      this.updateAvailability();
    });
  }

  increaseQuantity(produit: Produit): void {
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
    this.router.navigate(['/livraison']);
  }

  updateAvailability(): void {
    this.cartItems.forEach(produit => {
      produit.available = (produit.stock !== undefined) ? produit.stock > 0 : false;
    });
  }
}
