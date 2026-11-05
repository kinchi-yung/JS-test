class InventoryPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async getPageTitle() {
    return this.pageTitle.textContent();
  }

  async sortByPriceDescending() {
    await this.sortDropdown.selectOption('hilo');
  }

  async getMostExpensiveItemName() {
    const firstItem = this.inventoryItems.first();
    return firstItem.locator('[data-test="inventory-item-name"]').textContent();
  }

  async addItemToCart(itemName) {
    const item = this.inventoryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', {
        hasText: itemName,
      }),
    });

    await item.locator('button').click();
  }

  async addMostExpensiveItemToCart() {
    const firstItem = this.inventoryItems.first();
    const itemName = await firstItem
      .locator('[data-test="inventory-item-name"]')
      .textContent();

    await firstItem.locator('button').click();

    return itemName.trim();
  }

  async openCart() {
    await this.cartIcon.click();
  }
}

module.exports = InventoryPage;


//this.pageTitle = page.locator(//span[@class='title']);
//this.pageTitle = page.locator(span.title);
//this.pageTitle = page.locator(a.shopping_cart_link);
//this.pageTitle = page.locator(//button[contains(@name, 'add-to-cart-')]);
//this.pageTitle = page.locator(//div[@class='inventory_item'][.//div[@class='inventory_item_name' and text()='Sauce Labs Backpack']]//button);