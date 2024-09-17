import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Produit } from './models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<Produit[]>(this.loadCartItemsFromLocalStorage());
  private cartItems$ = this.cartItemsSubject.asObservable();

  getCartItems(): Observable<Produit[]> {
    return this.cartItems$;
  }

  addToCart(produit: Produit, quantity: number): void {
    const cartItems = this.loadCartItemsFromLocalStorage();
    const existingProduct = cartItems.find(item => item.id === produit.id);

    // Définit stock à 0 si undefined
    const stock = produit.stock ?? 0;

    if (existingProduct) {
      if (existingProduct.quantity + quantity <= stock) {
        existingProduct.quantity += quantity;
      } else {
        console.warn('Quantité demandée dépasse le stock disponible.');
      }
    } else {
      if (quantity <= stock) {
        produit.quantity = quantity;
        cartItems.push(produit);
      } else {
        console.warn('Quantité demandée dépasse le stock disponible.');
      }
    }

    this.saveCartItemsToLocalStorage(cartItems);
    this.cartItemsSubject.next(cartItems);
  }

  updateCart(produit: Produit): void {
    const cartItems = this.loadCartItemsFromLocalStorage();
    const existingProduct = cartItems.find(item => item.id === produit.id);

    // Définit stock à 0 si undefined
    const stock = produit.stock ?? 0;

    if (existingProduct) {
      if (produit.quantity <= stock) {
        existingProduct.quantity = produit.quantity;
      } else {
        console.warn('Quantité demandée dépasse le stock disponible.');
      }

      existingProduct.available = stock > 0;
    }

    this.saveCartItemsToLocalStorage(cartItems);
    this.cartItemsSubject.next(cartItems);
  }

  private loadCartItemsFromLocalStorage(): Produit[] {
    const cartItems = localStorage.getItem('cartItems');
    return cartItems ? JSON.parse(cartItems) : [];
  }

  private saveCartItemsToLocalStorage(cartItems: Produit[]): void {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
}
