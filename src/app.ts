import { ProductService } from "./services/ProductService"
import { CartService } from "./services/CartService"
import { ProductRenderer } from "./renderers/ProductRenderer"
import { CartRenderer } from "./renderers/CartRenderer"
import type { Product } from "./models/Product"

class App {
  private productService: ProductService
  private cartService: CartService
  private productRenderer: ProductRenderer
  private cartRenderer: CartRenderer
  private cartModal: HTMLElement

  constructor() {
    this.productService = new ProductService()
    this.cartService = new CartService()
    this.productRenderer = new ProductRenderer(
      document.getElementById("products-container") as HTMLElement,
      this.handleAddToCart.bind(this),
    )
    this.cartRenderer = new CartRenderer(
      document.getElementById("cart-items") as HTMLElement,
      document.getElementById("cart-total") as HTMLElement,
      document.getElementById("cart-count") as HTMLElement,
      this.handleUpdateQuantity.bind(this),
      this.handleRemoveItem.bind(this),
    )
    this.cartModal = document.getElementById("cartModal") as HTMLElement

    this.initializeEventListeners()
  }

  private initializeEventListeners(): void {
    const cartButton = document.getElementById("cart-button")
    const checkoutButton = document.getElementById("checkout-button")
    const closeButtons = document.querySelectorAll('[data-dismiss="modal"]')

    cartButton?.addEventListener("click", () => this.showModal())
    checkoutButton?.addEventListener("click", () => this.handleCheckout())
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => this.hideModal())
    })

    // Cerrar modal al hacer clic fuera de él
    window.addEventListener("click", (event) => {
      if (event.target === this.cartModal) {
        this.hideModal()
      }
    })
  }

  private showModal(): void {
    this.cartModal.classList.add("show")
    this.cartModal.style.display = "block"
    document.body.classList.add("modal-open")
  }

  private hideModal(): void {
    this.cartModal.classList.remove("show")
    this.cartModal.style.display = "none"
    document.body.classList.remove("modal-open")
  }

  private handleCheckout(): void {
    if (this.cartService.getItems().length > 0) {
      alert("¡Gracias por tu compra! Este es un demo, así que no se realizará ningún cargo.")
      this.cartService.clearCart()
      this.updateCart()
      this.hideModal()
    } else {
      alert("Tu carrito está vacío.")
    }
  }

  private handleAddToCart(product: Product): void {
    this.cartService.addItem(product)
    this.updateCart()
  }

  private handleUpdateQuantity(productId: number, change: number): void {
    this.cartService.updateQuantity(productId, change)
    this.updateCart()
  }

  private handleRemoveItem(productId: number): void {
    this.cartService.removeItem(productId)
    this.updateCart()
  }

  private updateCart(): void {
    const items = this.cartService.getItems()
    const total = this.cartService.getTotal()
    this.cartRenderer.render(items, total)
  }

  public async init(): Promise<void> {
    try {
      const products = await this.productService.getProducts()
      this.productRenderer.render(products)
      this.updateCart()
    } catch (error) {
      console.error("Failed to initialize app:", error)
      this.productRenderer.renderError("Failed to load products. Please try again later.")
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new App()
  app.init()
})

