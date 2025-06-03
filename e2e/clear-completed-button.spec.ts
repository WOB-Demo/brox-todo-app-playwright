import { expect, type Page } from "@playwright/test";
import { test } from '../fixtures';
import { todoPage } from "../pom/todoPage";
import { readFile } from "fs/promises"; // Added import

// Added testObj constant
const testObj = JSON.parse(
  await readFile(new URL("../pom/TestObject/Jobject.json", import.meta.url))
);

const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
];

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test.describe("Clear completed button", () => {
  let tdPage: todoPage;

  test.beforeEach(async ({ page }) => {
    tdPage = new todoPage(page);
    await tdPage.createDefaultTodos(TODO_ITEMS);
  });

  test("should display the correct text", async ({ page }) => {
    await tdPage.todoTasks.first().locator(".toggle").check();
    await expect(tdPage.clearCompleted).toBeVisible();
  });

  test("should remove completed items when clicked", async ({ page }) => {
    const todoItems = tdPage.todoTasks;
    await todoItems.nth(1).getByRole("checkbox").check();
    // Reverted to use testObj for the click action's locator text
    await page.getByText(testObj.todoClearCompleted).click();
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toContainText([new RegExp(TODO_ITEMS[0]), new RegExp(TODO_ITEMS[2])]);
  });

  test("should be hidden when there are no items that are completed", async ({page}, testInfo) => {
    await tdPage.todoTasks.first().locator(".toggle").check();
    // Reverted to use testObj for the click action's locator text
    await page.getByText(testObj.todoClearCompleted).click();
    // This condition is specific to certain frameworks due to their handling of UI updates.
    // React-based frameworks might have different behavior for DOM updates and visibility.
    if (!testInfo.project.name.toLowerCase().includes("react") ){
      await tdPage.clearCompleted.waitFor({state:"hidden"});
      await expect(tdPage.clearCompleted).toBeHidden();
    }
  });
});
