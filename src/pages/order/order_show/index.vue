<!--
 * @Author: 订单查看
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-28 16:55:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="order_show">
    <div class="top">
      <div></div>
      <!-- <div><el-button type="primary" size="mini" @click="goBack">返回</el-button></div> -->
    </div>
    <!-- 面包屑导航 -->
    <el-breadcrumb v-if="type == 'order'" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单系统</el-breadcrumb-item>
      <el-breadcrumb-item><router-link :to="{ path: '/order/orderlist' }">订单列表</router-link> </el-breadcrumb-item>
      <el-breadcrumb-item>订单预览</el-breadcrumb-item>
    </el-breadcrumb>

    <el-breadcrumb v-else separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单系统</el-breadcrumb-item>
      <el-breadcrumb-item><router-link :to="{ path: '/order/approval' }">合同列表</router-link> </el-breadcrumb-item>
      <el-breadcrumb-item>审批预览</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>

    <!-- 订单展示 -->
    <div v-if="type == 'order'" class="order_list_content">
      <div class="order_list_content_box">
        <div class="order_list_tab">
          <p v-for="(item, index) in dataList" :key="index" @click="showtThis(index + 1)" :class="{ select: selectThis == index + 1 }">
            <span>{{ item.contractName }}</span> <span>{{ item.contractCode }}</span>
          </p>
        </div>
        <div v-for="(item, index1) in dataList" :key="index1 + 1">
          <template v-if="selectThis == index1 + 1">
            <!-- <p class="order_list_title">
              合同状态： <span class="pass">{{ item.contractStatus | getStatus }}</span>
            </p> -->
            <p class="order_list_heard">委托方(甲方)：{{ item.companyName }}</p>
            <p class="order_list_heard">邮寄地址：{{ item.postAddress }}</p>
            <p class="order_list_heard">邮编：{{ item.postCode }}</p>
            <p class="order_list_heard">企业负责人：{{ item.contactName }}</p>
            <p class="order_list_heard">电话：{{ item.contactValue }}</p>
            <p class="order_list_heard">委托方(乙方)：{{ item.secondName }}</p>
            <!-- <p class="order_list_heard">备注：{{ item.remark }}</p> -->
            <div class="order_list_show">
              <tablelsShow v-if="item.orderStaff.length > 0" :staff="item.orderStaff" :sku="item.skuMsg"></tablelsShow>
              <tablelsShow2 v-if="item.orderTalent.length > 0" :talent="item.orderTalent"></tablelsShow2>
              <pay2 :list="item.paymentList"></pay2>
            </div>
          </template>
        </div>
      </div>
    </div>

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
        <div class="shenpi_btn" v-if="isMyOrder">
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
      isMyOrder: false,
      type: "",
      //tab选择
      selectThis: 1,
      dataList: [],
      dataList2: {},
      /* 弹框 */
      contractId: "",
      orderId: "",
      message: "",
      titleType: "不同意审批意见",
      typeFormVisible: false,
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
    showtThis(index) {
      this.selectThis = index;
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

    /* ===接口=== */
    async getList(id) {
      let _resp = await this.Axios.get(`order-api/orderlist/get/contract?orderId=${id}`);
      console.log(_resp.data);
      this.dataList = _resp.data.result.contractDetailView;
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
</style>
