// eslint-disable-next-line
const { defineConfig } = require("cypress");
// eslint-disable-next-line
const fs = require("fs");

// eslint-disable-next-line
module.exports = defineConfig({
  video: false,
  env: {
    baseUrl: "https://api-qa.adms-aaa.apps.asu.edu",
    dplBaseUrl: "https://api-tst.myasuplat-dpl.asu.edu/api",
  },
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:8080",
    defaultCommandTimeout: 30000,
    experimentalRunAllSpecs: true,

    //  Node events
    setupNodeEvents(on, config) {
      // eslint-disable-next-line
      require("@cypress/code-coverage/task")(on, config);
      // eslint-disable-next-line
      require("./cypress/plugins")(on, config);
      // include any other plugin code...

      return config;
    },
  },
  useRelativeSnapshots: {
    useRelativeSnapshots: true,
    snapshotFileName: "snapshots.js",
  },
  // rerun the failed testcases
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 1,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 0,
  },
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: false,
    json: true,
  },
});
