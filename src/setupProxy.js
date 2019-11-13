const proxy = require("http-proxy-middleware");

const bucket = process.env.REACT_APP_AWS_BUCKET_PUBLIC;
const region = process.env.REACT_APP_AWS_REGION;
const folder = process.env.REACT_APP_VALIDATORS_S3_FOLDER_NAME;

module.exports = function(app) {
  app.use(
    `/${folder}`,
    proxy({
      changeOrigin: true,
      target: `https://${bucket}.s3-${region}.amazonaws.com`,
    }),
  );
};
