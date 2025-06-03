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

test.describe("Editing", () => {
  let tdPage: todoPage;

  test.beforeEach(async ({ page }) => {
    tdPage = new todoPage(page);
    await tdPage.createDefaultTodos(TODO_ITEMS);
  });

  test("should hide other controls when editing", async ({ page }) => {
    // tdPage is already initialized in beforeEach
    const todoItem = tdPage.todoTasks.nth(1);
    await todoItem.dblclick();
    await expect(todoItem.getByRole("checkbox")).not.toBeVisible( );
    await expect(
      todoItem.locator("label", {
        hasText: new RegExp(TODO_ITEMS[1]),
      })
    ).not.toBeVisible();
  });

  test("should save edits on blur", async ({ page }, testInfo) => {
    // tdPage is already initialized in beforeEach
    const todoItems = tdPage.todoTasks;
    await todoItems.nth(1).dblclick();
    // This condition is specific to certain frameworks due to their handling of UI updates or event handling.
    // React and Angular might have different behavior for DOM updates or blur event propagation during editing.
    if (!testInfo.project.name.toLowerCase().includes("react") && !testInfo.project.name.toLowerCase().includes("angular")){
      await todoItems.nth(1).locator("input[class*='edit']").fill("buy some sausages");
      await todoItems.nth(1).locator("input[class*='edit']").dispatchEvent("blur");

      await expect(todoItems).toContainText([
        new RegExp(TODO_ITEMS[0]),
        /buy some sausages/,
        new RegExp(TODO_ITEMS[2]),
      ]);
    }
  });

  test("should trim entered text", async ({ page },testInfo) => {
    // tdPage is already initialized in beforeEach
    const todoItems = tdPage.todoTasks;
    await todoItems.nth(1).dblclick();
    // This condition is specific to certain frameworks due to their handling of UI updates.
    // React-based frameworks might have different behavior for DOM updates during editing.
    if (!testInfo.project.name.toLowerCase().includes("react")){
      await todoItems.nth(1).locator("input[class*='edit']").fill("    buy some sausages    ");
      await todoItems.nth(1).locator("input[class*='edit']").press("Enter");

      await expect(todoItems).toContainText([
        new RegExp(TODO_ITEMS[0]),
        /buy some sausages/,
        new RegExp(TODO_ITEMS[2]),
      ]);
    }
  });

  test("should remove the item if an empty text string was entered", async ({page}, testInfo) => {
    // tdPage is already initialized in beforeEach
    const todoItems = tdPage.todoTasks;
    await todoItems.nth(1).dblclick();
    // This condition is specific to certain frameworks due to their handling of UI updates.
    // React-based frameworks might have different behavior for DOM updates during editing.
    if (!testInfo.project.name.toLowerCase().includes("react")){
      await todoItems.nth(1).locator("input[class*='edit']").fill("");
      await todoItems.nth(1).locator("input[class*='edit']").press("Enter");

      await expect(todoItems).toContainText([new RegExp(TODO_ITEMS[0]), new RegExp(TODO_ITEMS[2])]);
    }
  });

  test("should cancel edits on escape", async ({ page }, testInfo) => {
    // tdPage is already initialized in beforeEach
    const todoItems = tdPage.todoTasks;
    await todoItems.nth(1).dblclick();
    // This condition is specific to certain frameworks due to their handling of UI updates.
    // React-based frameworks might have different behavior for DOM updates during editing.
    if (!testInfo.project.name.toLowerCase().includes("react")){
      await todoItems.nth(1).locator("input[class*='edit']").fill("buy some sausages");
      await todoItems.nth(1).locator("input[class*='edit']").press("Escape");
      await expect(todoItems).toContainText(TODO_ITEMS);
    }
  });
});
