class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;
    this.summaryItems = page.locator('.cart_item');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async getItemNames() {
    return this.summaryItems
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }
}

module.exports = CheckoutStepTwoPage;

