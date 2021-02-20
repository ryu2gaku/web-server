const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const tool = require("../utils/tool");

let destDir = path.join(__dirname, "../uploads");

let storage = multer.diskStorage({
  // 用来确定上传的文件应该存储在哪个文件夹中
  destination: function (req, file, cb) {
    // 检查目标目录是否存在
    tool
      .checkDirectoryExisted(destDir)
      .then((val) => {
        console.log(`上传文件中，目标目录 ${destDir} 已存在`);
        cb(null, destDir);
      })
      .catch((val) => {
        fs.mkdir(destDir, (err) => {
          if (err) {
            return console.log(err);
          }
          console.log(`上传文件中，目标目录 ${destDir} 不存在，创建目录成功`);
          cb(null, destDir);
        });
      });
  },
  // 用于确定文件夹中的文件名的确定
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, file.originalname);
  },
});

router
  .get("/", (req, res, next) => {
    res.render("upload", { title: "简单的本地服务器", router: "upload" });
  })
  .post(
    "/uploadfile",
    // 用于处理上传文件的中间件
    multer({ storage: storage }).array("file"),
    (req, res, next) => {
      // console.log(req.body, req.files);
      res.json("上传成功");
    }
  );

module.exports = router;
