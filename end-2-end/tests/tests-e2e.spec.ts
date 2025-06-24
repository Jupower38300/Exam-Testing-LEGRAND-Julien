import { test, expect } from '@playwright/test';

test('Parcours complet : répondre à des questions CDA', async ({ page }) => {
  await page.goto('https://rubrr.s3-main.oktopod.app/');
  await expect(page).toHaveTitle(/Révision titre CDA/i);

  await page.getByRole('link', { name: 'Html' }).click();
  await page.locator('span', { hasText: 'Html' }).click();
  await expect(page.getByRole('heading', { name: /html/i })).toBeVisible();

  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('En faisant en a');
  await page.getByRole('button', { name: 'Répondre' }).click();
  await expect(page.getByText('❌ Fausse !')).toBeVisible();
  await page.getByText('❌ Fausse !').click();

  await page.getByRole('link', { name: 'Nouvelle question' }).click();
  await expect(page.getByRole('heading', { name: /fonction de la/i })).toBeVisible();
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('garder les données métadata + links si besoins');
  await page.getByRole('button', { name: 'Répondre' }).click();
  await expect(page.getByText('✅ Bonne !')).toBeVisible();
  await page.getByText('✅ Bonne !').click();

  await page.getByRole('link', { name: 'Liste des questions' }).click();
  await expect(page.getByRole('heading', { name: 'Toutes les questions' })).toBeVisible();
  await page.getByRole('columnheader', { name: 'Question' }).click();

  await page.getByRole('link', { name: 'Retour' }).click();
  await expect(page.getByRole('heading', { name: 'Questions pour un CDA' })).toBeVisible();
});
