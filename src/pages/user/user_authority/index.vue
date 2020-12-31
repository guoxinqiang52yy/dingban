<!--
 * @Author:  系统创建
 * @Date: 2020-08-14 14:53:16
 * @LastEditTime: 2020-12-03 19:51:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\user\uesr_org\index.vue
-->
<template>
  <div class="uesr_addr">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item>系统创建</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <article class="uesr_addr_list">
      <div class="add_button">
        <el-button v-has="'/user/authority-btn-add'" type="primary" size="small" @click="add">创建系统</el-button>
      </div>
      <div class="table_list">
        <el-table class="table_list_list" :data="tableData" stripe style="width: 100%">
          <!-- <el-table-column prop="id" align="center" label="序号" min-width="80"></el-table-column> -->
          <el-table-column prop="name" align="center" label="系统名称" min-width="100"></el-table-column>
          <el-table-column prop="type" :formatter="formatType" align="center" label="系统类型" min-width="80"></el-table-column>
          <el-table-column prop="describe" align="center" label="系统描述" min-width="150"></el-table-column>
          <el-table-column prop="mark" align="center" label="权限标记" min-width="100"></el-table-column>
          <!-- <el-table-column prop="areaId" align="center" label="系统路径" :formatter="formatCity"></el-table-column> -->
          <el-table-column prop="time" align="center" label="显示状态" min-width="150">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" disabled :active-value="0" :inactive-value="1" @click.native="handleUpdate(scope.row, scope.row.status)" @change="changeSwitch(scope.$index, scope.row)"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button v-has="'/user/authority-btn-edit'" @click="editor(scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-has="'/user/authority-btn-edit'" @click="goto(scope.row)" type="text" size="small">页面配置</el-button>
              <el-button v-has="'/user/authority-btn-del'" @click="dele(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pages">
        <p></p>
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="totle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
      </div>
    </article>

    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="系统名称" prop="sysName">
          <el-input size="small" v-model="editForm.sysName" auto-complete="off" placeholder="请输入系统名称"></el-input>
        </el-form-item>
        <el-form-item label="系统路径" prop="sysPath">
          <el-input :disabled="isAddOrEdit == 2" size="small" v-model="editForm.sysPath" auto-complete="off" placeholder="请输入工号"></el-input>
        </el-form-item>
        <!-- <el-form-item label="系统类型" prop="sysType">
					<el-select size="small" v-model="editForm.sysType" filterable placeholder="请选择" @change="selectUsr">
						<el-option v-for="(item, index) in typeList" :key="index" :label="item.typeName" :value="item.typeId"></el-option>
					</el-select>
				</el-form-item> -->
        <el-form-item label="系统描述" prop="sysdesc">
          <el-input size="small" v-model="editForm.sysdesc" auto-complete="off" placeholder="请输入系统描述"></el-input>
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
      //编辑禁止修改
      //用户列表
      typeList: [
        { typeName: "系统", typeId: 0 },
        { typeName: "页面", typeId: 1 },
        { typeName: "按钮", typeId: 2 },
      ],
      tableData: [
        {
          sysName: "名称",
          sysType: "页面",
          sysDesc: "页面描述",
          sysMark: "页面标记",
        },
      ],
      //弹框内容
      loading: false, //是显示加载
      title: "添加地区管理员",
      editFormVisible: false, //控制编辑页面显示与隐藏
      editForm: {
        sysName: "",
        sysPath: "",
        // sysType: "",
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
    this.getSysList();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /*列表过滤*/
    formatType(row, column) {
      if (row.type == 0) return "系统";
    },
    /* 页面*/
    //添加页面
    add() {
      this.isAddOrEdit = 1;
      this.editFormVisible = true;
      this.title = "添加系统";
    },
    //编辑
    editor(data) {
      console.log(data);
      this.isAddOrEdit = 2;
      this.title = "编辑系统";
      this.tempData = data;
      this.editFormVisible = true;
      this.editForm.sysName = data.name;
      this.editForm.sysPath = data.path;
      // this.editForm.sysType = "";
      this.editForm.sysdesc = data.describe;
      this.editForm.sysMark = data.mark;

      // this.$router.push({ path: "/user/authority2" });
    },
    dele(d) {
      console.log(d);
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delSysList(d.id);
        })
        .catch(() => {});
    },
    //跳转
    goto(data) {
      sessionStorage.setItem("parent", JSON.stringify({ powerId: data.powerId, name: data.name }));
      this.$router.push({ name: "系统创建(二级页)", params: { alert: data } });
    },
    //提交表单
    submitForm() {
      this.$refs.editForm.validate((val) => {
        if (val) {
          if (this.isAddOrEdit == 1) {
            let data = {
              parentId: 0,
              name: this.editForm.sysName,
              describe: this.editForm.sysdesc,
              path: this.editForm.sysPath,
              mark: this.editForm.sysMark,
              type: 0,
            };
            this.addSysList(data);
          } else {
            let data = {
              id: this.tempData.id,
              name: this.editForm.sysName,
              describe: this.editForm.sysdesc,
              mark: this.editForm.sysMark,
            };

            this.editSysList(data);
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
      // this.editForm.sysType = "";
      this.editForm.sysdesc = "";
      this.editForm.sysMark = "";
    },
    selectPages(val) {
      this.page = parseInt(val - 1);
      this.getSysList();
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
    //获取列表
    async getSysList() {
      let resp = await this.Axios.get(`ucenter-api/powerlist/queryAll?parentId=0&pageNum=${this.page}&pageSize=${this.pageSize}`);
      console.log(resp.data.result);
      this.tableData = resp.data.result;
      this.totle = resp.data.total;
    },
    //添加列表
    async addSysList(data) {
      let typeList = await this.Axios.post(`ucenter-api/powerlist/add`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.getSysList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
    //编辑列表
    async editSysList(data) {
      let typeList = await this.Axios.post(`ucenter-api/powerlist/update`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "修改成功");
        this.getSysList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
    //删除列表
    async delSysList(id) {
      let typeList = await this.Axios.post(`ucenter-api/powerlist/delete?id=${id}`);
      if (typeList.data.code == 0) {
        this.showMessage("success", "删除成功");
        this.getSysList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
    //状态转换
    async selectType(id, powerid, status) {
      let _resp = await this.Axios.post(`ucenter-api/powerlist/updateStatus?id=${id}&powerId=${powerid}&status=${status}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "修改成功");
        this.getSysList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
    },
  },
};
</script>
<style scoped>
@import url("./index.css");

.uesr_addr /deep/ .el-switch.is-disabled {
  opacity: 1;
}
.uesr_addr /deep/ .el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}
.uesr_addr /deep/ .el-form--inline .el-form-item {
  display: flex !important;
  width: 100%;
}
</style>
