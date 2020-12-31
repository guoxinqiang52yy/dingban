/*
 * @Author: your name
 * @Date: 2020-08-07 14:04:40
 * @LastEditTime: 2020-10-30 19:54:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\router\index.js
 */
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

// const routes = [
// 	//登录
// 	{
// 		path: "/login",
// 		name: "login",
// 		component: () => import("../pages/login.vue"),
// 	},
// 	//主路由
// 	{
// 		path: "/",
// 		name: "home",
// 		meta: {
// 			requireAuth: true,
// 		},
// 		component: () => import("../pages/home"),
// 		children: [
// 			/* 用户中心 */
// 			{
// 				path: "/user/org",
// 				name: "org",
// 				component: () => import("../pages/user/uesr_org"),
// 			},
// 			{
// 				path: "/user/dep",
// 				name: "dep",
// 				component: () => import("../pages/user/user_dep"),
// 			},
// 			{
// 				path: "/user/role",
// 				name: "role",
// 				component: () => import("../pages/user/user_role"),
// 			},
// 			{
// 				path: "/user/addr",
// 				name: "addr",
// 				component: () => import("../pages/user/user_addr"),
// 			},
// 			/* 商品库 */
// 			{
// 				path: "/prod/attr",
// 				name: "attr",
// 				component: () => import("../pages/prod/prod_attr"),
// 			},
// 			{
// 				path: "/prod/list",
// 				name: "list",
// 				component: () => import("../pages/prod/prod_list"),
// 			},
// 			{
// 				path: "/prod/sku",
// 				name: "sku",
// 				component: () => import("../pages/prod/prod_sku"),
// 			},

// 			/* 政策库 */
// 			{
// 				path: "/policy/list",
// 				name: "attr",
// 				component: () => import("../pages/policy/policy_list"),
// 			},

// 			/* 官网配置*/
// 			{
// 				path: "/offcial/banner",
// 				name: "banner",
// 				component: () => import("../pages/official/official_banner"),
// 			},
// 			{
// 				path: "/offcial/link",
// 				name: "link",
// 				component: () => import("../pages/official/official_link"),
// 			},
// 			{
// 				path: "/offcial/nav",
// 				name: "nav",
// 				component: () => import("../pages/official/official_nav"),
// 			},

// 			/* 测试用 */
// 			{
// 				path: "/home/test",
// 				name: "test",
// 				component: () => import("../pages/test"),
// 			},
// 			{
// 				path: "/home/check",
// 				name: "check",
// 				component: () => import("../pages/test/check.vue"),
// 			},
// 		],
// 	},
// ];

//总路由
// let routerALL = [
//   //登录
//   {
//     path: "/login",
//     name: "login",
//     component: () => import("../pages/login.vue"),
//   },
//   {
//     path: "/",
//     name: "home",
//     meta: {
//       requireAuth: true,
//     },
//     component: () => import("../pages/home"),
//     children: [
//       /* 用户中心 */
//       {
//         path: "/user/org",
//         name: "org",
//         component: () => import("../pages/user/uesr_org"),
//       },
//       {
//         path: "/user/dep",
//         name: "dep",
//         component: () => import("../pages/user/user_dep"),
//       },
//       {
//         path: "/user/role",
//         name: "role",
//         component: () => import("../pages/user/user_role"),
//       },
//       {
//         path: "/user/addr",
//         name: "addr",
//         component: () => import("../pages/user/user_addr"),
//       },
//       /* 商品库 */
//       {
//         path: "/prod/attr",
//         name: "attr",
//         component: () => import("../pages/prod/prod_attr"),
//       },
//       {
//         path: "/prod/list",
//         name: "list",
//         component: () => import("../pages/prod/prod_list"),
//       },
//       {
//         path: "/prod/sku",
//         name: "sku",
//         component: () => import("../pages/prod/prod_sku"),
//       },

//       /* 政策库 */
//       {
//         path: "/policy/list",
//         name: "attr",
//         component: () => import("../pages/policy/policy_list"),
//       },

//       /* 官网配置*/
//       {
//         path: "/offcial/banner",
//         name: "banner",
//         component: () => import("../pages/official/official_banner"),
//       },
//       {
//         path: "/offcial/link",
//         name: "link",
//         component: () => import("../pages/official/official_link"),
//       },
//       {
//         path: "/offcial/nav",
//         name: "nav",
//         component: () => import("../pages/official/official_nav"),
//       },

//       /* 测试用 */
//       {
//         path: "/home/test",
//         name: "test",
//         component: () => import("../pages/test"),
//       },
//       {
//         path: "/home/check",
//         name: "check",
//         component: () => import("../pages/test/check.vue"),
//       },
//     ],
//   },
// ];

//子路由
// let routerLists = [
//   /* 用户中心 */
//   {
//     path: "/user/org",
//     name: "org",
//     component: () => import("../pages/user/uesr_org"),
//   },
//   {
//     path: "/user/dep",
//     name: "dep",
//     component: () => import("../pages/user/user_dep"),
//   },
//   {
//     path: "/user/role",
//     name: "role",
//     component: () => import("../pages/user/user_role"),
//   },
//   {
//     path: "/user/authority",
//     name: "authority",
//     component: () => import("../pages/user/user_authority"),
//   },
//   {
//     path: "/user/authority2",
//     name: "authority2",
//     component: () => import("../pages/user/user_authority2"),
//   },
//   //权限生成
//   {
//     path: "/user/addr",
//     name: "addr",
//     component: () => import("../pages/user/user_addr"),
//   },
//   /* 商品库 */
//   {
//     path: "/prod/attr",
//     name: "attr",
//     component: () => import("../pages/prod/prod_attr"),
//   },
//   {
//     path: "/prod/list",
//     name: "list",
//     component: () => import("../pages/prod/prod_list"),
//   },
//   {
//     path: "/prod/sku",
//     name: "sku",
//     component: () => import("../pages/prod/prod_sku"),
//   },

//   /* 政策库 */
//   {
//     path: "/policy/list",
//     name: "attrs",
//     component: () => import("../pages/policy/policy_list"),
//   },

//   /* 官网配置*/
//   {
//     path: "/offcial/banner",
//     name: "banner",
//     component: () => import("../pages/official/official_banner"),
//   },
//   {
//     path: "/offcial/link",
//     name: "link",
//     component: () => import("../pages/official/official_link"),
//   },
//   {
//     path: "/offcial/nav",
//     name: "nav",
//     component: () => import("../pages/official/official_nav"),
//   },

//   /* 测试用 */
//   {
//     path: "/home/test",
//     name: "test",
//     component: () => import("../pages/test"),
//   },
//   {
//     path: "/home/check",
//     name: "check",
//     component: () => import("../pages/test/check.vue"),
//   },
// ];

//定义 上面数组的父路由
let routerAlls = [
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

];

// 获取所有权限列表
// let arr = ["org", "dep", "role", "addr", "attr", "attrs", "list", "sku", "link", "banner", "nav", "authority", "authority2"];
// arr = JSON.parse(sessionStorage.getItem("routerList")) || [];
// 将权限添加到动态路由
// routerAlls[1].children = routerListFun(arr, routerLists);
// router.addRoutes(routerAlls);

// router.beforeEach((to, from, next) => {
//   console.log("路由子目录");
//   // 将权限添加到动态路由
//   arr = JSON.parse(sessionStorage.getItem("routerList")) || [];
//   routerAlls[1].children = routerListFun(arr, routerLists);
//   console.log(routerAlls);
//   router.addRoutes(routerAlls);
//   next();
// });

// 根据后台返回的权限数组，筛选对应的路由信息对象
// function routerListFun(arr, allList) {
//   let arrArray = [];
//   for (let i = 0; i < arr.length; i++) {
//     for (let k = 0; k < allList.length; k++) {
//       if (arr[i] == allList[k].name) {
//         arrArray.push(allList[k]);
//       }
//     }
//   }
//   for (let i = 0; i < arrArray.length; i++) {
//     if (arrArray[i].children && arrArray[i].children.length > 0) {
//       arrArray[i].childrens = [];
//       for (let k = 0; k < arrArray[i].children.length; k++) {
//         for (let j = 0; j < arr.length; j++) {
//           if (arrArray[i].children[k].name == arr[j]) {
//             arrArray[i].childrens.push(arrArray[i].children[k]);
//           }
//         }
//       }
//       arrArray[i].children = arrArray[i].childrens;
//     }
//   }
//   return arrArray;
// }

// // 根据全部的路由信息对象 返回 权限列表
// function routerListStr(routerStr) {
//   let routerJson = JSON.parse(routerStr);
//   for (let i = 0; i < routerJson.length; i++) {
//     if (routerJson[i].component) {
//       routerJson[i].component = "";
//     }

//     if (routerJson[i].children && routerJson[i].children.length > 0) {
//       for (let k = 0; k < routerJson[i].children.length; k++) {
//         routerJson[i].children[k].component = "";
//       }
//     }
//   }
//   return routerJson;
// }
const router = new VueRouter({
  
  routes: routerAlls,
});
export default router;
