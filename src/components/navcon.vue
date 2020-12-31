<!--
 * @Author:  顶部组件
 * @Date: 2020-08-12 09:31:06
 * @LastEditTime: 2020-12-23 17:07:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\components\navcon.vue
-->

<template>
  <div class="icon">
    <i><img src="../assets/icon/icon02.png" alt=""/></i>
    <i><img src="../assets/icon/icon03.png" alt=""/></i>
    <i><img src="../assets/icon/icon04.png" alt=""/></i>
    <el-popover placement="bottom" width="200" trigger="click">
      <div class="icon_show">
        <div class="icon_show_box">
          <div class="icon_show_box_title">
            <span class="el-icon-user-solid">{{ userMessage.realName }}</span> <span>{{ userMessage.depName | nameLong }}</span>
          </div>
          <div class="icon_show_box_title2">
            <span>{{ userMessage.comName }}</span>
          </div>
          <div class="icon_show_box_title_line"></div>
          <div class="icon_show_box_title_role">
            <span v-for="(itme, index) in userMessage.role" :key="index">{{ itme.roleName }}</span>
          </div>
        </div>
        <div class="icon_show_box_title_line"></div>
        <el-button class="icon_show_btn" size="mini" @click="exit()">退出 </el-button>
      </div>
      <i slot="reference"><img src="../assets/icon/icon01.png" alt=""/></i>
    </el-popover>
  </div>
  <!-- <el-menu class="el-menu-demo" mode="horizontal" background-color="#1989fa" text-color="#fff" active-text-color="#fff">
    <el-submenu index="1" class="submenu">
      <template slot="title">你好，超级管理员</template>
      <el-menu-item @click="exit()" index="2-1">退出</el-menu-item>
    </el-submenu>
  </el-menu> -->
</template>

<script>
import myMixin from "../assets/js/minx/minx";
export default {
  name: "navcon",
  mixins: [myMixin],
  components: {},
  props: [],
  data() {
    return {
      userMessage: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  filters: {
    nameLong(data) {
      //console.log(data);
      if (data) {
        if (data.length > 6) {
          return data.slice(0, 5) + "...";
        } else {
          return data;
        }
      }
    },
  },
  mounted() {
    this.userMessage = {};
    // let _resp = JSON.parse(sessionStorage.getItem("userMessage"));
    let _resp = this.getDataStorge("userMessage");
    console.log(_resp);
    this.userMessage = _resp;
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    //退出
    exit() {
      this.$confirm("退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        setTimeout(() => {
          this.$store.commit("logout", "false");
          this.$router.push({ path: "/login" });
          this.$message({
            type: "success",
            message: "已退出登录!",
          });
        }, 600);
      });
    },
  },
};
</script>
<style scoped>
.icon {
  display: flex;
  align-items: center;
  padding-right: 5px;
  color: #fff;
}
.icon i {
  cursor: pointer;
  margin: 0 14px;
}
.icon i img {
  width: 20px;
  height: auto;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
}
.el-menu-demo /deep/ .is-active .el-submenu__title {
  border: none;
}
.submenu {
  float: right;
}
.el-menu--horizontal .el-menu--popup {
  width: 100px;
}
.icon_show_box_title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.icon_show_box_title :nth-child(1) {
  font-size: 15px;
  color: #409eff;
  margin-right: 5px;
}

.icon_show_box_title :nth-child(2) {
  font-size: 12px;
  color: #bbbbbb;
}

.icon_show_box_title2 {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.icon_show_box_title2 :nth-child(1) {
  font-size: 12px;
  color: #bbbbbb;
}

.icon_show_box_title_line {
  width: 100%;
  height: 1px;
  background: #eee;
  margin: 10px 0;
}
.icon_show_box_title_role {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.icon_show_box_title_role span {
  margin: 5px 10px;
  color: #bbbbbb;
}
.icon_show_btn {
  width: 100%;
}
</style>
