<!--
 * @Author: 订单详情
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-30 14:42:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="order_show order_details">
    <div class="top">
      <div></div>
      <!-- <div><el-button type="primary" size="mini" @click="goBack">返回</el-button></div> -->
    </div>
    <!-- 面包屑导航 -->
    <el-breadcrumb v-if="type == 'order'" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单系统</el-breadcrumb-item>
      <el-breadcrumb-item><router-link :to="{ path: '/order/orderlist' }">订单列表</router-link> </el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="top_line"></div>
    <!-- 订单信息 -->
    <div class="order_details_order">
      <p class="order_details_order_title">
        <b>订单编号: {{ orderInfo.orderId }}</b>
      </p>

      <div class="order_details_order_content">
        <el-row class=" row_waper">
          <el-col :span="12" class=" row_col_waper">
            <span class=" row_col_span_waper">甲方名称:</span>
            <span>{{ orderInfo.companyName }}</span>
          </el-col>
          <el-col :span="12" class=" row_col_waper">
            <span class=" row_col_span_waper">邮寄地址:</span>
            <span>{{ orderInfo.postAddress }}</span>
          </el-col>
        </el-row>
        <el-row class=" row_waper">
          <el-col :span="12" class=" row_col_waper">
            <span class=" row_col_span_waper">企业负责人:</span>
            <span>{{ orderInfo.contactName }}</span>
          </el-col>
          <el-col :span="12" class=" row_col_waper">
            <span class=" row_col_span_waper"> 邮编:</span>
            <span>{{ orderInfo.postCode }}</span>
          </el-col>
        </el-row>
        <el-row class=" row_waper">
          <el-col :span="12" class=" row_col_waper">
            <span class=" row_col_span_waper"> 电话:</span>
            <span>{{ orderInfo.contactValue }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="order_details_contract">
      <div class="order_details_contract-header">
        <span v-for="(item, index) in dataList" :key="index" @click="showtThis(index + 1, item)" :class="{ span_select: selectThis == index + 1 }">{{ item.contractName }}</span>
      </div>
      <div class="order_details_contract-content">
        <div v-for="(item, index1) in dataListType" :key="Math.random() + index1">
          <template>
            <div class="order_details_contract_title">
              <el-row class=" row_waper">
                <el-col :span="12" class=" row_col_waper">
                  <span class=" row_col_span_waper">合同编号:</span>
                  <span>{{ item.contractCode }}</span>
                </el-col>
                <el-col :span="12" class=" row_col_waper">
                  <span class=" row_col_span_waper">合同状态:</span>
                  <span>{{ item.contractStatus | contractStatus }}</span>
                </el-col>
              </el-row>
              <el-row class="row_waper">
                <el-col :span="12" class=" row_col_waper">
                  <span class=" row_col_span_waper">乙方名称:</span>
                  <span>{{ item.secondName }}</span>
                </el-col>
              </el-row>
            </div>
            <div class="order_details_contract_examine">
              <p class="order_details_order_title"><b>审核状态:</b></p>
              <div class="order_details_order_examine" v-if="test">
                <el-steps :space="100" align-center :active="statusNum" :process-status="statusThis" finish-status="success">
                  <el-step :title="item.userName" v-for="(item, index) in statusLit" :key="index"></el-step>
                </el-steps>
                <p></p>
              </div>
            </div>
            <div class="contract_order_list">
              <tablelsShow v-if="item.orderStaff.length > 0" :staff="item.orderStaff" :sku="item.skuMsg"></tablelsShow>
              <tablelsShow2 v-if="item.orderTalent.length > 0" :talent="item.orderTalent"></tablelsShow2>
              <pay2 v-if="item.paymentList.length > 0" :list="item.paymentList"></pay2>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!--=====订单展示=================================== -->
    <!--=====订单展示=================================== -->
    <!--=====订单展示=================================== -->
    <!--=====订单展示=================================== -->
    <!--=====订单展示=================================== -->
    <!-- <div v-if="type == 'order'" class="order_list_content" style="display:none">
      <div class="order_list_content_box">
        <div class="order_list_tab">
          <p v-for="(item, index) in dataList" :key="index" @click="showtThis(index + 1)" :class="{ select: selectThis == index + 1 }">
            <span>{{ item.contractName }}</span> <span>{{ item.contractCode }}</span>
          </p>
        </div>
        <div v-for="(item, index1) in dataList" :key="index1 + 1">
          <template>
            
            <p class="order_list_heard">委托方(甲方)：{{ item.companyName }}</p>
            <p class="order_list_heard">邮寄地址：{{ item.postAddress }}</p>
            <p class="order_list_heard">邮编：{{ item.postCode }}</p>
            <p class="order_list_heard">企业负责人：{{ item.contactName }}</p>
            <p class="order_list_heard">电话：{{ item.contactValue }}</p>
            <p class="order_list_heard">委托方(乙方)：{{ item.secondName }}</p>
           
            <div class="order_list_show">
              <tablelsShow v-if="item.orderStaff.length > 0" :staff="item.orderStaff" :sku="item.skuMsg"></tablelsShow>
              <tablelsShow2 v-if="item.orderTalent.length > 0" :talent="item.orderTalent"></tablelsShow2>
              <pay2 v-if="item.paymentList.length > 0" :list="item.paymentList"></pay2>
            </div>
          </template>
        </div>
      </div>
    </div> -->

    <!-- 审批预览 -->
    <div v-if="type != 'order'" class="order_list_content">
      <div class="order_list_content_box">
        <div>
          <!-- <p class="order_list_title">
            合同状态： <span class="pass">{{ dataList2.contractStatus | getStatus }}</span>
          </p> -->
          <p class="order_list_heard" v-for="(item, index) in dataList2.contractApproveDetail" :key="index">{{ item.fieldName }}: {{ item.fieldValue }}</p>

          <div class="order_list_show">
            <tablelsShow v-if="dataList2.orderStaff && dataList2.orderStaff.length > 0" :staff="dataList2.orderStaff" :sku="dataList2.skuMsg"></tablelsShow>
            <tablelsShow2 v-if="dataList2.orderStaff && dataList2.orderTalent.length > 0" :talent="dataList2.orderTalent"></tablelsShow2>
            <pay2 v-if="dataList2.paymentList && dataList2.paymentList.length > 0" :list="dataList2.paymentList"></pay2>
          </div>
        </div>
      </div>
      <div class="shenpi">
        <div></div>
        <div class="shenpi_btn" v-if="!isMyOrder">
          <span><b>审批操作：</b></span>
          <el-button size="small" type="danger" @click="approval">不同意</el-button>
          <el-button size="small" type="primary" @click="passThis">同意</el-button>
        </div>
      </div>
    </div>

    <el-dialog :title="titleType" :visible.sync="typeFormVisible" width="40%" :before-close="closeDialog">
      <el-input size="small" type="textarea" maxlength="100" show-word-limit rows="5" resize="none" v-model="message" auto-complete="off" placeholder="请输入审批意见"></el-input>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="danger" @click="submitFormType(1)">取消</el-button>
        <el-button size="small" type="primary" @click="submitFormType(0)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myMixin from "../../../assets/js/minx/minx";
import pay2 from "../../../components/pay/index2.vue";
import tablelsShow from "../../../components/tablelist/index2.vue";
import tablelsShow2 from "../../../components/tablelist2/index2.vue";
export default {
  name: "",
  mixins: [myMixin],
  components: { pay2, tablelsShow, tablelsShow2 },
  props: [],
  data() {
    return {
      test: true,
      isMyOrder: true,
      type: "",
      //tab选择
      selectThis: 1,
      dataList: [],
      dataListType: [],
      dataList2: {},
      /* 弹框 */
      contractId: "",
      orderId: "",
      message: "",
      titleType: "不同意审批意见",
      typeFormVisible: false,
      orderInfo: {},
      //当前节点状态
      statusLit: [],
      statusThis: "",
      statusNum: -1,
    };
  },
  filters: {
    //获取status
    getStatus(val) {
      let _data = "";
      let s = val;
      switch (s) {
        case 1:
          _data = "下单待提交";
          break;
        case 100:
          _data = "已下单";
          break;
        case 101:
          _data = "待付款";
          break;
        case 211:
          _data = "异常";
          break;
        case 300:
          _data = "已结清";
          break;
        case 400:
          _data = "已完成";
          break;
        case 500:
          _data = "全部退款";
          break;
        case 501:
          _data = "已关闭";
          break;
        default:
          _data = `已付款(第${parseInt((s % 100) / 10)}阶段)`;
          break;
      }
      return _data;
    },
    contractStatus(data) {
      let _data = "";
      switch (data) {
        case 1:
          _data = "草稿";
          break;
        case 2:
          _data = "未通过";
          break;
        case 100:
          _data = "待审核";
          break;
        case 101:
          _data = "已通过";
          break;
        case 210:
          _data = "合同成立";
          break;
        case 300:
          _data = "合同回收";
          break;
        case 400:
          _data = "合同完成";
          break;
        case 500:
          _data = "合同终止";
          break;
      }
      return _data;
    },
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    let pams = this.getParams();
    this.type = pams.type;
    this.isMyOrder = pams.isShow;
    console.log(pams);
    if (this.type == "order") {
      //orderId
      this.getList(pams.id);
    } else {
      //contractId
      this.getList2(pams.id);
    }
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* ===页面=== */
    showtThis(index, data) {
      this.test = false;
      this.selectThis = index;
      console.log(data);
      this.dataListType = [];
      this.dataListType.push(data);
      console.log(this.dataListType);
      this.getExtCode(this.dataListType[0].contractId);
    },
    submitFormType(val) {
      if (val) {
        this.closeDialog();
      } else {
        if (this.message == "") {
          this.showMessage("error", "输入内容不能为空");
        } else {
          this.psssOrder(this.contractId, 2, this.message);
        }
      }

      this.message = "";
      this.closeDialog();
    },
    //返回
    goBack() {
      if (this.type == "order") {
        this.$router.push({ path: "/order/orderlist" });
      } else {
        this.$router.push({ path: "/order/approval" });
      }
    },
    /* ===审批=== */
    approval() {
      this.typeFormVisible = true;
    },
    passThis() {
      this.$confirm("是否通过？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.psssOrder(this.orderId, 2);
      });
    },
    /* 弹框 */
    closeDialog() {
      this.typeFormVisible = false;
      this.message = "";
      if (this.$refs.editFormType) this.$refs.editFormType.resetFields();
    },
    /* 分页*/
    selectPages() {},
    //获取当前审核节点
    codeExi(arr) {
      if (!arr) {
        return;
      }
      let _datas = JSON.parse(JSON.stringify(arr));
      let _data = _datas.reverse().findIndex((item) => {
        return item.isAgree != -1;
      });

      if (_data > -1) {
        _datas[_data].isAgree == 1 ? (this.statusThis = "success") : (this.statusThis = "error");
        this.statusNum = _datas.length - 1 - _data;
      } else {
        this.statusNum = -1;
      }

      this.test = true;
    },
    /* ===接口=== */
    async getList(id) {
      let _resp = await this.Axios.get(`order-api/orderlist/get/contract?orderId=${id}`);
      console.log(_resp.data.result);
      this.dataList = _resp.data.result.contractDetailView;
      this.dataListType = [_resp.data.result.contractDetailView[0]];
      this.orderInfo = _resp.data.result;
      this.getExtCode(this.dataList[0].contractId);
    },
    //获取审核节点
    async getExtCode(contractId) {
      let _resp = await this.Axios.get(`workflow-api/approvallist/list?relationId=${contractId}&status=1`);
      console.log(_resp.data.result);
      this.statusLit = _resp.data.result;
      this.codeExi(_resp.data.result);
    },
    //获取审核
    async getList2(id) {
      let _resp = await this.Axios.get(`order-api/contractlist/get/approveMsg?contractId=${id}`);
      console.log(_resp.data);
      this.dataList2 = _resp.data.result;
      this.contractId = _resp.data.result.contractId;
      this.orderId = _resp.data.result.orderId;
    },

    //审核
    async psssOrder(id, pass, remark = "") {
      let _userId = this.getDataStorge("userMessage").userId;
      let _data = { userId: _userId, relationId: id, isAgree: pass, remark: remark };
      let _resp = await this.Axios.post(`workflow-api/approvallist/update`, _data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.goBack();
      }
    },

    /* 数据处理 */
    // 提取数据筹划关注
    dataAssembly(data) {},
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
.order_list_show {
  width: 100%;
}
.select {
  color: #fff !important;
  background: rgb(2, 167, 249) !important;
}
.order_show .order_list_heard {
  padding: 2px;
  font-size: 14px;
}
.order_details_order_title {
  background: #e9f2fb;
  padding: 8px 0;
  margin-bottom: 0 !important;
}
.order_details_order_examine {
  display: flex;
  justify-content: center;
  width: 100%;
}

.order_details_order_examine /deep/ .el-steps {
  flex: 1;
  margin-top: 10px;
  justify-content: center;
}
</style>
