<!--
 * @Author:订单审批
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-29 17:50:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="order_list approval" v-loading="loading">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单系统</el-breadcrumb-item>
      <el-breadcrumb-item>合同列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="order_list_message" v-if="!myDepHide">
      <div>
        <!-- 待审批数量：<b>{{ totle }}</b> 条 -->
      </div>
      <div class="order_list_message_dep">
        <div class="input_label" style="width:85px;margin-right:25px">
          <el-checkbox v-model="showMe" @change="showMeClick">查看自己</el-checkbox>
        </div>
        <div class="input_label select_dep" style="width:350px">
          <span class="input_label_title">部门</span>
          <el-cascader size="mini" ref="cascader" v-model="deptIds" :props="listProps" :options="depListOptions" :show-all-levels="true" @change="tableListChange"></el-cascader>
        </div>
        <!-- <div class="input_label" style="width:250px;margin-right:25px">
          <span class="input_label_title">人员</span>
          <el-select v-model="people" size="mini" placeholder="请选择" @change="getPeople">
            <el-option v-for="item in peopleList" :key="item.value" :label="item.realName" :value="item.userId"> </el-option>
          </el-select>
        </div> -->
        <div class="input_label" style="width:80px;margin-right:25px">
          <el-button type="primary" size="mini" @click="celarAll">清空搜索</el-button>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="order_list_list table_list_style">
      <el-table :data="arrOrderList" stripe style="width: 100%" :header-cell-style="table_heard_style">
        <el-table-column prop="orderId" align="center" label="订单编号" min-width="80">
          <template slot-scope="scope">
            <span @click="gotoShowOrder(scope.row.id)">{{ scope.row.orderId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contractCode" align="center" label="合同编号" min-width="160"></el-table-column>
        <el-table-column prop="skuName" align="center" label="服务名称" min-width="160"></el-table-column>
        <el-table-column prop="companyName" align="center" label="企业名称" min-width="100"></el-table-column>
        <el-table-column prop="contactName" align="center" label="联系人" min-width="100"></el-table-column>
        <el-table-column :formatter="formatPrice" prop="contractPrice" align="center" label="价格(元)" min-width="100"></el-table-column>
        <el-table-column :formatter="formatPrice" prop="orgPrice" align="center" label="标准价(元)" min-width="130"></el-table-column>
        <el-table-column :formatter="formatPriceLow" prop="spreadPrice" align="center" label="差额(元)" min-width="100"> </el-table-column>
        <el-table-column prop="depName" align="center" label="合同状态" min-width="100">
          <template slot-scope="scope">
            <p v-if="scope.row.status != 2">{{ scope.row.status | statusType }}</p>
            <el-tooltip v-else class="item" effect="dark" placement="top-start">
              <div slot="content">{{ scope.row.remark }}</div>
              <p>{{ scope.row.status | statusType }}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="depName" align="center" label="所在部门" min-width="100"></el-table-column>
        <el-table-column prop="ownName" align="center" label="发起人" min-width="100"></el-table-column>
        <el-table-column prop="addTime" align="center" label="发起时间" min-width="100"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="200" class="table_btn">
          <template slot-scope="scope">
            <el-button v-if="isApproved && userName != scope.row.ownName" size="small" plain type="primary" @click="approval(scope.row)">快速审批</el-button>
            <el-button size="small" plain type="success" @click="gotoShow(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages">
      <p></p>
      <el-pagination background layout="total,prev, pager, next" :page-size="pageSize" :total="totle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
    </div>

    <el-dialog :title="titleType" :visible.sync="typeFormVisible" width="40%" :before-close="closeDialog">
      <el-form class="approval_input" label-position="right" :inline="true" ref="editFormType">
        <el-form-item label="审批意见">
          <el-input size="small" type="textarea" maxlength="100" show-word-limit rows="3" resize="none" v-model="message" auto-complete="off" placeholder="请输入审批意见"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="danger" @click="submitFormType(0)">不同意</el-button>
        <el-button size="small" type="primary" @click="submitFormType(1)">同意</el-button>
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
      myDepHide: false,
      isApproved: false,
      //部门管理员信息
      deManagerId: this.getDataStorge("userMessage").manageDepId || "",
      //登录信息
      userName: this.getDataStorge("userMessage").realName || "",
      showMe: false,
      isMyself: 0,
      loading: false,
      listProps: {
        value: "depId",
        label: "name",
        children: "children",
        checkStrictly: true,
        expandTrigger: "click",
      },
      //分页
      totle: 0,
      page: 0,
      pageSize: 10,
      arrOrderList: [],
      /* 部门 */
      deptIds: [],
      deptId: "",
      depListOptions: [],
      peopleList: [],
      people: "",

      /* 弹框 */
      orderId: "",
      contractId: "",
      message: "",
      titleType: "快速审批确认",
      typeFormVisible: false,
    };
  },
  computed: {
    //获取城市
  },
  watch: {
    // showMe(val) {
    //   console.log(val);
    //   val ? (this.isMyself = 1) : (this.isMyself = 0);
    //   this.getList();
    // },
  },
  created() {},
  mounted() {
    //是否为审批人
    this.getPeopleMessage();
    this.getUserDepList();
    // this.getDepList();
    // this.getList();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  filters: {
    statusType(data) {
      console.log(data);
      let _type = {
        2: "未通过",
        100: "待审核",
        101: "通过",
      };

      return _type[data];
    },
  },
  methods: {
    /*列表过滤*/
    formatDate(row, column) {
      let _data = row.addTime ? row.addTime.split(" ")[0] : "";
      return _data;
    },
    formatSubtr(row) {
      return row.orgPrice - row.orgPrice || "";
    },
    formatPrice(row, column, cellValue) {
      return cellValue < 0 ? "面议" : cellValue / 100;
    },
    formatPriceLow(row, column, cellValue) {
      return cellValue / 100;
    },
    /* 页面 */

    tableListChange(data) {
      console.log(data);
      this.isMyself = 0;
      this.showMe = false;
      this.deptId = data.slice(-1);
      this.getList();
      // this.getPeoList(this.deptId);
      // this.$refs.cascader.dropDownVisible = false;
    },
    getPeople(data) {
      console.log(data);
      this.people = data;
      this.getList();
    },
    celarAll() {
      this.people = "";
      this.deptId = "";
      this.deptIds = [];
      this.getList();
    },
    //只看自己
    showMeClick(data) {
      this.deptId = "";
      this.deptIds = [];
      data ? (this.isMyself = 1) : (this.isMyself = 0);
      this.getList();
    },
    //审批
    approval(data) {
      console.log(data);
      this.contractId = data.contractId;
      this.orderId = data.orderId;
      this.typeFormVisible = true;
    },
    //查看合同详情
    gotoShow(data) {
      console.log(data);
      this.pushParams({ id: data.contractId, type: "shen", isShow: this.isApproved });
      this.$router.push({ path: "/order/show" });
    },
    //查看订单详情
    gotoShowOrder(data) {
      console.log(data);
      // this.pushParams({ id: data.id, type: "order" });
      // this.$router.push({ path: "/order/show" });
    },
    // 分页
    selectPages(val) {
      this.page = parseInt(val - 1);
      this.getList();
    },
    /* 弹框 */
    closeDialog() {
      this.typeFormVisible = false;
      this.message = "";
      this.contractId = "";
      this.$refs.editFormType.resetFields();
    },
    submitFormType(val) {
      if (val) {
        console.log(this.contractId);
        this.psssOrder(this.contractId, 1, this.message);
      } else {
        if (this.message == "") {
          this.showMessage("error", "输入内容不能为空");
          return false;
        } else {
          this.psssOrder(this.contractId, 2, this.message);
        }
      }

      this.closeDialog();
    },
    /* 接口 */
    //获取审核列表
    getList() {
      this.loading = true;
      let that = this;
      setTimeout(() => {
        this.Axios.get(`order-api/orderlist/check/contract/list?pageNum=${that.page}&pageSize=${that.pageSize}&isMyself=${that.isMyself}&deptId=${that.deptId}`).then((_resp) => {
          this.loading = false;
          console.log(_resp.data.result);
          this.arrOrderList = _resp.data.result;
          this.totle = _resp.data.total;
        });
      }, 1000);

      // this.arrOrderList = [];
    },
    //获取用户管理部门列表
    async getUserDepList() {
      let _resp = await this.Axios.get(`ucenter-api/admindep/tree`);
      if (_resp.data.result.length > 0) {
        this.myDepHide = false;
        this.showMe = true;
        this.isMyself = 1;
        this.depListOptions = [this.dataAssembly2(_resp.data.result[0])];
      } else {
        this.myDepHide = true;
        this.showMe = false;
        this.isMyself = 0;
      }
      this.getList();
    },
    //获取审批人信息
    async getPeopleMessage() {
      let _resp = await this.Axios.get(`order-api/orderlist/is/approval`);
      console.log(_resp.data);
      if (_resp.data.result == 1) {
        this.isApproved = true;
      } else {
        this.isApproved = false;
      }
    },
    //获取所有部门列表
    async getDepList() {
      let _resp = await this.Axios.get(`ucenter-api/departmentlist/tree`);
      this.depListOptions = [this.dataAssembly2(_resp.data.result[0])];
    },
    //获取人员列表
    async getPeoList(id) {
      let _resp = await this.Axios.get(`ucenter-api/userlist/getUserList?depId=${id}&pageNum=0&pageSize=9999&status=0`);
      this.peopleList = _resp.data.result;
    },
    //审核
    async psssOrder(id, pass, remark = "") {
      let _userId = this.getDataStorge("userMessage").userId;
      let _data = { userId: _userId, relationId: id, isAgree: pass, remark: remark };
      console.log(_data);
      // workflow-
      let _resp = await this.Axios.post(`workflow-api/approvallist/update`, _data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getList();
      }
    },

    /* 数据处理 */
    dataAssembly2(data) {
      let _data2 = JSON.parse(JSON.stringify(data)); //深拷贝
      function change2(data2) {
        Object.keys(data2).forEach((val) => {
          if (val == "children") {
            if (data2[val] == null || data2[val].length == 0) {
              delete data2[val];
              return false;
            }
            data2[val].forEach((val2) => {
              change2(val2);
            });
          }
        });
      }
      change2(_data2);
      return _data2;
    },
  },
};
</script>
<style>
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
.select_dep /deep/ .el-cascader {
  flex: 1;
}
.el-cascader-panel .el-radio {
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  top: 0px;
  right: 10px;
}
.el-cascader-node__label {
  width: 157px;
}
.el-cascader-panel .el-radio__input {
  visibility: hidden;
}
.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}
.approval_input /deep/ .el-form-item {
  display: flex;
}
.approval_input /deep/ .el-form-item .el-form-item__content {
  flex: 1;
  height: 70px;
}
</style>
