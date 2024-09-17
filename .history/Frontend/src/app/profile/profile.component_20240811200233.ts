import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service'; // Assurez-vous que le chemin est correct

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
    email: ''
  };

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.id) {
      this.userService.getUserById(userInfo.id).subscribe(
        (data) => {
          this.user = data;
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
    console.log('User data updated:', this.user);
    // Vous pouvez ajouter ici l'appel à votre service pour sauvegarder les données mises à jour
  }
}
