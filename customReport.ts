import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

import { writeFile } from "fs/promises";
//const fs = require("fs");

export class CustomReport {
  onBegin(config, suite) {}

  onTestBegin(test, result) {}

  onTestEnd(test, result) {
    let html = "<!DOCTYPE html>\n";
    html += "<html>\n<head>\n<title>${test.title}</title>\n</head>\n<body>";
    html += "<h1>test: ${test.title} status: ${result.status}</h1>\n";
    html += "<table>";
    for (const steppe of result.steps) {
      // not a typo, step is reserved
      html +=
        "<tr><td>${steppe.title}</td><td>${steppe.startTime}</td><td>${steppe.duration}</td></tr>\n";
    }
    html += "</table></body></html>";
    writeFile(
      "./${process.env.PLAYWRIGHT_HTML_REPORT}/${test.title}.html",
      html,
      (e) => {
        if (e) {
          console.log(e);
        }
      }
    );
  }

  onEnd(result) {}
}

export default CustomReport;
