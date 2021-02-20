const router = require("express").Router();
const tool = require("../utils/tool");

/* GET home page. */
router.get("/", (req, res, next) => {
  let ip = tool.getIPAdress();
  let port = req.app.get("port");

  res.render("index", {
    title: "简单的本地服务器",
    router: "index",
    ip: ip,
    port: port,
  });
});

module.exports = router;
