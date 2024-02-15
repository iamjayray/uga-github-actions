// eslint-disable-next-line
const fs = require("fs");

const snapShotCustomPlugin = (on, config) => {
  on("task", {
    readFileMaybe(filename) {
      if (fs.existsSync(filename)) {
        return fs.readFileSync(filename, "utf8");
      } else if (filename.endsWith("snapshots.js")) {
        const emptyContents = "{}";
        fs.writeFile(filename, emptyContents, { encoding: "utf8" });
        return emptyContents;
      }

      console.error("File not found: ", filename);
      return null;
    },
  });

  return config;
};

// eslint-disable-next-line
module.exports = snapShotCustomPlugin;
