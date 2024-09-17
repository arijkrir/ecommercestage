import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
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
  totalAfterPromo: number = 0;

  constructor(private authService: AuthService, private orderService: OrderService) {
    this.steps = [
      { label: 'Informations personnelles' },
      { label: 'Choix de la livraison' },
      { label: 'Récapitulatif de la commande' }
    ];
  }

  ngOnInit(): void {
    // Récupération des informations utilisateur depuis le localStorage
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      this.livraisonForm.nom = userInfo.nom || '';
      this.livraisonForm.prenom = userInfo.prenom || '';
      this.livraisonForm.email = userInfo.email || '';
      this.livraisonForm.telephone = userInfo.telephone || '';
    }

    this.calculateTotalAfterPromo();
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
    this.totalAfterPromo = this.orderService.calculateTotalAfterPromo(this.livraisonForm.codePromo);
  }

  confirmOrder(): void {
    if (this.validatePersonalInfo() && this.validateDeliveryInfo()) {
      this.orderService.confirmOrder(this.livraisonForm).subscribe(response => {
        // Handle response
        console.log('Commande confirmée!', response);
      });
    }
  }
}
