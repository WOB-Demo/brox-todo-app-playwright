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

test.describe("New Todo", () => {
  let tdPage: todoPage;

  test.beforeEach(async ({ page }) => {
    tdPage = new todoPage(page);
  });

  test("should allow me to add todo items", async ({ page }) => {
    // No longer need 'const tdPage = new todoPage(page);'
    await tdPage.newInput.fill(TODO_ITEMS[0]);
    await tdPage.newInput.press("Enter");

    await expect(tdPage.todoTasks).toContainText([new RegExp(TODO_ITEMS[0])]);

    await tdPage.newInput.fill(TODO_ITEMS[1]);
    await tdPage.newInput.press("Enter");

    // No longer need 'const tasks = tdPage.todoTasks;' if only used once
    await expect(tdPage.todoTasks).toContainText([new RegExp(TODO_ITEMS[0]), new RegExp(TODO_ITEMS[1])]);
  });

  test("should clear text input field when an item is added", async ({
    page, // page parameter is kept if other page operations are needed, otherwise can be removed
  }) => {
    // No longer need 'const tdPage = new todoPage(page);'
    await tdPage.newInput.fill(TODO_ITEMS[0]);
    await tdPage.newInput.press("Enter");

    await expect(tdPage.newInput).toBeEmpty();
  });

  test("should append new items to the bottom of the list", async ({
    page, // page parameter is kept
  }) => {
    // No longer need 'const tdPage = new todoPage(page);'
    const newItem = "Another Item";

    await tdPage.createDefaultTodos(TODO_ITEMS);

    await expect(tdPage.incompletedTasks).toContainText(/3 items left/);

    await tdPage.newInput.fill(newItem);
    await tdPage.newInput.press("Enter");

    await expect(tdPage.todoTasks).toContainText([new RegExp(TODO_ITEMS[0]),new RegExp(TODO_ITEMS[1]),new RegExp(TODO_ITEMS[2]), new RegExp(newItem)]);
  });
});
