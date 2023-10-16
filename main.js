/*
* Project: Milestone 1
* File Name: main.js
* Description:
*
* Created Date:
* Author:
*
*/

/*
Step 1: Read the zip file
Step 2: Unzip the file
Step 3: Read all png images from unzipped folder
Step 4: Send them to the grayscale filter function
Step 5: Aftre ALL IMAGES have SUCCESSFULLY been grayscaled, show a success message.
*/

// ALL ERRORS MUST SHOW IN .catch in PROMISE CHAIN


// Hint1: ["img1.png", "img2.png", "img3.png"].forEach(img => {
    // grayScale(img); }); -> problem here: forEach is not a promise, so it will not wait for the previous one to finish and print success message too early
    
    // Hint2: one by one
    // grayScale("img1.png")
    // .then(() => grayScale("img2.png"))
    // .then(() => grayScale("img3.png"))
    // .then(() => console.log("Success!"))
    // problem here: order is correct but it makes it unneccessarily low, 
    // -> we want to do it in parallel (all at the same time) -> "Promise.all"
    // not going to wait to finish all of them, but it will wait for all of them to successfully finish and then it will print the success message
    // Promise.all([grayScale("img1.png"), grayScale("img2.png"), grayScale("img3.png")])
    // .then(() => console.log("Success!"))
    
const IOhandler = require("./IOhandler");
const path = require("path");

const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

// Step 1: Unzip the zip file
IOhandler.unzip(zipFilePath, pathUnzipped)
  .then((message) => {
    console.log(message);

    // Step 2: Read the directory for PNG files
    return IOhandler.readDir(pathUnzipped);
  })
  .then((pngFilePaths) => {
    // Step 3: Apply grayscale filter to each PNG file
    const promises = pngFilePaths.map((filePath) =>
      IOhandler.grayScale(filePath, path.join(pathProcessed, path.basename(filePath)))
    );
    
    return Promise.all(promises);
  })
  .then((messages) => {
    // All operations are complete
    console.log("All operations complete");
  })
  .catch((err) => {
    console.error(err);
  });


// fs.createReadStream("./unzipped/in.png") // read png
//   .pipe(
//     new PNG({ // use pngjs to transform
//       filterType: 4,
//     }) // transform stream -> takes in bytes of png and gives it back to you in the convenient way that you can manipulate it
//   )
//   .on("parsed", function () {   // this function belongs to the parsed event
//     for (var y = 0; y < this.height; y++) {   //"this" refers to the png that we are working on( dict)
//       for (var x = 0; x < this.width; x++) {
//         var idx = (this.width * y + x) << 2;  // where is the pixel in the data array (translating to one dimension)  , << 2 -> shift 2 bits to the left
//         // ex) 1 << 2 -> 100, 6 << 2 -> 24 : fasted way to multiply by 4 (RGB + alpha)

//         // invert color
//         this.data[idx] = 255 - this.data[idx]; //R
//         this.data[idx + 1] = 255 - this.data[idx + 1]; //G
//         this.data[idx + 2] = 255 - this.data[idx + 2]; //B

//         // and reduce opacity
//         this.data[idx + 3] = this.data[idx + 3] >> 1; //A
//       }
//     }

//     this.pack().pipe(fs.createWriteStream("out.png")); // write stream
//     // pack() -> take the meta data we need and pack it back into the png
//   });


// const unzipper = require("unzipper");

// // create unzipped folder
// // const zlib = require("zlib");

// // returns you a transform stream -> whatever you pipeed to it, it will unzip it
// // const ts = zlib.createGunzip();     -> for now we are gonna use lib unzipper

// // Step 1: unzip myfile.zip
// // fs.createReadStream(zipFilePath)
// // need to pipeed it to transform stream -> gonna unzip it -> pipeed to writable stream -> write to unzipped folder (destination)
// // .pipe(ts)

// // npm install -> install all the dependencies at the root directory (gonna have access to all the file in it.)
// // gonna work in only for the evironment that you're in by default -> let you work in multiple version

// fs.createReadStream(zipFilePath)
// // pipe data 2 possible kind of stream
// // 1. .pipe(ts)
// // 2. .pipe(process.stdout) // take all of the data and pipe it to the process.stdout (console.log), not look good but it works
// .pipe(unzipper.Extract({ path: "./unzipped" })); // create a readable(transform) stream


// // Read each png file... -> need to look up all the specification of the file.
// // (not good way to do it because has too many unnessary data, so we use pngjs)
// // fs.createReadStream("png1.png")
// // .on("data", (chunk) => console.log(chunk))


// // buffer -> a one dimensional chunk of data (very long string)