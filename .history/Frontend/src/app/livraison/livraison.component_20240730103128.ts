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
  }

  get totalAfterPromo(): number {
    const total = 100; // Replace with actual calculation
    if (this.livraisonForm.codePromo === 'PROMO10') {
      return total * 0.9;
    }
    return total;
  }
}
