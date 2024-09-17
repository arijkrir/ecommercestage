import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5102/api/users/login'; // Remplacez par l'URL de votre API
  private tokenKey = 'authToken';
  private userInfoKey = 'userInfo';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userInfoKey, JSON.stringify(response.user));
      })
    );
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Se déconnecter en supprimant le token
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userInfoKey);
  }

  // Obtenir le token de l'utilisateur
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Obtenir les informations de l'utilisateur
  getUserInfo(): any {
    const userInfo = localStorage.getItem(this.userInfoKey);
    return userInfo ? JSON.parse(userInfo) : null;
  }
}
