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
    motdePasse: '',
  };

  showPassword = false;
  displaySuccessDialog = false;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.id) {
      this.userService.getUserById(userInfo.id).subscribe(
        (data) => {
          this.user = data;
          console.log('Données utilisateur récupérées:', this.user);
        },
        (error) => {
          console.error('Erreur lors de la récupération des données utilisateur :', error);
        }
      );
    } else {
      console.error('Aucun utilisateur connecté.');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.id) {
      this.userService.updateUser(userInfo.id, this.user).subscribe(
        (response) => {
          console.log('Données utilisateur mises à jour avec succès :', response);
          this.displaySuccessDialog = true;
        },
        (error) => {
          console.error('Erreur lors de la mise à jour des données utilisateur :', error);
        }
      );
    } else {
      console.error('Aucun utilisateur connecté.');
    }
  }

  onCloseSuccessDialog(): void {
    this.displaySuccessDialog = false;
  }
}
