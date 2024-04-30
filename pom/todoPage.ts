import { type FrameLocator, type Locator, type Page } from "@playwright/test";

// import {Array} from "@types/node"

import { readFile } from "fs/promises";
const jobj = JSON.parse(
  await readFile(new URL("./TestObject/Jobject.json", import.meta.url))
);

export class todoPage {
  //Page
  readonly page: Page;

  //URL
  readonly url: string;
  

  //Tasks 
  readonly newInput:Locator;
  readonly taskNames: Locator;
  readonly incompletedTasks: Locator;
  readonly todoTasks: Locator;
  readonly todoActiveTasks: Locator;
  readonly todoCompletedTasks: Locator;

  //Button
  readonly markAll: Locator; //"todoMarkAll": "//label[contains(@for,`toggle-all`)]/preceding-sibling::input",
  readonly clearCompleted:Locator;
  readonly displayAll: Locator;
  readonly displayActive: Locator;
  readonly displayCompleted: Locator;
  

  constructor(page: Page) {
    //Page
    this.page = page;

    //URL
    this.url = this.page.url();
   
    //Tasks
    this.newInput = this.page.getByPlaceholder(jobj.todoNew);
    this.taskNames = this.page.locator(jobj.todoTaskNames);
    this.incompletedTasks = this.page.locator(jobj.todoIncompletedTasks);
    this.todoTasks = this.page.locator(jobj.todoTasks);
    this.todoActiveTasks = this.page.locator(jobj.todoActiveTasks);
    this.todoCompletedTasks = this.page.locator(jobj.todoCompletedTasks);
   
    //Button
    // this.markAll = this.page.locator("input").and(this.page.getByLabel(/ *all* /i));
    this.markAll = this.page.locator(jobj.todoMarkAll);    
    // this.markAll = this.page.getByRole(jobj.todoMarkAll.role).filter({ has: this.page.getByLabel( /Mark all/) });
  
    this.clearCompleted = this.page.getByText(jobj.todoClearCompleted); 
    this.displayAll = this.page.getByRole(jobj.todoDisplayAll.role, { name: jobj.todoDisplayAll.name });   
    this.displayActive = this.page.getByRole(jobj.todoDisplayActive.role, { name: jobj.todoDisplayActive.name  });
    this.displayCompleted = this.page.getByRole(jobj.todoDisplayCompleted.role, { name: jobj.todoDisplayCompleted.name  });

  }

  // async createDefaultTodos(page: Page, todoItems: string[]) {
  async createDefaultTodos(todoItems: string[]) {
    // create a new todo locator
    //const newTodo = this.newInput;
    for (const item of todoItems) {
      await this.newInput.fill(item);
      await this.newInput.press("Enter");
    }
  }
}