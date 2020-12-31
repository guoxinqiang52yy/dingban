<!--
 * @Author:模板配置
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-16 18:55:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="finance_list financeTemplate">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>财务系统</el-breadcrumb-item>
      <el-breadcrumb-item>模板配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="finance_btn">
      <el-button size="small" type="primary" @click="gotoTemplate(0, '')">创建新模板</el-button>
    </div>
    <!-- 列表 -->
    <div class="finance_list_list table_list_style">
      <el-table :data="arrOrderList" stripe style="width: 100%" :header-cell-style="table_heard_style">
        <!-- <el-table-column prop="id" align="center" label="序号" min-width="100"></el-table-column> -->
        <el-table-column prop="templateName" align="center" label="三级服务名称" min-width="160"></el-table-column>
        <el-table-column prop="remark" align="center" label="备注" min-width="260"></el-table-column>
        <el-table-column prop="creatorName" align="center" label="创建人" min-width="80"></el-table-column>
        <el-table-column prop="updateTime" :formatter="formatDate" align="center" label="更新时间" min-width="100"></el-table-column>
        <el-table-column prop="updateTime" align="center" label="开启状态" min-width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" disabled :active-value="1" :inactive-value="0" @click.native="handleUpdate(scope.row, scope.row.status)"> </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="updateTime" align="center" label="合同状态" min-width="100"></el-table-column> -->
        <el-table-column align="center" label="操作" fixed="right" width="150" class="table_btn">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="gotoTemplate(1, scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pages">
      <p></p>
      <el-pagination background layout="total,prev, pager, next" :page-size="pageSize" :total="totle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
    </div>
  </div>
</template>
<script>
import myMixin from "../../../assets/js/minx/minx";
export default {
  name: "",
  mixins: [myMixin],
  components: {},
  props: [],
  data() {
    return {
      //分页
      totle: 0,
      page: 0,
      pageSize: 10,
      arrOrderList: [],
    };
  },
  computed: {
    //获取城市
  },
  watch: {},
  created() {},
  mounted() {
    this.getList();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /*列表过滤*/
    formatDate(row, column) {
      if (row.updateTime) return row.updateTime.split(" ")[0];
    },
    formatCity(row, column) {
      let _Da = this.$store.state.cityList;
      console.log(_Da);
      console.log(row.areaId);
      let _resp = _Da.find((val) => {
        return val.values == row.areaId;
      });
      if (_resp) return _resp.label; //有旧数据残留 数据结构不同
    },
    /* 页面 */
    // 分页
    selectPages(val) {
      this.page = parseInt(val - 1);
      this.getList();
    },
    gotoTemplate(type, val) {
      this.addDataStorge("templateData", { type: type, val: val });
      console.log({ type: type, val: val });
      this.$router.push({ path: "/finance/addtemplate" });
    },
    //切换状态
    handleUpdate(data1, data) {
      //验证权限
      // if (!this.verification(this.$store.state.selectBtnJurisdiction, "/kuaiban-api/links/update")) {
      //   this.showMessage("error", "无此权限");
      //   return false;
      // }
      console.log(data1);
      console.log(data);
      let _data = 0;
      data == 1 ? (_data = 0) : (_data = 1);
      this.$confirm("是否修改设置？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.selectType(data1.id, _data);
        })
        .catch(() => {
          return false;
        });
    },
    /* 接口 */
    async getList() {
      let _resp = await this.Axios.get(`order-api/templatelist/query?pageNum=${this.page}&pageSize=${this.pageSize}`);
      this.totle = _resp.data.total;
      this.arrOrderList = _resp.data.result;
      console.log(_resp.data.result);
    },
    async selectType(id, status) {
      let _resp = await this.Axios.get(`order-api/templatelist/update?id=${id}&status=${status}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getList();
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
.finance_list_list /deep/ .el-switch.is-disabled {
  opacity: 1;
}
.finance_list_list /deep/ .el-switch.is-disabled .el-switch__core,
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
