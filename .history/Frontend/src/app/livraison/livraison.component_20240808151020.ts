import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css'],
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
  displayModal: boolean = false;  // Propriété pour afficher/masquer le dialogue
  confirmationMessage: string = 'Votre message de confirmation ou d\'erreur ici.';

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router,
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
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }

  loadUserData(): void {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getUserInfo();
      if (user) {
        this.livraisonForm.nom = user.nom || '';
        this.livraisonForm.prenom = user.prenom || '';
        this.livraisonForm.email = user.email || '';
        this.livraisonForm.ville = user.ville || '';
        this.livraisonForm.telephone = user.telephone || '';
        this.livraisonForm.codePostal = user.codePostal || '';
        this.livraisonForm.rue = user.rue || '';
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
      const orderDetails = {
        cartItems: this.cartItems,
        userId: this.authService.getUserInfo().id,
        totalAfterPromo: this.totalAfterPromo
      };
  
      this.orderService.confirmOrder(orderDetails).subscribe(response => {
        console.log('Commande confirmée!', response);
        this.confirmationMessage = 'Commande confirmée avec succès!';
  
        // Appel à updateFtpQuantities après la confirmation de la commande
        this.orderService.updateFtpQuantities(this.cartItems).subscribe(updateResponse => {
          console.log('Quantités FTP mises à jour!', updateResponse);
        }, updateError => {
          console.error('Erreur lors de la mise à jour des quantités FTP', updateError);
        });
  
        this.cartService.clearCart();


        this.displayModal = true;  // Afficher le dialogue
      }, error => {
        console.error('Erreur lors de la confirmation de la commande', error);
        this.confirmationMessage = 'Erreur lors de la confirmation de la commande';
        this.displayModal = true;  // Afficher le dialogue
      });
    }
  }
  
  hideDialog(): void {
    this.displayModal = false;
  }
}
