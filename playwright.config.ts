//https://github.com/microsoft/playwright/issues/28734
//https://github.com/microsoft/playwright/issues/9380
//https://github.com/microsoft/playwright/issues/18345
//https://github.com/microsoft/playwright-vscode/pull/407
// https://medium.com/@pothiwalapranav/running-playwright-tests-with-multiple-grep-patterns-c602528f6649
import { defineConfig, devices } from "playwright-test-coverage-native";
// import { defineConfig, devices } from "@playwright/test";
import path from "path";

export const playwright_URL = "https://demo.playwright.dev/todomvc/";
export const svelte_URL     = "https://todomvc.com/examples/svelte/dist/";
export const react_URL      = "https://todomvc.com/examples/react/dist/";
export const vue_URL        = "https://todomvc.com/examples/vue/dist/#/";
export const backbone_URL   = "https://todomvc.com/examples/backbone/dist/";
export const preact_URL     = "https://todomvc.com/examples/preact/dist/";
export const angular_URL    = "https://todomvc.com/examples/angular/dist/browser/#/all";
export const ember_URL      = "https://todomvc.com/examples/emberjs/todomvc/dist/";
export const lit_URL        = "https://todomvc.com/examples/lit/dist/";
// export const webc_URL       = "https://todomvc.com/examples/web-components/dist/";
// export const js5_URL        = "https://todomvc.com/examples/javascript-es5/dist/";
// export const js6_URL        = "https://todomvc.com/examples/javascript-es6/dist/";
export const jquery_URL     = "https://todomvc.com/examples/jquery/dist/#/all";


export const base_URL = [
  { playwright: "https://demo.playwright.dev/todomvc/" },
  { svelte: "https://demo.playwright.dev/todomvc/" },
  { react: "https://demo.playwright.dev/todomvc/" },
  { vue: "https://demo.playwright.dev/todomvc/" },
  { backbone: "https://demo.playwright.dev/todomvc/" },
  { preact: "https://demo.playwright.dev/todomvc/" },
  { angular: "https://demo.playwright.dev/todomvc/" },
  { webc: "https://demo.playwright.dev/todomvc/" },
  { js6: "https://demo.playwright.dev/todomvc/" },
  { jquery: "https://demo.playwright.dev/todomvc/" }
];

/*
export const base_URL = [
  {name: "playwright_URL", url: "https://demo.playwright.dev/todomvc/" },
  {name: "svelte_URL", url: "https://demo.playwright.dev/todomvc/" },
  {name: "react_URL", url: "https://demo.playwright.dev/todomvc/" },
  {name: "vue_URL", url: "https://demo.playwright.dev/todomvc/" },
  {name: "backbone_URL", url: "https://demo.playwright.dev/todomvc/" },
  {name: "preact_URL", url: "https://demo.playwright.dev/todomvc/" },
  {name: "angular_URL", url: "https://demo.playwright.dev/todomvc/" },
  {name: "webc_URL", url: "https://demo.playwright.dev/todomvc/" },
  {name: "js6_URL", url: "https://demo.playwright.dev/todomvc/" },
  {name: "jquery_URL", url: "https://demo.playwright.dev/todomvc/" }
];
base_URL.find(x => x.name =="playwright_URL").map(x => x.url)
*/
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();



/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  expect: {
    timeout: 10 * 1000,
  },

  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 1 : undefined,
  workers: process.env.CI ? 2 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: "html",
  reporter: [
    [
      "html",
      {
        outputFolder: process.env.REPNAME
          ? process.env.REPNAME + "myReports"
          : "myReports",
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    //https://playwright.dev/docs/api/class-testoptions#test-options-base-url
    //https://github.com/microsoft/playwright/issues/9468
    /* Base URL to use in actions like `await page.goto('/')`. */
    //baseURL: 'http://127.0.0.1:3000',

    trace: "off",
    // trace: "on-first-retry",
    //screenshot: 'only-on-failure',
    //video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  // https://stackoverflow.com/questions/68103235/how-do-i-access-playwright-test-runner-project-info-in-a-test
  projects: [
    {
      name: "Playwright_todo_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: playwright_URL,
        coverageDir: './coverage/tmp',  // output location for coverage data
        coverageSrc: './e2e',           // filter coverage data for only files in ./src (optional)
        // one of: '@fs', 'localhosturl'. Sadly you'll just have to play around to see which one works
        coverageSourceMapHandler: '@fs'
      },
    },
    {
      name: "Playwright_todo_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: playwright_URL,
      },
    },
    {
      name: "Playwright_todo_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: playwright_URL,
      },
    },

    //Svelte MVC
    {
      name: "Svelte_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: svelte_URL,
      },
    },
    {
      name: "Svelte_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: svelte_URL,
      },
    },
    {
      name: "Svelte_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: svelte_URL,
      },
    },

    //React MVC
    {
      name: "React_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: react_URL,
      },
    },

    {
      name: "React_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: react_URL,
      },
    },

    {
      name: "React_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: react_URL,
      },
    },

    //Vue MVC
    {
      name: "Vue_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: vue_URL,
      },
    },

    {
      name: "Vue_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: vue_URL,
      },
    },
    {
      name: "Vue_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: vue_URL,
      },
    },

    //Backbone MVC
    {
      name: "Backbone_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: backbone_URL,
      },
    },
    {
      name: "Backbone_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: backbone_URL,
      },
    },
    {
      name: "Backbone_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: backbone_URL,
      },
    },
    //Preact MVC
    {
      name: "Preact_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: preact_URL,
      },
    },

    {
      name: "Preact_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: preact_URL,
      },
    },
    {
      name: "Preact_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: preact_URL,
      },
    },

    //Angular MVC
    {
      name: "Angular_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: angular_URL,
      },
    },
    {
      name: "Angular_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: angular_URL,
      },
    },
    {
      name: "Angular_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: angular_URL,
      },
    },

    //Ember MVC
    {
      name: "Ember_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: ember_URL,
      },
    },

    {
      name: "Ember_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: ember_URL,
      },
    },
    {
      name: "Ember_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: ember_URL,
      },
    },

    //Lit MVC
    {
      name: "Lit_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: lit_URL,
      },
    },
    {
      name: "Lit_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: lit_URL,
      },
    },
    {
      name: "Lit_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: lit_URL,
      },
    },
    
    //Web-Component MVC
    // {
    //   name: "WebC_chromium",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     baseURL: webc_URL,
    //   },
    // },

    // {
    //   name: "WebC_firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //     baseURL: webc_URL,
    //   },
    // },
    // {
    //   name: "WebC_webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //     baseURL: webc_URL,
    //   },
    // },

    // //JS-ES6 MVC
    // {
    //   name: "JS-ES6_chromium",
    //   use: {
    //     ...devices["Desktop Chrome"],
    //     baseURL: js6_URL,
    //   },
    // },

    // {
    //   name: "JS-ES6_firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //     baseURL: js6_URL,
    //   },
    // },
    // {
    //   name: "JS-ES6_webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //     baseURL: js6_URL,
    //   },
    // },

    //jquery MVC
    {
      name: "jquery_chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: jquery_URL,
      },
    },
    {
      name: "jquery_firefox",
      use: {
        ...devices["Desktop Firefox"],
        baseURL: jquery_URL,
      },
    },
    {
      name: "jquery_webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: jquery_URL,
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
