<!--
 * @Author:  订单编辑  结构组装
 * @Date: 2020-12-10 15:16:24
 * @LastEditTime: 2020-12-30 17:32:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\orderUpdataComponents\index.vue
-->
<template>
  <div class="order_compon">
    <div class="title">{{ datas.contractName }}</div>
    <fiexdCode ref="fiexdCode" :contractId="datas.contractId" :datas="datas.contractDetail" :type="type" :number="number"></fiexdCode>
    <serve ref="serve" v-if="datas.skuMsg.length >= 0 && type == 1" :datas="priceMultipleLow(datas.skuMsg, ['contractPrice', 'sellPrice'])" type="edit" :tax="tax" :orderId="orderId" :contractId="datas.contractId" @serveprice="serveprice"></serve>
    <havePeople ref="havePeople" v-if="type == 1 && datas.orderStaff.length >= 0" type="edit" :tax="tax" :datas="priceMultipleLow(datas.orderStaff, ['staffPrice', 'staffCostPrice'])" :orderId="orderId" :contractId="datas.contractId" @haveprice="haveprice"></havePeople>
    <otherPeople ref="otherPeople" v-if="number > 1 && type == 2 && datas.orderTalent.length >= 0" type="edit" :tax="tax" :datas="priceMultipleLow(datas.orderTalent, ['staffPrice', 'staffCostPrice'])" :orderId="orderId" :contractId="datas.contractId" @otherprice="otherprice"></otherPeople>
    <customCode ref="customCode" :contractId="datas.contractId" type="edit" :datas="datas.contractDetail"></customCode>
    <pay ref="pay" v-if="datas.paymentList.length > 0" :datas="priceMultipleLow(datas.paymentList, ['payable'])" :orderId="orderId" :contractId="datas.contractId" :price="sprice + hprice + oprice"></pay>
  </div>
</template>

<script>
import myMixin from "../../assets/js/minx/minx";
import fiexdCode from "../../components/fixedCode";
import customCode from "../../components/customCode";
import serve from "../../components/listServe";
import havePeople from "../../components/listHavePeople";
import otherPeople from "../../components/listOtherPeople";
import pay from "../../components/pay/index.vue";
export default {
  name: "",
  mixins: [myMixin],
  components: { pay, serve, havePeople, otherPeople, fiexdCode, customCode },
  props: {
    datas: {
      type: Object,
      default: () => {},
    },
    number: {
      type: Number,
      default: 0,
    },
    type: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    orderId: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
      //减小100倍后的价格
      //计算总价
      sprice: 0,
      hprice: 0,
      oprice: 0,
      //含税
      tax1: 0,
      tax2: 0,
      tax3: 0,
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    /* 父级调用 */
    showData() {
      let _fiexdCode,
        _customCode,
        _serve,
        _havePeople,
        _otherPeople,
        _pay,
        talentPrice = 0,
        servePrice = 0,
        staffPrice = 0,
        talentPrice2 = 0,
        servePrice2 = 0,
        staffPrice2 = 0;

      try {
        _fiexdCode = this.$refs.fiexdCode.showData();
      } catch (error) {
        _fiexdCode = [];
      }
      try {
        _customCode = this.$refs.customCode.showData();
      } catch (error) {
        _customCode = [];
      }
      try {
        _serve = this.$refs.serve.showData();
        _serve = this.priceMultiple(_serve, ["contractPrice", "sellPrice"]); //价格扩大100倍
        servePrice = this.sumServePriceOrg(_serve, "contractPrice", "skuCount"); //手输价格总计
        servePrice2 = this.sumServePriceOrg(_serve, "sellPrice", "skuCount"); //获取价格总计
      } catch (error) {
        _serve = [];
      }
      try {
        _havePeople = this.$refs.havePeople.showData();
        _havePeople = this.priceMultiple(_havePeople, ["staffPrice", "staffCostPrice"]); //价格扩大100倍
        staffPrice = this.sumServePriceOrg(_havePeople, "staffPrice", "staffCount"); //手输价格总计
        staffPrice2 = this.sumServePriceOrg(_havePeople, "staffCostPrice", "staffCount"); //获取价格总计
      } catch (error) {
        _havePeople = [];
      }
      try {
        _otherPeople = this.$refs.otherPeople.showData();
        _otherPeople = this.priceMultiple(_otherPeople, ["staffPrice", "staffCostPrice"]); //价格扩大100倍
        talentPrice = this.sumServePriceOrg(_otherPeople, "staffPrice", "staffCount"); //手输价格总计
        talentPrice2 = this.sumServePriceOrg(_otherPeople, "staffCostPrice", "staffCount"); //获取价格总计
        console.log(talentPrice);
      } catch (error) {
        _otherPeople = [];
      }
      try {
        _pay = this.$refs.pay.showData();
        _pay = this.priceMultiple(_pay, ["payable"]); //价格扩大100倍
      } catch (error) {
        _pay = [];
      }
      //删除字段 & 获取表单验证结果(输入框)
      let _contractDetail = "";
      if (!_fiexdCode || !_customCode) {
        _contractDetail = false;
      } else {
        _contractDetail = this.deleteCode(["fieldName"], [..._fiexdCode, ..._customCode]);
      }
      console.log(_pay, "价格——————");
      return {
        callBack: 0,
        signTime1: 0,
        signTime2: 0,
        orderId: this.datas.orderId,
        contractId: this.datas.contractId,
        templateId: this.datas.templateId,
        contractName: this.datas.contractName,
        contractCode: this.datas.contractCode,
        contractType: this.datas.contractType,
        contractDetail: _contractDetail,
        orderDetails: _serve,
        orderStaff: _havePeople,
        orderTalent: _otherPeople,
        paymentList: _pay,
        contractPrice: talentPrice + servePrice + staffPrice, //手输价格
        orgPrice: talentPrice2 + servePrice2 + staffPrice2, //获取价格
        tax: this.tax1 + this.tax2 + this.tax3,
      };
    },
    /* 获取价格 */
    serveprice(data, type) {
      console.log(type);
      this.sprice = data * 100;
      this.tax1 = type;
    },
    haveprice(data, type) {
      this.hprice = data * 100;
      this.tax2 = type;
    },
    otherprice(data, type) {
      this.oprice = data * 100;
      this.tax3 = type;
    },

    /* 数据处理 */
    //删除字段
    deleteCode(code = [], arr) {
      let _arr = arr.map((item) => {
        code.forEach((i) => {
          delete item[i];
        });
        return item;
      });
      return _arr;
    },
    //计算列表总价
    sumServePriceOrg(arr, a, b) {
      let _sum = 0;
      for (let item of arr) {
        _sum += (item[a] == -1 ? 0 : item[a]) * item[b];
      }
      return _sum;
    },
    //将价格扩大100倍
    priceMultiple(arr, b = []) {
      if (arr == "价格输入有误") return "价格输入有误";
      let _data = JSON.parse(JSON.stringify(arr));
      let _resp = _data.map((item) => {
        for (let a of b) {
          item[a] = parseFloat(item[a]).toFixed(2) * 100;
        }
        return item;
      });
      return _resp;
    },
    //将价格减小100倍
    priceMultipleLow(arr, b = []) {
      let _data = JSON.parse(JSON.stringify(arr));
      let _resp = _data.map((item) => {
        for (let a of b) {
          item[a] = (parseFloat(item[a]) / 100).toFixed(2);
        }
        return item;
      });
      return _resp;
    },
    //判断组件
    isTemplate(arr, code) {
      console.log(this.number, "外聘");
      if (this.type == 1 && this.number > 1 && code == "外聘列表") {
        return false;
      }
      if (this.number > 1 && code == "外聘列表") {
        return true;
      }
      let _resp = arr.some((item) => {
        return item.fieldName == code;
      });
      return _resp;
      //   return true;
    },
  },
};
</script>
<style lang="less" scoped>
.order_compon {
  .title {
  }
}
</style>
