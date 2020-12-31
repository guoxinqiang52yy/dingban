/*
 * @Author:  混入 公共方法
 * @Date: 2020-09-04 09:54:07
 * @LastEditTime: 2020-12-10 21:15:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \online\src\assets\js\minx\minx.js
 */
import axios from "axios";
let mixin = {
  data() {
    return {
      //表头样式
      table_heard_style: {
        backgroundColor: "#F3F6FD",
        color: "#606266",
        padding: "8px 0",
        textAlign: "center",
      },
      uploadProgress: "",
    };
  },
  methods: {
    //递归处理行业数据删除 children 字段
    data_(data) {
      data.forEach((val) => {
        if (val.children.length === 0) {
          delete val.children;
        } else {
          this.data_(val.children);
        }
      });
      return data;
    },
    //去除数据中的默认 -1
    setObj_(obj) {
      Object.keys(obj).forEach(key => {
        if (obj[key] == -1) {
          obj[key] = typeof obj[key] === 'string' ? '' : null
        }
      })
      return obj
    },
    handleChanges(val) {
      console.log(val);
    },
    /* elementui  图片上传 共用方法*/
    handleAvatarSuccess() {
    },
    beforeAvatarUpload(file) {
      console.log(file.type);
      const isJPG = file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 <= 3;
      // const isLt2M = true;
      if (!isJPG) {
        this.$message.error("上传图片格式不正确!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过3MB!");
      }
      return isJPG && isLt2M;
    },
    suceessAvataruploadPic(params) {
      console.log(params);
      let that = this;
      let _file = params.file;
      let param = new FormData(); //创建form对象
      param.append("file", _file); //通过append向form对象添加数据
      let config = {
        headers: {"Content-Type": "multipart/form-data"},
      }; //添加请求头
      axios
         .post("http://gateway.kuaiban.com/common-api/file/upload", param, config)
         .then((res) => {
           // console.log(res.data.result[0]);
           this.getPicture(res.data.result[0]);
         })
         .catch((err) => {
           this.showMessage("error", "图片上传错误");
         });
    },
    getPicture(data) {
    },
    /* 弹框 */
    showMessage(type, data) {
      this.$message({
        message: data,
        type: type,
        duration: 2500,
      });
    },
    /* 权限验证 */
    verification(list, data) {
      if (list.includes(data)) {
        return true;
      } else {
        return false;
      }
    },
    //时间格式数据处理成20201211
    set_date(data) {
      let date1, date2, date3;
      if (data !== "" && data.length === 10) {
        date1 = data.split("-");
        date2 = parseInt(date1.join(""));
        date3 = date2;
        return date3;
      } else {
        return data;
      }
    },
    ////时间格式数据处理成2020-12-11
    setDate(date) {
      let datess = date.toString()
      if (datess.length === 8) {
        let timearr = datess.split("", 4).join("");
        let strs = datess.substring(datess.length - 2);
        let str = datess.substr(-4, 2);
        date = `${timearr}-${str}-${strs}`;
        console.log(date);
      } else if (datess.length === 1) {
        date = ""
      }
      return date
    },
    //计算分钟
    s_to_hs(s) {
      //算法：将秒数除以60，然后下舍入，既得到分钟数
      var h;
      h = Math.floor(s / 60);
      //计算秒
      //算法：取得秒%60的余数，既得到秒数
      s = s % 60;
      //将变量转换为字符串
      h += "";
      s += "";
      //如果只有一位数，前面增加一个0
      h = h.length == 1 ? "0" + h : h;
      s = s.length == 1 ? "0" + s : s;
      return h + ":" + s;
    },
    //对象为空数据过滤
    isEmptyObj(o) {
      for(var attr in o) return !1;
      return !0;
    },
    processArray(arr) {
      for(var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === null || arr[i] === undefined) arr.splice(i, 1);
        else if (typeof arr[i] == "object") this.removeNullItem(arr[i], arr, i);
      }
      return arr.length == 0;
    },
    proccessObject(o) {
      for(var attr in o) {
        if (o[attr] === null || o[attr] === undefined || o[attr] === "") delete o[attr];
        else if (typeof o[attr] == "object") {
          this.removeNullItem(o[attr]);
          if (this.isEmptyObj(o[attr])) delete o[attr];
        }
      }
    },
    removeNullItem(o, arr, i) {
      var s = {}.toString.call(o);
      if (s == "[object Array]") {
        if (this.processArray(o) === true) {
          //o也是数组，并且删除完子项，从所属数组中删除
          if (arr) arr.splice(i, 1);
        }
      } else if (s == "[object Object]") {
        this.proccessObject(o);
        if (arr && this.isEmptyObj(o)) arr.splice(i, 1);
      }
    },
    //封装为一个方法判断变量是否为空
    isobjEmpty(obj) {
      if (obj === null || obj === undefined || obj === "" || obj.length === 0 || obj === {}) {
        return true;
      } else {
        return false;
      }
    },
    /* 本地存储 页面跳转 */
    pushParams(data) {
      sessionStorage.setItem("params", JSON.stringify(data));
    },
    getParams() {
      return JSON.parse(sessionStorage.getItem("params"));
    },
    //表格样式
    row_key(row) {
      return row.id;
    },
    cellStyle({row, column, rowIndex, columnIndex}) {
      return "text-align:center";
    },

    /* 本地存储  */
    addDataStorge(params, data) {
      sessionStorage.setItem(params, JSON.stringify(data));
    },
    getDataStorge(params) {
      return JSON.parse(sessionStorage.getItem(params));
    },
    /*  数据传值 (给对象赋值 以第一个字段为准 )  */
    copyData(data1, data2) {
      Object.keys(data1).forEach((key) => {
        data1[key] = data2[key];
      });
    },
  },
};

export default mixin;
