<!--
 * @Author:合同预览
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-08 14:14:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="finance_show">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>财务系统</el-breadcrumb-item>
      <el-breadcrumb-item> <router-link :to="{ path: '/finance/template' }">模板列表</router-link> </el-breadcrumb-item>
      <el-breadcrumb-item> <router-link :to="{ path: '/finance/addtemplate' }">模板编辑</router-link> </el-breadcrumb-item>
      <el-breadcrumb-item>预览模板</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="finance_show_heard">
      <p></p>
      <el-button size="mini" type="primary">返回</el-button>
    </div>
    <!-- 预览 -->
    <div class="finance_show_box">
      <div v-html="edit" style=" font-size: 16px;line-height:1.3"></div>
    </div>
  </div>
</template>
<script>
import tablels from "../../../components/tablelist/index.vue";
import tablels2 from "../../../components/tablelist2";

import myMixin from "../../../assets/js/minx/minx";

export default {
  name: "financeshow",
  mixins: [myMixin],
  components: { tablels, tablels2 },
  props: [],

  data() {
    return {
      //分页
      totle: 0,
      page: 0,
      pageNumber: 0,
      title: 123,
      edit: "",
      test: [{ "%电话%": "电话啊啊啊~~~" }, { "%邮编%": "邮编啊啊啊~~~" }, { "%甲方名称%": "甲方的名称啊啊啊~~~" }, { "%乙方名称%": "乙方的名称啊啊啊~~~" }, { "%服务列表%": "服务列表" }],
      passList: ["%人才列表%", "%服务列表%", "%支付%"],
      templateArr: [],
    };
  },
  computed: {
    //获取城市
  },
  watch: {},
  created() {},
  mounted() {
    this.edit = this.getDataStorge("templateShow").data;
    this.getCode(this.edit, this.test);
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 页面 */
    selectPages() {},
    /* 获取模板字符串内容 批量替换 */
    getCode(data, data2) {
      let _resp = [...new Set(data.match(/\%(.+?)\%/g))];
      let re = data;
      this.templateArr = _resp;
      _resp.forEach((item) => {
        if (this.passList.includes(item)) {
          let _reg = "/" + item + "/g";
          let _img = "";
          if (item.includes("服务列表")) {
            _img = require("../../../assets/icon/temlate_01.jpg");
          } else if (item.includes("人才列表")) {
            _img = require("../../../assets/icon/temlate_02.jpg");
          } else {
            _img = require("../../../assets/icon/temlate_03.jpg");
          }
          re = re.replace(eval(_reg), `<img src="${_img}" alt="">`);
        } else {
          let _arr = data2.filter((i) => {
            //待定使用key值查找相同
            let _arrKey = Object.keys(i);
            if (_arrKey.includes(item)) return i;
          });
          let _reg = "/" + item + "/g";

          let _replace = "";
          _arr.length > 0 ? (_replace = _arr[0][item]) : (_replace = item);
          re = re.replace(eval(_reg), _replace);
        }
      });

      this.edit = re;
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
.dialog_link /deep/ .el-form-item__content {
  width: 400px;
}
.official_link /deep/ .el-switch.is-disabled {
  opacity: 1;
}
.official_link /deep/ .el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}
.pages {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
