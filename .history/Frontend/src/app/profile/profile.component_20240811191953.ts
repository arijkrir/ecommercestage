import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'; // Assurez-vous que le chemin est correct

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userId = 1; // Remplacez par l'ID de l'utilisateur connecté
    this.userService.getUserById(userId).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
      }
    );
  }

  onSubmit() {
    // Logic to update the user data
    console.log('User data updated:', this.user);
    // Vous pouvez ajouter ici l'appel à votre service pour sauvegarder les données mises à jour
  }
}
