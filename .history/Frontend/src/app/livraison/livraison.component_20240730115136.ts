import { OrderService } from '../order.service'; // Importez le service
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
    numeroCarte: '',
    codeCarte: '',
    codePromo: ''
  };
  totalAmount: number = 0;

  constructor(
    private orderService: OrderService // Injectez le service
  ) {
    this.steps = [
      { label: 'Informations personnelles' },
      { label: 'Choix de la livraison' },
      { label: 'Récapitulatif' }
    ];
  }

  ngOnInit(): void {
    this.totalAmount = this.orderService.getTotalAmount(); // Récupérez le total

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

  get totalAfterPromo(): number {
    if (this.livraisonForm.codePromo === 'PROMO10') {
      return this.totalAmount * 0.9;
    }
    return this.totalAmount;
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

  onPaymentTypeChange(): void {
    if (this.livraisonForm.typeLivraison !== 'Carte Edinar' && this.livraisonForm.typeLivraison !== 'Carte VIVA') {
      this.livraisonForm.numeroCarte = '';
      this.livraisonForm.codeCarte = '';
    }
  }
}
