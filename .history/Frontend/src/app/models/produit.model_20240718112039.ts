export interface Produit {
  id: number;
  reference: string;
  designation: string;
  image: string;
  oldPrice?: number; // Optionnel si les anciens prix sont disponibles
  promoPrice?: number; // Optionnel si les nouveaux prix sont disponibles
  quantity: number;
}

export interface ProduitsResponse {
  produits: Produit[];
  totalProduits: number;
}
