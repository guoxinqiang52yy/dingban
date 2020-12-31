<!--
 * @Author: 订单预览
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-11-19 14:34:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="order_preview">
    <div class="order_preview_title">
      <span> <b>合同预览</b></span>
      <el-button size="mini" type="primary"> 返回 </el-button>
    </div>
    <div style="width:1200px;margin:0 auto;padding:10px;border:1px solid #ccc">
      <div style="display:flex; justify-content: space-between;color:#888;">
        <span>logo</span>
        <span>快办网（天津企业服务有限公司</span>
        <span></span>
      </div>
      <div style="">
        <div style="width:1000px;margin:0 auto;margin-top:20px;">
          <div v-html="node"></div>

          <!-- <table border="1" width="100%" cellpadding="10" style=" text-align: center;">
            <tr>
              <th height="25px">Month</th>
              <th style="">Savings</th>
              <th style="">Month</th>
              <th style="">Savings</th>
              <th style="">Month</th>
              <th style="">Savings</th>
            </tr>
            <tr>
              <td height="25px">123</td>
              <td>433</td>
              <td>123</td>
              <td>433</td>
              <td>123</td>
              <td>433</td>
            </tr>
          </table> -->
        </div>
      </div>
    </div>
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
      type: 1,
      node: "",
      tableData: [
        { title: "321fs", age: 111 },
        { title: "dsrq2312", age: 12222 },
        { title: "343ffa", age: 333 },
      ],
    };
  },
  computed: {
    //获取城市
  },
  watch: {},
  created() {},
  mounted() {
    this.node = this.addTable(this.tableData);
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 拼接生成表单 */
    addTable(arrData) {
      let str = "";
      str += "<table border='1'; width='100%' cellpadding='10' style='text-align: center;'";
      for (var i = 0; i < arrData.length; i++) {
        str += "<tr>";
        if (i == 0) {
          Object.keys(arrData[i]).forEach((val) => {
            str += "<th height='25px'>" + val + "</th>";
          });
        } else {
          Object.values(arrData[i]).forEach((val) => {
            str += "<td height='25px'>" + val + "</td>";
          });
        }
        str += "</tr>";
      }
      str += "</table>";
      return str;
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
.order_preview {
}
</style>
