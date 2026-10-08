import { test, expect } from '@playwright/test';

test.describe('Tree Navigation & Canvas Rendering', () => {
  test('renders the family tree and allows viewport interactions', async ({ page }) => {
    await page.goto('/');

    // Verify main canvas or ReactFlow container loads
    await expect(page.locator('.react-flow')).toBeVisible();

    // Verify presence of at least one person node
    const firstNode = page.locator('.react-flow__node').first();
    await expect(firstNode).toBeVisible();

    // Verify controls panel exists
    await expect(page.locator('.react-flow__controls')).toBeVisible();
  });
});
