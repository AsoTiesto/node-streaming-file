const fs = require("fs");
const { performance } = require("perf_hooks");

const fileName = "text.txt";

function createTestFile() {
  const writeStream = fs.createWriteStream(fileName);
  for (let i = 0; i < 8800000; i++) {
    writeStream.write("This is a leaky file operation\n");
  }
  writeStream.end();
}

function readFileWithoutStreaming() {
  const startTime = performance.now();
  const data = fs.readFileSync(fileName, "utf-8");
  const endTime = performance.now();
  console.log("Without Streaming");
  console.log("Execution Time:", (endTime - startTime).toFixed(4), "ms");
  console.log("Memory Usage:", Buffer.byteLength(data, "utf-8"), "bytes");
}

function readFileWithStreaming() {
  const startTime = performance.now();
  let memoryUsage = 0;

  const readStream = fs.createReadStream(fileName, { encoding: "utf-8" });
  readStream.on("data", (chunk) => {
    memoryUsage += Buffer.byteLength(chunk, "utf-8");
  });

  readStream.on("end", () => {
    const endTime = performance.now();
    console.log("With Streaming");
    console.log("Execution Time:", (endTime - startTime).toFixed(4), "ms");
    console.log("Memory Usage:", memoryUsage, "bytes");
  });

  readStream.on("error", (err) => {
    console.error("Error reading file:", err);
  });
}

createTestFile();
readFileWithoutStreaming();
setTimeout(readFileWithStreaming, 1000);
