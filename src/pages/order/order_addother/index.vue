<!--
 * @Author: 附加订单创建
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-29 18:54:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="order_list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单系统</el-breadcrumb-item>
      <el-breadcrumb-item> <router-link :to="{ path: '/order/orderlist' }">订单列表</router-link> </el-breadcrumb-item>
      <el-breadcrumb-item>创建订单（合同）</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="form_content">
      <orderCom :ref="'orderCom' + index" v-for="(item, index) in orderList" :key="index" :groupId="groupId" :datas="item" :type="item.contractType" :number="number"></orderCom>

      <div class="order_list_bot">
        <div></div>
        <div>
          <el-button size="small" type="primary" plain>取消</el-button>
          <el-button size="small" type="success" plain @click="onlySave">仅保存</el-button>
          <el-button size="small" type="info" plain @click="submit">保存并提交</el-button>
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
import orderCom from "../../../components/orderComponents";
import fiexdCode from "../../../components/fixedCode";
import customCode from "../../../components/customCode";
import serve from "../../../components/listServe";
import havePeople from "../../../components/listHavePeople";
import otherPeople from "../../../components/listOtherPeople";
import pay from "../../../components/pay/index.vue";
import tablels from "../../../components/tablelist/index.vue";
import tablels2 from "../../../components/tablelist2/index.vue";
import myMixin from "../../../assets/js/minx/minx";

export default {
  name: "",
  mixins: [myMixin],
  components: { orderCom, tablels, tablels2, pay, serve, havePeople, otherPeople, fiexdCode, customCode },
  props: [],
  data() {
    return {
      /* 合同数量 */
      number: 0,
      /* 组件列表 */
      templateList: ["fiexdCode", "serve", "havePeople", "otherPeople", "pay"],
      //服务分类id
      groupId: "",
      //订单id
      orderId: "",
      contractId: "",
      //订单列表
      orderList: [],
      orderServeList: [{ contractType: "" }],
      orderPeopleList: [{ contractType: "" }],
      domain: [],
      //字段列表
      codeList: {
        //固定字段
        codeFixed: [
          { fieldName: "甲方名称", fieldCode: "%甲方名称%", fieldType: 1, fieldValue: "" },
          { fieldName: "乙方名称", fieldCode: "%乙方名称%", fieldType: 1, fieldValue: "" },
          { fieldName: "邮寄地址", fieldCode: "%邮寄地址%", fieldType: 1, fieldValue: "" },
          { fieldName: "邮编", fieldCode: "%邮编%", fieldType: 1, fieldValue: "" },
          { fieldName: "电话", fieldCode: "%电话%", fieldType: 1, fieldValue: "" },
          { fieldName: "企业负责人", fieldCode: "%企业负责人%", fieldType: 1, fieldValue: "" },
        ],
        //添加字段
        codeIn: [
          // { fieldName: "甲方名称", fieldCode: "%甲方名称%", fieldType: 2, fieldValue: "" },
          // { fieldName: "乙方名称", fieldCode: "%乙方名称%", fieldType: 2, fieldValue: "" },
          // { fieldName: "邮寄地址", fieldCode: "%邮寄地址%", fieldType: 2, fieldValue: "" },
          // { fieldName: "邮编", fieldCode: "%邮编%", fieldType: 2, fieldValue: "" },
        ],
      },
      testForm: [
        { fieldType: 0, fieldCode: "%甲方名称%" },
        { fieldType: 0, fieldCode: "%乙方名称%" },
        { fieldType: 0, fieldCode: "%甲方邮寄地址%" },
        { fieldType: 0, fieldCode: "%乙方邮寄地址%" },
      ],
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
    console.log(this.getParams());
    let _orderId = this.getParams().result;
    let _groupId = this.getParams().groupId;
    this.getOrder(_orderId);
    this.groupId = _groupId;
    this.domain = this.codeCustomize(this.testForm);
    console.log(this.domain);
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /*  组装列表 */
    getList() {
      this.number = this.orderList.length;
      let _data = [];
      let orgPrice = 0,
        totalPrice = 0,
        isTax = 0;
      for (let i = 0; i < this.number; i++) {
        let _res = this.$refs[`orderCom${i}`][0].showData();
        orgPrice += _res.totleprice1;
        totalPrice += _res.totleprice2;
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
      console.log(_tempData);
      return _tempData;
    },

    init() {},
    /* 页面 */
    // 分页
    selectPages() {},

    //提交数据
    submit() {
      let _data = this.getList();
      if (this.selecEmpty(_resp)) {
        this.showMessage("error", "输入内容不能为空或者不符合要求");
      } else {
        this.saveSubmit(_resp);
      }
    },
    onlySave() {
      let _resp = this.getList();
      if (this.selecEmpty(_resp)) {
        this.showMessage("error", "输入内容不能为空或者不符合要求");
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
    //判断组件
    isTemplate(arr, code) {
      let _resp = arr.some((item) => {
        return item.fieldName == code;
      });
      return _resp;
    },
    //计算服务合同org总价
    sumServePriceOrg(arr) {
      let _sum = 0;
      for (let item of arr) {
        let p = item.sellPrice == -1 ? 0 : parseInt(item.sellPrice);
        console.log(p);
        _sum += p * item.skuCount;
      }
      return _sum;
    },
    sumServePriceOrg2(arr) {
      let _sum = 0;
      for (let item of arr) {
        let p = item.staffOrgPrice == -1 ? 0 : parseInt(item.staffOrgPrice);
        _sum += p * item.staffCount;
      }
      return _sum;
    },
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

    /* 接口 */
    //获取订单模板
    async getOrder(id) {
      let _resp = await this.Axios.get(`order-api/orderlist/get/detail?orderId=${id}`);
      console.log(_resp.data);
      this.orderId = id;
      this.contractId = _resp.data.result.contractId;

      this.orderList = _resp.data.result.contractLists;
      this.number = this.orderList.length;

      this.orderServeList = orderList.find((res) => {
        return res.contractType == 1;
      });
      this.orderPeopleList = orderList.find((res) => {
        return res.contractType == 2;
      });
      console.log(this.orderServeList);
      console.log(this.orderPeopleList);
    },
    //保存提交
    async saveSubmit(data) {
      let _resp = await this.Axios.post(`order-api/orderlist/saveOrderMsg`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "创建成功");
        this.getSencond();
      }
    },
    //保存到草稿
    async saveDraft(data) {
      let _resp = await this.Axios.post(`order-api/orderlist/saveOrderDraft`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "保存成功");
      }
    },
    /* 数据处理 */
    selecEmpty(o) {
      let empty = false;
      return selec(o);
      function selec(o) {
        var s = {}.toString.call(o);
        if (s == "[object Array]") {
          if (o.length > 0) {
            o.forEach((element) => {
              selec(element);
            });
          }
        } else if (s == "[object Object]") {
          for (var attr in o) {
            if (o[attr] === null || o[attr] === undefined || o[attr] === "") {
              empty = true;
            } else if (typeof o[attr] == "object") {
              selec(o[attr]);
            }
          }
        }
        return empty;
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
.order_contract {
  margin-bottom: 45px;
}
</style>
