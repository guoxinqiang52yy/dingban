<!--
 * @Author:所属配置
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-24 13:18:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="finance_list finance_configuration">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>财务系统</el-breadcrumb-item>
      <el-breadcrumb-item>所属配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="finance_btn">
      <el-button size="small" type="primary" @click="add()">+创建合同所属</el-button>
    </div>
    <!-- 列表 -->
    <div class="finance_list_list table_list_style">
      <el-table :data="arrOrderList" stripe style="width: 100%" :header-cell-style="table_heard_style">
        <!-- <el-table-column prop="id" align="center" label="序号" min-width="100"></el-table-column> -->
        <el-table-column prop="partyName" align="center" label="所属公司名称" min-width="160"></el-table-column>
        <el-table-column prop="partyLogo" align="center" label="logo" min-width="80">
          <template slot-scope="scope">
            <img width="80" :src="scope.row.partyLogo" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="bankInfo" align="center" label="开户行" min-width="260"></el-table-column>
        <el-table-column prop="bankAccount" align="center" label="银行账号" min-width="100"></el-table-column>
        <el-table-column prop="addressInfo" align="center" label="邮寄地址" min-width="260"></el-table-column>
        <el-table-column prop="postCode" align="center" label="邮政编码" min-width="80"></el-table-column>
        <!-- <el-table-column prop="realName" align="center" label="负责人姓名" min-width="100"></el-table-column> -->
        <el-table-column prop="telephone" align="center" label="手机号码" min-width="80"></el-table-column>
        <!-- <el-table-column prop="remark" align="center" label="备注" min-width="80"></el-table-column> -->
        <el-table-column prop="realName" align="center" label="创建人" min-width="80"></el-table-column>
        <el-table-column prop="status" align="center" label="启用状态" min-width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" disabled :active-value="1" :inactive-value="0" @click.native="handleUpdate(scope.row, scope.row.status)" @change="changeSwitch(scope.$index, scope.row)"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="upadteTime" :formatter="formatDate" align="center" label="更新时间" min-width="100"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="150" class="table_btn">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="editThis(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages">
      <p></p>
      <el-pagination background layout="total,prev, pager, next" :page-size="pageSize" :total="totle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
    </div>
    <!-- 编辑弹窗 -->
    <el-dialog class="dialog_link" :title="title" :visible.sync="editFormVisible" width="30%" top="3vh" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="公司名称" prop="partyName">
          <el-input size="small" v-model="editForm.partyName" auto-complete="off" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" prop="imageUrl">
          <el-upload class="avatar-uploader" action="" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :http-request="suceessAvataruploadPic">
            <img v-if="editForm.partyLogo" :src="editForm.partyLogo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="开户行" prop="bankInfo">
          <el-input size="small" v-model="editForm.bankInfo" auto-complete="off" placeholder="请输入开户行"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="bankAccount">
          <el-input size="small" v-model="editForm.bankAccount" auto-complete="off" placeholder="请输入银行账号"></el-input>
        </el-form-item>
        <el-form-item label="邮寄地址" prop="addressInfo">
          <el-input size="small" v-model="editForm.addressInfo" auto-complete="off" placeholder="请输入邮寄地址"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="postCode">
          <el-input size="small" v-model="editForm.postCode" auto-complete="off" placeholder="请输入邮政编码"></el-input>
        </el-form-item>
        <!-- <el-form-item label="负责人姓名" prop="realName">
          <el-input size="small" v-model="editForm.realName" auto-complete="off" placeholder="请输入负责人姓名"></el-input>
        </el-form-item> -->
        <el-form-item label="手机号码" prop="telephone">
          <el-input size="small" v-model="editForm.telephone" auto-complete="off" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="remark">
          <el-input size="small" v-model="editForm.remark" auto-complete="off" placeholder="请输入备注"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="创建人" prop="name">
          <el-input size="small" v-model="editForm.bankNum" auto-complete="off" placeholder="请输入链接名称"></el-input>
        </el-form-item> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm">提交</el-button>
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
      //弹窗
      id: "",
      isAddOrEdit: 1,
      title: "新建合同属性",
      editFormVisible: false,
      editForm: {
        partyName: "",
        partyLogo: "",
        bankInfo: "",
        bankAccount: "",
        addressInfo: "",
        postCode: "",
        // realName: "",
        telephone: "",
        // remark: "",
      },
      loading: false,
      rules: {
        partyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
          { min: 1, max: 50, message: "字数应在1-50字之内" },
        ],
        partyLogo: [{ required: true, message: "请输入LOGO", trigger: "blur" }],
        bankInfo: [{ required: true, message: "请输入开户行", trigger: "blur" }],
        bankAccount: [
          { required: true, message: "请输入银行账号", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "只能输入数字" },
        ],
        addressInfo: [
          { required: true, message: "请输入邮寄地址", trigger: "blur" },
          { min: 1, max: 100, message: "字数应在1-100字之内" },
        ],
        postCode: [
          { required: true, message: "请输入邮政编码", trigger: "blur" },
          { min: 1, max: 6, message: "字数应在1-6字之内" },
          { pattern: /^[0-9]*$/, message: "只能输入数字" },
        ],
        // realName: [{ required: true, message: "请输入负责人姓名", trigger: "blur" }],
        // remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
        telephone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            message: "请输入正确的手机号",
          },
        ],
      },
      //分页
      totle: 0,
      page: 0,
      pageSize: 10,
      arrOrderList: [],
    };
  },
  computed: {
    //获取城市
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
    /*列表过滤*/
    formatDate(row, column) {
      if (row.upadteTime) return row.upadteTime.split(" ")[0];
    },
    formatCity(row, column) {
      let _Da = this.$store.state.cityList;
      console.log(_Da);
      console.log(row.areaId);
      let _resp = _Da.find((val) => {
        return val.values == row.areaId;
      });
      if (_resp) return _resp.label; //有旧数据残留 数据结构不同
    },
    /* 页面 */
    add() {
      this.title = "新建合同属性";
      this.isAddOrEdit = 1;
      this.editFormVisible = true;
      this.clearInput();
    },
    editThis(data) {
      this.isAddOrEdit = 0;
      this.clearInput();
      this.id = data.id;
      // this.editForm = data;
      this.copyData(this.editForm, data);
      this.editFormVisible = true;
      console.log(this.editForm);
    },
    clearInput() {
      this.editForm = {
        partyName: "",
        partyLogo: "",
        bankInfo: "",
        bankAccount: "",
        addressInfo: "",
        postCode: "",
        // realName: "",
        telephone: "",
        // remark: "",
      };
      if (this.$refs.editForm) this.$refs.editForm.resetFields();
    },
    // 分页
    selectPages(val) {
      this.page = parseInt(val - 1);
      this.getList();
    },
    gotoTemplate(type, val) {
      // this.pushParams({ type: type, val: val });
      // console.log({ type: type, val: val });
      // this.$router.push({ name: "创建模板" });
    },
    //切换状态
    handleUpdate(data1, data) {
      //验证权限
      // if (!this.verification(this.$store.state.selectBtnJurisdiction, "/kuaiban-api/links/update")) {
      //   this.showMessage("error", "无此权限");
      //   return false;
      // }
      let _data = 0;
      data == 1 ? (_data = 0) : (_data = 1);
      this.$confirm("是否修改启用状态？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.selectType(data1.id, _data);
      });
    },
    /* 弹窗 */
    closeDialog() {
      this.editFormVisible = false;
      this.clearInput();
    },
    submitForm() {
      this.$refs.editForm.validate((val) => {
        if (!val) {
          this.showMessage("error", "输入内容 不能为空");
        } else {
          if (this.isAddOrEdit == 1) {
            console.log(this.editForm);
            this.addList(this.editForm);
          } else {
            let _data = JSON.parse(JSON.stringify(this.editForm));
            _data.id = this.id;
            console.log(_data);
            this.updList(_data);
          }
        }
      });
    },
    //获取图片
    getPicture(dat) {
      this.editForm.partyLogo = `http://applet-second.oss-cn-qingdao.aliyuncs.com/` + dat;
    },
    /* 接口 */
    async getList() {
      let _resp = await this.Axios.get(`order-api/secondparty/query?pageNum=${this.page}&pageSize=${this.pageSize}`);
      this.totle = _resp.data.total;
      this.arrOrderList = _resp.data.result;
      console.log(_resp.data.result);
    },
    async addList(data) {
      let _resp = await this.Axios.post(`order-api/secondparty/add`, data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.closeDialog();
        this.getList();
        // this.listBanner();
      }
    },
    async updList(data) {
      let _resp = await this.Axios.post(`order-api/secondparty/update`, data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "编辑成功");
        this.closeDialog();
        this.getList();
        // this.listBanner();
      }
    },
    async selectType(data1, data2) {
      let _resp = await this.Axios.post(`order-api/secondparty/update`, { id: data1, status: data2 });
      if (_resp.data.code == 0) {
        this.showMessage("success", "修改成功");
        this.getList();
        // this.listBanner();
      }
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
.finance_list_list /deep/ .el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}
.finance_list_list /deep/ .el-switch.is-disabled {
  opacity: 1;
}
.finance_list_list /deep/ .el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}
.pages {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/* 弹框 */
.dialog_link /deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.dialog_link /deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.dialog_link /deep/ .avatar-uploader .el-upload > img {
  width: 80px;
  height: 80px;
}
.dialog_link /deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.dialog_link /deep/ .el-form-item__label {
  width: 100px !important;
}
</style>
