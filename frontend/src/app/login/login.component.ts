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
        // En supposant que le token est renvoyé dans la réponse, stockez-le
        localStorage.setItem('authToken', response.token); // Assurez-vous que `response.token` est correct
        this.router.navigate(['/produits']); // Redirection après la connexion
      },
      error => {
        console.error('Erreur lors de la connexion : ', error);
        this.errorMessage = error.error || 'Erreur lors de la connexion. Veuillez vérifier vos informations.';
      }
    );
  }
}
