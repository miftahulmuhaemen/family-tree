import { test, expect } from '@playwright/test';

test.describe('Person and Relative Modals', () => {
  test('opens add relative modal when node action button is clicked', async ({ page }) => {
    await page.goto('/');

    const addRelativeButton = page.locator('button[title*="Tambah"]').first();
    if (await addRelativeButton.isVisible()) {
      await addRelativeButton.click();

      // Form dialog should be visible
      await expect(page.getByRole('heading', { name: /tambah kerabat/i })).toBeVisible();
      
      // Cancel button closes modal
      await page.getByRole('button', { name: /batal/i }).click();
      await expect(page.getByRole('heading', { name: /tambah kerabat/i })).not.toBeVisible();
    }
  });
});
