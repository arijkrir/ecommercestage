import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css']
})
export class LivraisonComponent {
  steps: MenuItem[];
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
    numeroCarte: '',
    codeCarte: '',
    codePromo: ''
  };
  totalAfterPromo: number = 0;

  constructor() {
    this.steps = [
      { label: 'Informations' },
      { label: 'Livraison' },
      { label: 'Résumé' }
    ];
  }

  nextPage() {
    this.activeIndex++;
  }

  prevPage() {
    this.activeIndex--;
  }

  confirmOrder() {
    // Ajouter la logique de confirmation de commande ici
    console.log('Commande confirmée', this.livraisonForm);
  }

  onPaymentTypeChange() {
    // Réinitialiser les champs de la carte si le type de livraison change
    this.livraisonForm.numeroCarte = '';
    this.livraisonForm.codeCarte = '';
  }
}
