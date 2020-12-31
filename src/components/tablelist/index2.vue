<!--
 * @Author: 服务列表单独展示 
 * @Date: 2020-11-19 09:20:38
 * @LastEditTime: 2020-12-29 09:14:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\tablelist\index2.vue
-->

<template>
  <div class="table_show">
    <p class="table_show_title"><b>服务列表</b></p>
    <el-table size="mini" :data="tableServeData" border style="width: 100%">
      <el-table-column align="center" prop="thirdName" label="服务名称"> </el-table-column>
      <el-table-column align="center" prop="skuName" label="服务性质"> </el-table-column>
      <el-table-column align="center" prop="skuCount" label="数量"> </el-table-column>
      <el-table-column :formatter="formatPrice" align="center" prop="defaultPrice" label="标准价"> </el-table-column>
      <el-table-column :formatter="formatPrice" align="center" prop="contractPrice" label="单价"> </el-table-column>
    </el-table>
    <p class="table_show_title"><b>自有人员</b></p>
    <el-table size="mini" :data="tablePeopleData" border style="width: 100%">
      <el-table-column :formatter="formatType" align="center" prop="staffType" label="类型"> </el-table-column>
      <el-table-column align="center" prop="postName" label="岗位"> </el-table-column>
      <el-table-column align="center" prop="levelName" label="等级"> </el-table-column>
      <el-table-column align="center" prop="professionalName" label="专业"> </el-table-column>
      <el-table-column :formatter="formaRegisterStatus" align="center" prop="registerStatus" label="证书状态"> </el-table-column>
      <el-table-column :formatter="formaHsb" align="center" prop="hasB" label="B本情况"> </el-table-column>
      <el-table-column :formatter="formaSocial" align="center" prop="social" label="社保情况"> </el-table-column>
      <el-table-column align="center" prop="ageLimit" label="发证年限"> </el-table-column>

      <el-table-column align="center" prop="staffCount" label="人数"> </el-table-column>
      <el-table-column :formatter="formatPrice" align="center" prop="staffCostPrice" label="标准价"> </el-table-column>
      <el-table-column :formatter="formatPrice" align="center" prop="staffPrice" label="单价"> </el-table-column>
      <el-table-column :formatter="formaTotle" align="center" prop="servePriceOne" label="总价"> </el-table-column>
      <el-table-column align="center" prop="remark" label="备注"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: "",
  components: {},
  props: ["staff", "sku"],
  data() {
    return {
      tabtitle: [
        {
          label: "类型",
          prop: "servePriceOne",
        },
        {
          label: "服务名称",
          prop: "serveName",
        },
        {
          label: "单价",
          prop: "servePriceOne",
        },
        {
          label: "参考价",
          prop: "servePrice",
        },
      ],
      tableServeData: [
        {
          serveName: "434",
          serveTytpe: "4324",
          servePrice: 1200,
          servePriceOne: 1100,
        },
      ],
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
    this.tableServeData = this.sku;
    this.tablePeopleData = this.staff;
    console.log(this.tablePeopleData);
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 列表数据 */
    formatType(data) {
      console.log(data.staffType);
      let _data = {
        1: "有证",
        2: "考证",
        3: "办证",
      };
      return _data[data.staffType] || "-";
    },
    formatPrice(row, column, cellValue) {
      return cellValue < 0 ? "面议" : cellValue / 100;
    },
    formaHsb(data) {
      let _data = {
        1: "带B",
        2: "不带B",
      };
      return _data[data.hasB] || "-";
    },
    //社保情况
    formaSocial(data) {
      let _data = {
        1: "临时",
        2: "唯一",
        3: "不上",
      };
      return _data[data.social] || "-";
    },
    formaTotle(data) {
      return (data.staffCount * data.staffPrice) / 100;
    },
    formaRegisterStatus(data) {
      let _data = {
        1: "初始",
        2: "变更",
        3: "重新",
        4: "延续",
      };
      return _data[data.registerStatus] || "-";
    },
  },
};
</script>
<style scoped>
.table_show {
  width: 100%;
  margin: 10px 0;
  margin-bottom: 45px;
}
.table_show > p {
  margin: 10px 0;
}
.table_show_title {
  margin: 10px 0;
  background: #e9f2fb;
  padding: 8px 0;
  margin-bottom: 0 !important;
}
</style>
