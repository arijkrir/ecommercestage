import { Component, OnInit, Output, EventEmitter, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../produits.service';
import { Produit } from '../models/produit.model';
import { CartService } from '../cart.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-productlist-scrollable',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProductlistScrollableComponent implements OnInit {
  produits: Produit[] = [];
  allProductIds: number[] = [];
  offset = 0;
  limit = 1000;
  loading = false;
  hasMoreProduits = true;
  scrollDistance = 100; 
  scrollUpDistance = 1; 
  searchTerm: string = '';
  category: string = ''; // Property for category
  showCart = false;
  showAccountOptions = false;
  cartItems: Produit[] = [];

  @Output() cartItemCountChanged = new EventEmitter<number>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService, 
    private el: ElementRef, 
    private router: Router, 
    private cartService: CartService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.category = params['category'] || ''; // Retrieve category

      if (this.searchTerm || this.category) {
        this.loadFilteredProducts(this.searchTerm, this.category);
      } else {
        this.produits = [];
        this.offset = 0;
        this.limit = 1000;
        if (this.category) {
          this.loadCategoryProducts(this.category);
        } else {
          this.loadProductIds();
        }
      }
    });

    // Load cart items from the localStorage
    this.loadCartItems();
  }

  loadProductIds(): void {
    this.loading = true;
    this.productService.getAllProductIds(this.offset, this.limit).subscribe(
      ids => {
        this.allProductIds = ids;
        this.loadProductDetails(ids);
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching product IDs:', error);
        this.loading = false;
      }
    );
  }

  loadProductDetails(ids: number[]): void {
    if (ids.length === 0) {
      this.hasMoreProduits = false;
      return;
    }

    this.productService.getProductDetails(ids).subscribe(
      produits => {
        this.produits = [...this.produits, ...produits];
        this.loading = false;
        this.offset += this.limit;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching product details:', error);
        this.loading = false;
      }
    );
  }

  loadCategoryProducts(category: string): void {
    this.loading = true;
    this.productService.getProductIdsByCategory(category, this.offset, this.limit).subscribe(
      ids => {
        this.allProductIds = ids;
        this.loadProductDetails(ids);
      },
      (error: HttpErrorResponse) => {
        console.error(`Error fetching category product IDs:`, error);
        this.loading = false;
        if (error.status === 0) {
          alert('Network error: Please check your internet connection.');
        } else {
          alert('Failed to load products for the selected category.');
        }
      }
    );
  }

  loadFilteredProducts(searchTerm: string, category: string): void {
    this.loading = true;
    this.productService.searchProducts(searchTerm, category, this.offset, this.limit).subscribe(
      produits => {
        this.produits = produits;
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching filtered products:', error);
        this.loading = false;
      }
    );
  }

  onScroll(): void {
    if (!this.loading && this.hasMoreProduits) {
      if (this.category) {
        this.loadCategoryProducts(this.category);
      } else {
        this.loadProductIds();
      }
    }
  }

  loadCartItems(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.cd.detectChanges();
    });
  }

  addToCart(produit: Produit): void {
    this.cartService.addToCart(produit);
    this.cartItemCountChanged.emit(this.cartItems.length);
  }

  increaseQuantity(produit: Produit): void {
    if (produit.quantity < 99) {
      produit.quantity++;
    }
  }

  decreaseQuantity(produit: Produit): void {
    if (produit.quantity > 1) {
      produit.quantity--;
    }
  }
}
