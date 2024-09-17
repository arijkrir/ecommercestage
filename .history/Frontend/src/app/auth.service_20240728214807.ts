import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5102/api/users/login'; // Remplacez par l'URL de votre API
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Se déconnecter en supprimant le token
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Obtenir le token de l'utilisateur
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
