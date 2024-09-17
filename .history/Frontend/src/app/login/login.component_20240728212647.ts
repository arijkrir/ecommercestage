import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginFormModel = {
    emailOrPhone: '',
    password: ''
  };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  submitLoginForm() {
    this.authService.login(this.loginFormModel).subscribe(
      response => {
        console.log('Utilisateur connecté avec succès : ', response);
        localStorage.setItem('authToken', response.token); // Stocker le jeton d'authentification
        this.router.navigate(['/produits']);
      },
      error => {
        console.error('Erreur lors de la connexion : ', error);
        this.errorMessage = error.error || 'Erreur lors de la connexion. Veuillez vérifier vos informations.';
      }
    );
  }
  
}
