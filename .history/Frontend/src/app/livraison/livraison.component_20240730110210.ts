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
    numeroCarte: '', // Champs de numéro de carte
    codeCarte: '',   // Champs de code de carte
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
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.livraisonForm.nom = userInfo.nom;
      this.livraisonForm.prenom = userInfo.prenom;
      this.livraisonForm.email = userInfo.email;
      this.livraisonForm.telephone = userInfo.telephone;
      this.livraisonForm.rue = userInfo.rue;
      this.livraisonForm.ville = userInfo.ville;
      this.livraisonForm.codePostal = userInfo.codePostal;
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
    const total = 100; // Remplacez ceci par le total réel
    if (this.livraisonForm.codePromo === 'PROMO10') {
      return total * 0.9;
    }
    return total;
  }

  onPaymentTypeChange(): void {
    // Réinitialisez les champs de carte lorsque le type de paiement change
    if (this.livraisonForm.typeLivraison !== 'Carte Edinar' && this.livraisonForm.typeLivraison !== 'Carte Bancaire') {
      this.livraisonForm.numeroCarte = '';
      this.livraisonForm.codeCarte = '';
    }
  }
}
