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

test.describe("Counter", () => {
  let tdPage: todoPage;

  test.beforeEach(async ({ page }) => {
    tdPage = new todoPage(page);
  });

  test("should display the current number of todo items", async ({ page }) => {
    // tdPage is already initialized in beforeEach
    // const newTodo = tdPage.newInput; // Not needed if using tdPage.newInput directly
    // const todoCount = tdPage.incompletedTasks; // Not needed if using tdPage.incompletedTasks directly

    await tdPage.newInput.fill(TODO_ITEMS[0]);
    await tdPage.newInput.press("Enter");
    await expect(tdPage.incompletedTasks).toContainText("1");

    await tdPage.newInput.fill(TODO_ITEMS[1]);
    await tdPage.newInput.press("Enter");
    await expect(tdPage.incompletedTasks).toContainText("2");
  });
});
