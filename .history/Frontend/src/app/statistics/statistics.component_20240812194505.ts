import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements AfterViewInit {
  private svg: SVGSVGElement | null = null;

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.svg = document.getElementById('map-svg') as SVGSVGElement;
    if (this.svg) {
      this.loadCityData();
    }
  }

  private loadCityData(): void {
    this.http.get<any>('assets/data/cities.json').subscribe(data => {
      this.drawCities(data);
    });
  }

  private drawCities(data: any): void {
    data.cities.forEach((city: any) => {
      this.drawCity(city);
    });
  }

  private drawCity(city: any): void {
    const { x, y, purchaseRate } = city; // Coordonnées x et y et taux d'achat

    // Déterminez la couleur en fonction du taux d'achat
    let color = '#ff0000'; // Couleur par défaut

    if (purchaseRate > 1000) {
      color = '#00ff00'; // Taux d'achat élevé
    } else if (purchaseRate > 500) {
      color = '#ffff00'; // Taux d'achat moyen
    }

    if (this.svg) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '10');
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', '#000000');
      circle.setAttribute('stroke-width', '1');
      this.svg.appendChild(circle);
    }
  }
}
