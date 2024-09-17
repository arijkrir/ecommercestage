import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  confirmOrder(orderDetails: any): Observable<any> {
    const url = `${this.apiUrl}/confirm`; // Assurez-vous que l'URL est correcte
    return this.http.post(url, orderDetails);
  }
  

  calculateTotalAfterPromo(promoCode: string): number {
    let discount = 0;

    if (promoCode === 'PROMO10') {
      discount = 0.10;
    }

    return this.totalAmount * (1 - discount);
  }
}
