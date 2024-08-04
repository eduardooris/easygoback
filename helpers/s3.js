const aws = require("aws-sdk");

const region = "sa-east-1";
const bucketName = "easygoimage";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

exports.getSignedUrl = async (req, res) => {
  const { fileName, fileType } = req.body;
  const s3Params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 60,
  };
  const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
  res.send({ uploadUrl });
};
