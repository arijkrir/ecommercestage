import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css'],
  encapsulation: ViewEncapsulation.None // Disable view encapsulation
})
export class LivraisonComponent {
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

  constructor() {
    this.steps = [
      { label: 'Informations personnelles' },
      { label: 'Choix de la livraison' },
      { label: 'Récapitulatif' }
    ];
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
