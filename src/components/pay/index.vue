<!--
 * @Author:  支付组件
 * @Date: 2020-11-17 11:21:36
 * @LastEditTime: 2020-12-30 17:36:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\pay\index.vue
-->

<template>
  <div class="pay" v-if="number > 0">
    <p class="pay_heard"><b>支付方式</b></p>
    <div class="pay_title">
      <b>本合同费用总额: ￥{{ (price / 100).toFixed(2) }}</b>
    </div>
    <div class="pay_content">
      <p class="pay_content_title">
        合同分次支付次数为 <span><el-input-number size="mini" v-model="number" @change="handleChange" :min="1"></el-input-number></span> 次
      </p>
      <div class="pay_content_box">
        <div class="pay_content_list">
          <p><b>第1阶段付款：</b></p>
          <p class="pay_content_list_intrud">
            甲方应在合同签订后5日内向乙方支付人民币:
            <span class="select_price"> <el-input size="mini" v-model="payList[0].payable" placeholder="请输入价格" @input="inputPrice(0, payList[0].payable)"></el-input> </span>元
          </p>
        </div>
        <div class="pay_content_list" v-for="(item, index) in payList.slice(1)" :key="index">
          <p>
            <b>第{{ index + 2 }}阶段付款：</b>
          </p>
          <p class="pay_content_list_intrud">
            甲方应在
            <span class="select_process select_process1">
              <el-select size="mini" v-model="payList[index + 1].taskId" placeholder="请选择" @change="choose(index, $event)">
                <el-option v-for="item in taskList" :key="item.nodeTemplateId" :label="item.nodeName" :value="item.nodeTemplateId"> </el-option>
              </el-select>
            </span>
            前合同签订后5日内向乙方支付人民币:
            <span class="select_price">
              <el-input size="mini" v-model="payList[index + 1].payable" placeholder="输入价格" @input="inputPrice(index + 1, payList[index + 1].payable)"></el-input>
            </span>
            元
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myMixin from "../../assets/js/minx/minx";
import loginVue from "../../pages/login.vue";
import navconVue from "../navcon.vue";
export default {
  name: "pay",
  mixins: [myMixin],
  components: {},
  props: {
    datas: {
      type: Array,
      default: () => [],
    },
    price: {
      type: Number,
      default: 0,
    },
    contractId: {
      type: String,
      default: "",
    },
    orderId: { type: String, default: "" },
  },
  // props: ["price", "contractId", "orderId"],
  data() {
    return {
      //价格有误
      outPrice: true,
      //计算总价
      sumPrice: 0,
      number: 1,
      contractIds: this.contractId,
      orderIds: this.orderId,
      taskList: [],
      processList: [
        {
          value: "1",
          label: "蚵仔煎",
        },
        {
          value: "2",
          label: "小笼包",
        },
      ],
      payList: [
        {
          actual: 0,
          payable: "",
          batch: 1,
          taskId: "0",
          taskName: "0",
        },
      ],
    };
  },
  computed: {
    serveLists() {
      return this.$store.state.serveList;
    },
  },
  watch: {
    serveLists(data) {
      this.serveListShow(data);
    },
  },
  beforeCreate() {
    // this.payList = this.datas;
  },
  created() {},
  mounted() {
    console.log(this.orderId);
    console.log(this.datas, "cahngdu");
    // this.datas.length < 1 ? "" : (this.payList = JSON.parse(this.datas));
    this.datas.length < 1 ? "" : (this.payList = this.datas);
    this.number = this.payList.length;
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    handleChange(data) {
      let num = this.payList.length;
      if (data > num) {
        this.payList.push({
          actual: 0,
          payable: "",
          batch: this.payList.length + 1,
          taskId: "",
          taskName: 0,
        });
      }
      if (data < num) {
        this.payList.splice(-1);
      }
    },
    getPrice() {
      this.sumPrice = this.payList.reduce((p, c) => {
        return p + parseFloat(c.payable * 100 || 0);
      }, 0);
      if (this.sumPrice != this.price) {
        this.outPrice = false;
      } else {
        this.outPrice = true;
      }
    },
    choose(index, e) {
      console.log(e);
      console.log(this.taskList);
      console.log(this.payList);
      let obj = this.taskList.find((item) => {
        return item.nodeTemplateId == e;
      });
      this.payList[index + 1].taskId = obj.nodeTemplateId;
      this.payList[index + 1].taskName = obj.nodeName;
    },
    showData() {
      //价格
      this.getPrice();
      console.log(this.outPrice, "价格");
      if (!this.outPrice) {
        return "价格输入有误";
      }
      console.log(this.payList, "支付列表");
      let _payList = this.addeteCode({ orderId: this.orderIds, contractId: this.contractIds }, this.payList);
      console.log(_payList);
      return _payList;
    },
    //获取服务id
    serveListShow(data) {
      console.log(data, "pay数据");
      this.getNode(data.join(","));
    },
    //添加字段
    addeteCode(code = {}, arr) {
      let _arr = arr.map((item) => {
        return Object.assign(item, code);
      });
      return _arr;
    },
    //根据sku获取支付节点列表
    async getNode(serviceIds) {
      let _data = [];
      let _resp2 = await this.Axios.get(`workflow-api/templatenode/listByService?serviceIds=${serviceIds}`);
      console.log(_resp2.data, "节点信息");
      _resp2.data.result.forEach((item) => {
        _data.push(...item.templateNodeList);
      });
      this.taskList = _data;
    },
    //价格输入判断
    inputPrice(index, data) {
      this.payList[index].payable = data.replace(/[^\d^\.]/g, "");
    },
  },
};
</script>
<style>
.pay {
  width: 100%;
  margin: 10px 0;
  margin-top: 20px;
  margin-bottom: 45px;
  padding: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
}
.pay_heard {
  font-size: 16px;
  margin: 10px 0;
}
.pay_content_title {
}
.pay_content_title span {
  display: inline-block;
  width: 90px;
}
.pay_title {
  margin-bottom: 10px;
}
.pay_content_title span /deep/ .el-input-number--mini {
  width: 90px;
}
.pay_content_list {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.pay_content_box {
  margin-top: 10px;
  letter-spacing: 1px;
}
.select_process {
  display: block;
  width: 70px;
}
.select_process1 {
  width: 100px;
}
.pay_content_list_intrud {
  display: flex;
  align-items: center;
}
.select_price {
  width: 100px;
}
</style>
