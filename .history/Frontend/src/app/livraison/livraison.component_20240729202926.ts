import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'; // Assurez-vous d'avoir un service d'authentification

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css']
})
export class LivraisonComponent implements OnInit {
  livraisonForm: any = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    rue: '',
    ville: '',
    codePostal: '',
    typeLivraison: '',
    codePromo: ''
  };
  activeIndex: number = 0;
  steps: any[];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.steps = [
      {label: 'Informations Personnelles'},
      {label: 'Adresse de Livraison'},
      {label: 'Récapitulatif'}
    ];

    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUserDetails();
      this.livraisonForm.nom = user.nom;
      this.livraisonForm.prenom = user.prenom;
      this.livraisonForm.email = user.email;
      this.livraisonForm.telephone = user.telephone;
    }
  }

  previousStep() {
    this.activeIndex--;
  }

  nextStep() {
    this.activeIndex++;
  }

  confirmOrder() {
    // Logic to confirm the order
  }
}
