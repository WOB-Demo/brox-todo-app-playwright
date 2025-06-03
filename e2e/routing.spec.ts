import { expect, type Page } from "@playwright/test";
import { test } from '../fixtures';
import { todoPage } from "../pom/todoPage";

const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
];

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test.describe("Routing", () => {
  let tdPage: todoPage;

  test.beforeEach(async ({ page }) => {
    tdPage = new todoPage(page);
    await tdPage.createDefaultTodos(TODO_ITEMS);
  });

  test("should allow me to display active items", async ({ page }) => {
    // tdPage is already initialized in beforeEach
    await tdPage.todoTasks.nth(1).getByRole("checkbox").check();

    await tdPage.displayActive.click();
    // After filtering, check the visible active tasks
    await expect(tdPage.todoActiveTasks).toHaveCount(2);
    await expect(tdPage.todoActiveTasks).toContainText([new RegExp(TODO_ITEMS[0]), new RegExp(TODO_ITEMS[2])]);
  });

  test("should respect the back button", async ({ page }) => {
    // tdPage is already initialized in beforeEach
    await tdPage.todoTasks.nth(1).getByRole("checkbox").check();

    await test.step("Showing all items", async () => {
      await tdPage.displayAll.click();
      // Re-initialize or use locators that are not tied to the initial tdPage instance if needed
      // For this test, direct page interaction and re-querying locators might be more robust
      await expect(new todoPage(page).todoTasks).toHaveCount(3);
    });

    await test.step("Showing active items", async () => {
      await tdPage.displayActive.click();
      await expect(new todoPage(page).todoActiveTasks).toHaveCount(2);
    });

    await test.step("Showing completed items", async () => {
      await tdPage.displayCompleted.click();
      await expect(new todoPage(page).todoCompletedTasks).toHaveCount(1);
    });

    await page.goBack(); // Should go to Active
    await expect(new todoPage(page).todoActiveTasks).toHaveCount(2);

    await page.goBack(); // Should go to All
    await expect(new todoPage(page).todoTasks).toHaveCount(3);
  });

  test("should allow me to display completed items", async ({ page }) => {
    // tdPage is already initialized in beforeEach
    await tdPage.todoTasks.nth(1).getByRole("checkbox").check();

    await tdPage.displayCompleted.click();
    // After filtering, check the visible completed tasks
    await expect(new todoPage(page).todoCompletedTasks).toHaveCount(1); // Use new todoPage for fresh locators after navigation
  });

  test("should allow me to display all items", async ({ page }) => {
    // tdPage is already initialized in beforeEach
    await tdPage.todoTasks.nth(1).getByRole("checkbox").check();

    await tdPage.displayActive.click();
    await tdPage.displayCompleted.click();
    await tdPage.displayAll.click();
    await expect(new todoPage(page).todoTasks).toHaveCount(3); // Use new todoPage for fresh locators after navigation
  });

  test("should highlight the currently applied filter", async ({ page }) => {
    // tdPage is already initialized in beforeEach
    await expect(tdPage.displayAll).toHaveClass(/selected/);

    // No need to redefine activeLink and completedLink if using tdPage directly
    await tdPage.displayActive.click();
    await expect(tdPage.displayActive).toHaveClass(/selected/);

    await tdPage.displayCompleted.click();
    await expect(tdPage.displayCompleted).toHaveClass(/selected/);
  });
});
