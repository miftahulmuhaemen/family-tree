import { test, expect } from '@playwright/test';

test.describe('Persistence, Export, and Share Flows', () => {
  test('displays share/save action in sidebar', async ({ page }) => {
    await page.goto('/');

    const shareButton = page.getByRole('button', { name: /simpan|bagikan/i });
    await expect(shareButton).toBeVisible();
  });
});
