<!--
 * @Author:订单编辑
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-30 17:23:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="order_list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item>订单系统</el-breadcrumb-item> -->
      <el-breadcrumb-item><router-link :to="{ path: '/order/orderlist' }">订单列表</router-link></el-breadcrumb-item>
      <el-breadcrumb-item>编辑订单（合同）</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="form_content">
      <orderEdit :ref="'orderCom' + index" :tax="tax" v-for="(item, index) in orderList" :key="index" :datas="item" :orderId="orderId" :type="item.contractType" :number="number"></orderEdit>
      <div class="order_list_bot">
        <div></div>
        <div>
          <!-- <el-button size="small" type="primary" plain>取消</el-button> -->
          <el-button size="small" type="success" plain @click="onlySave">仅保存</el-button>
          <el-button size="small" type="primary" plain @click="submit">保存并提交</el-button>
        </div>
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="Successdialog" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" width="30%" center>
      <span style="font-size:16px;text-align: center;display: inline-block;width:100%"> 您的合同已经提交审批，请留意审批进度，及时沟通处理 </span>
      <span style="font-size:14px;text-align: center;display: inline-block;width:100%;margin-top:15px"> {{ Sencond }}秒后跳转页面。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="gotoList" type="primary">立即跳转</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import orderEdit from "../../../components/orderUpdataComponents";
import pay from "../../../components/pay/index.vue";
import pay2 from "../../../components/pay/index2.vue";
import tablels from "../../../components/tablelist/index.vue";
import tablelsShow from "../../../components/tablelist/index2.vue";
import tablelsShow2 from "../../../components/tablelist2/index2.vue";
import tablels2 from "../../../components/tablelist2/index.vue";
import myMixin from "../../../assets/js/minx/minx";
export default {
  name: "",
  mixins: [myMixin],
  components: { orderEdit, tablels, tablelsShow, tablelsShow2, tablels2, pay, pay2 },
  props: [],
  data() {
    return {
      //税收
      tax: 0,
      //服务分类id
      groupId: "",
      //订单id
      orderId: "",
      //订单列表
      orderServeList: [{ contractType: "" }],
      orderPeopleList: [{ contractType: "" }],
      //输入内容
      ruleForm: {
        nameA: "",
        address: "",
        number: "",
        nameCompany: "",
        tlephone: "",
        nameB: "",
      },
      // rules表单验证
      rules: {
        nameA: [{ required: true, message: "请输入甲方名称", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        number: [{ required: true, message: "请输入邮编", trigger: "blur" }],
        nameCompany: [{ required: true, message: "请输入企业负责人", trigger: "blur" }],
        tlephone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        nameB: [{ required: true, message: "请输入乙方名称", trigger: "blur" }],
      },
      orderList: {},
      number: 0,
      /*倒计时*/
      Successdialog: false, //控制弹出
      Sencond: 5, //设置初始倒计时
      isDisabled: true,
      interval: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    let _data = this.getParams();
    console.log(_data);
    this.orderId = _data.orderId;
    this.getEditor(this.orderId);
    this.groupId = "111111"; //编辑页面不可更改联动列表 groupId 可不用获取
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    init() {},
    /* 页面 */
    goback() {
      this.$router.push({ path: "/order/orderlist" });
    },
    /*  组装列表 */
    getList() {
      this.number = this.orderList.length;
      let _data = [];
      let orgPrice = 0,
        totalPrice = 0,
        isTax = 0;
      for (let i = 0; i < this.number; i++) {
        let _res = this.$refs[`orderCom${i}`][0].showData();
        orgPrice += _res.orgPrice;
        totalPrice += _res.contractPrice;
        isTax += _res.tax;
        let _datas = this.deleteCode(["tax", "totleprice1", "totleprice2"], _res);
        _data.push(_datas);
      }
      let _tempData = {
        orgPrice: orgPrice,
        orderId: this.orderId,
        isTax: isTax,
        remark: 0,
        totalPrice: totalPrice,
      };
      _tempData.updateContractList = _data;

      return _tempData;
    },
    //获取订单数据
    async getEditor(id) {
      let _resp = await this.Axios.get(`order-api/orderlist/edit/order?orderId=${id}`);
      console.log(_resp);
      this.orderList = _resp.data.result.contractList;
      this.tax = _resp.data.result.isTax;
      this.number = _resp.data.result.contractList.length;
      this.orderId = _resp.data.result.orderId;
    },

    //提交数据
    submit() {
      let _resp = this.getList();
      if (!this.isHaveList(_resp)) {
        this.showMessage("error", "服务列表不能为空");
        return;
      }
      if (this.selecEmpty(_resp)) {
        this.showMessage("error", this.selecEmpty(_resp));
      } else {
        this.saveSubmit(_resp);
      }
    },
    onlySave() {
      let _resp = this.getList();
      if (!this.isHaveList(_resp)) {
        this.showMessage("error", "服务列表不能为空");
        return;
      }
      if (this.selecEmpty(_resp)) {
        this.showMessage("error", this.selecEmpty(_resp));
      } else {
        this.saveDraft(_resp);
      }
    },
    //弹框倒计时
    getSencond() {
      this.Successdialog = true;
      const that = this;
      that.interval = window.setInterval(function() {
        --that.Sencond;
        if (that.Sencond === 0) {
          window.clearInterval(that.interval);
          that.gotoList();
        }
      }, 1000);
    },
    gotoList() {
      window.clearInterval(this.interval);
      this.$router.push({ path: "/order/approval" });
    },
    /* 数据处理 */
    //自定义字段 编辑
    codeCustomize(arr) {
      let _arr = arr.map((val) => {
        return { ...val, value: "" };
      });
      return _arr;
    },
    //删除字段
    deleteCode(code = [], obj) {
      let _data = JSON.parse(JSON.stringify(obj));
      Object.keys(obj).forEach((item) => {
        if (code.includes(item)) {
          delete _data[item];
        }
      });
      return _data;
    },
    //判断想赢合同工 是否包含服务列表
    isHaveList(data) {
      let _resp = false;
      let _data = data.updateContractList;
      for (let i = 0; i < _data.length; i++) {
        if (_data[i].contractType == 1) {
          if (_data[i].orderDetails.length <= 0) {
            _resp = false;
            return false;
          } else {
            _resp = true;
          }
        }
      }
      console.log(_resp);
      return _resp;
    },
    /* 接口 */
    //联动
    async getList4(productId) {
      let _resp = await this.Axios.get(`product-api/skulist/skuAttrListByParams?areaId=3&productId=${productId}`);
      console.log(_resp.data.result);
      this.options4 = _resp.data.result;
    },
    //保存提交
    async saveSubmit(data) {
      let _resp = await this.Axios.post(`order-api/orderlist/saveOrderMsg`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "编辑成功");
        this.getSencond();
        // this.$router.push({ path: "/order/approval" });
      }
    },
    //保存到草稿
    async saveDraft(data) {
      let _resp = await this.Axios.post(`order-api/orderlist/saveOrderDraft`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "保存成功");
      }
    },
    //数据处理
    selecEmpty(o) {
      let empty = false;
      selec(o);
      function selec(o) {
        var s = {}.toString.call(o);
        if (s == "[object Array]") {
          if (o.length > 0) {
            for (var ele in o) {
              selec(o[ele]);
            }
          }
        } else if (s == "[object Object]") {
          for (var attr in o) {
            if (attr != "remark" && (o[attr] === undefined || o[attr] === "" || o[attr] === false)) {
              empty = "输入内容不能为空";
            } else if (o[attr] == "字段输入有误") {
              empty = "字段输入有误";
              return false;
            } else if (o[attr] == "价格输入有误") {
              empty = "支付价与总价不符";
              return false;
            } else if (typeof o[attr] == "object") {
              selec(o[attr]);
            }
          }
        }
      }
      return empty;
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
