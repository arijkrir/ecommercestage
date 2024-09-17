import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  topCities: any[] = [];
  errorMessage: string = '';
  chartType = 'PieChart';
  chartData: any[] = [];
  chartOptions = {
    backgroundColor: '#d3d3d3', // Fond gris pour le graphique
    pieHole: 0.4,
    pieSliceTextStyle: {
      color: 'white'
    },
    legend: {
      position: 'bottom',
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
          this.chartData = cities.map(city => [city.ville, city.commandes]);
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
