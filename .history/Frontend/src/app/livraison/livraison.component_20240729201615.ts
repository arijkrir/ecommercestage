import { Component, OnInit } from '@angular/core';

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

  constructor() {
    this.steps = [
      { label: 'Informations personnelles' },
      { label: 'Choix de la livraison' },
      { label: 'Récapitulatif' }
    ];
  }

  ngOnInit(): void {
    // Pré-remplir les informations si l'utilisateur est connecté
    const isLoggedIn = true; // Remplacez par la vérification réelle de l'état de connexion
    if (isLoggedIn) {
      this.prefillUserData();
    }
  }

  prefillUserData(): void {
    // Récupérer les informations de l'utilisateur et les pré-remplir dans le formulaire
    this.livraisonForm.nom = 'John'; // Exemple de données, remplacez par les données réelles
    this.livraisonForm.prenom = 'Doe';
    this.livraisonForm.email = 'john.doe@example.com';
    this.livraisonForm.telephone = '123456789';
    this.livraisonForm.rue = '123 Rue Exemple';
    this.livraisonForm.ville = 'Exempleville';
    this.livraisonForm.codePostal = '12345';
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
    const total = 100; // Exemple de total, remplacez par le calcul réel
    if (this.livraisonForm.codePromo === 'PROMO10') {
      return total * 0.9;
    }
    return total;
  }
}
