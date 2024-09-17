export interface Produit {
  id: number;
  reference: string;
  designation: string;
  image: string;
  oldPrice: number; 
  promoPrice?: number; 
  quantity: number;
}

export interface ProduitsResponse {
  produits: Produit[];
  totalProduits: number;
}