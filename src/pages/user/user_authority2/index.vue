<!--
 * @Author:  系统页面&按钮
 * @Date: 2020-08-14 14:53:16
 * @LastEditTime: 2020-12-19 10:13:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\user\uesr_org\index.vue
-->

<template>
  <div class="uesr_addr">
    <!-- 面包屑导航 -->
    <div class="autho2_title">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>用户中心</el-breadcrumb-item>
        <el-breadcrumb-item>系统权限</el-breadcrumb-item>
        <el-breadcrumb-item>页面权限</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="btn_back" type="primary" size="mini" @click="goback">返回</el-button>
    </div>

    <div class="top_line"></div>
    <article class="uesr_addr_list ">
      <div class="title2">
        <span class="title2_span">页面权限</span>
        <el-button class="btn_add" type="primary" size="mini" @click="addPage">添加页面</el-button>
      </div>
      <!-- 页面列表 -->
      <el-table :data="pageList" max-height="300" style="width: 100%" highlight-current-row @row-click="getButton">
        <!-- <el-table-column prop="id" align="center" label="序号" min-width="80"></el-table-column> -->
        <el-table-column prop="name" align="center" label="系统名称" min-width="100"></el-table-column>
        <el-table-column :formatter="formatPageType" prop="sysType" align="center" label="系统类型" min-width="80"></el-table-column>
        <el-table-column prop="describe" align="center" label="系统描述" min-width="150"></el-table-column>
        <el-table-column prop="path" align="center" label="权限路径" min-width="100"></el-table-column>
        <el-table-column prop="mark" align="center" label="系统路径"></el-table-column>
        <el-table-column prop="time" align="center" label="显示状态" min-width="150">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" disabled :active-value="0" :inactive-value="1" @click.native="handleUpdate(scope.row, scope.row.status)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="180" fixed="right">
          <template slot-scope="scope">
            <el-button @click="editorPage(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="addButton(scope.row)" type="text" size="small">添加按钮</el-button>
            <!-- <el-button @click="getButton(scope.row)" type="text" size="small">查看按钮</el-button> -->
            <el-button @click="delePage(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages">
        <p></p>
        <el-pagination background layout="prev, pager, next" :page-size="pageSize1" :total="totle1" @next-click="selectPages1" @prev-click="selectPages1" @current-change="selectPages1"> </el-pagination>
      </div>
    </article>

    <!-- 按钮列表 -->
    <article class="uesr_addr_list addbutton">
      <div class="title2">
        <span class="title2_span">按钮权限</span>
        <!-- <el-button type="primary" size="small" @click="addPage">添加按钮</el-button> -->
      </div>
      <el-table :data="butList" stripe max-height="300" style="width: 100%">
        <!-- <el-table-column prop="id" align="center" label="序号" min-width="80"></el-table-column> -->
        <el-table-column prop="name" align="center" label="系统名称" min-width="100"></el-table-column>
        <el-table-column :formatter="formatBtuType" prop="sysType" align="center" label="系统类型" min-width="80"></el-table-column>
        <el-table-column prop="describe" align="center" label="系统描述" min-width="150"></el-table-column>
        <el-table-column prop="path" align="center" label="权限路径" min-width="110"></el-table-column>
        <el-table-column prop="mark" align="center" label="按钮路径" min-width="110"></el-table-column>
        <!-- <el-table-column prop="areaId" align="center" label="系统路径" :formatter="formatCity"></el-table-column> -->
        <el-table-column align="center" label="操作" min-width="180" fixed="right">
          <template slot-scope="scope">
            <el-button @click="editorBtn(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleBtn(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages">
        <p></p>
        <el-pagination background layout="prev, pager, next" :page-size="pageSize3" :total="totle3" @next-click="selectPages3" @prev-click="selectPages3" @current-change="selectPages3"> </el-pagination>
      </div>
    </article>

    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" :close-on-click-modal="false" width="30%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="权限名称" prop="sysName">
          <el-input size="small" v-model="editForm.sysName" auto-complete="off" placeholder="请输入权限名称"></el-input>
        </el-form-item>
        <el-form-item label="权限路径" prop="sysPath">
          <el-input size="small" v-model="editForm.sysPath" auto-complete="off" placeholder="请输入权限路径"></el-input>
        </el-form-item>
        <el-form-item label="权限类型" prop="sysType">
          <el-select :disabled="true" size="small" v-model="editForm.sysType" filterable placeholder="请选择权限类型" @change="selectUsr">
            <el-option v-for="(item, index) in typeList" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限描述" prop="sysdesc">
          <el-input size="small" v-model="editForm.sysdesc" auto-complete="off" placeholder="请输入权限描述"></el-input>
        </el-form-item>
        <el-form-item label="权限标记" prop="sysMark">
          <el-input size="small" v-model="editForm.sysMark" auto-complete="off" placeholder="请输入权限标记"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myMixin from "../../../assets/js/minx/minx";
import axios from "axios";
export default {
  name: "系统创建(二级页)",
  components: {},
  mixins: [myMixin],
  props: [],
  data() {
    return {
      //跳转
      parentId: "",
      parentName: "",
      pageId: 0,
      btnId: 0,
      page1: 0,
      pageSize1: 15,
      totle1: 0,
      page3: 0,
      pageSize3: 15,
      totle3: 0,
      //添加 &编辑
      isAddOrEdit: 1, //1 3页面&按钮添加   2 4页面&按钮编辑
      //用户列表
      typeList: [
        { typeName: "系统", typeId: 0 },
        { typeName: "页面", typeId: 1 },
        { typeName: "菜单", typeId: 2 },
        { typeName: "按钮", typeId: 3 },
      ],
      pageList: [],
      butList: [],
      //弹框内容
      loading: false, //是显示加载
      title: "添加地区管理员",
      editFormVisible: false, //控制编辑页面显示与隐藏
      editForm: {
        sysName: "",
        sysPath: "",
        sysType: "",
        sysdesc: "",
        sysMark: "",
      },
      // rules表单验证
      rules: {
        sysName: [{ required: true, message: "请添加系统名称", trigger: "blur" }],
        sysPath: [{ required: true, message: "请添加系统路径", trigger: "blur" }],
        // sysType: [{ required: true, message: "请选择系统类型", trigger: "change" }],
        sysdesc: [{ required: true, message: "请添加系统描述", trigger: "blur" }],
        sysMark: [{ required: true, message: "请添加权限标记", trigger: "blur" }],
      },
      //编辑数据
      tempData: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.parentId = JSON.parse(sessionStorage.getItem("parent")).powerId || "";
    this.parentName = JSON.parse(sessionStorage.getItem("parent")).name || "";
    // if (!!this.$route.params.alert) {
    //   sessionStorage.setItem("parent", JSON.stringify(this.$route.params.alert));
    //   this.parentId = this.$route.params.alert.powerId;
    //   this.parentName = this.$route.params.alert.name;
    // } else {
    //   this.parentId = JSON.parse(sessionStorage.getItem("parent")).powerId || "";
    //   this.parentName = JSON.parse(sessionStorage.getItem("parent")).name || "";
    // }
    console.log(this.parentId);
    this.getSysPageList();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /*列表过滤*/
    formatPageType(row, column) {
      if (row.type == 1) return "页面";
    },
    formatBtuType(row, column) {
      if (row.type == 3) return "按钮";
    },

    /* 页面*/
    //返回
    goback() {
      this.$router.push({ name: "系统创建" });
    },
    //添加页面
    addPage() {
      this.isAddOrEdit = 1;
      this.editForm.sysType = 1;
      this.editFormVisible = true;
      this.title = `添加 ${this.parentName} 的页面权限`;
    },
    //添加按钮
    addButton(data) {
      this.isAddOrEdit = 3;
      this.editForm.sysType = 3;
      this.editFormVisible = true;
      this.pageId = data.powerId;
      this.title = `添加 ${data.name} 的按钮权限`;
    },
    //获取按钮权限
    getButton(data) {
      console.log(data);
      this.page3 = 0;
      this.pageId = data.powerId;
      this.getSysBtnList();
    },
    //编辑
    editorPage(data) {
      console.log(data);
      this.isAddOrEdit = 2;
      this.title = `编辑 ${data.name}`;
      this.tempData = data;
      this.editFormVisible = true;
      this.editForm.sysName = data.name;
      this.editForm.sysPath = data.path;
      this.editForm.sysType = data.type;
      this.editForm.sysdesc = data.describe;
      this.editForm.sysMark = data.mark;

      // this.$router.push({ path: "/user/authority2" });
    },
    //删除页面
    delePage(d) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delPageList(d.id);
        })
        .catch(() => {});
    },
    //编辑按钮
    editorBtn(data) {
      console.log(data);
      this.isAddOrEdit = 4;
      this.title = `编辑 ${data.name}`;
      this.tempData = data;
      this.editFormVisible = true;
      this.editForm.sysName = data.name;
      this.editForm.sysPath = data.path;
      this.editForm.sysType = data.type;
      this.editForm.sysdesc = data.describe;
      this.editForm.sysMark = data.mark;
    },
    //删除按钮
    deleBtn(d) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delBtnList(d.id);
        })
        .catch(() => {});
    },
    //提交表单
    submitForm() {
      this.$refs.editForm.validate((val) => {
        if (val) {
          //页面添加
          if (this.isAddOrEdit == 1) {
            let data = {
              parentId: this.parentId,
              name: this.editForm.sysName,
              describe: this.editForm.sysdesc,
              path: this.editForm.sysPath,
              mark: this.editForm.sysMark,
              type: this.editForm.sysType,
            };
            console.log(data);
            this.addSysPageList(data);
          }
          //按钮添加
          if (this.isAddOrEdit == 3) {
            let data = {
              parentId: this.pageId,
              name: this.editForm.sysName,
              describe: this.editForm.sysdesc,
              path: this.editForm.sysPath,
              mark: this.editForm.sysMark,
              type: this.editForm.sysType,
            };
            console.log(data);
            this.addSysBtnList(data);
          }
          //编辑页面
          if (this.isAddOrEdit == 2) {
            let data = {
              id: this.tempData.id,
              name: this.editForm.sysName,
              describe: this.editForm.sysdesc,
              path: this.editForm.sysPath,
              mark: this.editForm.sysMark,
            };
            console.log(data);
            this.editSysPageList(data);
          }
          //编辑按钮
          if (this.isAddOrEdit == 4) {
            let data = {
              id: this.tempData.id,
              name: this.editForm.sysName,
              describe: this.editForm.sysdesc,
              path: this.editForm.sysPath,
              mark: this.editForm.sysMark,
            };
            console.log(data);
            this.editSysBtnList(data);
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
      this.editForm.sysName = "";
      this.editForm.sysPath = "";
      this.editForm.sysType = "";
      this.editForm.sysdesc = "";
      this.editForm.sysMark = "";
    },
    //页面分页
    selectPages1(val) {
      this.page1 = parseInt(val - 1);
      this.getSysPageList();
    },
    //按钮分页
    selectPages3(val) {
      this.page3 = parseInt(val - 1);
      this.getSysBtnList();
    },
    //切换状态
    handleUpdate(data1, data) {
      let _data = "";
      console.log(data1);
      this.$confirm("是否修改设置？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          data == 0 ? (_data = 1) : (_data = 0);
          console.log(data);
          this.selectType(data1.id, data1.powerId, _data);
        })
        .catch(() => {
          return false;
        });
    },
    /* 接口 */
    //获取页面列表
    async getSysPageList() {
      let resp = await this.Axios.get(`ucenter-api/powerlist/queryAll?parentId=${this.parentId}&pageNum=${this.page1}&pageSize=${this.pageSize1}`);
      console.log(resp.data.result);
      this.pageList = resp.data.result;
      this.totle1 = resp.data.total;
    },
    //获取按钮列表
    async getSysBtnList() {
      let resp = await this.Axios.get(`ucenter-api/powerlist/queryAll?parentId=${this.pageId}&pageNum=${this.page3}&pageSize=${this.pageSize3}`);
      console.log(resp.data.result);
      this.butList = resp.data.result;
      this.totle3 = resp.data.total;
    },
    //添加页面
    async addSysPageList(data) {
      let typeList = await this.Axios.post(`ucenter-api/powerlist/add`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.getSysPageList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
    //添加按钮
    async addSysBtnList(data) {
      let typeList = await this.Axios.post(`ucenter-api/powerlist/add`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.getSysBtnList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
    //编辑页面
    async editSysPageList(data) {
      let typeList = await this.Axios.post(`ucenter-api/powerlist/update`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.getSysPageList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
    //编辑按钮
    async editSysBtnList(data) {
      let typeList = await this.Axios.post(`ucenter-api/powerlist/update`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "修改成功");
        this.getSysBtnList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
    //删除页面
    async delPageList(id) {
      let typeList = await this.Axios.get(`ucenter-api/powerlist/delete?id=${id}`);
      if (typeList.data.code == 0) {
        this.showMessage("success", "删除成功");
        this.getSysPageList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
    },
    //删除按钮
    async delBtnList(id) {
      let typeList = await this.Axios.get(`ucenter-api/powerlist/delete?id=${id}`);
      if (typeList.data.code == 0) {
        this.showMessage("success", "删除成功");
        this.getSysBtnList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
    },
    //状态转换
    async selectType(id, powerid, status) {
      let _resp = await this.Axios.post(`ucenter-api/powerlist/updateStatus?id=${id}&powerId=${powerid}&status=${status}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "修改成功");
        this.getSysPageList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
.uesr_addr_list /deep/ .el-switch.is-disabled {
  opacity: 1;
}
.uesr_addr_list /deep/ .el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}
</style>
