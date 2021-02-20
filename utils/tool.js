const fs = require("fs");
const os = require("os");

/**
 * 检测目录是否存在
 * @param {string} directoryPath
 * @returns {Promise}
 */
const checkDirectoryExisted = (directoryPath) => {
  return new Promise((resolve, reject) => {
    fs.stat(directoryPath, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.isDirectory()) {
        resolve(true);
      } else {
        reject(new Error(`不存在${directoryPath}目录`));
      }
    });
  });
};

/**
 * 获取设备 IP 地址
 */
const getIPAdress = () => {
  let interfaces = os.networkInterfaces();

  for (let devName in interfaces) {
    let iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }
};

module.exports = { checkDirectoryExisted, getIPAdress };
