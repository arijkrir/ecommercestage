export interface Produit {
  id: number;
  reference: string;
  designation: string;
  image: string;
  oldPrice?: decimal; 
  promoPrice?: decimal; 
  quantity: number;
}

export interface ProduitsResponse {
  produits: Produit[];
  totalProduits: number;
}
