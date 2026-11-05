const { test, expect } = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage = require('../pages/CartPage');
const CheckoutStepOnePage = require('../pages/CheckoutStepOnePage');
const CheckoutStepTwoPage = require('../pages/CheckoutStepTwoPage');
const CheckoutCompletePage = require('../pages/CheckoutCompletePage');

test('покупка самого дорогого товара', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  const checkoutCompletePage = new CheckoutCompletePage(page);

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(inventoryPage.pageTitle).toHaveText('Products');

  await inventoryPage.sortByPriceDescending();
  const mostExpensiveItem = await inventoryPage.addMostExpensiveItemToCart();

  await inventoryPage.openCart();
  await expect(page).toHaveURL(/cart\.html/);

  const cartItemNames = await cartPage.getItemNames();
  expect(cartItemNames).toContain(mostExpensiveItem);

  await cartPage.goToCheckout();
  await checkoutStepOnePage.fillUserInfo('Test', 'User', '12345');
  await checkoutStepOnePage.continueCheckout();

  await expect(page).toHaveURL(/checkout-step-two\.html/);

  await expect(page.locator('[data-test="title"]'))
  .toHaveText('Checkout: Overview');//

  const summaryItemNames = await checkoutStepTwoPage.getItemNames();
  expect(summaryItemNames).toContain(mostExpensiveItem);

  await checkoutStepTwoPage.finishCheckout();

  await expect(page).toHaveURL(/checkout-complete\.html/);
  await expect(checkoutCompletePage.completionMessage).toHaveText(
    'Thank you for your order!'
  );
});
