import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private totalAmount: number = 0;
  private apiUrl: string = 'http://localhost:5102/api/orders'; 

  constructor(private http: HttpClient) {}

  setTotalAmount(amount: number): void {
    this.totalAmount = amount;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  confirmOrder(orderDetails: any): Observable<any> {
    const orderPayload = {
      UserId: orderDetails.userId,
      PrixTotal: orderDetails.totalAfterPromo,
      Articles: orderDetails.cartItems.map((item: any) => ({
        ProduitId: item.id,
        QuantiteeCommandee: item.quantity
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
