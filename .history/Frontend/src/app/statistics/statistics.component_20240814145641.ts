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
  chartType: ChartType = ChartType.GeoChart;
  chartData: any[] = [];
  chartOptions: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getTopCities();
    this.chartOptions = {
      region: 'TN', // Code ISO pour la Tunisie
      displayMode: 'regions',
      resolution: 'provinces',
      colorAxis: { 
        colors: ['#ffc1cc', '#ff91a4', '#ff6088', '#ff3068', '#ff0048']
      },
      backgroundColor: '#f8f9fa',
      datalessRegionColor: '#f5f5f5',
      defaultColor: '#f8f9fa',
      legend: {
        textStyle: {
          color: 'black',
          fontSize: 14
        }
      }
    };
  }

  getTopCities() {
    this.userService.getTopCity().subscribe(
      cities => {
        if (cities && cities.length > 0) {
          this.topCities = cities;
          this.chartData = cities.map((city: { ville: string, commandes: number }) => {
            const regionCode = this.getRegionCode(city.ville); // Assurez-vous de cette fonction
            return [regionCode, city.commandes];
          });
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

  getRegionCode(ville: string): string {
    // Remplacez par une logique qui mappe les villes aux codes ISO des régions
    const map: { [key: string]: string } = {
      'Tunis': 'TN-11',
      'Nabeul': 'TN-21',
      'Sfax': 'TN-31',
      // Ajoutez les autres mappings ici
    };
    return map[ville] || 'TN-00'; // Code par défaut
  }
}
