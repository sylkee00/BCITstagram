/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {

  return new Promise((resolve, reject) => {
    // Create a directory for unzipped files
    fs.mkdir(pathOut, { recursive: true }, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Extract the zip file
      fs.createReadStream(pathIn)
        .pipe(unzipper.Extract({ path: pathOut }))
        .on("close", () => {
          resolve("Extraction operation complete");
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  });

};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {

  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      // Filter only the PNG files
      const pngFiles = files.filter((file) => path.extname(file).toLowerCase() === ".png");
      
      // Create full file paths
      const pngFilePaths = pngFiles.map((file) => path.join(dir, file));
      
      resolve(pngFilePaths);
    });
  });

};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(new PNG())
      .on("parsed", function () {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            const gray = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
            this.data[idx] = gray;
            this.data[idx + 1] = gray;
            this.data[idx + 2] = gray;
          }
        }
        this.pack().pipe(fs.createWriteStream(pathOut)).on("finish", () => {
          resolve("Grayscale operation complete");
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });

};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
