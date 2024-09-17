import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  user = {
    nom: '',
    prenom: '',
    ville: '',
    codePostal: null,
    telephone: '',
    email: ''
  };

  onSubmit() {
    // Logic to update the user data
    console.log('User data updated:', this.user);
    // You can add your service call here to save the updated user data
  }
}
