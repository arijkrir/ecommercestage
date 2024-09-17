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
  errorMessage: string = '';
  chartType: ChartType = ChartType.GeoChart;
  chartData: any[] = [];
  chartOptions: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getTopCities();
    this.getTopUsers();
    this.chartOptions = {
      region: 'TN', // Code ISO pour la Tunisie
      displayMode: 'regions',
      resolution: 'provinces',
      backgroundColor: '#f8f9fa', // Fond du conteneur
      colorAxis: { 
        colors: ['#ffc1cc', '#ff91a4', '#ff6088', '#ff3068', '#ff0048']
      },
      legend: {
        textStyle: {
          color: 'black',
          fontSize: 14
        }
      },
      // Ajout d'un paramètre pour contrôler le zoom (non pris en charge directement)
      // Vous pouvez utiliser un `region` spécifique pour un effet de zoom
      focus: 'Tunisia' // Simule un effet de zoom en mettant l'accent sur la Tunisie
    };
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
}
