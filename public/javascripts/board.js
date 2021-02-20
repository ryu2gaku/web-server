var vm = new Vue({
  el: "#app",
  data: {
    comment: "",
    commentList: [],
  },
  methods: {
    /**
     * 提交
     */
    submit: function () {
      var comment = this.comment;

      // 如果输入框为空
      if (!comment) {
        // 刷新评论列表
        this.refresh();
        return;
      }
      var that = this;

      var data = { content: comment, date: new Date() };
      $.post("/board/comment", data, function (data, textStatus, jqXHR) {
        console.log("留言板提交", textStatus, data); // 完成
        that.comment = ""; // 清空输入框
        refreshComments(that.commentList, data);
      }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("留言板提交", textStatus, errorThrown); // 异常
      });
    },
    /**
     * 刷新
     */
    refresh: function () {
      var that = this;

      $.get("/board/commentList", function (data, textStatus, jqXHR) {
        console.log("留言板刷新", textStatus, data); // 完成
        refreshComments(that.commentList, data);
      }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("留言板刷新", textStatus, errorThrown); // 异常
      });
    },
  },
  mounted() {
    // 自动加载 refresh 方法
    this.refresh();
  },
});

function refreshComments(commentList, data) {
  // 清空评论列表
  commentList.splice(0, commentList.length);

  for (var i = 0; i < data.length; i++) {
    var comment = data[data.length - i - 1];
    // 处理 ip 地址的 ::ffff: 部分
    // ::ffff:127.0.0.1
    if (comment.ip.indexOf("::ffff:") == 0) {
      comment.ip = comment.ip.replace("::ffff:", "");
    }
    commentList.push(comment);
  }
}
