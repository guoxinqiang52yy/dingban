<!--
 * @Author:  支付列表
 * @Date: 2020-11-19 10:28:45
 * @LastEditTime: 2020-12-30 11:10:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\pay\index2.vue
-->
<!--  -->
<template>
  <div class="pay_list">
    <p class="pay_list_title"><b>支付方式</b></p>
    <el-table size="mini" :data="tablePeopleData" border style="width: 100%">
      <el-table-column align="center" prop="batch" label="付款批次"> </el-table-column>
      <el-table-column :formatter="formatType" align="center" prop="taskName" label="付款阶段"> </el-table-column>
      <el-table-column :formatter="formatPriceLow" align="center" prop="payable" label="付款金额"> </el-table-column>
      <!-- <el-table-column align="center" prop="taskName" label="备注"> </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: ["list"],
  data() {
    return {
      tablePeopleData: [
        {
          serveName: "434",
          serveTytpe: "4324",
          servePrice: 1200,
          servePriceOne: 1100,
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    console.log(this.list, "支付");
    this.tablePeopleData = this.list;
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    formatType(data) {
      return data.batch == 1 ? "首款" : data.taskName;
    },
    formatPriceLow(row, column, cellValue) {
      return cellValue / 100;
    },
  },
};
</script>
<style scoped>
.pay_list {
  width: 100%;
  margin: 10px 0;
  margin-bottom: 45px;
}
.pay_list > p {
  margin: 10px 0;
  background: #e9f2fb;
  padding: 8px 0;
  margin-bottom: 0;
}
</style>
