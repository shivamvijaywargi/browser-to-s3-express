const express = require("express");
const mime = require("mime-types");
const getS3PutUrl = require("./getS3PutUrl");
const getS3SignedUrl = require("./getS3SignedLink");

const router = express.Router();

router.post("/get-put-url", async (req, res) => {
  // Always gate this
  // Check whether the user has access to upload and other checks
  const { fileName, fileSize, fileType } = req.body;

  // Make a unique key name for fileName
  // Make the timestamp for the upload
  const uniqueKeyName = `${Date.now().toString()}-${encodeURIComponent(fileName)}`;
  const mimeType = mime.lookup(fileName) ?? fileType;

  // Call getS3PutLink and send it to the client
  const url = await getS3PutUrl(uniqueKeyName, mimeType);

  res.json({
    preSignedUrl: url,
    mimeType,
    uniqueKeyName,
  });
});

router.post("/finalize-upload", async (req, res) => {
  const { key } = req.body;

  const signedUrl = await getS3SignedUrl(key);

  res.json({
    signedUrl,
  });
});

router.get("/test", (req, res) => {
  res.json("Test");
});

module.exports = router;
