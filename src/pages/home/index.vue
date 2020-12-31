<!--
 * @Author: 首页1
 * @Date: 2020-08-10 14:23:36
 * @LastEditTime: 2020-12-21 16:16:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\index.vue
-->
<!--  -->
<template>
  <el-container class="index-con">
    <!-- 顶部导航 -->
    <el-header class="index-header">
      <div class="index-header-title">
        <div class="title"><img src="../../assets/icon/logo_title.png" alt="" /></div>
        <!-- <div class="title">快办网后台管理系统</div> -->
        <div class="button-icon">
          <el-select :popper-append-to-body="false" class="selects select_index" v-model="values" placeholder="请选择" @change="selecType">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
        <div class="button"></div>
      </div>
      <navcon></navcon>
    </el-header>

    <el-container class="main-con">
      <!-- 左侧导航 -->
      <el-aside :class="showclass">
        <leftnav :data1="leftData"></leftnav>
      </el-aside>
      <!-- 内容部分 -->
      <el-main clss="index-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import navcon from "../../components/navcon";
import leftnav from "../../components/leftnav";
import loginVue from "../login.vue";
export default {
  name: "",
  components: { navcon, leftnav },
  props: [],
  data() {
    return {
      leftData: "",
      input: "12",
      showclass: "asideshow",
      title: "用户中心",
      options: [],
      values: "",
      dataList: [],
      value: "",
    };
  },
  beforeMount() {
    // 弹出登录成功
    // this.$message({
    //   message: "登录成功",
    //   type: "success",
    // });
  },
  computed: {
    // //接收vuex事件变化
    // isNotice() {
    //   return this.$store.state.isNotice;
    // },
  },
  watch: {
    // isNotice(val, oldVal) {
    //   //console.log("组件触发++"); // 通过vuex传递来的组件A中的参数
    //   // 触发组件B中的事件...
    //   this.getUrl();
    // },
  },
  created() {},
  mounted() {
    //console.log("首页渲染");
    this.getUrl();
    console.log(this.leftData);
  },
  beforeCreate() {},
  beforeUpdate() {
    this.getUrl();
  },
  updated() {},
  beforeDestroy() {},
  methods: {
    getUrl() {
      //系统权限
      this.options = [];
      this.options = this.$store.state.selectModuleJurisdiction;
      console.log(this.options);
      //页面权限
      this.dataList = [];
      this.dataList = this.$store.state.selectPageJurisdiction;
      console.log(this.dataList);

      let _data = this.$route.path;
      console.log(_data);
      let _inpData = _data.substr(1);
      console.log(_inpData);
      // if (_inpData == "user/authority2") {
      //   _inpData = "user/authority";
      // }
      console.log(_inpData);
      let _strUrl = `/${_inpData.split("/")[0]}`;
      console.log(_strUrl);
      let _data2 = this.dataAssembleX(this.dataList, _strUrl);
      console.log(_data2);
      this.values = _data2[0].menuname;
      this.leftData = _data2;
    },
    selecType(val) {
      console.log(val);
      console.log(this.dataList);
      //点击的页面权限
      let _data = this.dataList.filter((data) => {
        return data.menuname == val;
      });
      console.log(_data);
      let _url = `/${_data[0].menus[0].url}`; //拼接url
      //  //console.log(_data2[0].url);
      this.leftData = _data;
      this.$router.push({ path: _url });
    },
    /* 数据处理(提取路由列表) */
    dataAssemble(data, val) {
      let _data = {};
      data.forEach((ele) => {
        if (!!ele.menus) {
          ele.menus.forEach((eles) => {
            if (eles.url == val) {
              _data = ele;
              return false;
            }
          });
        }
      });
      //console.log(_data);
      return _data;
    },
    dataAssembleX(data, val) {
      let _data = data.filter((i) => {
        return i.url == val;
      });

      return _data;
    },
  },
};
</script>
<style scoped>
.index-con {
  height: 100%;
  width: 100%;
  display: flex;

  box-sizing: border-box;
}

.aside {
  width: 64px !important;
  height: 100%;
  background-color: #334157;
  margin: 0px;
  color: #fff;
}
.asideshow {
  width: 160px !important;
  height: 100%;
  background-color: #222d32;
  margin: 0px;
  color: #fff;
}
.index-header {
  min-width: 1410px;
  height: 40px !important;
  background: rgb(10, 76, 173);
  display: flex;
  justify-content: space-between;
}
.index-header-title {
  display: flex;
  align-items: center;
}
.index-header-title .title {
  line-height: 40px;
  color: #ffffff;
  font-weight: 600;
  padding-left: 20px;
  font-size: 18px;
  letter-spacing: 1px;
}
.index-header-title .title img {
  width: auto;
  height: 40px;
  margin-right: 20px;
}
.index-header-title .button-icon {
  margin-left: 20px;
  width: 105px;
  height: 40px;
  color: #ffffff;
  font-weight: 500;
  text-align: center;
  line-height: 36px;
  font-size: 16px;
  background: rgb(9, 64, 148) !important;
}
.index-header-title .button-icon .el-select {
  height: 33px;
}
.index-header-title .button-icon .el-input__inner {
  height: 33px;
}
.index-header-title .button-icon .el-input__icon {
  line-height: 34px;
}

.index-header-title .button-icon b {
  font-size: 14px;
}
.index-header-title .button {
  color: #fff;
  margin-left: 20px;
}
.main-con {
  /* flex: auto; */
  width: 100%;
  height: calc(100% - 40px);
}
.el-container /deep/ .el-main {
  padding: 10px !important;
  min-width: 1250px;
  /* border-left: 2px solid #333; */
}
.button-icon /deep/ .select_index .el-select-dropdown .el-scrollbar .el-select-dropdown__wrap {
  max-height: 1000px !important;
}
.selects /deep/ .el-input__inner {
  border: none;
  height: 40px !important;
  color: #fff;
  background-color: rgb(8, 63, 145);
}
</style>
