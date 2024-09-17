import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  cartItems: any[] = [];
  private cartSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {
    this.steps = [
      { label: 'Informations personnelles' },
      { label: 'Choix de la livraison' },
      { label: 'Récapitulatif de la commande' }
    ];
  }

  ngOnInit(): void {
    this.loadUserData();
    this.calculateTotalAfterPromo();
    this.cartSubscription = this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  loadUserData(): void {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUserInfo();
      if (user) {
        this.livraisonForm = { ...this.livraisonForm, ...user };
      }
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
      }
    }
  }

  validatePersonalInfo(): boolean {
    return !!this.livraisonForm.nom && !!this.livraisonForm.prenom && !!this.livraisonForm.email && !!this.livraisonForm.telephone;
  }

  validateDeliveryInfo(): boolean {
    if (['Carte Edinar', 'Carte Bancaire'].includes(this.livraisonForm.typeLivraison)) {
      return !!this.livraisonForm.numeroCarte && !!this.livraisonForm.codeCarte;
    }
    return !!this.livraisonForm.rue && !!this.livraisonForm.ville && !!this.livraisonForm.codePostal;
  }

  canProceedToNextStep(): boolean {
    return this.activeIndex === 0 ? this.validatePersonalInfo() : this.activeIndex === 1 ? this.validateDeliveryInfo() : true;
  }

  onPaymentTypeChange(): void {
    this.calculateTotalAfterPromo();
  }

  calculateTotalAfterPromo(): void {
    this.totalAfterPromo = this.orderService.calculateTotalAfterPromo(this.livraisonForm.codePromo);
  }

  confirmOrder(): void {
    if (this.validatePersonalInfo() && this.validateDeliveryInfo()) {
      const orderDetails = {
        ...this.livraisonForm,
        cartItems: this.cartItems,
        userId: this.authService.getUserInfo().id
      };
      this.orderService.confirmOrder(orderDetails).subscribe(
        response => {
          console.log('Commande confirmée!', response);
          this.router.navigate(['/confirmation']);
        },
        error => {
          console.error('Erreur lors de la confirmation de la commande', error);
        }
      );
    }
  }
}
