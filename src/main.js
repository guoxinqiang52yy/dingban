/*
 * @Author: your name
 * @Date: 2020-08-07 14:04:40
 * @LastEditTime: 2020-12-14 16:19:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\main.js
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import http from "./assets/js/axios/index";
import "./assets/icon/iconfont.css";

Vue.prototype.Axios = http;
Vue.prototype.$EventBus = new Vue();
Vue.config.productionTip = false;
Vue.use(ElementUI);

//按钮权限控制
// 注册一个全局自定义指令 `v-has`
Vue.directive("has", {
  inserted: function(el, binding) {
    if (!permissionJudge(binding.value)) {
      el.parentNode.removeChild(el);
    }
    function permissionJudge(value) {
      //console.log(value);
      let list = store.state.selectBtnJurisdiction || [];
      if (list.includes(value)) {
        return true;
      } else {
        return false;
      }
    }
  },
});

// 图片放大插件
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
Vue.use(Viewer);
Viewer.setDefaults({
  Options: { inline: true, button: false, navbar: false, title: false, toolbar: true, tooltip: false, movable: false, zoomable: false, rotatable: false, scalable: true, transition: false, fullscreen: false, keyboard: false, url: "data-source" },
});

// 路由拦截器
// store.commit("setAdmin");
let routerFlag = "";
router.beforeEach((to, from, next) => {
  console.log(to);
  var user = sessionStorage.getItem("userInfo");
  if (!user) {
    if (to.name != "login") {
      next("/login");
    } else {
      next();
    }
  } else {
    if (!routerFlag) {
      routerFlag = true;
      // //console.log("路由跳转");
      if (to.name != "login") {
        store.dispatch("setMenuList", user).then((res) => {
          if (store.state.selectUrlJurisdiction.includes(to.path)) {
            routerFlag = true;
            next({ path: to.path });
          } else {
            routerFlag = true;
            next("/login");
          }
        });
      } else {
        next("/login");
      }
    } else {
      routerFlag = false;
      next();
    }

    // if (to.name == "dep") {
    //   store.commit("addJurisdiction", ["c1", "c2"]);
    // } else {
    //   store.commit("addJurisdiction", ["b1", "b2"]);
    // }
  }

  //   if (to.matched.length != 0) {
  //     if (to.meta.requireAuth) {
  //       // 判断该路由是否需要登录权限
  //       if (Boolean(localStorage.getItem("userInfo"))) {
  //         // 通过vuex state获取当前的user是否存在
  //         next();
  //       } else {
  //         next({
  //           path: "/login",
  //           query: { redirect: to.fullPath }, // 将跳转的路由path作为参数，登录成功后跳转到该路由
  //         });
  //       }
  //     } else {
  //       if (Boolean(localStorage.getItem("userInfo"))) {
  //         // 判断是否登录
  //         if (to.path != "/" && to.path != "/login") {
  //           //判断是否要跳到登录界面
  //           next();
  //         } else {
  //           /**
  //            * 防刷新，如果登录，修改路由跳转到登录页面，修改路由为登录后的首页
  //            */
  //           next({
  //             path: "/home",
  //           });
  //         }
  //       } else {
  //         next();
  //       }
  //     }
  //   } else {
  //     next({
  //       path: "/login",
  //       query: { redirect: to.fullPath }, // 将跳转的路由path作为参数，登录成功后跳转到该路由
  //     });
  //   }
});

//节流处理
const on = Vue.prototype.$on;
Vue.prototype.$on = function(event, func) {
  let previous = 0;
  let newFunc = func;
  if (event === "click") {
    newFunc = function() {
      const now = new Date().getTime();
      if (previous + 500 <= now) {
        func.apply(this, arguments);
        previous = now;
      }
    };
  }
  on.call(this, event, newFunc);
};

new Vue({
  data() {
    return {
      areaId: "",
    };
  },
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
