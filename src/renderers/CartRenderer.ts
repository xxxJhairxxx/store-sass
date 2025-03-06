import type { CartItem } from "../models/CartItem"

export class CartRenderer {
  private itemsContainer: HTMLElement
  private totalElement: HTMLElement
  private countElement: HTMLElement
  private updateQuantityHandler: (productId: number, change: number) => void
  private removeItemHandler: (productId: number) => void

  constructor(
    itemsContainer: HTMLElement,
    totalElement: HTMLElement,
    countElement: HTMLElement,
    updateQuantityHandler: (productId: number, change: number) => void,
    removeItemHandler: (productId: number) => void,
  ) {
    this.itemsContainer = itemsContainer
    this.totalElement = totalElement
    this.countElement = countElement
    this.updateQuantityHandler = updateQuantityHandler
    this.removeItemHandler = removeItemHandler
  }

  public render(items: CartItem[], total: number): void {
    this.renderItems(items)
    this.renderTotal(total)
    this.renderCount(items)
  }

  private renderItems(items: CartItem[]): void {
    this.itemsContainer.innerHTML = ""

    if (items.length === 0) {
      this.itemsContainer.innerHTML = '<p class="text-center">Tu carrito está vacío</p>'
      return
    }

    items.forEach((item) => {
      const cartItem = this.createCartItem(item)
      this.itemsContainer.appendChild(cartItem)
    })
  }

  private renderTotal(total: number): void {
    this.totalElement.textContent = `$${total.toFixed(2)}`
  }

  private renderCount(items: CartItem[]): void {
    const count = items.reduce((total, item) => total + item.quantity, 0)
    this.countElement.textContent = count.toString()
  }

  private createCartItem(item: CartItem): HTMLElement {
    const { product, quantity } = item

    const cartItem = document.createElement("div")
    cartItem.className = "cart-item d-flex align-items-center mb-3"

    cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="cart-item-image mr-3" style="width: 50px; height: 50px; object-fit: cover;">
            <div class="flex-grow-1">
                <h6 class="mb-0">${product.title}</h6>
                <p class="mb-0">$${product.price.toFixed(2)} x ${quantity}</p>
            </div>
            <div class="btn-group btn-group-sm mr-2" role="group">
                <button type="button" class="btn btn-secondary btn-decrease">-</button>
                <button type="button" class="btn btn-secondary btn-increase">+</button>
            </div>
            <button type="button" class="btn btn-danger btn-sm btn-remove">Eliminar</button>
        `

    const decreaseBtn = cartItem.querySelector(".btn-decrease")
    decreaseBtn?.addEventListener("click", () => {
      this.updateQuantityHandler(product.id, -1)
    })

    const increaseBtn = cartItem.querySelector(".btn-increase")
    increaseBtn?.addEventListener("click", () => {
      this.updateQuantityHandler(product.id, 1)
    })

    const removeBtn = cartItem.querySelector(".btn-remove")
    removeBtn?.addEventListener("click", () => {
      this.removeItemHandler(product.id)
    })

    return cartItem
  }
}

