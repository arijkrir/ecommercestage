import { Component, OnInit, Output, EventEmitter, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
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
  scrollDistance = 100; 
  scrollUpDistance = 1; 
  viewportWidth = 0;

  showAccountOptions = false;
  cartItems: Produit[] = [];
  showCart = false;

  searchTerm: string = ''; // Add this property

  @Output() cartItemCountChanged = new EventEmitter<number>();

  constructor(
    private productService: ProductService, 
    private el: ElementRef, 
    private router: Router, 
    private cartService: CartService,
    private cd: ChangeDetectorRef // Ajouter ChangeDetectorRef ici
  ) {}

  ngOnInit(): void {
    this.loadProductIds();
    this.loadCartItemsFromLocalStorage();

    // Handle search query if provided
    this.router.events.subscribe(() => {
      const searchQuery = this.router.url.split('?search=')[1];
      if (searchQuery) {
        this.searchTerm = decodeURIComponent(searchQuery);
        this.search(this.searchTerm);
      }
    });
  }

  loadProductIds(): void {
    if (this.loading || !this.hasMoreProduits) return;

    this.loading = true;

    this.productService.getAllProductIds(this.offset, this.limit).subscribe(
      (ids: number[]) => {
        if (ids.length < 1000) {
          console.log('All product IDs loaded:', ids.length, ids);
          this.hasMoreProduits = false;
        }
        this.allProductIds.push(...ids);
        this.loadProductDetails(ids);
        this.loadProductQuantities(ids); // Appeler cette méthode pour les quantités
        this.loading = false;
      },
      (error) => {
        console.error('Error loading product IDs', error);
        this.loading = false;
      }
    );
  }

  loadProductDetails(ids: number[]): void {
    console.log("Loading product details for ids:", ids);

    this.productService.getProductDetails(ids).subscribe(
      (produits: Produit[]) => {
        console.log("Loaded products:", produits.length, produits);

        produits.forEach(newProduct => {
          if (!this.produits.some(product => product.id === newProduct.id)) {
            newProduct.quantity = 1; // Initialiser la quantité
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

        this.offset += 1000;
        this.limit += 1000;
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
        this.offset += 1000;
        this.limit += 1000;
      },
      (error) => {
        console.error('Error loading product quantities from FTP', error);
      }
    );
  }

  loadProductIdsForPage(): void {
    if (this.searchTerm) {
      // Si un terme de recherche est présent
      this.productService.searchProductIds(this.pageSearch, this.pageSize, this.searchTerm).subscribe(
        (ids: number[]) => {
          if (ids.length > 0) {
            this.productService.getProductDetails(ids).subscribe(
              (products: Product[]) => {
                this.updateProducts(products, ids);
                this.hasMoreProducts = products.length >= this.pageSize; // Détermine s'il y a plus de produits à charger
              },
              (error) => {
                console.error('Error fetching product details:', error);
              }
            );
          } else {
            this.hasMoreProducts = false; // Pas plus de produits à charger
            this.noProductsFound = true; // Affiche un message si aucun produit n'est trouvé
          }
        },
        (error) => {
          console.error('Error fetching product IDs:', error);
        }
      );
    } else {
      // Si aucun terme de recherche n'est présent
      this.productService.getProductIds(this.page, this.limit).subscribe(
        (ids: number[]) => {
          if (ids.length > 0) {
            this.productService.getProductDetails(ids).subscribe(
              (products: Product[]) => {
                this.updateProducts(products, ids);
                this.hasMoreProducts = products.length >= this.limit; // Détermine s'il y a plus de produits à charger
              },
              (error) => {
                console.error('Error fetching product details:', error);
              }
            );
          } else {
            this.hasMoreProducts = false; // Pas plus de produits à charger
            this.noProductsFound = true; // Affiche un message si aucun produit n'est trouvé
          }
        },
        (error) => {
          console.error('Error fetching product IDs:', error);
        }
      );
    }
  }
  

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const isBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    if ( !this.loading && this.hasMoreProduits) {
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
      this.cartItems = JSON.parse(cartItems);
      this.cartItemCountChanged.emit(this.cartItems.length);
    }
  }

  getCartItemCount(): number {
    return this.cartItems.length;
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  removeFromCart(item: Produit): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.cartItemCountChanged.emit(this.cartItems.length);
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  login(): void {
    console.log('Se connecter...');
    this.showAccountOptions = false;
  }

  register(): void {
    console.log('Créer un compte...');
    this.showAccountOptions = false;
  }
}
