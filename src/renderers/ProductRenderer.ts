import type { Product } from "../models/Product"

export class ProductRenderer {
  private container: HTMLElement
  private addToCartHandler: (product: Product) => void

  constructor(container: HTMLElement, addToCartHandler: (product: Product) => void) {
    this.container = container
    this.addToCartHandler = addToCartHandler
  }

  public render(products: Product[]): void {
    this.container.innerHTML = ""

    products.forEach((product) => {
      const productCard = this.createProductCard(product)
      this.container.appendChild(productCard)
    })
  }

  public renderError(message: string): void {
    this.container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          ${message}
        </div>
      </div>
    `
  }

  private createProductCard(product: Product): HTMLElement {
    const card = document.createElement("div")
    card.className = "col-md-4 mb-4"

    card.innerHTML = `
      <div class="card h-100">
        <a href="product-detail.html?id=${product.id}" class="text-decoration-none">
          <img src="${product.image}" class="card-img-top product-image" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description.substring(0, 100)}...</p>
            <p class="card-text"><strong>$${product.price.toFixed(2)}</strong></p>
          </div>
        </a>
        <div class="card-footer">
          <button class="btn btn-primary btn-block btn-add-to-cart">Añadir al Carrito</button>
        </div>
      </div>
    `

    const addToCartButton = card.querySelector(".btn-add-to-cart")
    addToCartButton?.addEventListener("click", (e) => {
      e.preventDefault() // Prevenir la navegación al detalle del producto
      this.addToCartHandler(product)
    })

    return card
  }
}