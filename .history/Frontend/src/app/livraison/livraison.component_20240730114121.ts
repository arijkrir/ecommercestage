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
    if (this.isStepValid()) {
      this.activeIndex++;
    }
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
    // Réinitialiser les champs de carte si le type de paiement change
    if (this.livraisonForm.typeLivraison !== 'Carte Edinar' && this.livraisonForm.typeLivraison !== 'Carte Bancaire') {
      this.livraisonForm.numeroCarte = '';
      this.livraisonForm.codeCarte = '';
    }
  }

  isStepValid(): boolean {
    switch (this.activeIndex) {
      case 0:
        return this.livraisonForm.nom && this.livraisonForm.prenom && this.livraisonForm.email &&
               this.livraisonForm.telephone;
      case 1:
        if (this.livraisonForm.typeLivraison === 'Carte Edinar' || this.livraisonForm.typeLivraison === 'Carte Bancaire') {
          return this.livraisonForm.rue && this.livraisonForm.ville && this.livraisonForm.codePostal &&
                 this.livraisonForm.numeroCarte && this.livraisonForm.codeCarte;
        }
        return this.livraisonForm.rue && this.livraisonForm.ville && this.livraisonForm.codePostal;
      case 2:
        return true; // Tous les champs doivent être valides avant de confirmer
      default:
        return false;
    }
  }
}
