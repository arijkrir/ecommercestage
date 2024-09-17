import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements AfterViewInit {
  private canvas: HTMLCanvasElement | undefined;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.setupCanvas();
    this.loadCityData();
  }

  private setupCanvas(): void {
    this.canvas = document.getElementById('map-canvas') as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    }
  }

  private loadCityData(): void {
    this.http.get<any>('assets/data/cities.json').subscribe(data => {
      if (this.ctx) {
        this.drawCities(data);
      }
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

    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, 10, 0, 2 * Math.PI); // Dessinez un cercle autour des coordonnées
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#000000';
      this.ctx.stroke();
    }
  }
}
