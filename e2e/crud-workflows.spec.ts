import { test, expect } from '@playwright/test';

test.describe('Person and Relative Modals', () => {
  test('opens add person modal when add button is clicked', async ({ page }) => {
    await page.goto('/');

    const addButton = page.getByRole('button', { name: /tambah anggota/i });
    if (await addButton.isVisible()) {
      await addButton.click();

      // Form dialog should be visible
      await expect(page.getByRole('heading', { name: /tambah anggota/i })).toBeVisible();
      
      // Cancel button closes modal
      await page.getByRole('button', { name: /batal/i }).click();
      await expect(page.getByRole('heading', { name: /tambah anggota/i })).not.toBeVisible();
    }
  });
});
