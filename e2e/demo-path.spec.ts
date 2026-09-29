import { test, expect } from "@playwright/test";

/**
 * P0 Demo Path — 10-step sequential smoke test.
 *
 * Overview → John Smith / Acme → Attribution Summary → Why? →
 * Customer Journey → Acme Account → Attribution (First → Conversion →
 * Last Marketing Touch) → Unknown row → Vector Group →
 * Ask Inbound → Integrations
 */
test("P0 demo path walks end-to-end without broken states", async ({
  page,
}) => {
  // -----------------------------------------------------------------------
  // Step 1 — Overview
  // -----------------------------------------------------------------------
  await page.goto("/overview");
  await expect(
    page.getByRole("heading", { name: "Overview", level: 1 }),
  ).toBeVisible();

  // KPI cards (scoped to main content to avoid sidebar nav collisions)
  const main = page.getByRole("main");
  await expect(main.getByText("Inbound Leads")).toBeVisible();
  await expect(main.getByText("Open Pipeline")).toBeVisible();
  await expect(main.getByText("Won Revenue")).toBeVisible();

  // Recent inbound table
  await expect(main.getByText("Recent inbound")).toBeVisible();

  // John Smith visible in the recent inbound table
  await expect(main.getByText("John Smith").first()).toBeVisible();

  // -----------------------------------------------------------------------
  // Step 2 — Click John Smith → Lead Detail
  // -----------------------------------------------------------------------
  await main.getByText("John Smith").first().click();
  await page.waitForURL(/\/leads\/person_john_smith/);

  await expect(
    page.getByRole("heading", { name: "John Smith", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText("VP Product")).toBeVisible();
  await expect(page.getByText("john.smith@acme.com")).toBeVisible();

  // -----------------------------------------------------------------------
  // Step 3 — Attribution section
  // -----------------------------------------------------------------------
  await expect(
    page.getByRole("heading", { name: "Attribution", level: 2 }),
  ).toBeVisible();

  // Three touchpoint columns
  await expect(page.getByText("Google Organic").first()).toBeVisible();
  await expect(page.getByText("LinkedIn Organic").first()).toBeVisible();
  await expect(page.getByText("Contact Form")).toBeVisible();

  // Click first "Why?" button → evidence dialog
  const whyButtons = page.getByRole("button", { name: /Why\?/ });
  await whyButtons.first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Evidence")).toBeVisible();

  // Close dialog
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).not.toBeVisible();

  // -----------------------------------------------------------------------
  // Step 4 — Customer journey section
  // -----------------------------------------------------------------------
  await expect(
    page.getByRole("heading", { name: "Customer journey", level: 2 }),
  ).toBeVisible();
  await expect(page.getByText(/Journey assembled from/)).toBeVisible();

  // -----------------------------------------------------------------------
  // Step 5 — Opportunity in sidebar
  // -----------------------------------------------------------------------
  await expect(
    page.getByText("AI Transformation Platform", { exact: true }),
  ).toBeVisible();

  // -----------------------------------------------------------------------
  // Step 6 — Click Acme Inc link → Account Detail
  // -----------------------------------------------------------------------
  // There could be multiple "Acme Inc" links; click the one in the header
  await page.getByRole("link", { name: "Acme Inc" }).first().click();
  await page.waitForURL(/\/accounts\/company_acme/);

  await expect(
    page.getByRole("heading", { name: "Acme Inc", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Known Contacts", level: 2 }),
  ).toBeVisible();

  // -----------------------------------------------------------------------
  // Step 7 — Sidebar → Attribution page → tab switching
  // -----------------------------------------------------------------------
  await page.getByRole("link", { name: "Attribution", exact: true }).click();
  await page.waitForURL(/\/attribution/);

  await expect(
    page.getByRole("heading", { name: "Attribution", level: 1 }),
  ).toBeVisible();

  // "First Touch" tab is selected by default
  const firstTouchTab = page.getByRole("tab", { name: "First Touch" });
  await expect(firstTouchTab).toHaveAttribute("aria-selected", "true");

  // Click "Conversion Touch" tab
  await page.getByRole("tab", { name: "Conversion Touch" }).click();
  await expect(page).toHaveURL(/model=conversion_touch/);

  // Click "Last Marketing Touch" tab
  await page.getByRole("tab", { name: "Last Marketing Touch" }).click();
  await expect(page).toHaveURL(/model=last_touch/);

  // Go back to "First Touch"
  await page.getByRole("tab", { name: "First Touch" }).click();
  await expect(page).toHaveURL(/model=first_touch/);

  // -----------------------------------------------------------------------
  // Step 8 — Click "Unknown" row → Vector Group in drilldown
  // -----------------------------------------------------------------------
  // Find the table row containing "Unknown" text
  const unknownRow = page
    .locator("table tbody tr")
    .filter({ hasText: "Unknown" });
  await unknownRow.first().click();

  // Drilldown should appear with Vector Group
  await expect(page.getByText("Vector Group")).toBeVisible();

  // -----------------------------------------------------------------------
  // Step 9 — Sidebar → Ask Inbound
  // -----------------------------------------------------------------------
  await page.getByRole("link", { name: "Ask Inbound" }).click();
  await page.waitForURL(/\/ask-inbound/);

  await expect(
    page.getByRole("heading", { name: "Ask Inbound", level: 1 }),
  ).toBeVisible();

  // Click the "Where did Acme come from?" chip
  await page
    .getByRole("button", { name: "Where did Acme come from?" })
    .click();

  // Answer should show with CTA link
  await expect(page.getByText("Attribution for Acme Inc")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Open Acme Inc journey/ }),
  ).toBeVisible();

  // -----------------------------------------------------------------------
  // Step 10 — Sidebar → Integrations
  // -----------------------------------------------------------------------
  await page.getByRole("link", { name: "Integrations" }).click();
  await page.waitForURL(/\/integrations/);

  await expect(page.getByText("Website Tracker")).toBeVisible();
  await expect(page.getByText("Connected").first()).toBeVisible();
});
