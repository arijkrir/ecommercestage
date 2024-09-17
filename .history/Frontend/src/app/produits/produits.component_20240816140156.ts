import { Component, OnInit, Output, EventEmitter, HostListener, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../produits.service';
import { Produit } from '../models/produit.model';
import { CartService } from '../cart.service';

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
  searchTerm: string = '';
  scrollDistance = 100; 
  scrollUpDistance = 1; 
  category: string = ''; 
  showCart = false;
  showAccountOptions = false;
  cartItems: Produit[] = [];

  @Output() cartItemCountChanged = new EventEmitter<number>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService, 
    private router: Router, 
    private cartService: CartService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.category = params['category'] || '';

      this.loadProducts();
    });

    // Charger les éléments du panier depuis le localStorage
    this.loadCartItemsFromLocalStorage();
  }

  loadProducts(): void {
    this.produits = [];
    this.offset = 0;
    this.hasMoreProduits = true;

    if (this.searchTerm) {
      this.loadFilteredProducts();
    } else if (this.category) {
      this.loadCategoryProducts();
    } else {
      this.loadProductIds();
    }
  }

  loadFilteredProducts(): void {
    this.productService.searchProducts(this.searchTerm).subscribe(
      (results: Produit[]) => {
        this.produits = results;
        const ids = results.map(p => p.id);
        this.loadProductDetails(ids);
        this.loadProductQuantities(ids);
      },
      (error) => {
        console.error('Error fetching search results', error);
      }
    );
  }

  loadCategoryProducts(): void {
    if (this.loading || !this.hasMoreProduits) return;

    this.loading = true;

    this.productService.getCategoryProductIds(this.category, this.offset, this.limit).subscribe(
      (ids: number[]) => {
        if (ids.length < 1000) {
          this.hasMoreProduits = false;
        }
        this.allProductIds.push(...ids);
        this.loadCategoryProductDetails(ids,this.category, 'details');
        this.loadCategoryProductDetails(ids,this.category, 'csv');
        this.loadCategoryProductDetails(ids,this.category, 'ftp');
        this.loading = false;
      },
      (error) => {
        console.error('Error loading category product IDs', error);
        this.loading = false;
      }
    );
  }

  loadCategoryProductDetails(ids: number[], category: string, source: string): void {
    this.productService.getCategoryProductDetails(ids, this.category, source).subscribe(
      (produits: Produit[]) => {
        produits.forEach(newProduct => {
          const existingProduct = this.produits.find(product => product.id === newProduct.id);
          if (existingProduct) {
            existingProduct.quantity = 1; 
          } else {
            newProduct.quantity = 1;
            this.produits.push(newProduct);
          }
        });
  
       // Ajouter le traitement pour les produits provenant de la source CSV
if (source === 'csv') {
  this.productService.getCategoryProductDetails(ids, this.category, 'csv').subscribe(
    (produits: Produit[]) => {
      produits.forEach(csvProduct => {
        const existingProduct = this.produits.find(p => p.id === csvProduct.id);
        if (existingProduct) {
          existingProduct.oldPrice = csvProduct.oldPrice;
          existingProduct.promoPrice = csvProduct.promoPrice;
        }
      });
    },
    (error) => {
      console.error('Error loading product details from CSV', error);
    }
  );
}

  
        // Traitement pour les produits provenant de la source FTP
        if (source === 'ftp') {
          this.productService.getCategoryProductDetails(ids, this.category, 'ftp').subscribe(
            (produitsFTP: Produit[]) => {
              produitsFTP.forEach(productFTP => {
                const existingProduct = this.produits.find(p => p.id === productFTP.id);
                if (existingProduct) {
                  existingProduct.stock = productFTP.quantity;
                  existingProduct.available = existingProduct.stock > 0;
                }
              });
            },
            (error) => {
              console.error('Error loading product quantities from FTP', error);
            }
          );
        }
  
        this.offset += 1000;
        this.limit += 1000;
      },
      (error) => {
        console.error(`Error loading product details from ${source}`, error);
      }
    );
  }
  

  loadProductIds(): void {
    if (this.loading || !this.hasMoreProduits) return;

    this.loading = true;

    this.productService.getAllProductIds(this.offset, this.limit).subscribe(
      (ids: number[]) => {
        if (ids.length < 1000) {
          this.hasMoreProduits = false;
        }
        this.allProductIds.push(...ids);
        this.loadProductDetails(ids);
        this.loadProductQuantities(ids);
        this.loading = false;
      },
      (error) => {
        console.error('Error loading product IDs', error);
        this.loading = false;
      }
    );
  }

  loadProductDetails(ids: number[]): void {
    this.productService.getProductDetails(ids).subscribe(
      (produits: Produit[]) => {
        produits.forEach(newProduct => {
          const existingProduct = this.produits.find(product => product.id === newProduct.id);
          if (existingProduct) {
            existingProduct.quantity = 1; 
          } else {
            newProduct.quantity = 1;
            this.produits.push(newProduct);
          }
        });

        this.offset += 1000;
        this.limit += 1000;
      },
      (error) => {
        console.error('Error loading product details', error);
      }
    );

    this.productService.getProductDetailsFromCsvByIds(ids).subscribe(
      (produits: Produit[]) => {
        produits.forEach(csvProduct => {
          const existingProduct = this.produits.find(p => p.id === csvProduct.id);
          if (existingProduct) {
            existingProduct.oldPrice = csvProduct.oldPrice;
            existingProduct.promoPrice = csvProduct.promoPrice;
          }
        });

      },
      (error) => {
        console.error('Error loading product details from CSV', error);
      }
    );
  }

  loadProductQuantities(ids: number[]): void {
    this.productService.getProductDetailsFromFTPByIds(ids).subscribe(
      (produitsFTP: Produit[]) => {
        produitsFTP.forEach(productFTP => {
          const existingProduct = this.produits.find(p => p.id === productFTP.id);
          if (existingProduct) {
            existingProduct.stock = productFTP.quantity;
            existingProduct.available = existingProduct.stock > 0;
          }
        });
      },
      (error) => {
        console.error('Error loading product quantities from FTP', error);
      }
    );
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const isBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    if (!this.loading && this.hasMoreProduits) {
      this.loadProductIds();
    }
  }

  addToCart(produit: Produit): void {
    this.cartService.addToCart(produit, produit.quantity);
  }

  increaseQuantity(produit: Produit): void {
    produit.quantity++;
  }

  decreaseQuantity(produit: Produit): void {
    if (produit.quantity > 1) {
      produit.quantity--;
    }
  }

  loadCartItemsFromLocalStorage(): void {
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      const items = JSON.parse(cartItems);
      this.cartItems = items;
    this.cartItemCountChanged.emit(this.cartItems.length);
  }

  }
}
