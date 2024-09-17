import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css']
})
export class LivraisonComponent implements OnInit {
  steps: any[];
  activeIndex: number = 0;
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

  constructor(private authService: AuthService) {
    this.steps = [
      { label: 'Informations personnelles' },
      { label: 'Choix de la livraison' },
      { label: 'Récapitulatif' }
    ];
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const userDetails = this.authService.getUserDetails();
      if (userDetails) {
        this.livraisonForm.nom = userDetails.nom;
        this.livraisonForm.prenom = userDetails.prenom;
        this.livraisonForm.email = userDetails.email;
        this.livraisonForm.telephone = userDetails.telephone;
      }
    }
  }

  nextStep(): void {
    this.activeIndex++;
  }

  previousStep(): void {
    this.activeIndex--;
  }

  confirmOrder(): void {
    console.log('Commande confirmée');
    console.log(this.livraisonForm);
    // Add logic to send order data to the server
  }

  get totalAfterPromo(): number {
    // Calculate the total after applying the promo code
    const total = 100; // Example total, replace with actual calculation
    if (this.livraisonForm.codePromo === 'PROMO10') {
      return total * 0.9;
    }
    return total;
  }
}
