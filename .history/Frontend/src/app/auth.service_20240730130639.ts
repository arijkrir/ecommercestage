import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5102/api/users/login'; // Remplacez par l'URL de votre API
  private userInfoKey = 'userInfo';

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer les informations utilisateur par ID
  getUserInfoFromApi(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }

  // Méthode pour stocker les informations utilisateur dans localStorage
  storeUserInfo(userInfo: any): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
  }

  // Méthode pour obtenir les informations utilisateur depuis localStorage
  getUserInfo(): any {
    const userInfo = localStorage.getItem(this.userInfoKey);
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error('Erreur lors de l\'analyse des informations utilisateur:', error);
        return null;
      }
    } else {
      console.warn('Aucune information utilisateur trouvée dans le localStorage.');
      return null;
    }
  }
}
