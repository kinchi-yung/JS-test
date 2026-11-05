class CheckoutCompletePage {
  constructor(page) {
    this.page = page;
    this.completionMessage = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async getCompletionMessage() {
    return this.completionMessage.textContent();
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}

module.exports = CheckoutCompletePage;
