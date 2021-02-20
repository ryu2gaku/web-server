$("#uploadfile").fileinput({
  language: "zh",
  uploadUrl: "/upload/uploadfile",
  maxFileCount: 20,
});

$("#uploadfile").on("fileuploaded", function (event, data, previewId, index) {
  console.log(data.response);
});
