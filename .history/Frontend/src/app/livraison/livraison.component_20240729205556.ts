import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service'; // Service pour obtenir le total du panier

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
    codePromo: ''
  };
  totalPanier: number = 0;

  constructor(private authService: AuthService, private cartService: CartService) {
    this.steps = [
      { label: 'Informations personnelles' },
      { label: 'Choix de la livraison' },
      { label: 'Récapitulatif' }
    ];
  }

  ngOnInit(): void {
    // Remplir le formulaire avec les données de l'utilisateur si connecté
    if (this.authService.isLoggedIn()) {
      const userInfo = this.authService.getUserInfo();
      if (userInfo) {
        this.livraisonForm.nom = userInfo.nom;
        this.livraisonForm.prenom = userInfo.prenom;
        this.livraisonForm.email = userInfo.email;
        this.livraisonForm.telephone = userInfo.telephone;
      }
    }

    // Obtenir le total du panier
    this.cartService.getTotal().subscribe(total => {
      this.totalPanier = total;
    });
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
    // Ajouter la logique pour envoyer les données de la commande au serveur
  }

  get totalAfterPromo(): number {
    // Calculer le total après application du code promo
    const total = this.totalPanier;
    if (this.livraisonForm.codePromo === 'PROMO10') {
      return total * 0.9;
    }
    return total;
  }
}
