export interface Produit {
  id: number;
  reference: string;
  designation: string;
  image: string;
  OldPrice?: number; 
  PromoPrice?: number; 
  quantity: number;
}

export interface ProduitsResponse {
  produits: Produit[];
  totalProduits: number;
}
