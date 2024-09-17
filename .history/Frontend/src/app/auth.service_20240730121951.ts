import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5102/api/users'; // Votre URL API
  private userInfo: any = null;

  constructor(private http: HttpClient) { }

  login(emailOrPhone: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { emailOrPhone, password });
  }

  setUserInfo(user: any): void {
    this.userInfo = user;
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  getUserInfo(): any {
    if (this.userInfo) {
      return this.userInfo;
    }
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }
}
