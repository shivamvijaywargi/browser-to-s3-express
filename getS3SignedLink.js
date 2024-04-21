// This file generates a put link for the client
// It is signed and validated based on params we set here

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Configure AWS
const client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const getS3SignedUrl = async (
  uniqueS3Key,
  mimeType,
  bucket = process.env.BUCKET,
) => {
  // Get link from S3
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: uniqueS3Key,
    ContentType: mimeType,
  });

  try {
    const signedLink = await getSignedUrl(client, command, {
      expiresIn: 60 * 60,
    });

    return signedLink;
  } catch (err) {
    console.log(err);
  }
};

module.exports = getS3SignedUrl;
