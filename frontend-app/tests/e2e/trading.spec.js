import { test, expect } from '@playwright/test';
import { MongoClient } from 'mongodb';
import Redis from 'ioredis';

test.describe('Trading UI End-to-End Tests', () => {
  // Use a unique suffix for this test run
  const uniqueSuffix = Date.now().toString().slice(-5);
  const testUsername = `user_${uniqueSuffix}`;
  const testEmail = `test_${uniqueSuffix}@example.com`;

  test.beforeAll(async () => {
    // Ensure the stock data isn't considered "stale" (older than 5 minutes) by the backend
    // which would block trading. We must clear both MongoDB and Redis caches.
    const client = new MongoClient('mongodb://127.0.0.1:27017/finvesto_test');
    try {
      await client.connect();
      await client.db().collection('stocks').updateMany({}, { $set: { lastPriceUpdatedAt: new Date() } });
      
      // Also flush Redis so the cached stale stock documents are cleared
      const redis = new Redis(); // defaults to 127.0.0.1:6379
      await redis.flushall();
      await redis.quit();
    } catch (err) {
      console.error("Test setup warning: could not update stock timestamps", err);
    } finally {
      await client.close();
    }
  });

  test('User can register, login, add stock to watchlist, and execute a buy order', async ({ page }) => {
    // 1. Generate unique user details
    const timestamp = Date.now();
    const username = `u_${timestamp.toString().slice(-8)}`;
    const email = `testuser_${timestamp}@example.com`;
    const password = 'Password123!';

    // 2. Navigate to Signup Page
    await page.goto('/signup');
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    
    // Click Sign Up and wait for redirect to login
    await page.click('button[type="submit"]');
    
    // The UI redirects to /login after a successful signup delay
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // 3. Login with the newly created account
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Should redirect to Dashboard
    await expect(page).toHaveURL(/\//, { timeout: 10000 });
    
    // Verify Dashboard loaded
    await expect(page.locator('text=Dashboard').first()).toBeVisible();

    // 4. Add a stock to the WatchList
    // The WatchList component fetches available stocks from backend
    // Since the backend auto-upserts stocks, there should be items in the Select dropdown
    
    // Wait for the dropdown to be visible
    const addStockLabel = page.locator('label', { hasText: 'Add Stock' });
    await expect(addStockLabel).toBeVisible();

    // Click the Select dropdown
    await page.locator('.MuiSelect-select').click();

    // Wait for dropdown options to appear (MUI renders them in a Popover)
    const listbox = page.locator('ul[role="listbox"]');
    await expect(listbox).toBeVisible();

    // Select the first available stock
    const firstStockOption = listbox.locator('li[role="option"]').first();
    const stockName = await firstStockOption.textContent();
    await firstStockOption.click();

    // Verify the stock was added to the watchlist by checking if its name appears in the list
    const stockItem = page.locator(`text=${stockName}`).first();
    await expect(stockItem).toBeVisible({ timeout: 10000 });

    // Wait for the item container and hover over it to reveal actions
    const stockContainer = page.getByTestId('watchlist-item').first();
    await stockContainer.hover();
    
    // Wait for the list item to render its buttons (The B button for Buy)
    const buyButton = page.locator('button:has-text("B")').first();
    await expect(buyButton).toBeVisible({ timeout: 5000 });
    await buyButton.click();

    // 6. Interact with the Buy Modal
    const modal = page.locator('.MuiModal-root');
    await expect(modal).toBeVisible();
    
    // Assert the modal title contains "Buy"
    await expect(modal.locator('h5')).toContainText(/Buy/);

    // Wait for the funds to load from the API (balance should update from ₹0.00 to ₹100000.00)
    await expect(modal.locator('text=Available: ₹100000.00')).toBeVisible({ timeout: 5000 });

    // Enter quantity
    await modal.locator('input[type="number"]').fill('1');

    // Submit the buy order
    await modal.locator('button', { hasText: 'Place Buy Order' }).click();

    // 7. Verify Success
    const snackbar = page.locator('.MuiSnackbar-root');
    await expect(snackbar).toBeVisible({ timeout: 10000 });
    
    const snackbarText = await snackbar.textContent();
    console.log("Snackbar text is:", snackbarText);

    await expect(snackbar.locator('text=Buy order placed successfully!')).toBeVisible();
  });
});
