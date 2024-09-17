import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Assurez-vous d'importer HttpClient
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private totalAmount: number = 0;
  private apiUrl: string = 'http://your-api-url.com/orders'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {}

  setTotalAmount(amount: number): void {
    this.totalAmount = amount;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  // Méthode pour confirmer la commande
  confirmOrder(orderDetails: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderDetails);
  }

  // Méthode pour calculer le total après la promo
  calculateTotalAfterPromo(promoCode: string): number {
    let discount = 0;

    if (promoCode === 'PROMO10') {
      discount = 0.10;
    }

    return this.totalAmount * (1 - discount);
  }
}
