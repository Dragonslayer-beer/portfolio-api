const fs = require("fs");
const path = require("path");

const RemoveFile = (filePath, callback) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error removing file at ${filePath}:`, err);
      return callback(err);
    }
    console.log(`File at ${filePath} successfully removed`);
    callback(null);
  });
};

module.exports = RemoveFile;
