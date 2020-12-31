<!--
 * @Author:  部门管理
 * @Date: 2020-08-14 14:53:16
 * @LastEditTime: 2020-10-26 11:40:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\user\uesr_org\index.vue
-->

<template>
  <div class="uesr_addr">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item>地区管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <article class="uesr_addr_list1">
      <div class="add_button">
        <el-button v-has="'/user/addr-btn-add'" type="primary" size="small" @click="add">添加地区管理员</el-button>
      </div>
      <el-table :data="tableData" stripe style="width: 100%">
        <!-- <el-table-column prop="id" align="center" label="序号" min-width="80"></el-table-column> -->
        <el-table-column prop="realname" align="center" label="姓名" min-width="80"></el-table-column>
        <el-table-column prop="areaId" align="center" label="地区" :formatter="formatCity"></el-table-column>
        <el-table-column align="center" label="操作" min-width="180" fixed="right">
          <template slot-scope="scope">
            <el-button v-has="'/user/addr-btn-edit'" @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <!-- <el-button type="text" size="small">编辑</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </article>
    <div class="pages">
      <p></p>
      <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="totle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
    </div>

    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="姓名" prop="userName">
          <el-select size="small" v-model="editForm.userName" filterable placeholder="请选择" @change="selectUsr">
            <el-option v-for="(item, index) in userList" :key="index" :label="item.realname" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区" prop="city">
          <el-select size="small" v-model="editForm.city" placeholder="请选择">
            <el-option v-for="(item, index) in cityList" :key="index" :label="item.cityName" :value="item.addressId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myMixin from "../../../assets/js/minx/minx";
import axios from "axios";
export default {
  name: "",
  components: {},
  mixins: [myMixin],
  props: [],
  data() {
    return {
      page: 0,
      pageSize: 15,
      totle: 0,
      //添加 &编辑
      isAddOrEdit: 1,
      //用户列表
      userList: [],
      cityList: [],
      tableData: [],
      //弹框内容
      loading: false, //是显示加载
      title: "添加地区管理员",
      editFormVisible: false, //控制编辑页面显示与隐藏
      editForm: {
        userName: "",
        city: "",
      },
      // rules表单验证
      rules: {
        userName: [{ required: true, message: "请选择用户", trigger: "change" }],
        city: [{ required: true, message: "请选择地区", trigger: "change" }],
      },
      //编辑数据
      tempData: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getPersonList();
    this.getAreaLsit();
    this.getAreaPer();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 格式化地区 */
    formatCity(row, column) {
      let _resp = this.cityList.find((val) => {
        return val.addressId == row.areaId;
      });
      if (_resp) return _resp.cityName; //有旧数据残留 数据结构不同
    },
    /* 页面*/
    //添加
    add() {
      this.isAddOrEdit = 1;
      this.editFormVisible = true;
      this.title = "添加地区管理员";
    },
    //编辑
    handleClick(data) {
      this.isAddOrEdit = 2;
      console.log(data);
      this.tempData = data;
      this.editFormVisible = true;
      this.title = "编辑地区管理员";
      this.editForm.userName = data.userId;
      this.editForm.city = parseInt(data.areaId);
    },
    //提交表单
    submitForm() {
      this.$refs.editForm.validate((val) => {
        if (val) {
          if (this.isAddOrEdit == 1) {
            let data = {
              userId: this.editForm.userName,
              areaId: this.editForm.city,
            };
            console.log(data);
            this.addAreaPer(data);
          } else {
            let data = {
              id: this.tempData.id,
              userId: this.editForm.userName,
              areaId: this.editForm.city,
            };
            console.log(data);
            this.editAreaPer(data);
          }
        } else {
          this.showMessage("error", "内容不能为空");
        }
      });
    },
    selectUsr(value) {
      console.log(value);
    },
    closeDialog() {
      if (this.$refs.editForm) this.$refs.editForm.resetFields();
      this.editFormVisible = false;
      this.editForm.userName = "";
      this.editForm.city = "";
    },
    selectPages(val) {
      this.page = parseInt(val - 1);
      this.getAreaPer();
    },
    /* 接口 */
    //获取人员列表
    async getPersonList() {
      let resp = await this.Axios.get(`ucenter-api/userlist/queryAll`);
      console.log(resp.data.result);
      this.userList = resp.data.result;
    },
    //获取地区列表
    async getAreaLsit() {
      let resp = await this.Axios.get(`common-api/citysite/list`);
      console.log(resp.data);
      this.cityList = resp.data.result;
    },
    //获取地区管理列表
    async getAreaPer() {
      let typeList = await this.Axios.get(`ucenter-api/adminarea/queryList?pageNum=${this.page}&pageSize=${this.pageSize}`);
      console.log(typeList.data.result);
      this.tableData = typeList.data.result;
      this.totle = typeList.data.total;
    },
    //添加地区管理列表
    async addAreaPer(data) {
      let typeList = await this.Axios.post(`ucenter-api/adminarea/setArea`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.getAreaPer();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
    //编辑地区管理列表
    async editAreaPer(data) {
      let typeList = await this.Axios.post(`ucenter-api/adminarea/updateArea`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "修改成功");
        this.getAreaPer();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
</style>
