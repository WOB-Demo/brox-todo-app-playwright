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

test.describe("Mark all as completed", () => {
  let tdPage: todoPage;

  test.beforeEach(async ({ page }) => {
    tdPage = new todoPage(page);
    await tdPage.createDefaultTodos(TODO_ITEMS);
  });

  test("should allow me to mark all items as completed", async ({ page }) => {
    // tdPage is already initialized in beforeEach
    await tdPage.markAll.check();

    await expect(tdPage.todoTasks).toHaveClass([
      /completed/,
      /completed/,
      /completed/,
    ]);
  });

  test("should allow me to clear the complete state of all items", async ({
    page,
  }) => {
    // tdPage is already initialized in beforeEach
    await tdPage.markAll.check();
    await tdPage.markAll.uncheck();

    await expect(tdPage.todoTasks).toHaveClass([/|\s/, /|\s/, /|\s/]);
  });

  test("complete all checkbox should update state when items are completed / cleared", async ({
    page,
  }) => {
    // tdPage is already initialized in beforeEach
    await tdPage.markAll.check();
    await expect(tdPage.markAll).toBeChecked();

    const firstTodo = tdPage.todoTasks.nth(0);
    await firstTodo.getByRole("checkbox").uncheck();

    await expect(tdPage.markAll).not.toBeChecked();

    await firstTodo.getByRole("checkbox").check();

    await expect(tdPage.markAll).toBeChecked();
  });
});
