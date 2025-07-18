import { test, expect } from '@playwright/test';

test.setTimeout(150000); // Set timeout to 150s

test('Visual regression - solo-analytics-sheet-selections', async ({ page }, testInfo) => {
  await page.goto('solo-analytics-sheet-selections.html');
  // Wait for the main header to appear
  await expect(page.locator('h1')).toHaveText('analytics/sheet and analytics/selections via qlik/embed-web-components and refApi');

  // Wait another moment for good measure/ slow compute
  // Not good practice, but necessary for some slow environments
  await page.waitForTimeout(20000);

  // Take a screenshot of the main container and compare it with the baseline (default state)
  const defaultScreenshot = await page.locator('.main-container').screenshot();
  expect(defaultScreenshot).toMatchSnapshot('solo-analytics-sheet-selections-default.png');

  // Loop through each option in the dropdown and take a snapshot after selection, skipping the currently selected option
  const dropdown = page.locator('[data-testid="dropdown"]');
  const options = await dropdown.locator('option').all();
  const selectedValue = await dropdown.inputValue();
  for (const option of options) {
    const value = await option.getAttribute('value');
    if (!value || value === selectedValue) continue;
    // Select the option
    await dropdown.selectOption(value);

    // Wait another moment for good measure/ slow compute
    // Not good practice, but necessary for some slow environments
    await page.waitForTimeout(20000);

    // Take a screenshot and compare with a snapshot for this option
    const screenshot = await page.locator('.main-container').screenshot();
    expect(screenshot).toMatchSnapshot(`solo-analytics-sheet-selections-${value}.png`);
  }
});
