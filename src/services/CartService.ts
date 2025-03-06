import type { Product } from "../models/Product"
import type { CartItem } from "../models/CartItem"

export class CartService {
  private items: CartItem[] = []
  private storageKey = "ts_shop_cart"

  constructor() {
    this.loadCart()
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.storageKey)
    if (savedCart) {
      try {
        this.items = JSON.parse(savedCart)
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        this.items = []
      }
    }
  }

  private saveCart(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items))
  }

  public getItems(): CartItem[] {
    return [...this.items]
  }

  public getTotal(): number {
    return this.items.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  }

  public addItem(product: Product): void {
    const existingItem = this.items.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.items.push({
        product,
        quantity: 1,
      })
    }

    this.saveCart()
  }

  public updateQuantity(productId: number, change: number): void {
    const item = this.items.find((item) => item.product.id === productId)

    if (item) {
      item.quantity += change

      if (item.quantity <= 0) {
        this.removeItem(productId)
      } else {
        this.saveCart()
      }
    }
  }

  public removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.product.id !== productId)
    this.saveCart()
  }

  public clearCart(): void {
    this.items = []
    this.saveCart()
  }
}

