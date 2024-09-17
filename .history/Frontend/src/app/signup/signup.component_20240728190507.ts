import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service'; // Service à créer pour gérer les utilisateurs

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupFormModel = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    rue: '',
    ville: '',
    codePostal: ''
  };

  constructor(private userService: UserService, private router: Router) {}

  submitSignUpForm() {
    this.userService.createUser(this.signupFormModel).subscribe(
      response => {
        console.log('Utilisateur créé avec succès : ', response);
        // Rediriger l'utilisateur après la création du compte
        this.router.navigate(['/produits']);
      },
      error => {
        console.error('Erreur lors de la création de l\'utilisateur : ', error);
      }
    );
  }
}
