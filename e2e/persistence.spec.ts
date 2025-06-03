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

test.describe("Persistence", () => {
  let tdPage: todoPage;

  test.beforeEach(async ({ page }) => {
    tdPage = new todoPage(page);
  });

  test("should persist its data", async ({ page }, testInfo) => {
    // tdPage is already initialized in beforeEach
    for (const item of TODO_ITEMS) {
      await tdPage.newInput.fill(item);
      await tdPage.newInput.press("Enter");
    }

    const firstTodoCheck = tdPage.todoTasks.nth(0).getByRole("checkbox");
    await firstTodoCheck.check();
    // It's generally better to check for specific texts rather than the whole array if completion modifies text presentation
    await expect(tdPage.todoTasks.nth(0)).toContainText(TODO_ITEMS[0]);
    await expect(tdPage.todoTasks.nth(1)).toContainText(TODO_ITEMS[1]);
    await expect(tdPage.todoTasks.nth(2)).toContainText(TODO_ITEMS[2]);
    await expect(firstTodoCheck).toBeChecked();

    await expect(tdPage.todoTasks).toHaveClass([/completed/,/|\s/,/|\s/]);

    // This condition is specific to the Playwright demo app or apps that ensure immediate persistence.
    // Other frameworks might require waiting or have different mechanisms for local storage updates.
    if (testInfo.project.name.toLowerCase().includes("playwright") ){
      await page.reload();
      const tdPageAfterReload = new todoPage(page); // Re-initialize POM after reload

      await expect(tdPageAfterReload.todoTasks.nth(0)).toContainText(TODO_ITEMS[0]);
      await expect(tdPageAfterReload.todoTasks.nth(1)).toContainText(TODO_ITEMS[1]);
      await expect(tdPageAfterReload.todoTasks.nth(2)).toContainText(TODO_ITEMS[2]);
      await expect(tdPageAfterReload.todoTasks.nth(0).getByRole("checkbox")).toBeChecked();
      await expect(tdPageAfterReload.todoTasks).toHaveClass([/completed/,/|\s/, /|\s/]);
    }
  });
});
