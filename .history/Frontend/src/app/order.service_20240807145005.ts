import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private totalAmount: number = 0;
  private apiUrl: string = 'http://your-api-url.com/orders'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  setTotalAmount(amount: number): void {
    this.totalAmount = amount;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  confirmOrder(orderDetails: any): Observable<any> {
    const orderPayload = {
      userId: orderDetails.userId,
      totalAmount: this.totalAmount,
      cartItems: orderDetails.cartItems.map((item: any) => ({
        produitId: item.id,
        quantiteeCommandee: item.quantity
      }))
    };

    return this.http.post<any>(`${this.apiUrl}/confirm`, orderPayload);
  }

  calculateTotalAfterPromo(promoCode: string): number {
    let discount = 0;

    if (promoCode === 'PROMO10') {
      discount = 0.10;
    }

    return this.totalAmount * (1 - discount);
  }
}
