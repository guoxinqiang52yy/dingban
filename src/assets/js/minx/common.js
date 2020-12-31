/*
 * @Author: your name
 * @Date: 2020-12-05 09:59:07
 * @LastEditTime: 2020-12-09 21:11:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\assets\js\minx\common.js
 */
// 标准时间转换成
function time(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  h = h < 10 ? "0" + h : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  var second = date.getSeconds();
  second = second < 10 ? "0" + second : second;
  return y + "" + m + "" + d;
}
//时间转换成横线连接的
function changetime(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  h = h < 10 ? "0" + h : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  var second = date.getSeconds();
  second = second < 10 ? "0" + second : second;
  return y + "-" + m + "-" + d + " " + "00" + ":" + "00" + ":" + "00";
}
function changetime1(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  h = h < 10 ? "0" + h : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  var second = date.getSeconds();
  second = second < 10 ? "0" + second : second;
  return y + "-" + m + "-" + d + " " + "23" + ":" + "59" + ":" + "59";
}
// 截取时间
function subtr(data) {
  let data1 = data.slice(0, 4);
  let data2 = data.slice(4, 6);
  let data3 = data.slice(6, 8);
  return data1 + "-" + data2 + "-" + data3;
}
// 手机号和区号的判断
function checkTel(tel) {
  var mobile = /^1[3|5|8]\d{9}$/,
    phone = /^0\d{2,3}-?\d{7,8}$/;
  return mobile.test(tel) || phone.test(tel);
}
function geticon(suffix) {
  let arr = [
    "aac",
    "ape",
    "asf",
    "asx",
    "avi",
    "bmp",
    "cab",
    "cdr",
    "dat",
    "doc",
    "docx",
    "dxf",
    "emf",
    "eps",
    "fla",
    "flac",
    "flv",
    "gif",
    "gp",
    "htm",
    "html",
    "iso",
    "jpeg",
    "jpg",
    "midi",
    "mkv",
    "mov",
    "mp3",
    "mp4",
    "mpe",
    "mpeg",
    "mpg",
    "mv",
    "ogg",
    "7z",
    "pcx",
    "pdf",
    "png",
    "ppt",
    "pptx",
    "psd",
    "rar",
    "rm",
    "rmvb",
    "srt",
    "svg",
    "swf",
    "tar",
    "tgz",
    "tif",
    "txt",
    "vod",
    "wav",
    "wma",
    "wmf",
    "wmv",
    "xls",
    "xlsx",
    "zip",
  ];

  return arr.indexOf(suffix) != -1;
}
// 去除数组对象中重复的元素
function deteleObject(obj){
  let shuzu=JSON.parse(JSON.stringify(obj));
  let arr=[];
  let newarr=[]
 for(var i=0,len=shuzu.length;i<len;i++){
   if(arr.indexOf(shuzu[i].filePath)==-1){
     arr.push(shuzu[i].filePath);
     newarr.push(shuzu[i])
   }
 }
 return newarr

}
// 模糊搜索
function fuzzyQuery(list, keyWord) {
  var arr = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].label.match(keyWord) != null) {
      arr.push(list[i]);
    }
  }
  return arr;
}
export { time, checkTel, subtr, changetime, changetime1, geticon,deteleObject,fuzzyQuery };
export function uploadFile(Url, data) {
  //上传图片的方法
  return new Promise((resolve, reject) => {
    let instance = axios.create({
      baseURL: "http://gateway.kuaiban.com/common-api/",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    instance
      .post(Url, data)
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((error) => {
        reject(error.data);
      });
  });
}
