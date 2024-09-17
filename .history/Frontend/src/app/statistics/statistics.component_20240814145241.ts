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
  errorMessage: string = '';
  chartType: ChartType = ChartType.GeoChart; // Utilisation de GeoChart
  chartData: any[] = [];
  chartOptions = {
    region: 'TN', // Code ISO 3166-1 pour la Tunisie
    displayMode: 'regions', // Affichage des régions
    resolution: 'provinces', // Niveau de détail à afficher
    backgroundColor: '#f8f9fa', // Fond du conteneur
    colorAxis: { colors: ['#FFC0CB', '#C71585'] }, // Dégradé de couleurs en rose
    legend: {
      textStyle: {
        color: 'black',
        fontSize: 14
      }
    }
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getTopCities();
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
}
