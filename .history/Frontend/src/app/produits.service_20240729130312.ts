import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from './models/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5102/api/produits';
  private csvUrl = 'http://localhost:5102/api/csv-products';
  private ftpUrl = 'http://localhost:5102/api/ftp-products';

  constructor(private http: HttpClient) {}

  getAllProductIds(offset: number, limit: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/ids?offset=${offset}&limit=${limit}`);
  }

  getProductDetails(ids: number[]): Observable<Produit[]> {
    return this.http.post<Produit[]>(`${this.apiUrl}/details`, ids);
  }

  getProductDetailsFromCsvByIds(ids: number[]): Observable<Produit[]> {
    return this.http.post<Produit[]>(`${this.csvUrl}/details`, ids);
  }

  getProductDetailsFromFTPByIds(ids: number[]): Observable<Produit[]> {
    return this.http.post<Produit[]>(`${this.ftpUrl}/details`, ids);
  }

  searchProducts(term: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/search`, { params: { term } });
  }

  searchProductscsv(term: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.csvUrl}/search`, { params: { term } });
  }

  searchProductsftp(term: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.ftpUrl}/search`, { params: { term } });
  }
}
