import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Service à créer pour gérer l'authentification

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginFormModel = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  submitLoginForm() {
    this.authService.login(this.loginFormModel).subscribe(
      response => {
        console.log('Utilisateur connecté avec succès : ', response);
        // Rediriger l'utilisateur après la connexion
        this.router.navigate(['/produits']);
      },
      error => {
        console.error('Erreur lors de la connexion : ', error);
      }
    );
  }
}
