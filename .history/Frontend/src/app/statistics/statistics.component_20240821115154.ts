import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { UserService } from '../user.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  topCities: any[] = [];
  topUsers: any[] = [];
  topProducts: any[] = [];
  errorMessage: string = '';
  chartType: ChartType = ChartType.GeoChart;
  chartData: any[] = [];
  chartOptions: any;
  topCategories: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getTopCities();
    this.getTopUsers();
    this.getTopProducts(); 
    this.getTopCategories();
    this.chartOptions = {
      region: 'TN',
      displayMode: 'regions',
      resolution: 'provinces',
      backgroundColor: '#f8f9fa',
      colorAxis: { 
        colors: ['#ffc1cc', '#ff91a4', '#ff6088', '#ff3068', '#ff0048']
      },
      legend: {
        position: 'right',
        textStyle: {
          color: 'black',
          fontSize: 12
        }
      },
      focus: 'Tunisia'
    };
  }

  getTopCategories() {
    this.userService.getTopCategories().subscribe(
      categories => {
        if (categories && categories.length > 0) {
          this.topCategories = categories;
        } else {
          this.errorMessage = 'Aucune catégorie trouvée';
        }
      },
      error => {
        console.error('Erreur lors de la récupération des catégories:', error);
        this.errorMessage = 'Erreur lors de la récupération des catégories';
      }
    );
  }getTopCategories() {
    this.userService.getTopCategories().subscribe(
      categories => {
        console.log('Catégories reçues:', categories);  // Ajoutez cette ligne
        if (categories && categories.length > 0) {
          this.topCategories = categories;
        } else {
          this.errorMessage = 'Aucune catégorie trouvée';
        }
      },
      error => {
        console.error('Erreur lors de la récupération des catégories:', error);
        this.errorMessage = 'Erreur lors de la récupération des catégories';
      }
    );
  }
  

  getTopCities() {
    this.userService.getTopCity().subscribe(
      cities => {
        if (cities && cities.length > 0) {
          this.topCities = cities;
          this.chartData = cities.map((city: { ville: string, commandes: number }) => [city.ville, city.commandes]);
        } else {
          this.errorMessage = 'Aucune ville trouvée';
        }
      },
      error => {
        console.error('Erreur lors de la récupération des villes:', error);
        this.errorMessage = 'Erreur lors de la récupération des villes';
      }
    );
  }

  getTopUsers() {
    this.userService.getTopUsers().subscribe(
      users => {
        if (users && users.length > 0) {
          this.topUsers = users;
        } else {
          this.errorMessage = 'Aucun utilisateur trouvé';
        }
      },
      error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        this.errorMessage = 'Erreur lors de la récupération des utilisateurs';
      }
    );
  }

  getTopProducts() {
    this.userService.getTopProducts().subscribe(
      products => {
        if (products && products.length > 0) {
          this.topProducts = products;
        } else {
          this.errorMessage = 'Aucun produit trouvé';
        }
      },
      error => {
        console.error('Erreur lors de la récupération des produits:', error);
        this.errorMessage = 'Erreur lors de la récupération des produits';
      }
    );
  }
}
