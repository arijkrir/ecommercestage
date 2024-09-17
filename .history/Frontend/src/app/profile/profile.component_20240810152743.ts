// profile.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user = {
    firstName: '',
    lastName: '',
    city: '',
    phone: '',
    postalCode: '',
    email: ''
  };

  constructor() {}

  saveProfile() {
    // Logique pour enregistrer les modifications du profil
  }
}
