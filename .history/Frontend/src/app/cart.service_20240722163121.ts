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
    if (existingProduct) {
      existingProduct.quantity = Math.min(existingProduct.quantity + quantity, produit.stock ?? 0);
    } else {
      produit.quantity = Math.min(quantity, produit.stock ?? 0);
      cartItems.push(produit);
    }
    this.saveCartItemsToLocalStorage(cartItems);
    this.cartItemsSubject.next(cartItems);
  }
  
  updateCart(produit: Produit): void {
    const cartItems = this.loadCartItemsFromLocalStorage();
    const existingProduct = cartItems.find(item => item.id === produit.id);
    if (existingProduct) {
      existingProduct.quantity = produit.quantity;
      existingProduct.stock = produit.stock ?? 0;
      existingProduct.available = existingProduct.stock > 0;
    }
    this.saveCartItemsToLocalStorage(cartItems);
    this.cartItemsSubject.next(cartItems);
  }
  
  

  removeFromCart(produit: Produit): void {
    let cartItems = this.loadCartItemsFromLocalStorage();
    cartItems = cartItems.filter(item => item.id !== produit.id);
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
