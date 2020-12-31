<!--
 * @Author: 官网配置 link
 * @Date: 2020-08-15 09:16:43
 * @LastEditTime: 2020-11-06 08:40:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage(0815)\src\pages\official\official_link\index.vue
-->

<template>
  <div class="official_link">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>官网配置</el-breadcrumb-item>
      <el-breadcrumb-item>友情链接</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="official_link_top">
      <div>
        <span style="margin-right: 10px">地区筛选:</span>
        <el-select class="select_city" v-model="selectCity" placeholder="请选择" @change="seleCity">
          <el-option key="" label="全部" value=""></el-option>
          <el-option v-for="item in options" :key="item.values" :label="item.label" :value="item.values"> </el-option>
        </el-select>
      </div>
      <div>
        <!-- <el-button type="primary" size="small" @click="add">新建友情链接</el-button> -->
      </div>
    </div>

    <el-table :data="tableData" stripe max-height="650px" style="width: 100%">
      <!-- <el-table-column prop="id" align="center" label="序号" min-width="50"></el-table-column> -->
      <!-- <el-table-column prop="pic" align="center" label="图片" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.pic" width="100" height="40" />
        </template>
      </el-table-column> -->
      <el-table-column prop="name" align="center" label="友情链接名称" min-width="170"></el-table-column>
      <el-table-column prop="isLink" align="center" label="互链状态" min-width="80">
        <template slot-scope="scope">
          <span
            v-if="scope.row.isAct == 0"
            style="
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: red;
            "
          ></span>
          <span
            v-if="scope.row.isAct == 1"
            style="
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: green;
            "
          ></span>
        </template>
      </el-table-column>
      <el-table-column prop="link" align="center" label="链接" min-width="150"></el-table-column>
      <el-table-column :formatter="formatCity" prop="cityId" align="center" label="地区" min-width="150"></el-table-column>
      <!-- <el-table-column prop="description" align="center" label="描述" min-width="150"></el-table-column> -->
      <el-table-column prop="time" align="center" label="显示状态" min-width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" disabled :active-value="2" :inactive-value="1" @click.native="handleUpdate(scope.row, scope.row.status)" @change="changeSwitch(scope.$index, scope.row)"> </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="80" fixed="right">
        <template slot-scope="scope">
          <el-button v-has="'/offcial/link-btn-delete'" @click="deleteThis(scope.row)" type="text" style="color: #f56c6c" size="small">删除</el-button>
          <el-button v-has="'/offcial/link-btn-edit'" @click="editorThis(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages">
      <p></p>
      <el-pagination background layout="total,prev, pager, next" :page-size="8" :total="totle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
    </div>

    <!-- 编辑link -->
    <el-dialog class="dialog_link" :title="title" :visible.sync="editFormVisible" width="30%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editForm4" :model="editForm" :rules="rules">
        <el-form-item label="链接名称" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="请输入链接名称"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" prop="link">
          <el-input size="small" v-model="editForm.link" auto-complete="off" placeholder="请输入链接地址"></el-input>
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
  mixins: [myMixin],
  components: {},
  props: [],
  data() {
    return {
      selectCity: 3,
      number: 0,
      totle: 0,
      tableData: [
        {
          id: 1112,
          cityId: 3,
          name: "商会内部活动banner",
          description: "商会内部活动banner第8期",
          link: "www.www.com",
          addTime: "2020-08-14",
          status: 2,
        },
      ],
      // rules表单验证
      rules: {
        name: [{ required: true, message: "请输入友情链接名称", trigger: "blur" }],
        link: [{ required: true, message: "请输入友情链接地址", trigger: "blur" }],
      },
      //弹框数据
      loading: false,
      editForm: {
        name: "",
        link: "",
      },
      title: "编辑友情链接",
      editFormVisible: false,
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
    formatCity(row, column) {
      let _resp = this.options.find((val) => {
        return val.values == row.cityId;
      });
      if (_resp) return _resp.label; //有旧数据残留 数据结构不同
    },
    /* 页面操作 */
    selectPages(val) {
      this.number = parseInt(val - 1);
      this.getList();
    },
    //选择城市
    seleCity() {
      this.getList();
    },
    async add() {
      this.title = "新建友情链接";
      this.editFormVisible = true;
      // await this.Axios.get(`kuaiban-api/links/add?name=123&cityId=3&link=www.222.com&cityId=3&description=123&status=-1`);
    },
    deleteThis(data) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delList(data.id);
        })
        .catch(() => {
          return false;
        });
    },
    editorThis(data) {
      console.log(data);
      this.title = "编辑友情链接";
      this.editFormVisible = true;
      this.editForm.name = data.name;
      this.editForm.link = data.link;
      this.id = data.id;
    },
    /* 表单操作 */
    closeDialog() {
      this.editFormVisible = false;
      this.deleteForm();
    },
    deleteForm() {
      this.editForm.name = "";
      this.editForm.link = "";
      if (this.$refs.editForm4 !== undefined) {
        this.$refs.editForm4.resetFields();
      }
    },
    submitForm() {
      this.$refs.editForm4.validate((val) => {
        if (val) {
          let data = {};
          data.name = this.editForm.name;
          data.link = this.editForm.link;
          data.id = this.id;
          this.editList(data);
        }
      });
    },
    //切换状态
    handleUpdate(data1, data) {
      //验证权限
      if (!this.verification(this.$store.state.selectBtnJurisdiction, "/kuaiban-api/links/update")) {
        this.showMessage("error", "无此权限");
        return false;
      }
      let _data = 0;
      data == 1 ? (_data = 2) : (_data = 1);
      this.$confirm("是否修改设置？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.selectType(data1.id, data1.linkId, _data, data1.name, data1.link);
        })
        .catch(() => {
          return false;
        });
    },
    // changeSwitch(id, data) {
    //   console.log(data);
    //   let _type = data.status;
    //   console.log(_type);
    //   this.selectType(data.id, data.linkId, _type);
    // },
    /* 接口 */
    async getList() {
      let _resp = await this.Axios.get(`kuaiban-api/links/list?pageSize=8&pageNum=${this.number}&cityId=${this.selectCity}`);
      console.log(_resp.data.result);
      this.tableData = _resp.data.result;
      this.totle = _resp.data.total;
    },
    async delList(id) {
      let _resp = await this.Axios.get(`kuaiban-api/links/delete?id=${id}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getList();
      } else {
        this.showMessage("error", "操作失败");
      }
    },
    async editList(data) {
      let _resp = await this.Axios.get(`kuaiban-api/links/update`, data);
      console.log(_resp.data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getList();
        this.closeDialog();
      } else {
        this.showMessage("error", "操作失败");
      }
    },
    //切换显示状态
    async selectType(id, linkId, status, name, link) {
      let _resp = await this.Axios.get(`kuaiban-api/links/update?id=${id}&linkId=${linkId}&status=${status}&name=${name}&link=${link}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "设置成功");
        this.getList();
      } else {
        this.showMessage("error", "操作失败");
        this.getList();
      }
    },
    // getData(data) {
    //   this.editForm.name = data.name;
    //   this.editForm.link = data.link;
    //   this.editForm.description = data.description;
    //   this.editForm.status = data.status;
    //   this.editForm.id = data.id;
    //   this.editForm.addTime = data.addTime;
    //   this.editForm.cityId = data.cityId;
    // },
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
