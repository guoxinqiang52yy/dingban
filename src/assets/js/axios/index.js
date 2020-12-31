/*
 * @Author: axios 初始化
 * @Date: 2020-08-10 14:40:10
 * @LastEditTime: 2020-12-30 18:37:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\assets\js\axios\index.js
 */

const axios = require("axios");
const Qs = require("qs");
import { Button, Form, FormItem, Input, Message } from "element-ui";

//  cross-env
// if (process.env.NODE_ENV === 'development') {
//   axios.defaults.baseURL = ''
// } else if (process.env.NODE_ENV === 'debug') {
//   axios.defaults.baseURL = ''
// } else if (process.env.NODE_ENV === 'production') {
//   axios.defaults.baseURL = ''
// }

/* ====BASEURL===== */
const TIMEOUT = 30000;
process.env.VUE_APP_URL;
const BASEURL = process.env.VUE_APP_URL; //公共请求url头
// const BASEURL = "http://gateway.kuaiban.cn/";//公共请求url头 可以临时替换
const TESTBASEURL = "http://172.16.1.4:3007";
axios.defaults.baseURL = "http://gateway.kuaiban.cn/";
axios.defaults.withCredentials = true;

const config = {
  get: {
    setConfig(data = "") {
      axios.defaults.baseURL = BASEURL;
      let conf = {
        timeout: TIMEOUT,
        params: data,
      };
      return { data, conf };
    },
  },
  getTest: {
    setConfig(data = "") {
      axios.defaults.baseURL = TESTBASEURL;
      let conf = {
        timeout: TIMEOUT,
        params: data,
      };
      return { data, conf };
    },
  },
  postTest: {
    setConfig(dat = "") {
      let data = JSON.stringify(dat) || "";
      let conf = {
        timeout: TIMEOUT,
        headers: { "Content-Type": "application/json" },
      };
      axios.defaults.baseURL = TESTBASEURL;
      return { data, conf };
    },
  },
  post: {
    setConfig(dat = "") {
      let conf = {
        timeout: TIMEOUT,
      };
      axios.defaults.baseURL = BASEURL;
      let data = Qs.stringify(dat) || "";
      return { data, conf };
    },
  },
  postJson: {
    setConfig(dat = "") {
      let data = JSON.stringify(dat) || "";
      let conf = {
        timeout: TIMEOUT,
        headers: { "Content-Type": "application/json" },
      };
      axios.defaults.baseURL = BASEURL;
      return { data, conf };
    },
  },
  upload: {
    setConfig(data = "") {
      let dat = new FormData();
      dat.append("file", data);
      // for (let i of data) {
      //   param.append("file", data); //通过append向form对象添加数据
      // }
      let conf = {
        timeout: TIMEOUT,
        headers: { "Content-Type": "multipart/form-data" },
      };
      axios.defaults.baseURL = BASEURL;
      return { dat, conf };
    },
  },
};

/*  拦截器 */
//请求
axios.interceptors.request.use(
  (res) => {
    if (res.method == "get") {
      let _urlData = res.url.split("?")[1] || "";
      let _tempUrl = res.url.split("?")[0] || res.url;
      if (!_urlData) {
        return res;
      } else {
        let _data = filterData(_urlData);
        Object.assign(_data, res.params);
        deleteEmpty(_data);
        res.params = _data;
        res.url = _tempUrl;
        return res;
      }
    } else {
      console.log(res);
      return res;
    }
  },
  (error) => {
    console.log(error);
  }
);
//响应
axios.interceptors.response.use(
  (res) => {
    // console.log("响应拦截");
    // console.log(res);
    if (res.data.code != 0) {
      Message({
        message: res.data.message,
        type: "error",
      });
      return Promise.reject(res.data);
    } else {
      return res;
    }
  },
  (err) => {
    let _error = JSON.parse(JSON.stringify(err));
    console.log(_error);
    if (_error.message.includes("415")) {
      Message({
        message: "网络错误",
        type: "error",
      });
    } else if (_error.message.includes("time")) {
      Message({
        message: "网络超时",
        type: "error",
      });
    } else {
      Message({
        message: "网络错误",
        type: "error",
      });
    }

    return err;
  }
);

/*导出*/
//get
function get(url, params = "", type = "get") {
  var { data, conf } = config[type].setConfig(params);
  return new Promise((resolve, reject) => {
    axios
      .get(url, conf)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
//POST
function post(urls, data1 = {}, type = "post") {
  deleteEmpty(data1);
  var { data, conf } = config[type].setConfig(data1);
  return new Promise((resolve, reject) => {
    axios
      .post(urls, data, conf)
      .then((res) => {
        resolve(res);
      })
      .catch((res) => {
        reject(res);
      });
  });
}
function postEdit(urls, data1 = {}, type = "post") {
  var { data, conf } = config[type].setConfig(data1);
  return new Promise((resolve, reject) => {
    axios
      .post(urls, data, conf)
      .then((res) => {
        resolve(res);
      })
      .catch((res) => {
        reject(res);
      });
  });
}

//将字符串转成对象
function filterData(data) {
  var theRequest = new Object();
  let strs = data.split("&");
  for (var i = 0; i < strs.length; i++) {
    theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
  }
  return theRequest;
}

//删除空对象(字符串)
function deleteEmpty(o, arr, i) {
  removeNullItem(o, arr, i);

  function isEmptyObj(o) {
    for (var attr in o) return !1;
    return !0;
  }

  function processArray(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === null || arr[i] === undefined) arr.splice(i, 1);
      else if (typeof arr[i] == "object") removeNullItem(arr[i], arr, i);
    }
    return arr.length == 0;
  }

  function proccessObject(o) {
    for (var attr in o) {
      if (o[attr] === null || o[attr] === undefined || o[attr] === "") delete o[attr];
      else if (typeof o[attr] == "object") {
        removeNullItem(o[attr]);
        if (isEmptyObj(o[attr])) delete o[attr];
      }
    }
  }

  function removeNullItem(o, arr, i) {
    var s = {}.toString.call(o);
    if (s == "[object Array]") {
      if (processArray(o) === true) {
        //o也是数组，并且删除完子项，从所属数组中删除
        if (arr) arr.splice(i, 1);
      }
    } else if (s == "[object Object]") {
      proccessObject(o);
      if (arr && isEmptyObj(o)) arr.splice(i, 1);
    }
  }
}

export default {
  get,
  post,
  postEdit,
};
