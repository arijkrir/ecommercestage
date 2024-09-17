import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produit } from './models/produit.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5102/api/produits';

  constructor(private http: HttpClient) { }

  getAllProductIds(offset: number, limit: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/GetProductsIds?offset=${offset}&limit=${limit}`);
  }

  getProductDetails(ids: number[]): Observable<Produit[]> {
    return this.http.post<Produit[]>(`${this.apiUrl}/GetProductSDetailsByIds`, ids);
  }

  getProductDetailsFromCsvByIds(ids: number[]): Observable<Produit[]> {
    return this.http.post<Produit[]>(`${this.apiUrl}/GetProductDetailsFromCsvByIds`, ids);
  }

  getProductDetailsFromFTPByIds(ids: number[]): Observable<Produit[]> {
    return this.http.post<Produit[]>(`${this.apiUrl}/GetProductDetailsFromFTPByIds`, ids);
  }

  searchProducts(term: string): Observable<Produit[]> {
    return this.http.post<Produit[]>(`${this.apiUrl}/search-with-details`, { SearchTerm: term, Page: 1, PageSize: 1000 });
  }

  searchProductscsv(term: string): Observable<Produit[]> {
    return this.http.post<Produit[]>(`${this.apiUrl}/search-csv-details`, { SearchTerm: term, Page: 1, PageSize: 1000 });
  }

  searchProductsftp(term: string): Observable<Produit[]> {
    return this.http.post<Produit[]>(`${this.apiUrl}/search-ftp-details`, { SearchTerm: term, Page: 1, PageSize: 1000 });
  }

  getCategoryProductIds(category: string, ofset: number, limi: number): Observable<number[]> {
    const params = new HttpParams().set('ofset', ofset).set('limi', limi);
    return this.http.get<number[]>(`${this.apiUrl}/GetCategoryProductsByIds/${category}`, { params });
  }

  getCategoryProductDetails(ids: number[], category: string, source: string): Observable<Produit[]> {
    switch (source) {
      case 'csv':
        return this.http.post<Produit[]>(`${this.apiUrl}/GetCategoryProductDetailsFromCsvByIds/${category}`, ids);
      case 'ftp':
        return this.http.post<Produit[]>(`${this.apiUrl}/GetCategoryProductDetailsFromFTPByIds/${category}`, ids);
      default:
        return this.http.post<Produit[]>(`${this.apiUrl}/GetCategoryProductDetailsByIds/${category}`, ids);
    }
  }
}
