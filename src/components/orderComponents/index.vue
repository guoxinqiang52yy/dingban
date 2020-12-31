<!--
 * @Author:  新加合同 结构组装
 * @Date: 2020-12-09 23:52:05
 * @LastEditTime: 2020-12-30 19:33:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\orderComponents\index.vue
-->
<template>
  <div class="order_compon">
    <div class="title">{{ datas.contractName }}</div>
    <fiexdCode v-if="type != 3" ref="fiexdCode" partAname="123" :contractId="datas.contractId" :type="type" :number="number"></fiexdCode>
    <fiexdCode v-if="type == 3" ref="fiexdCode" :contractId="datas.contractId" :datas="heardData" :type="type" :number="number"></fiexdCode>
    <!-- <fiexdCode  ref="fiexdCode" :datas="heardData" :contractId="datas.contractId" :type="type" :number="number"></fiexdCode> -->
    <serve ref="serve" v-if="isTemplate(datas.templateLists, '服务列表')" :orderId="datas.orderId" :groupId="groupId" :contractId="datas.contractId" @serveprice="serveprice"></serve>
    <havePeople ref="havePeople" v-if="type == 1 && isTemplate(datas.templateLists, '自有列表')" :orderId="datas.orderId" :contractId="datas.contractId" @haveprice="haveprice"></havePeople>
    <otherPeople ref="otherPeople" v-if="number > 1 && type == 2 && isTemplate(datas.templateLists, '外聘列表')" :orderId="datas.orderId" :contractId="datas.contractId" @otherprice="otherprice"></otherPeople>
    <otherPeople ref="otherPeople" v-if="number == 1 && isTemplate(datas.templateLists, '外聘列表')" :orderId="datas.orderId" :contractId="datas.contractId" @otherprice="otherprice"></otherPeople>
    <customCode ref="customCode" :contractId="datas.contractId" :datas="datas.templateLists"></customCode>
    <pay ref="pay" :orderId="datas.orderId" :contractId="datas.contractId" :price="sprice + hprice + oprice"></pay>
  </div>
</template>

<script>
import myMixin from "../../assets/js/minx/minx";
import fiexdCode from "../../components/fixedCode";
import customCode from "../../components/customCode";
import serve from "../../components/listServe/index.vue";
import havePeople from "../../components/listHavePeople";
import otherPeople from "../../components/listOtherPeople";
import pay from "../../components/pay/index.vue";
export default {
  name: "",
  mixins: [myMixin],
  components: { pay, serve, havePeople, otherPeople, fiexdCode, customCode },
  props: {
    heardData: {
      type: Array,
      default: () => [],
    },
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
    groupId: {
      type: String,
      default: "",
    },
    orderId: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
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
  mounted() {
    console.log(this.datas.contractDetail, "合同数据");
  },
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
        console.log(_serve, "服务类表");
        _serve = this.priceMultiple(_serve, ["contractPrice", "sellPrice"]); //价格扩大100倍
        servePrice = this.sumServePriceOrg(_serve, "contractPrice", "skuCount"); //手输价格总计
        servePrice2 = this.sumServePriceOrg(_serve, "sellPrice", "skuCount"); //获取价格总计
      } catch (error) {
        _serve = [];
      }
      try {
        _havePeople = this.$refs.havePeople.showData();
        console.log(_havePeople);
        _havePeople = this.priceMultiple(_havePeople, ["staffPrice", "staffCostPrice"]); //价格扩大100倍
        staffPrice = this.sumServePriceOrg(_havePeople, "staffPrice", "staffCount"); //手输价格总计
        staffPrice2 = this.sumServePriceOrg(_havePeople, "staffCostPrice", "staffCount"); //获取价格总计
      } catch (error) {
        _havePeople = [];
      }
      try {
        _otherPeople = this.$refs.otherPeople.showData();
        console.log(_otherPeople);
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
        console.log(_pay);
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
    /* 获取手输价格合计 */
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
    //将价格扩大100倍
    priceMultiple(arr, b = []) {
      let _data = JSON.parse(JSON.stringify(arr));
      let _resp = _data.map((item) => {
        for (let a of b) {
          item[a] = parseFloat(item[a]).toFixed(2) * 100;
        }
        return item;
      });
      return _resp;
    },
    //计算列表总价
    sumServePriceOrg(arr, a, b) {
      let _sum = 0;
      for (let item of arr) {
        _sum += (item[a] == -1 ? 0 : item[a]) * item[b];
      }
      return _sum;
    },

    //判断组件
    isTemplate(arr, code) {
      let _resp = arr.some((item) => {
        return item.fieldName == code;
      });
      if (_resp) {
        if (this.type == 1 && this.number > 1 && code == "外聘列表") {
          return false;
        } else if (this.type == 2 && this.number > 1 && code == "外聘列表") {
          return true;
        } else {
          return true;
        }
      } else {
        return false;
      }
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
