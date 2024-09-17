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
    this.loadUserData();
    this.calculateTotalAfterPromo();
  }

  loadUserData(): void {
    if (this.authService.isLoggedIn()) {
      const userInfo = this.authService.getUserInfo();
      if (userInfo) {
        this.livraisonForm.nom = userInfo.nom || '';
        this.livraisonForm.prenom = userInfo.prenom || '';
        this.livraisonForm.email = userInfo.email || '';
        this.livraisonForm.telephone = userInfo.telephone || '';
      }
    }
  }

  calculateTotalAfterPromo(): void {
    // Suppose total is retrieved from orderService or similar
    const total = this.orderService.getTotalAmount();
    const promoCode = this.livraisonForm.codePromo;
    // Apply promo logic here
    this.totalAfterPromo = total; // Update this based on promo code logic
  }

  onPaymentTypeChange(): void {
    // Handle changes to payment type if necessary
  }

  previousStep(): void {
    if (this.activeIndex > 0) {
      this.activeIndex--;
    }
  }

  nextStep(): void {
    if (this.activeIndex < 2) {
      this.activeIndex++;
    }
  }

  confirmOrder(): void {
    // Logic to confirm the order
    console.log('Order confirmed', this.livraisonForm);
  }

  canProceedToNextStep(): boolean {
    // Logic to determine if the next step can be accessed
    return this.activeIndex === 0 || this.activeIndex === 1; // Adjust this logic as needed
  }
}
