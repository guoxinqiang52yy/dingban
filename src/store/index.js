/*
 * @Author:  状态处理
 * @Date: 2020-08-07 14:04:40
 * @LastEditTime: 2020-12-15 16:16:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\store\index.js
 */
import Vue from "vue";
import Vuex from "vuex";
import axios from "../assets/js/axios/index";
import router from "../router/index";
import { Button, Form, FormItem, Input, Message } from "element-ui";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /* 登录信息 */
    userInfo: {},
    /*  用来触发组件监听事件 */
    isNotice: true,
    /*  支付列表获取服务信息 */
    serveList: [],
    /*订单内容表单验证*/
    isRules: true,
    /* 登录状态*/
    user: false,
    /* 总计计算 */
    allPrice: "",
    /* 复选框所选列表 */
    checkList: [],
    /* 地区选择 */
    cityList: [],
    /* 按钮权限 */
    jurisdiction: ["a1", "b1", "c1"],
    /*已选路由信息 */
    selectRouterJurisdiction: {
      url_parent: "",
      title: "",
      url_node: "",
    },
    /*已选模块权限信息*/
    selectModuleJurisdiction: [],
    /* 已选页面URL信息 */
    selectUrlJurisdiction: [],
    /*已选页面权限信息*/
    selectPageJurisdiction: [],
    /* 已选按钮权限 */
    selectBtnJurisdiction: [],
    /* 全部模块权限 */
    moduleJurisdiction: [
      {
        value: "用户中心",
        label: "用户中心",
        url: "/user",
      },
      {
        value: "商品库",
        label: "商品库",
        url: "/prod",
      },
      {
        value: "政策库",
        label: "政策库",
        url: "/policy",
      },
      {
        value: "官网配置",
        label: "官网配置",
        url: "/offcial",
      },
      {
        value: "线索系统",
        label: "线索系统",
        url: "/xiansuo",
      },
    ],
    /* 全部页面权限 */
    pageJurisdiction: [
      {
        menuid: 1,
        url: "/user",
        icon: "li-icon-xiangmuguanli",
        menuname: "用户中心",
        menus: [
          {
            menuid: 2,
            icon: "icon-cat-skuQuery",
            menuname: "组织架构",
            url: "user/org",
          },
          {
            menuid: 3,
            icon: "icon-cat-skuQuery",
            menuname: "部门管理",
            url: "user/dep",
          },
          {
            menuid: 19,
            icon: "icon-cat-skuQuery",
            menuname: "系统创建",
            url: "user/authority",
          },
          {
            menuid: 4,
            icon: "icon-cat-skuQuery",
            menuname: "角色管理",
            url: "user/role",
          },
          {
            menuid: 18,
            icon: "icon-cat-skuQuery",
            menuname: "地区管理",
            url: "user/addr",
          },
        ],
      },
      {
        menuid: 5,
        url: "/prod",
        icon: "li-icon-xiangmuguanli",
        menuname: "商品库",
        menus: [
          {
            menuid: 6,
            icon: "icon-cat-skuQuery",
            menuname: "商品属性",
            url: "prod/attr",
          },
          {
            menuid: 7,
            icon: "icon-cat-skuQuery",
            menuname: "商品列表",
            url: "prod/list",
          },
          {
            menuid: 8,
            icon: "icon-cat-skuQuery",
            menuname: "SKU列表",
            url: "prod/sku",
          },
        ],
      },
      {
        menuid: 9,
        url: "/policy",
        icon: "li-icon-xiangmuguanli",
        menuname: "政策库",
        menus: [
          {
            menuid: 10,
            icon: "icon-cat-skuQuery",
            menuname: "政策列表",
            url: "policy/policylist",
          },
        ],
      },
      {
        menuid: 11,
        url: "/offcial",
        icon: "li-icon-xiangmuguanli",
        menuname: "官网配置",
        menus: [
          {
            menuid: 12,
            icon: "icon-cat-skuQuery",
            menuname: "banner",
            url: "offcial/banner",
          },
          {
            menuid: 13,
            icon: "icon-cat-skuQuery",
            menuname: "友情链接",
            url: "offcial/link",
          },
          {
            menuid: 14,
            icon: "icon-cat-skuQuery",
            menuname: "顶部导航",
            url: "offcial/nav",
          },
        ],
      },
      {
        menuid: 20,
        url: "/xiansuo",
        icon: "li-icon-xiangmuguanli",
        menuname: "线索系统",
        menus: [
          {
            menuid: 21,
            icon: "icon-cat-skuQuery",
            menuname: "私有库",
            url: "xiansuo/siyou",
          },
          {
            menuid: 22,
            icon: "icon-cat-skuQuery",
            menuname: "公海库",
            url: "xiansuo/gonghai",
          },
          {
            menuid: 111,
            icon: "icon-cat-skuQuery",
            menuname: "成交库",
            url: "xiansuo/chengjiao",
          },
          // {
          //   menuid: 23,
          //   icon: "icon-cat-skuQuery",
          //   menuname: "呼叫配置",
          //   url: "xiansuo/hujiao",
          // },
          // {
          //   menuid: 24,
          //   icon: "icon-cat-skuQuery",
          //   menuname: "来源配置",
          //   url: "xiansuo/laiyuan",
          // },
          // {
          //   menuid: 25,
          //   icon: "icon-cat-skuQuery",
          //   menuname: "回收配置",
          //   url: "xiansuo/huishou",
          // },
          // {
          //   menuid: 26,
          //   icon: "icon-cat-skuQuery",
          //   menuname: "标签配置",
          //   url: "xiansuo/biaoqian",
          // },
          // {
          //   menuid: 27,
          //   icon: "icon-cat-skuQuery",
          //   menuname: "隐藏配置",
          //   url: "xiansuo/yincang",
          // },
          //
          // {
          //   menuid: 222,
          //   icon: "icon-cat-skuQuery",
          //   menuname: "库容配置",
          //   url: "xiansuo/kurong",
          // },
        ],
      },
      // {
      //   menuid: 15,
      //   icon: "li-icon-xiangmuguanli",
      //   menuname: "测试专用",
      //   menus: [
      //     {
      //       menuid: 16,
      //       icon: "icon-cat-skuQuery",
      //       menuname: "树状图",
      //       url: "home/test",
      //     },
      //     {
      //       menuid: 17,
      //       icon: "icon-cat-skuQuery",
      //       menuname: "多选框组",
      //       url: "home/check",
      //     },
      //   ],
      // },
    ],
    /* 基本路由 */
    baseRouteList: [
      //登录
      {
        path: "/login",
        name: "login",
        component: () => import("../pages/login.vue"),
      },
      //这里为routerLists的父路由
      {
        path: "/",
        name: "home",
        meta: {
          requireAuth: true,
        },
        component: () => import("../pages/home"),
      },
      // {
      //   path: "*", // 页面不存在的情况下会跳到登录页面
      //   redirect: "/login",
      //   name: "login",
      //   component: () => import("../pages/login.vue"),
      // },
    ],
    /* 页面权限路由 */
    powerRouteList: [
      /* 用户中心 */
      {
        path: "/user/org",
        name: "org",
        component: () => import("../pages/user/user_org"),
      },
      {
        path: "/user/dep",
        name: "dep",
        component: () => import("../pages/user/user_dep"),
      },
      {
        path: "/user/role",
        name: "role",
        component: () => import("../pages/user/user_role"),
      },
      {
        path: "/user/authority",
        name: "authority",
        component: () => import("../pages/user/user_authority"),
      },
      {
        path: "/user/authority2",
        name: "authority2",
        component: () => import("../pages/user/user_authority2"),
      },
      //权限生成
      {
        path: "/user/addr",
        name: "addr",
        component: () => import("../pages/user/user_addr"),
      },
      /* 商品库 */
      {
        path: "/prod/attr",
        name: "attr",
        component: () => import("../pages/prod/prod_attr"),
      },
      {
        path: "/prod/list",
        name: "list",
        component: () => import("../pages/prod/prod_list"),
      },
      {
        path: "/prod/sku",
        name: "sku",
        component: () => import("../pages/prod/prod_sku"),
      },

      /* 政策库 */
      {
        path: "/policy/policylist",
        name: "policylist",
        component: () => import("../pages/policy/policy_policylist"),
      },

      /* 官网配置*/
      {
        path: "/offcial/banner",
        name: "banner",
        component: () => import("../pages/offcial/offcial_banner"),
      },
      {
        path: "/offcial/link",
        name: "link",
        component: () => import("../pages/offcial/offcial_link"),
      },
      {
        path: "/offcial/nav",
        name: "nav",
        component: () => import("../pages/offcial/offcial_nav"),
      },

      // 线索系统
      {
        path: "/xiansuo/siyou",
        name: "siyou",
        component: () => import("../pages/xiansuo/xiansuo_siyou"),
      },
      {
        path: "/xiansuo/gonghai",
        name: "gonghai",
        component: () => import("../pages/xiansuo/xiansuo_gonghai"),
      },
      // {
      //   path: "/xiansuo/hujiao",
      //   name: "hujiao",
      //   component: () => import("../pages/xiansuo/xiansuo_hujiao"),
      // },
      // {
      //   path: "/xiansuo/laiyuan",
      //   name: "laiyuan",
      //   component: () => import("../pages/xiansuo/xiansuo_laiyuan"),
      // },
      // {
      //   path: "/xiansuo/yincang",
      //   name: "yincang",
      //   component: () => import("../pages/xiansuo/xiansuo_yincang"),
      // },
      // {
      //   path: "/xiansuo/huishou",
      //   name: "huishou",
      //   component: () => import("../pages/xiansuo/xiansuo_huishou"),
      // },
      // {
      //   path: "/xiansuo/biaoqian",
      //   name: "biaoqian",
      //   component: () => import("../pages/xiansuo/xiansuo_biaoqian"),
      // },
      // {
      //   path: "/xiansuo/kurong",
      //   name: "kurong",
      //   component: () => import("../pages/xiansuo/xiansuo_kurong"),
      // },
      {
        path: "/xiansuo/chengjiao",
        name: "chengjiao",
        component: () => import("../pages/xiansuo/xiansuo_chengjiao"),
      },
      //  线索-页面内跳转-添加
      // {
      //   path: "/xiansuo/siyou_add",
      //   name: "siyou_add",
      //   component: () => import("../pages/xiansuo/xiansuo_siyou/siyou_add"),
      // },
      //  线索-页面内跳转-跟进
      // {
      //   path: "/xiansuo/siyou_genjin",
      //   name: "siyou_genjin",
      //   component: () => import("../pages/xiansuo/xiansuo_siyou/siyou_genjin"),
      // },
      /* 测试用 */
      {
        path: "/home/test",
        name: "test",
        component: () => import("../pages/test"),
      },
      {
        path: "/home/check",
        name: "check",
        component: () => import("../pages/test/check.vue"),
      },
    ],
    //
  },
  mutations: {
    //修改组件触发事件
    changeLunch(state) {
      state.isNotice = !state.isNotice;
    },
    //登录信息
    userInfo(state, data) {
      state.data = data;
    },
    // 登录
    login(state, user) {
      state.user = user;
      sessionStorage.setItem("userInfo", user);
    },
    // 退出
    logout(state, user) {
      state.user = "";
      sessionStorage.setItem("userMessage", "");
      sessionStorage.setItem("userInfo", "");
    },
    //支付页面获取服务信息
    getServeList(state, data) {
      state.serveList = [];
      state.serveList = data;
    },
    /*修改表单验证信息*/
    changeRoules(state, data) {
      state.isRules = data;
    },
    /* 计算总价 */
    sumTotle(state, price) {},
    /* 权限筛选 */
    //根据页面权限获取系统权限
    //跳转到页面时 添加按钮权限
    addJurisdiction(state, data) {
      console.log(data);
      // state.jurisdiction = [];
      // state.jurisdiction = data;
    },
    //筛选系统权限
    getSysPower(state, arrays) {
      // let _listSys = _newSysArr.map((item) => {
      //   return { label: item.name, value: item.name, url: item.path, id: item.powerId };
      // });
      // state.selectModuleJurisdiction = _listSys;
      // let _tempArr = JSON.parse(JSON.stringify(state.moduleJurisdiction));
      // let intersection = [];
      // for (let i = 0, len = _tempArr.length; i < len; i++) {
      //   for (let j = 0, length = arrays.length; j < length; j++) {
      //     if (_tempArr[i].url.includes(arrays[j].path)) {
      //       intersection.push(_tempArr[i]);
      //     }
      //   }
      // }
      // state.selectModuleJurisdiction = intersection;
      console.log("系统权限");
      // console.log(intersection);
    },
    //筛选页面权限
    getPagePower(state, arrays) {
      // let _seleltArr = arrays.map((item) => {
      //   return item.path;
      // });
      // let _tempUrl = _seleltArr;
      // if (_tempUrl.includes("/user/authority")) {
      //   _tempUrl.push("/user/authority2");
      // }
      // state.selectUrlJurisdiction = _tempUrl;
      // console.log(_tempUrl);
      // console.log(_seleltArr);
      // let _tempArr = state.pageJurisdiction.filter((x) => state.selectModuleJurisdiction.some((y) => y.url == x.url));
      // let _sysArr = JSON.parse(JSON.stringify(_tempArr));
      // _sysArr.forEach((item) => {
      //   let _resp = "";
      //   _resp = item.menus.filter((item) => {
      //     return _seleltArr.includes(`/${item.url}`);
      //   });
      //   item.menus = _resp;
      // });
      // state.selectPageJurisdiction = _sysArr;
      console.log("页面权限===");
      // console.log(_sysArr);
      _sysArr.forEach((item) => {
        let _resp = "";
        console.log(item);
        _resp = item.menus.filter((item) => {
          return _seleltArr.includes(`/${item.url}`);
        });
        item.menus = _resp;
        console.log(item.menus);
      });
      // console.log(state.selectModuleJurisdiction);
      // console.log(state.pageJurisdiction);
      // console.log(_sysArr);
      state.selectPageJurisdiction = _sysArr;
      // sessionStorage.setItem("pageList", JSON.stringify(_sysArr));
    },
    //筛选路由
    getRoutePower(state, arrays) {
      // console.log(arrays);
      let _tempArr = JSON.parse(JSON.stringify(arrays));
      let _resp = _tempArr.map((item) => {
        return item.path.split("/").pop();
      });
      if (_resp.includes("authority")) {
        _resp.push("authority2");
      }
      this.commit("addRouter", _resp);
      // state.selectRouterJurisdiction = _resp;
      // sessionStorage.setItem("routerList", JSON.stringify(_resp));
    },
    //按钮权限
    getBtnPower(state, arrays) {
      let _listButton = arrays.map((item) => {
        return item.mark;
      });
      state.selectBtnJurisdiction = _listButton;
    },
    //添加路由
    getRoute(state, arr) {
      let _childList = [];
      console.log("路由==");
      console.log(arr);
      arr.forEach((i) => {
        let _tempArrUrl = i.path.substr(1).split("/");
        let _objectRouter = {
          path: i.path,
          name: i.name,
          component: () => import(`../pages/${_tempArrUrl[0]}/${_tempArrUrl[0]}_${_tempArrUrl[1]}`),
        };
        _childList.push(_objectRouter);
        // if (_tempArrUrl.includes("authority")) {
        //   _childList.push({
        //     path: "/user/authority2",
        //     name: "authority2",
        //     component: () => import(`../pages/user/user_authority2`),
        //   });
        // }
      });

      let _allList = state.baseRouteList;
      _allList[1].children = _childList;
      console.log("动态路由");
      console.log(_allList);
      router.addRoutes(_allList);
      this.commit("changeLunch");
    },
    //路由权限添加
    addRouter(state, arr) {
      let _allList = state.baseRouteList;
      let _childList = routerListFun(arr, state.powerRouteList);
      _allList[1].children = _childList;
      console.log("固定路由");
      console.log(_allList);
      router.addRoutes(_allList);
      this.commit("changeLunch");

      function routerListFun(arr, allList) {
        let arrArray = [];
        for (let i = 0; i < arr.length; i++) {
          for (let k = 0; k < allList.length; k++) {
            if (arr[i] == allList[k].name) {
              arrArray.push(allList[k]);
            }
          }
        }
        for (let i = 0; i < arrArray.length; i++) {
          if (arrArray[i].children && arrArray[i].children.length > 0) {
            arrArray[i].childrens = [];
            for (let k = 0; k < arrArray[i].children.length; k++) {
              for (let j = 0; j < arr.length; j++) {
                if (arrArray[i].children[k].name == arr[j]) {
                  arrArray[i].childrens.push(arrArray[i].children[k]);
                }
              }
            }
            arrArray[i].children = arrArray[i].childrens;
          }
        }
        return arrArray;
      }

      function routerList() {}
    },
    //复选框所有选择列表
    selectA(state, select) {
      let num = state.checkList.findIndex((v) => {
        return v.index == select.index;
      });
      if (num < 0) {
        state.checkList.push(select);
      } else {
        state.checkList[num] = select;
      }
    },
    //树状图改平行图
    dataAssembly(state, data) {
      // console.log(state.pageJurisdiction);
      let _data = JSON.parse(JSON.stringify(data)); //深拷贝
      let _sysArr = [],
        _pagArr = [],
        _btnArr = [];
      function change(data) {
        data.forEach((elem) => {
          if (elem.type == 3) {
            _btnArr.push({ powerId: elem.powerId, parentId: elem.parentId, name: elem.name, mark: elem.mark, path: elem.path, status: elem.status });
          }
          if (elem.type == 1) {
            _pagArr.push({ powerId: elem.powerId, parentId: elem.parentId, name: elem.name, mark: elem.mark, path: elem.path, status: elem.status });
          }
          if (elem.type == 0) {
            _sysArr.push({ powerId: elem.powerId, parentId: elem.parentId, name: elem.name, mark: elem.mark, path: elem.path, status: elem.status });
          }
          if (elem.children != []) {
            change(elem.children);
          }
        });
      }
      change(data);
      let _newSysArr = _sysArr.reduce((all, next) => (all.some((item) => item["powerId"] == next["powerId"]) ? all : [...all, next]), []);
      let _newPagArr = _pagArr.reduce((all, next) => (all.some((item) => item["powerId"] == next["powerId"]) ? all : [...all, next]), []);
      let _newBtnArr = _btnArr.reduce((all, next) => (all.some((item) => item["powerId"] == next["powerId"]) ? all : [...all, next]), []);
      console.log("==================");
      console.log(_newSysArr);
      console.log(_newPagArr);

      /* ==通过权限生成路由 & 导航==   */
      //筛选的系统权限列表(导航)
      let _listSys = _newSysArr.map((item) => {
        return { label: item.name, value: item.name, url: item.path, id: item.powerId };
      });
      state.selectModuleJurisdiction = _listSys;
      //筛选的页面权限列表(导航)
      let _listPages = [];
      _listSys.forEach((item) => {
        let _tempFirstList = { icon: "li-icon-xiangmuguanli", menuid: parseInt(item.id), menuname: item.value, url: item.url, menus: [] };
        _newPagArr.forEach((item2) => {
          if (item2.parentId == item.id && !item2.name.includes("(二级页)")) {
            _tempFirstList.menus.push({ icon: "icon-cat-skuQuery", menuname: item2.name, menuid: parseInt(item2.powerId), url: item2.path.substr(1) });
          }
        });
        _listPages.push(_tempFirstList);
      });
      state.selectPageJurisdiction = _listPages;

      //获取权限路由集合
      let _seleltArr = _newPagArr.map((item) => {
        return item.path;
      });
      let _tempUrl = _seleltArr;
      // if (_tempUrl.includes("/user/authority")) {
      //   _tempUrl.push("/user/authority2");
      // }
      state.selectUrlJurisdiction = _tempUrl;
      // this.commit("getSysPower", _newSysArr);
      // this.commit("getPagePower", _newPagArr);
      //按钮权限
      this.commit("getBtnPower", _newBtnArr);
      //路由生成
      // this.commit("getRoutePower", _newPagArr);
      this.commit("getRoute", _newPagArr);
    },

    generate(state, arr) {},
    //获取所有地区
    getCity(state, select) {
      state.cityList = select;
    },
  },
  actions: {
    async setMenuList(state, data) {
      try {
        let _resp = await axios.get(`ucenter-api/userlist/getUserPower`);
        let _thisTree = _resp.data.result.powerTree;
        if (_thisTree != [] || _thisTree.length < 1) {
          this.commit("dataAssembly", _thisTree);
        } else {
          Message({
            message: "该用户暂无权限",
            type: "error",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  modules: {},
});
