import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    nom: '',
    prenom: '',
    ville: '',
    codePostal: null,
    telephone: '',
    email: '',
    motdepasse: '',
  };

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.id) {
      this.userService.getUserById(userInfo.id).subscribe(
        (data) => {
          this.user = data;
          console.log('Données utilisateur récupérées:', this.user); // Debug: Vérifiez les données ici
        },
        (error) => {
          console.error('Erreur lors de la récupération des données utilisateur :', error);
        }
      );
    } else {
      console.error('Aucun utilisateur connecté.');
    }
  }

  onSubmit() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.id) {
      this.userService.updateUser(userInfo.id, this.user).subscribe(
        (response) => {
          console.log('Données utilisateur mises à jour avec succès :', response);
          // Vous pouvez ajouter ici un message de succès ou rediriger l'utilisateur
        },
        (error) => {
          console.error('Erreur lors de la mise à jour des données utilisateur :', error);
        }
      );
    } else {
      console.error('Aucun utilisateur connecté.');
    }
  }
}
