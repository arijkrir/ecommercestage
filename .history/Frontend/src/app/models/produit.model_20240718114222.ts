export interface Produit {
  id: number;
  reference: string;
  designation: string;
  image: string;
  oldPrice?: number; // Optionnel si les anciens prix sont disponibles
  promoPrice?: number; 
  quantity: number;
}

export interface ProduitsResponse {
  produits: Produit[];
  totalProduits: number;
}
