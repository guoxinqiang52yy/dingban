/*
 * @Author: your name
 * @Date: 2020-11-05 20:37:40
 * @LastEditTime: 2020-11-24 09:55:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\assets\js\axios\config.js
 */

export default {
  BASE_URL: "",
  GET_CONFIG: {
    baseURL: BASEURL,
    timeout: 5000,
    method: "GET",
    // headers: { "X-Requested-With": "XMLHttpRequest" },
  },
  GET_CONFIG_JSON: {
    baseURL: BASEURL,
    timeout: 5000,
    method: "POST",
    // headers: { "X-Requested-With": "XMLHttpRequest" },
  },
  POST_CONFIG: {
    baseURL: BASEURL,
    timeout: 5000,
    method: "GET",
    // headers: { "X-Requested-With": "XMLHttpRequest" },
  },
};
