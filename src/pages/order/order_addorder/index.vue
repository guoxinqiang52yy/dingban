<!--
 * @Author:订单创建 & 编辑
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-30 19:32:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="order_list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="type == 0">
      <el-breadcrumb-item>订单系统</el-breadcrumb-item>
      <el-breadcrumb-item> <router-link :to="{ path: '/order/orderlist' }">订单列表</router-link> </el-breadcrumb-item>
      <el-breadcrumb-item>创建订单（合同）</el-breadcrumb-item>
    </el-breadcrumb>

    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="type == 1">
      <el-breadcrumb-item>订单系统</el-breadcrumb-item>
      <el-breadcrumb-item> <router-link :to="{ path: '/order/orderlist' }">订单列表</router-link> </el-breadcrumb-item>
      <el-breadcrumb-item>附加合同</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="top_line"></div>
    <div class="form_content">
      <orderCom :ref="'orderCom' + index" v-for="(item, index) in orderList" :key="index" :datas="item" :heardData="heardData" :groupId="groupId" :orderId="orderId" :type="item.contractType" :number="number"></orderCom>

      <div class="order_list_bot">
        <div></div>
        <div>
          <el-button size="small" type="info" plain @click="cancel">取消</el-button>
          <el-button v-if="type != 1" size="small" type="success" plain @click="onlySave">仅保存</el-button>
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
import orderCom from "../../../components/orderComponents/index.vue";
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
      heardData: {},
      type: 0,
      /* 合同数量 */
      number: 0,
      /* 组件列表 */
      templateList: ["fiexdCode", "serve", "havePeople", "otherPeople", "pay", "orderIds"],
      //服务分类id
      groupId: "",
      //主键id
      id: "",
      //订单id
      orderId: "",
      contractId: "",
      //订单列表
      orderList: [],
      orderServeList: [{ contractType: "" }],
      orderPeopleList: [{ contractType: "" }],
      domain: [],
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
    console.log(this.getParams(), "页面返回");
    let _orderId = this.getParams().result;
    this.orderId = _orderId;
    let _groupId = this.getParams().groupId;
    this.type = this.getParams().type || 0;
    console.log(this.type);
    if (this.type == 0) {
      this.getOrder(_orderId);
    } else {
      this.getOrderOther(_orderId);
    }
    this.groupId = _groupId;
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
        orgPrice += _res.orgPrice;
        totalPrice += _res.contractPrice;
        isTax += _res.tax;
        let _datas = this.deleteCode(["tax", "totleprice1", "totleprice2"], _res);
        _data.push(_datas);
      }
      // //替换人才合同公共字段
      let _resp = this.dataReplace(_data);
      let _tempData = {
        orgPrice: orgPrice,
        orderId: this.orderId,
        isTax: isTax,
        remark: 0,
        totalPrice: totalPrice,
      };
      _tempData.updateContractList = _resp;
      console.log(_tempData);
      return _tempData;
    },

    /* 页面 */
    //取消
    cancel() {
      this.cancelServe();
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
        return;
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
      this.$router.push({ path: "/order/orderlist" });
    },
    /* 接口 */
    //获取订单模板(新建)
    async getOrder(id) {
      let _resp = await this.Axios.get(`order-api/orderlist/get/detail?orderId=${id}`);
      console.log(_resp.data);
      this.orderId = _resp.data.result.orderId;
      this.orderList = _resp.data.result.contractLists;
      this.number = this.orderList.length;
      this.id = _resp.data.result.id;
    },
    //获取订单模板(创建附加)
    async getOrderOther(id) {
      let _resp = await this.Axios.get(`order-api/orderlist/get/subJoinContractDetail?contractId=${id}`);
      console.log(_resp.data);
      this.orderId = _resp.data.result.orderId;
      this.orderList = _resp.data.result.contractLists;
      this.number = this.orderList.length;
      this.heardData = _resp.data.result.firstPartyS;
      this.id = _resp.data.result.id;
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
    //取消
    async cancelServe() {
      console.log(this.type);
      if (this.type != 1) {
        let _resp = await this.Axios.get(`order-api/orderlist/remove?id=${this.id}`);
        if (_resp.data.code == 0) {
          this.showMessage("success", "取消成功");
          this.$router.push({ path: "/order/orderlist" });
        }
      } else {
        let _resp = await this.Axios.get(`order-api/orderlist/remove/subJoinOrder?contractId=${this.id}`);
        if (_resp.data.code == 0) {
          this.showMessage("success", "取消成功");
          this.$router.push({ path: "/order/orderlist" });
        }
      }
    },
    /* 数据处理 */
    //多个合同 包括人才合同时 将非人才合同的 固定字段替换到人才合同固定字段
    dataReplace(data) {
      let _data = JSON.parse(JSON.stringify(data));
      console.log(_data, "提交数据");
      //非人才合同
      let _firstData = _data.find((item) => {
        return item.contractType == 1;
      });
      //人才合同
      let _secondtData = _data.filter((item) => {
        return item.contractType == 2;
      });
      if (!_firstData) {
        return _data;
      }
      //提取固定字段数据
      let _resp = _firstData.contractDetail.filter((item) => {
        if (item.fieldCode != "%乙方名称%" && item.fieldValue) {
          return item;
        }
      });
      for (let i = 0; i < _data.length; i++) {
        if (_data[i].contractType != 1) {
          for (let j = 0; j < _data[i].contractDetail.length; j++) {
            if (_data[i].contractDetail[j] && _data[i].contractDetail[j].contractId) {
              for (let k = 0; k < _resp.length; k++) {
                if (_data[i].contractDetail[j].fieldCode == _resp[k].fieldCode) {
                  _data[i].contractDetail[j].fieldValue = _resp[k].fieldValue;
                }
              }
            }
          }
        }
      }
      return _data;
    },
    //判断组件
    isTemplate(arr, code) {
      let _resp = arr.some((item) => {
        return item.fieldName == code;
      });
      return _resp;
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
    //判断为空
    selecEmpty(o) {
      let empty = false;
      selec(o);
      function selec(o) {
        var s = {}.toString.call(o);
        console.log(s);
        if (s == "[object Array]") {
          if (o.length > 0) {
            for (var ele in o) {
              console.log(ele);
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
              console.log(`111===`);
              selec(o[attr]);
            }
          }
        }
      }
      return empty;
    },
    //判断合同 是否包含服务列表
    isHaveList(data) {
      let _resp = false;
      let _data = data.updateContractList;

      for (let i = 0; i < _data.length; i++) {
        if (_data[i].contractType == 1 || _data[i].contractType == 3) {
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
