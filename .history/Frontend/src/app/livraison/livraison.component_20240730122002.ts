import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'; // Assurez-vous que le chemin est correct

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
    numeroCarte: '',
    codeCarte: '',
    codePromo: ''
  };
  totalAfterPromo: number = 0;

  constructor(private userService: UserService) {
    this.steps = [
      { label: 'Informations personnelles' },
      { label: 'Choix de la livraison' },
      { label: 'Récapitulatif de la commande' }
    ];
  }

  ngOnInit(): void {
    this.loadUserData();
    this.calculateTotalAfterPromo();
  }

  loadUserData(): void {
    const userInfo = this.userService.getUserInfo();
    if (userInfo) {
      this.livraisonForm.nom = userInfo.nom || '';
      this.livraisonForm.prenom = userInfo.prenom || '';
      this.livraisonForm.email = userInfo.email || '';
      this.livraisonForm.telephone = userInfo.telephone || '';
      // Vous pouvez ajouter d'autres champs si nécessaires
    }
  }

  previousStep(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  nextStep(): void {
    if (this.activeIndex < 2) {
      if (this.activeIndex === 0) {
        if (this.validatePersonalInfo()) {
          this.activeIndex++;
        }
      } else if (this.activeIndex === 1) {
        if (this.validateDeliveryInfo()) {
          this.activeIndex++;
        }
      } else if (this.activeIndex === 2) {
        this.confirmOrder();
      }
    }
  }

  validatePersonalInfo(): boolean {
    return !!this.livraisonForm.nom && !!this.livraisonForm.prenom && !!this.livraisonForm.email && !!this.livraisonForm.telephone;
  }

  validateDeliveryInfo(): boolean {
    if (this.livraisonForm.typeLivraison === 'Carte Edinar' || this.livraisonForm.typeLivraison === 'Carte Bancaire') {
      return !!this.livraisonForm.numeroCarte && !!this.livraisonForm.codeCarte;
    }
    return !!this.livraisonForm.rue && !!this.livraisonForm.ville && !!this.livraisonForm.codePostal;
  }

  canProceedToNextStep(): boolean {
    if (this.activeIndex === 0) {
      return this.validatePersonalInfo();
    } else if (this.activeIndex === 1) {
      return this.validateDeliveryInfo();
    }
    return true;
  }

  onPaymentTypeChange(): void {
    this.calculateTotalAfterPromo();
  }

  calculateTotalAfterPromo(): void {
    // Remplacez par la méthode appropriée pour calculer le total après promotion
    this.totalAfterPromo = 100; // Exemple de valeur
  }

  confirmOrder(): void {
    if (this.validatePersonalInfo() && this.validateDeliveryInfo()) {
      // Logique pour confirmer la commande
      console.log('Commande confirmée!', this.livraisonForm);
    }
  }
}
