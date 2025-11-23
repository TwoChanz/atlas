import { test, expect } from '@playwright/test';

test.describe('Tool Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the application title', async ({ page }) => {
    await expect(page.getByText('Atlas')).toBeVisible();
    await expect(page.getByText('Personal Tool Intelligence System')).toBeVisible();
  });

  test('should open add tool modal when clicking Add Tool button', async ({ page }) => {
    // Find and click the Add Tool button
    await page.getByRole('button', { name: /add tool/i }).click();

    // Modal should be visible
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/add new tool/i)).toBeVisible();
  });

  test('should create a new tool', async ({ page }) => {
    // Open add tool modal
    await page.getByRole('button', { name: /add tool/i }).click();

    // Fill in tool details
    await page.getByLabel(/tool name/i).fill('Figma');
    await page.getByLabel(/url/i).fill('https://figma.com');
    await page.getByLabel(/type/i).selectOption('App');

    // Add tags (if TagInput supports it)
    const tagInput = page.getByPlaceholder(/add tags/i);
    await tagInput.fill('design');
    await tagInput.press('Enter');

    // Save the tool
    await page.getByRole('button', { name: /save/i }).click();

    // Tool should appear in the list
    await expect(page.getByText('Figma')).toBeVisible();
  });

  test('should search for tools', async ({ page }) => {
    // First, add a couple of tools
    await page.getByRole('button', { name: /add tool/i }).click();
    await page.getByLabel(/tool name/i).fill('Figma');
    await page.getByRole('button', { name: /save/i }).click();

    await page.getByRole('button', { name: /add tool/i }).click();
    await page.getByLabel(/tool name/i).fill('Notion');
    await page.getByRole('button', { name: /save/i }).click();

    // Search for specific tool
    const searchInput = page.getByPlaceholder(/search tools/i);
    await searchInput.fill('Figma');

    // Only Figma should be visible
    await expect(page.getByText('Figma')).toBeVisible();
    await expect(page.getByText('Notion')).not.toBeVisible();
  });

  test('should edit a tool', async ({ page }) => {
    // Add a tool first
    await page.getByRole('button', { name: /add tool/i }).click();
    await page.getByLabel(/tool name/i).fill('Figma');
    await page.getByRole('button', { name: /save/i }).click();

    // Click edit button on the tool card
    await page.getByTitle(/edit/i).first().click();

    // Modal should open with tool data
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByLabel(/tool name/i)).toHaveValue('Figma');

    // Edit the tool
    await page.getByLabel(/tool name/i).fill('Figma Updated');
    await page.getByRole('button', { name: /save/i }).click();

    // Updated name should be visible
    await expect(page.getByText('Figma Updated')).toBeVisible();
    await expect(page.getByText('Figma')).not.toBeVisible();
  });

  test('should delete a tool', async ({ page }) => {
    // Add a tool first
    await page.getByRole('button', { name: /add tool/i }).click();
    await page.getByLabel(/tool name/i).fill('Tool to Delete');
    await page.getByRole('button', { name: /save/i }).click();

    // Tool should be visible
    await expect(page.getByText('Tool to Delete')).toBeVisible();

    // Open edit modal
    await page.getByTitle(/edit/i).first().click();

    // Click delete button
    await page.getByRole('button', { name: /delete/i }).click();

    // Confirm deletion in dialog
    page.on('dialog', (dialog) => dialog.accept());

    // Tool should no longer be visible
    await expect(page.getByText('Tool to Delete')).not.toBeVisible();
  });

  test('should filter tools by tag', async ({ page }) => {
    // Add tools with different tags
    await page.getByRole('button', { name: /add tool/i }).click();
    await page.getByLabel(/tool name/i).fill('Design Tool');
    const tagInput = page.getByPlaceholder(/add tags/i);
    await tagInput.fill('design');
    await tagInput.press('Enter');
    await page.getByRole('button', { name: /save/i }).click();

    await page.getByRole('button', { name: /add tool/i }).click();
    await page.getByLabel(/tool name/i).fill('Productivity Tool');
    const tagInput2 = page.getByPlaceholder(/add tags/i);
    await tagInput2.fill('productivity');
    await tagInput2.press('Enter');
    await page.getByRole('button', { name: /save/i }).click();

    // Filter by tag
    await page.getByRole('button', { name: /design/i }).click();

    // Only design tool should be visible
    await expect(page.getByText('Design Tool')).toBeVisible();
    await expect(page.getByText('Productivity Tool')).not.toBeVisible();
  });
});
