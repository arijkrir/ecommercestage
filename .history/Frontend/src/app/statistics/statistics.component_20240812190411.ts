import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  private map: L.Map | undefined;

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([33.8869, 9.5375], 6); // Centrer la carte sur la Tunisie

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.addCities();
  }

  private addCities(): void {
    const cities = [
      { name: 'Tunis', lat: 36.8065, lng: 10.1815, percentage: 75 },
      { name: 'Sfax', lat: 34.7404, lng: 10.7604, percentage: 60 },
      { name: 'Sousse', lat: 35.8256, lng: 10.6367, percentage: 45 },
      // Ajoutez d'autres villes et pourcentages ici
    ];

    cities.forEach(city => {
      const color = this.getColorByPercentage(city.percentage);
      L.circle([city.lat, city.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 50000
      }).addTo(this.map)
        .bindPopup(`<b>${city.name}</b><br>Pourcentage d'achat: ${city.percentage}%`);
    });
  }

  private getColorByPercentage(percentage: number): string {
    if (percentage >= 70) return 'green';
    if (percentage >= 50) return 'yellow';
    return 'red';
  }
}
