import type { Product } from "../models/Product"

export class ProductService {
  private apiUrl = "https://fakestoreapi.com/products"

  public async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(this.apiUrl)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const products: Product[] = await response.json()
      return products
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  }
}

