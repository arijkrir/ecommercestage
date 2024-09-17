import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Produit } from './models/produit.model';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<Produit[]>([]);
  private cartItems$ = this.cartItemsSubject.asObservable();
  private apiUrl = 'http://localhost:5102/api/cart'; // Remplacez par votre URL API

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getUserId(): string | null {
    const user = this.authService.getUserInfo();
    return user ? user.id : null;
  }

  getCartItems(): Observable<Produit[]> {
    const userId = this.getUserId();
    if (userId) {
      return this.http.get<Produit[]>(`${this.apiUrl}/${userId}`).pipe(
        tap(items => this.cartItemsSubject.next(items))
      );
    }
    return of([]);
  }

  addToCart(produit: Produit, quantity: number): void {
    const userId = this.getUserId();
    if (userId) {
      this.http.post(`${this.apiUrl}/${userId}`, { produit, quantity })
        .subscribe(() => this.getCartItems().subscribe());
    }
  }

  updateCart(produit: Produit): void {
    const userId = this.getUserId();
    if (userId) {
      this.http.put(`${this.apiUrl}/${userId}`, produit)
        .subscribe(() => this.getCartItems().subscribe());
    }
  }

  removeFromCart(produit: Produit): void {
    const userId = this.getUserId();
    if (userId) {
      this.http.delete(`${this.apiUrl}/${userId}/${produit.id}`)
        .subscribe(() => this.getCartItems().subscribe());
    }
  }

  clearCart(): void {
    const userId = this.getUserId();
    if (userId) {
      this.http.delete(`${this.apiUrl}/${userId}`).subscribe(() => {
        this.cartItemsSubject.next([]);
      });
    }
  }
}
