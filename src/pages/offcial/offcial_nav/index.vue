<!--
 * @Author: 官网配置 导航
 * @Date: 2020-08-15 09:16:43
 * @LastEditTime: 2020-10-26 20:13:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage(0815)\src\pages\official\official_nav\index.vue
-->

<template>
  <div class="official_nav">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>官网配置</el-breadcrumb-item>
      <el-breadcrumb-item>导航</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="official_nav_top">
      <div>
        <!-- <span style="margin-right:10px">地区筛选:</span>
        <el-select class="select_city" v-model="selectCity" placeholder="请选择" @change="seleCity">
          <el-option v-for="item in options" :key="item.values" :label="item.label" :value="item.values"> </el-option>
        </el-select> -->
      </div>
      <div>
        <el-button v-has="'/offcial/nav-btn-add'" type="primary" size="small" @click="add">新建导航链接</el-button>
      </div>
    </div>

    <el-table :data="tableData" stripe max-height="550" style="width: 100%">
      <!-- <el-table-column prop="id" align="center" label="序号" min-width="50"></el-table-column> -->
      <!-- <el-table-column prop="pic" align="center" label="图片" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.pic" width="100" height="40" />
        </template>
      </el-table-column> -->
      <el-table-column prop="name" align="center" label="菜单名称" min-width="170"></el-table-column>

      <el-table-column prop="description" align="center" label="描述" min-width="150"></el-table-column>
      <el-table-column prop="url" align="center" label="链接" min-width="150"></el-table-column>
      <el-table-column :formatter="formatDate" prop="addTime" align="center" label="创建时间" min-width="150"></el-table-column>
      <el-table-column align="center" label="操作" min-width="80" fixed="right">
        <template slot-scope="scope">
          <el-button v-has="'/offcial/nav-btn-delete'" @click="deleteThis(scope.row)" type="text" style="color:#f56c6c;" size="small">删除</el-button>
          <el-button v-has="'/offcial/nav-btn-edit'" @click="editorThis(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑nav -->
    <el-dialog class="dialog_nav" :title="title" :visible.sync="editFormVisibleNav" width="30%" @close="closeDialog('editFormNav')">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editFormNav" :model="editForm" :rules="rules">
        <el-form-item label="导航名称" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="请输入导航名称"></el-input>
        </el-form-item>
        <el-form-item label="导航地址" prop="link">
          <el-input size="small" v-model="editForm.link" auto-complete="off" placeholder="请输入导航地址"></el-input>
        </el-form-item>
        <el-form-item label="导航描述" prop="desc">
          <el-input size="small" v-model="editForm.desc" auto-complete="off" placeholder="请输入导航描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myMixin from "../../../assets/js/minx/minx";
export default {
  name: "",
  components: {},
  mixins: [myMixin],
  props: [],
  data() {
    return {
      selectCity: "",
      tableData: [],
      // rules表单验证
      rules: {
        name: [{ required: true, message: "请输入导航名称", trigger: "blur" }],
        link: [{ required: true, message: "请输入导航地址", trigger: "blur" }],
        desc: [{ required: true, message: "请输入导航描述", trigger: "blur" }],
      },
      //弹框数据
      loading: false,
      editForm: {
        name: "",
        link: "",
        desc: "",
      },
      title: "编辑导航链接",
      addOrEdit: 1, //添加1 & 编辑2
      editFormVisibleNav: false,
      //编辑数据对象
      updataData: {},
    };
  },
  computed: {
    //获取城市
    options() {
      return this.$store.state.cityList;
    },
  },
  watch: {},
  created() {},
  mounted() {
  
    this.getList();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 列表格式化 */
    formatDate(row, column) {
      return row.addTime.split(" ")[0];
    },
    formatCity(row, column) {
      let _resp = this.options.find((val) => {
        return (val.value == row.areaId);
      });
      if (_resp) return _resp.label; //有旧数据残留 数据结构不同
    },
    /* 页面操作 */
    seleCity() {},
    add() {
      this.title = "新建导航链接";
      this.editFormVisibleNav = true;
      this.addOrEdit = 1;
      this.deleteForm();
    },
    editorThis(data) {
      console.log(data);
      this.updataData = data;
      this.title = "编辑导航链接";
      this.editFormVisibleNav = true;
      this.addOrEdit = 2;
      this.editForm.name = data.name;
      this.editForm.link = data.url;
      this.editForm.desc = data.description;
    },
    deleteThis(data) {
      console.log(data);
      this.$confirm("是否删除此节点？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delNav(data.id);
        })
        .catch(() => {
          return false;
        });
    },
    /*表单操作*/
    closeDialog() {
      this.editFormVisibleNav = false;
      this.deleteForm();
    },
    //清除表单
    deleteForm() {
      this.updataData = {};
      this.$nextTick(() => {
        this.editForm.name = "";
        this.editForm.link = "";
        this.editForm.desc = "";
      });
      console.log(this.editForm);
    },
    submitForm() {
      this.$refs.editFormNav.validate((val) => {
        if (val) {
          if (this.addOrEdit == 1) {
            console.log("新建");
            let _data = {};
            _data.name = this.editForm.name;
            _data.description = this.editForm.desc;
            _data.parentId = 0;
            _data.type = 1;
            _data.url = this.editForm.link;
            _data.sortNum = 1;
            _data.status = 1;
            this.addNav(_data);
          }
          if (this.addOrEdit == 2) {
            this.updataData.name = this.editForm.name;
            this.updataData.url = this.editForm.link;
            this.updataData.description = this.editForm.desc;
            this.editorNav(this.updataData);
          }
        } else {
          this.showMessage("success", "所填内容不能为空");
        }
      });
    },
    /* 接口 */
    async getList() {
      let _resp = await this.Axios.get(`kuaiban-api/menuopt/list`);
      console.log(_resp.data.result);
      this.tableData = _resp.data.result;
    },
    async addNav(data) {
      let _resp = await this.Axios.post(`kuaiban-api/menuopt/add`, data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getList();
      } else {
        this.showMessage("error", "操作失败");
        this.getList();
      }
      this.editFormVisibleNav = false;
    },
    async delNav(id) {
      let _resp = await this.Axios.get(`kuaiban-api/menuopt/delete?id=${id}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getList();
      } else {
        this.showMessage("error", "操作失败");
        this.getList();
      }
    },
    async editorNav(data) {
      let _resp = await this.Axios.get(`kuaiban-api/menuopt/update`, data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getList();
        this.editFormVisibleNav = false;
      } else {
        this.showMessage("error", "操作失败");
        this.getList();
        this.editFormVisibleNav = false;
      }
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
.dialog_nav /deep/ .el-form-item__content {
  width: 300px;
}
</style>
