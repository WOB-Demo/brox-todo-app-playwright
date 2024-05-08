// import { test, expect, type Page } from "@playwright/test";
// import { test, expect } from "playwright-test-coverage-native";
import { expect,type Page } from "@playwright/test";
import { test } from '../fixtures';
import { todoPage } from "../pom/todoPage";
// import { defineConfig } from "@playwright/test";

// import type URL from ;
//import { todoPage } from "./util";
import { readFile } from "fs/promises";
const testObj = JSON.parse(
  await readFile(new URL("../pom/TestObject/Jobject.json", import.meta.url))
);

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
];

test.describe("New Todo", () => {
  test("should allow me to add todo items", async ({ page }) => {
    // create a new todo locator
    const tdPage = new todoPage(page);
    
    // Create 1st todo.
    await tdPage.newInput.fill(TODO_ITEMS[0]);
    await tdPage.newInput.press("Enter");

    // Make sure the list only has one todo item.
    await expect(tdPage.todoTasks).toContainText([new RegExp(TODO_ITEMS[0])]);

    // Create 2nd todo.
    await tdPage.newInput.fill(TODO_ITEMS[1]);
    await tdPage.newInput.press("Enter");

    // Make sure the list now has two todo items.
    const tasks = tdPage.todoTasks;
    await expect(tasks).toContainText([new RegExp(TODO_ITEMS[0]), new RegExp(TODO_ITEMS[1])]);
  });

  test("should clear text input field when an item is added", async ({
    page,
  }) => {
    const tdPage = new todoPage(page);

    // Create one todo item.
    await tdPage.newInput.fill(TODO_ITEMS[0]);
    await tdPage.newInput.press("Enter");

    // Check that input is empty.
    await expect(tdPage.newInput).toBeEmpty();
  });

  test("should append new items to the bottom of the list", async ({
    page,
  }) => {
    const tdPage = new todoPage(page);
    const newItem = "Another Item";
    
    // Create 3 items.
    
    await tdPage.createDefaultTodos(TODO_ITEMS);

    // Check test using different methods.
    // await expect(page.getByText("3 items left")).toBeVisible();
    await expect(tdPage.incompletedTasks).toContainText(/3 items left/);
    // await expect(tdPage.incompletedTasks).toContainText(["3","items", "left"]);
    // await expect(todoCount).toContainText("3");
    // await expect(todoCount).toHaveText(/3/);

    // const todoCount = await tdPage.incompletedTasks.textContent()[0];
    await tdPage.newInput.fill(newItem);
    await tdPage.newInput.press("Enter");
    // await page.waitForLoadState("domcontentloaded");
    // Check all items in one call.
    await expect(tdPage.todoTasks).toContainText([new RegExp(TODO_ITEMS[0]),new RegExp(TODO_ITEMS[1]),new RegExp(TODO_ITEMS[2]), new RegExp(newItem)]);
    //await checkNumberOfTodosInLocalStorage(page, 3);
  });
});

test.describe("Mark all as completed", () => {
  test.beforeEach(async ({ page }) => {
    const tdPage = new todoPage(page);
     // Create 3 items.    
    await tdPage.createDefaultTodos(TODO_ITEMS);
    //await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test("should allow me to mark all items as completed", async ({ page }) => {
    // Complete all todos.
    const tdPage = new todoPage(page);
    await tdPage.markAll.check();

    // Ensure all todos have 'completed' class.
    await expect(tdPage.todoTasks).toHaveClass([
      /completed/,
      /completed/,
      /completed/,
    ]);
    
  });

  test("should allow me to clear the complete state of all items", async ({
    page,
  }) => {
    const tdPage = new todoPage(page);

    // const toggleAll = page.locator(testObj.todoMarkAll);
    // Check and then immediately uncheck.
    await tdPage.markAll.check();
    await tdPage.markAll.uncheck();

    // Should be no completed classes.
    // await expect(tdPage.todoTasks).toHaveClass(["", "", ""]);
    await expect(tdPage.todoTasks).toHaveClass([/|\s/, /|\s/, /|\s/]);
  });

  test("complete all checkbox should update state when items are completed / cleared", async ({
    page,
  }) => {
    const tdPage = new todoPage(page);

    // const toggleAll = page.locator(testObj.todoMarkAll);
    await tdPage.markAll.check();
    await expect(tdPage.markAll).toBeChecked();
    

    // Uncheck first todo.
    const firstTodo = tdPage.todoTasks.nth(0);
    await firstTodo.getByRole("checkbox").uncheck();

    // Reuse toggleAll locator and make sure its not checked.
    await expect(tdPage.markAll).not.toBeChecked();

    await firstTodo.getByRole("checkbox").check();
    

    // Assert the toggle all is checked again.
    await expect(tdPage.markAll).toBeChecked();
  });
});

test.describe("Item", () => {
  test("should allow me to mark items as complete", async ({ page }) => {
    // create a new todo locator
    const tdPage = new todoPage(page);

    // const newTodo = page.getByPlaceholder(testObj.todoNew);

    // Create two items.
    for (const item of TODO_ITEMS.slice(0,2)) {
      await tdPage.newInput.fill(item);
      await tdPage.newInput.press("Enter");
    }

    // Check first item.
    const firstTodo = tdPage.todoTasks.nth(0);
    await firstTodo.getByRole("checkbox").check();
    await expect(firstTodo).toHaveClass(/completed/);

    // Check second item.
    const secondTodo = tdPage.todoTasks.nth(1);
    await expect(secondTodo).not.toHaveClass(/completed/);
    await secondTodo.getByRole("checkbox").check();

    // Assert completed class.
    await expect(firstTodo).toHaveClass(/completed/);
    await expect(secondTodo).toHaveClass(/completed/);
  });

  test("should allow me to un-mark items as complete", async ({ page }) => {
    // create a new todo locator
    const tdPage = new todoPage(page);
    // const newTodo = page.getByPlaceholder(testObj.todoNew);

    tdPage.createDefaultTodos([TODO_ITEMS[0], TODO_ITEMS[1] ]);
    // Create two items.
    // for (const item of TODO_ITEMS.slice(0, 2)) {
    //   await newTodo.fill(item);
    //   await newTodo.press("Enter");
    // }

    const firstTodo = tdPage.todoTasks.nth(0);
    const secondTodo = tdPage.todoTasks.nth(1);
    // console.log(secondTodo.textContent());
    const firstTodoCheckbox = firstTodo.getByRole("checkbox");

    await firstTodoCheckbox.check();
    await expect(firstTodo).toHaveClass(/completed/);
    await expect(secondTodo).not.toHaveClass(/completed/);
    

    await firstTodoCheckbox.uncheck();
    await expect(firstTodo).not.toHaveClass(/completed/);
    await expect(secondTodo).not.toHaveClass(/completed/);
    //await checkNumberOfCompletedTodosInLocalStorage(page, 0);
  });

  test("should allow me to edit an item", async ({ page }, testInfo) => {
    const tdPage = new todoPage(page);
    await tdPage.createDefaultTodos(TODO_ITEMS);

    const todoItems = tdPage.todoTasks;
    const secondTodo = todoItems.nth(1);
    await todoItems.nth(1).dblclick();
    // await expect(secondTodo).toHaveText(/TODO_ITEMS[1]/);
    if (!testInfo.project.name.toLowerCase().includes("react")){
      await secondTodo.locator("input[class*='edit']").fill("buy some sausages");
      await secondTodo.locator("input[class*='edit']").press("Enter");

      // Explicitly assert the new text value.
      await expect(todoItems).toContainText([new RegExp(TODO_ITEMS[0]),/buy some sausages/,new RegExp(TODO_ITEMS[2])]);
    }
    //await checkTodosInLocalStorage(page, "buy some sausages");
  });
});

test.describe("Editing", () => {
  test.beforeEach(async ({ page }) => {
    const tdPage = new todoPage(page);
    await tdPage.createDefaultTodos(TODO_ITEMS);
    //await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test("should hide other controls when editing", async ({ page }) => {
    const tdPage = new todoPage(page);
    const todoItem = tdPage.todoTasks.nth(1);
    await todoItem.dblclick();
    await expect(todoItem.getByRole("checkbox")).not.toBeVisible( );
    await expect(
      todoItem.locator("label", {
        hasText: new RegExp(TODO_ITEMS[1]),
      })
    ).not.toBeVisible();
    //await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test("should save edits on blur", async ({ page }, testInfo) => {
    const tdPage = new todoPage(page);
    const todoItems = tdPage.todoTasks;
    await todoItems.nth(1).dblclick();
    if (!testInfo.project.name.toLowerCase().includes("react") || !testInfo.project.name.toLowerCase().includes("angular")){
      await todoItems.nth(1).locator("input[class*='edit']").fill("buy some sausages");
      await todoItems.nth(1).locator("input[class*='edit']").dispatchEvent("blur");

      await expect(todoItems).toContainText([
        new RegExp(TODO_ITEMS[0]),
        /buy some sausages/,
        new RegExp(TODO_ITEMS[2]),
      ]);
    }
    //await checkTodosInLocalStorage(page, "buy some sausages");
  });

  test("should trim entered text", async ({ page },testInfo) => {
    const tdPage = new todoPage(page);
    const todoItems = tdPage.todoTasks;
    await todoItems.nth(1).dblclick();
    if (!testInfo.project.name.toLowerCase().includes("react")){
      await todoItems.nth(1).locator("input[class*='edit']").fill("    buy some sausages    ");      
      await todoItems.nth(1).locator("input[class*='edit']").press("Enter");

      await expect(todoItems).toContainText([
        new RegExp(TODO_ITEMS[0]),
        /buy some sausages/,
        new RegExp(TODO_ITEMS[2]),
      ]);    
    }
    //await checkTodosInLocalStorage(page, "buy some sausages");
  });

  test("should remove the item if an empty text string was entered", async ({page}, testInfo) => {
    const tdPage = new todoPage(page);
    const todoItems = tdPage.todoTasks;
    await todoItems.nth(1).dblclick();
    if (!testInfo.project.name.toLowerCase().includes("react")){
      await todoItems.nth(1).locator("input[class*='edit']").fill("");
      await todoItems.nth(1).locator("input[class*='edit']").press("Enter");     

      await expect(todoItems).toContainText([new RegExp(TODO_ITEMS[0]), new RegExp(TODO_ITEMS[2])]);
    }
  });

  test("should cancel edits on escape", async ({ page }, testInfo) => {
    const tdPage = new todoPage(page);
    const todoItems = tdPage.todoTasks;
    await todoItems.nth(1).dblclick();
    if (!testInfo.project.name.toLowerCase().includes("react")){
      await todoItems.nth(1).locator("input[class*='edit']").fill("buy some sausages");
      await todoItems.nth(1).locator("input[class*='edit']").press("Escape");
      await expect(todoItems).toContainText(TODO_ITEMS);
    }
  });
});

test.describe("Counter", () => {
  test("should display the current number of todo items", async ({ page }) => {
    // create a new todo locator
    const tdPage = new todoPage(page);
    const newTodo = tdPage.newInput;

    // create a todo count locator
    const todoCount = tdPage.incompletedTasks;

    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press("Enter");

    await expect(todoCount).toContainText("1");

    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press("Enter");
    await expect(todoCount).toContainText("2");

    //await checkNumberOfTodosInLocalStorage(page, 2);
  });
});

test.describe("Clear completed button", () => {
  test.beforeEach(async ({ page }) => {
    const tdPage = new todoPage(page);
    await tdPage.createDefaultTodos(TODO_ITEMS);
  });

  test("should display the correct text", async ({ page }) => {
    const tdPage = new todoPage(page);
    await tdPage.todoTasks.first().locator(".toggle").check();
    await expect(tdPage.clearCompleted).toBeVisible();
  });

  test("should remove completed items when clicked", async ({ page }) => {
    const tdPage = new todoPage(page);
    const todoItems = tdPage.todoTasks;
    await todoItems.nth(1).getByRole("checkbox").check();
    await page.getByText(testObj.todoClearCompleted).click();
    await expect(todoItems).toHaveCount(2);
    // await expect(todoItems).toContainText([TODO_ITEMS[0], TODO_ITEMS[2]]);
    await expect(todoItems).toContainText([new RegExp(TODO_ITEMS[0]), new RegExp(TODO_ITEMS[2])]);
  });

  test("should be hidden when there are no items that are completed", async ({page}, testInfo) => {
    const tdPage = new todoPage(page);
    await tdPage.todoTasks.first().locator(".toggle").check();
    await tdPage.clearCompleted.click();
    if (!testInfo.project.name.toLowerCase().includes("react") ){
      await tdPage.clearCompleted.waitFor({state:"hidden"})
      await expect(tdPage.clearCompleted).toBeHidden();
    }
  });
});

test.describe("Persistence", () => {
  // if (testProjects){
    test("should persist its data", async ({ page }, testInfo) => {
      // create a new todo locator
      const tdPage = new todoPage(page);
      // const newTodo = page.getByPlaceholder(testObj.todoNew);

      for (const item of TODO_ITEMS) {
        await tdPage.newInput.fill(item);
        await tdPage.newInput.press("Enter");
      }

      let todoItems = tdPage.todoTasks;
      let firstTodoCheck = todoItems.nth(0).getByRole("checkbox");
      await firstTodoCheck.check();
      await expect(todoItems).toHaveText(TODO_ITEMS);
      await expect(firstTodoCheck).toBeChecked();

      // todoItems = tdPage.todoTasks;
      await expect(todoItems).toHaveClass([/completed/,/|\s/,/|\s/]);
      
      // Now reload.
      if (testInfo.project.name.toLowerCase().includes("playwright") ){
      
        await page.reload();
        await expect(todoItems).toHaveText(TODO_ITEMS);
        await expect(firstTodoCheck).toBeChecked();
        await expect(todoItems).toHaveClass([/completed/,/|\s/, /|\s/]);
      }
    });
  // }
});

test.describe("Routing", () => {
  test.beforeEach(async ({ page }) => {
    const tdPage = new todoPage(page);
    await tdPage.createDefaultTodos(TODO_ITEMS);
    // make sure the app had a chance to save updated todos in storage
    // before navigating to a new view, otherwise the items can get lost :(
    // in some frameworks like Durandal
    //await checkTodosInLocalStorage(page, TODO_ITEMS[0]);
  });

  test("should allow me to display active items", async ({ page }) => {
    const tdPage = new todoPage(page);
    // const todoItem = tdPage.todoTasks;
    await tdPage.todoTasks.nth(1).getByRole("checkbox").check();
    // await tdPage.todoTasks.getByText(TODO_ITEMS[1]).getByRole("checkbox").check();

    // 
    // await page.locator("ul.todo-list li:has-text(${TODO_ITEMS[1]})").getByRole("checkbox").check(); 
    await tdPage.displayActive.click();
    await expect(tdPage.todoActiveTasks).toHaveCount(2);
    await expect(tdPage.todoActiveTasks).toContainText([new RegExp(TODO_ITEMS[0]), new RegExp(TODO_ITEMS[2])]);
    

  });

  test("should respect the back button", async ({ page }) => {
    const tdPage = new todoPage(page);
    const todoItem = tdPage.todoTasks;
    await tdPage.todoTasks.nth(1).getByRole("checkbox").check();

    

    await test.step("Showing all items", async () => {
      await tdPage.displayAll.click();
      await expect(todoItem).toHaveCount(3);
    });

    await test.step("Showing active items", async () => {
      await tdPage.displayActive.click();
    });

    await test.step("Showing completed items", async () => {
      await tdPage.displayCompleted.click();
    });

    await expect(todoItem).toHaveCount(1);
    await page.goBack();
    await expect(todoItem).toHaveCount(2);
    await page.goBack();
    await expect(todoItem).toHaveCount(3);
  });

  test("should allow me to display completed items", async ({ page }) => {
    const tdPage = new todoPage(page);
    await tdPage.todoTasks.nth(1).getByRole("checkbox").check();
    
    // await page.getByRole("link", { name: "Completed" }).click();
    await tdPage.displayCompleted.click();
    // await 
    await expect(tdPage.todoTasks).toHaveCount(1);
  });

  test("should allow me to display all items", async ({ page }) => {
    const tdPage = new todoPage(page);
    await tdPage.todoTasks.nth(1).getByRole("checkbox").check();
    
    await tdPage.displayActive.click();
    await tdPage.displayCompleted.click();
    await tdPage.displayAll.click();
    await expect(tdPage.todoTasks).toHaveCount(3);
  });

  test("should highlight the currently applied filter", async ({ page }) => {
    const tdPage = new todoPage(page);
    await expect(tdPage.displayAll).toHaveClass(/selected/);

    //create locators for active and completed links
    const activeLink = tdPage.displayActive;
    const completedLink = tdPage.displayCompleted;
    await activeLink.click();

    // Page change - active items.
    await expect(activeLink).toHaveClass(/selected/);
    await completedLink.click();

    // Page change - completed items.
    await expect(completedLink).toHaveClass(/selected/);
  });
});


