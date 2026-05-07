const { exec } = require("child_process");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const PROJECT_ID = process.env.PROJECT_ID;
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});
async function init() {
  console.log(process.env.ACCESS_KEY_ID);
  console.log(process.env.SECRET_ACCESS_KEY);
  console.log("Executing Script.js");
  const outDirPath = path.join(__dirname, "output");
  const p = exec(`cd ${outDirPath} && npm install && npm run build`);
  p.stdout.on("data", async function (data) {
    console.log(data.toString());
  });
  p.stdout.on("error", async function (data) {
    console.log(data.toString());
  });
  p.on("close", async function () {
    console.log("build complete");
    const distFolderPath = path.join(__dirname, "output", "dist");
    const distFolderContent = fs.readdirSync(distFolderPath, {
      recursive: true,
    });

    for (const filePath of distFolderContent) {
      const fullPath = path.join(distFolderPath, filePath);
      if (fs.lstatSync(fullPath).isDirectory()) continue;
      console.log("Uploading:", filePath);
      const command = new PutObjectCommand({
        Bucket: "vercel-out",
        Key: `__outputs/${PROJECT_ID}/${filePath} `,
        Body: fs.createReadStream(fullPath),
        ContentType: mime.lookup(fullPath),
      });
      await s3Client.send(command);
    }
    console.log("done");
  });
}
init();
