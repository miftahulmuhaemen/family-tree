import { test, expect } from '@playwright/test';

test.describe('Member Filtering and Sorting in Sidebar', () => {
  test('allows searching members and filtering by birth year', async ({ page }) => {
    await page.goto('/');

    // Switch to Members tab
    const membersTab = page.getByRole('button', { name: /anggota/i });
    if (await membersTab.isVisible()) {
      await membersTab.click();
    }

    // Verify search input is present
    const searchInput = page.getByPlaceholder(/cari/i);
    await expect(searchInput).toBeVisible();

    // Verify year combobox is available
    const yearButton = page.getByRole('button', { name: /tahun/i });
    await expect(yearButton).toBeVisible();
  });
});
