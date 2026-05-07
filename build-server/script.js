const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { S3Client, PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const mime = require("mime-types");
const s3Client = new S3Client({
  region: "Asia Pacific (Mumbai) ap-south-1",
  credentials: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
  },
});
async function init() {
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
      if (fs.lstatSync(filePath).isDirectory) continue;
      console.log("uploading file path ");
      const command = new PutObjectCommand({
        Bucket: "vercel-out",
        Key: `__outputs/${PROJECT_ID}/${filePath} `,
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath),
      });
      await s3Client.send(command);
    }
    console.log("done");
  });
}
