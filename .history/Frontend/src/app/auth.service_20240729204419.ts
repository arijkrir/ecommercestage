import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5102/api/users/login'; // Replace with your API URL
  private tokenKey = 'authToken';
  private userDetailsKey = 'userDetails';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userDetailsKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserDetails(): any {
    const userDetails = localStorage.getItem(this.userDetailsKey);
    return userDetails ? JSON.parse(userDetails) : null;
  }

  setUserDetails(details: any): void {
    localStorage.setItem(this.userDetailsKey, JSON.stringify(details));
  }
}
