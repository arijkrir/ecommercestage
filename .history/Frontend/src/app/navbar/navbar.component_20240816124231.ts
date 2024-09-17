import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public showAccountOptions = false;
  public searchQuery: string = '';
  public isSidebarOpen = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {}

  toggleAccountOptions(): void {
    this.showAccountOptions = !this.showAccountOptions;
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  navigateToProducts(): void {
    this.searchQuery = '';
    this.router.navigate(['/produits'], { queryParams: {} });
  }

  navigateToCategory(category: string): void {
    this.searchQuery = '';
    this.router.navigate(['/produits'], { queryParams: { category } });
  }

  login(): void {
    console.log('Se connecter...');
    this.showAccountOptions = false;
    this.router.navigate(['/login']);
  }

  register(): void {
    console.log('Créer un compte...');
    this.showAccountOptions = false;
    this.router.navigate(['/signup']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/produits'], {
        queryParams: { search: this.searchQuery, source: 'details' }
      });
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
