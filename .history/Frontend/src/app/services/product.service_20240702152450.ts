import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5045/produits';  // Replace with the correct URL

  constructor(private http: HttpClient) {}

  getProducts(pageNumber: number, pageSize: number): Observable<ProductsResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ProductsResponse>(this.apiUrl, { params });
  }

}
