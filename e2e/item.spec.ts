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

test.describe("Item", () => {
  let tdPage: todoPage;

  test.beforeEach(async ({ page }) => {
    tdPage = new todoPage(page);
  });

  test("should allow me to mark items as complete", async ({ page }) => {
    // tdPage is already initialized in beforeEach
    for (const item of TODO_ITEMS.slice(0,2)) {
      await tdPage.newInput.fill(item);
      await tdPage.newInput.press("Enter");
    }

    const firstTodo = tdPage.todoTasks.nth(0);
    await firstTodo.getByRole("checkbox").check();
    await expect(firstTodo).toHaveClass(/completed/);

    const secondTodo = tdPage.todoTasks.nth(1);
    await expect(secondTodo).not.toHaveClass(/completed/);
    await secondTodo.getByRole("checkbox").check();

    await expect(firstTodo).toHaveClass(/completed/);
    await expect(secondTodo).toHaveClass(/completed/);
  });

  test("should allow me to un-mark items as complete", async ({ page }) => {
    // tdPage is already initialized in beforeEach
    await tdPage.createDefaultTodos([TODO_ITEMS[0], TODO_ITEMS[1] ]);

    const firstTodo = tdPage.todoTasks.nth(0);
    const secondTodo = tdPage.todoTasks.nth(1);
    const firstTodoCheckbox = firstTodo.getByRole("checkbox");

    await firstTodoCheckbox.check();
    await expect(firstTodo).toHaveClass(/completed/);
    await expect(secondTodo).not.toHaveClass(/completed/);

    await firstTodoCheckbox.uncheck();
    await expect(firstTodo).not.toHaveClass(/completed/);
    await expect(secondTodo).not.toHaveClass(/completed/);
  });

  test("should allow me to edit an item", async ({ page }, testInfo) => {
    // tdPage is already initialized in beforeEach
    await tdPage.createDefaultTodos(TODO_ITEMS);

    const todoItems = tdPage.todoTasks;
    const secondTodo = todoItems.nth(1);
    await todoItems.nth(1).dblclick();

    // This condition is specific to certain frameworks due to their handling of UI updates.
    // React-based frameworks might have different behavior for DOM updates during editing.
    if (!testInfo.project.name.toLowerCase().includes("react")){
      await secondTodo.locator("input[class*='edit']").fill("buy some sausages");
      await secondTodo.locator("input[class*='edit']").press("Enter");

      await expect(todoItems).toContainText([new RegExp(TODO_ITEMS[0]),/buy some sausages/,new RegExp(TODO_ITEMS[2])]);
    }
  });
});
