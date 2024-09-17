import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userInfoKey = 'userInfo';

  constructor() { }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.userInfoKey);
  }

  getUserInfo(): any {
    const userInfo = localStorage.getItem(this.userInfoKey);
    return userInfo ? JSON.parse(userInfo) : null;
  }
}
