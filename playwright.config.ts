//https://github.com/microsoft/playwright/issues/28734
//https://github.com/microsoft/playwright/issues/9380
//https://github.com/microsoft/playwright/issues/18345
//https://github.com/microsoft/playwright-vscode/pull/407
import { defineConfig, devices } from "@playwright/test";
import path from "path";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests-examples",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 1 : undefined,
  workers: process.env.CI ? 1 : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: "html",
  reporter: [
    [
      "html",
      { outputFolder: "myReports" },
      //{ outputFolder: ${ testproject.name } + "_test-report" },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    //https://playwright.dev/docs/api/class-testoptions#test-options-base-url
    //https://github.com/microsoft/playwright/issues/9468
    /* Base URL to use in actions like `await page.goto('/')`. */
    //baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    /* Capture screenshot after each test failure. */
    //screenshot: 'only-on-failure',
    /* Record video only when retrying a test for the first time. */
    //video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    /*{
      name: "Playwright_todo_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://demo.playwright.dev/todomvc/",
      },
    },
    {
      name: "Playwright_todo_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "https://demo.playwright.dev/todomvc/",
      },
    },
    {
      name: "Playwright_todo_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://demo.playwright.dev/todomvc/",
      },
    },
    */
    //Svelte MVC
    {
      name: "Svelte_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://todomvc.com/examples/svelte/dist/",
      },
    },
    {
      name: "Svelte_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "https://todomvc.com/examples/svelte/dist/",
      },
    },
    {
      name: "Svelte_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://todomvc.com/examples/svelte/dist/",
      },
    },

    //React MVC
    {
      name: "React_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://todomvc.com/examples/react/dist/",
      },
    },

    {
      name: "React_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "https://todomvc.com/examples/react/dist/",
      },
    },

    {
      name: "React_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://todomvc.com/examples/react/dist/",
      },
    },

    //Vue MVC
    {
      name: "Vue_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://todomvc.com/examples/vue/dist/#/",
      },
    },

    {
      name: "Vue_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "https://todomvc.com/examples/vue/dist/#/",
      },
    },
    {
      name: "Vue_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://todomvc.com/examples/vue/dist/#/",
      },
    },

    //Backbone MVC
    {
      name: "Backbone_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://todomvc.com/examples/backbone/dist/",
      },
    },
    {
      name: "Backbone_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "https://todomvc.com/examples/backbone/dist/",
      },
    },
    {
      name: "Backbone_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://todomvc.com/examples/backbone/dist/",
      },
    },
    //Preact MVC
    {
      name: "Preact_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://todomvc.com/examples/preact/dist/",
      },
    },

    {
      name: "Preact_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "https://todomvc.com/examples/preact/dist/",
      },
    },
    {
      name: "Preact_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://todomvc.com/examples/preact/dist/",
      },
    },

    //Angular MVC
    {
      name: "Angular_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://todomvc.com/examples/angular/dist/browser/#/all",
      },
    },
    {
      name: "Angular_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "https://todomvc.com/examples/angular/dist/browser/#/all",
      },
    },
    {
      name: "Angular_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://todomvc.com/examples/angular/dist/browser/#/all",
      },
    },

    //Web-Component MVC
    {
      name: "WebC_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://todomvc.com/examples/web-components/dist/",
      },
    },

    {
      name: "WebC_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "https://todomvc.com/examples/web-components/dist/",
      },
    },
    {
      name: "WebC_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://todomvc.com/examples/web-components/dist/",
      },
    },

    //JS-ES6 MVC
    {
      name: "JS-ES6_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://todomvc.com/examples/javascript-es6/dist/",
      },
    },

    {
      name: "JS-ES6_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "https://todomvc.com/examples/javascript-es6/dist/",
      },
    },
    {
      name: "JS-ES6_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://todomvc.com/examples/javascript-es6/dist/",
      },
    },

    //jquery MVC
    {
      name: "jquery_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "https://todomvc.com/examples/jquery/dist/#/all",
      },
    },
    {
      name: "jquery_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: "https://todomvc.com/examples/jquery/dist/#/all",
      },
    },
    {
      name: "jquery_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "https://todomvc.com/examples/jquery/dist/#/all",
      },
    },

    // Test against mobile viewports. */
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // Test against branded browsers. 
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    */
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
