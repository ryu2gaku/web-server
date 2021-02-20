const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const tool = require("../utils/tool");

// 下载目录的路径
let dirPath = path.join(__dirname, "../uploads");

router
  .get("/", (req, res, next) => {
    tool
      .checkDirectoryExisted(dirPath)
      .then((val) => {
        fs.readdir(dirPath, (err, files) => {
          // 过滤隐藏文件，如 .DS_Store
          let filteredFiles = files.filter((filename) => {
            return !/^\./.test(filename)
          });

          res.render("download", {
            title: "简单的本地服务器",
            router: "download",
            isDirExisted: true,
            fileList: filteredFiles,
          });
        });
      })
      .catch((val) => {
        res.render("download", {
          title: "简单的本地服务器",
          router: "download",
          isDirExisted: false,
        });
      });
  })
  .get("/file/:fileName", (req, res, next) => {
    let fileName = req.params.fileName;
    let filePath = path.join(dirPath, fileName);

    let stats = fs.statSync(filePath);
    if (stats.isFile()) {
      res.attachment(filePath);
      res.download(filePath);
    } else {
      res.end(404);
    }
  });

module.exports = router;
