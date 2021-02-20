const router = require("express").Router();

let commentList = [];

class Comment {
  constructor(content = "", date = null, ip = null, userAgent = "") {
    this.content = content;
    this.date = date;
    this.ip = ip;
    this.userAgent = userAgent;
  }
}

router
  .get("/", (req, res, next) => {
    res.render("board", { title: "简单的本地服务器", router: "board" });
  })
  .post("/comment", (req, res, next) => {
    let comment = new Comment(
      req.body.content,
      req.body.date,
      req.ip,
      req.get("User-Agent")
    );
    commentList.push(comment);
    res.json(commentList);
  })
  .get("/commentList", (req, res, next) => {
    res.json(commentList);
  });

module.exports = router;
