<!--
 * @Author:订单列表
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-30 13:13:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->
<template>
  <div class="order_list orderlist" v-loading="loading">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单系统</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="order_list_content">
      <!-- 搜索 -->
      <div class="order_list_search">
        <div class="input_label" style="flex:1">
          <span class="input_label_title">服务筛选:</span>
          <el-select class="input_select serve_select" v-model="selectService1" size="mini" placeholder="请选择" @change="select1">
            <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.path"> </el-option>
          </el-select>
          <el-select :disabled="!selectService1" class="input_select serve_select" v-model="selectService2" size="mini" placeholder="请选择" @change="select2">
            <el-option v-for="item in options2" :key="item.value" :label="item.name" :value="item.path"> </el-option>
          </el-select>
          <el-select :disabled="!selectService2" class="input_select serve_select" v-model="selectService3" size="mini" placeholder="请选择" @change="select3">
            <el-option v-for="item in options3" :key="item.value" :label="item.skuName" :value="item.productId"> </el-option>
          </el-select>
        </div>
        <div class="input_label" style="width:235px">
          <span class="input_label_title">服务性质</span>
          <el-select class="input_select" v-model="selectService4" size="mini" placeholder="请选择" @change="select4">
            <el-option v-for="item in options4" :key="item.value" :label="item.attributeNames" :value="item.skuId" :disabled="item.disabled"> </el-option>
          </el-select>
        </div>

        <div class="input_label" style="width:230px">
          <span class="input_label_title">订单状态</span>
          <el-select v-model="orderStatus" size="mini" placeholder="请选择" @change="getOrdeStatus">
            <el-option v-for="item in orderStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
        <div class="input_label" style="width:230px">
          <span class="input_label_title">查看部门</span>
          <el-cascader :disabled="myDepHide" size="mini" ref="cascader" v-model="deptIds" :props="listProps" :options="depListOptions" :show-all-levels="true" @change="tableListChange"></el-cascader>
        </div>
        <div class="input_label" style="">
          <el-button type="primary" size="mini" @click="searchAll">筛选</el-button>
        </div>
        <div class="input_label" style="width:80px;margin-right:25px">
          <el-button type="primary" size="mini" @click="celarAll">清空搜索</el-button>
        </div>
      </div>
      <div class="order_list_search">
        <div class="input_label" style="width:300px">
          <el-input placeholder="输入姓名或者企业名称" v-model="keyword" class="input-with-select" size="mini">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
        <div class="input_label" style="width:85px;margin-right:25px">
          <el-checkbox :disabled="myDepHide" v-model="showMe" @change="showMeType">查看自己</el-checkbox>
        </div>
      </div>

      <!-- 列表 -->
      <div class="order_list_list table_list_style">
        <el-table :data="arrOrderList" stripe style="width: 100%" :header-cell-style="table_heard_style">
          <el-table-column prop="orderId" align="center" label="订单编号" min-width="80"></el-table-column>
          <el-table-column prop="orderName" align="center" label="服务名称" min-width="160">
            <template slot-scope="scope">
              <p class="order_title" v-for="(item, index) in scope.row.skuNames" :key="index">{{ item }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" align="center" label="企业名称" min-width="160"></el-table-column>
          <el-table-column prop="contactName" align="center" label="联系人" min-width="80"></el-table-column>
          <el-table-column :formatter="formatPrice" prop="totalPrice" align="center" label="价格（元）" min-width="100"></el-table-column>
          <el-table-column :formatter="formatPrice" prop="orgPrice" align="center" label="标准价（元）" min-width="100"></el-table-column>
          <el-table-column :formatter="formatPriceLow" prop="orderSubtractPrice" align="center" label="服务差价（△元）" min-width="130">
            <!-- <template slot-scope="scope">
              <span> {{ scope.row.totalPrice / 100 - scope.row.orgPrice / 100 }} </span>
            </template> -->
          </el-table-column>

          <el-table-column prop="deptName" align="center" label="所在部门" width="150"></el-table-column>
          <el-table-column prop="realName" align="center" label="业务人员" min-width="100"></el-table-column>
          <el-table-column :formatter="formatStatus" prop="status" align="center" label="订单状态" min-width="100"> </el-table-column>
          <el-table-column prop="addTime" align="center" label="下单时间" min-width="100"></el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="230" class="table_btn">
            <template slot-scope="scope">
              <el-button size="small" v-if="scope.row.status == 1 && userName == scope.row.realName" plain type="info" @click="gotoEditor(scope.row)">编辑</el-button>
              <el-button size="small" v-else plain type="warning" @click="gotoShow(scope.row)">查看</el-button>
              <el-button size="small" v-if="scope.row.status >= 200 && scope.row.status <= 300 && userName == scope.row.realName" plain type="primary" @click="addOther(scope.row)">附加</el-button>

              <!-- <el-button size="small" plain type="warning">审核</el-button> -->
              <el-button size="small" v-if="scope.row.status < 100 && userName == scope.row.realName" plain type="danger" @click="deleteThis(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages">
        <p></p>
        <el-pagination background layout="total,prev, pager, next" :page-size="pageSize" :total="totle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
      </div>
    </div>
    <!-- 附加合同弹框 -->
    <el-dialog class="dialog" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="otherOrderVisible" @close="closeOther" title="附加合同" width="25%">
      <el-form :model="otherOrder" label-width="79px" ref="otherOrder" size="small">
        <el-form-item label="选择服务">
          <el-select @change="selectFwLx" clearable placeholder="请选择服务类型" v-model="otherOrder.fwvalue">
            <el-option :key="index" :label="item.name" :value="item.groupId" v-for="(item, index) in serveList"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择模板">
          <el-select clearable placeholder="请选择模板类型" v-model="otherOrder.templateId">
            <el-option :key="index" :label="item.templateName" :value="item.templateId" v-for="(item, index) in templateList"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="">
          <el-checkbox v-model="otherOrder.isTalent">包含人才合同</el-checkbox>
        </el-form-item> -->
      </el-form>
      <div class="dialog_btn">
        <el-button size="mini" @click="closeOther">取 消</el-button>
        <el-button size="mini" @click="otherSumbit" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { geticon } from "../../../assets/js/minx/common";
import myMixin from "../../../assets/js/minx/minx";
export default {
  name: "",
  mixins: [myMixin],
  components: {},
  props: [],
  data() {
    return {
      loading: false,
      listProps: {
        value: "depId",
        label: "name",
        children: "children",
        checkStrictly: true,
        expandTrigger: "click",
      },
      //登录信息
      userName: this.getDataStorge("userMessage").realName || "",

      //分页
      totle: 0,
      page: 0,
      pageSize: 8,
      optionsNature: [
        {
          value: "选项1",
          label: "黄金糕",
        },
      ],
      orderStatusList: [
        {
          value: 1,
          label: "待提交",
        },
        {
          value: 100,
          label: "已下单",
        },
        {
          value: 101,
          label: "待付款",
        },
        {
          value: 210,
          label: "已付款(部分付款)",
        },
        {
          value: 211,
          label: "异常",
        },
        {
          value: 300,
          label: "已结清",
        },
        {
          value: 400,
          label: "已完成",
        },
        {
          value: 500,
          label: "全部退款",
        },
        {
          value: 501,
          label: "已关闭",
        },
      ],
      value: "1",
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
      ],
      /*搜索内容*/
      //订单状态
      orderStatus: "",
      //部门id
      deptIds: [],
      deptId: "",
      //姓名或者公司名称
      keyword: "",
      showMe: true,
      myDepHide: true,
      isMyself: 1,
      skuids: [],
      //联动数据
      tempId1: "",
      tempId2: "",
      tempId3: "",
      selectService1: "",
      selectService2: "",
      selectService3: "",
      selectService4: "",
      //搜索下拉内容
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      arrOrderList: [],
      //部门列表
      depListOptions: [],
      /*附加合同*/
      otherOrderId: "",
      otherOrderVisible: false,
      serveList: [],
      templateList: [],
      otherOrder: {
        fwvalue: "",
        templateId: "",
        // isTalent: "",
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getList1();
    this.getList();
    this.getDepList();
    this.getUserDepList();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /*列表过滤*/
    formatCity(row, column) {
      let [...arr2] = this.options;
      let _resp = arr2.find((val) => {
        return row.areaId == val.values;
      });
      if (_resp) return _resp.label; //有旧数据残留 数据结构不同
    },
    formatPrice(row, column, cellValue) {
      if (cellValue < 0) {
        return 0;
      } else {
        return cellValue / 100;
      }
    },
    //价格相减
    formatPriceLow(row, column, cellValue) {
      //  scope.row.totalPrice / 100 - scope.row.orgPrice / 100
      return row.totalPrice / 100 - (row.orgPrice < 0 ? 0 : row.orgPrice) / 100;
    },
    formatDate(row, column) {
      return row.addTime.split(" ")[0];
    },
    formatStatus(row, column) {
      let _data = "";
      let s = row.status;
      switch (s) {
        case 1:
          _data = "待提交";
          break;
        case 100:
          _data = "已下单";
          break;
        case 101:
          _data = "待付款";
          break;
        case 211:
          _data = "异常";
          break;
        case 300:
          _data = "已结清";
          break;
        case 400:
          _data = "已完成";
          break;
        case 500:
          _data = "全部退款";
          break;
        case 501:
          _data = "已关闭";
          break;
        case 200:
          _data = "已付款(部分付款)";
          break;
      }
      return _data;
    },
    /* 页面 */
    search() {
      this.page = 0;
      this.getList();
    },
    getOrdeStatus(data) {
      this.page = 0;
      // this.getList();
    },
    //部门选择
    tableListChange(data) {
      console.log(data);
      this.deptId = data.slice(-1);
      // this.getList();
      // this.$refs.cascader.dropDownVisible = false;
    },
    celarAll() {
      this.deptId = "";
      this.keyword = "";
      this.skuids = "";
      this.deptIds = [];
      this.orderStatus = "";
      this.selectService1 = "";
      this.selectService2 = "";
      this.selectService3 = "";
      this.selectService4 = "";
      this.page = 0;
      this.getList();
    },
    showMeType(val) {
      val ? (this.isMyself = 1) : (this.isMyself = 2);
      this.deptIds = [];
      this.deptId = "";
      this.getList();
    },
    searchAll() {
      this.isMyself = 2;
      this.showMe = false;
      this.getList();
    },
    //服务筛选联动
    select1(data) {
      this.getList2(data);
      this.selectService2 = "";
      this.selectService3 = "";
      this.selectService4 = "";
      this.options2 = [];
      this.options3 = [];
      this.options4 = [];
    },
    select2(data) {
      this.selectService3 = "";
      this.selectService4 = "";
      this.options3 = [];
      this.options4 = [];
      console.log(data);
      this.getList3(data);
    },
    select3(data) {
      this.selectService4 = "";
      this.options4 = [];
      console.log(data);
      this.getList4(data);
    },
    select4(data) {
      this.skuids = data;
      // this.getList();
    },
    //删除
    deleteThis(data) {
      console.log(data);
      this.$confirm("是否删除订单？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteList(data.id);
        })
        .catch(() => {});
    },
    /*==附加合同==*/
    addOther(data) {
      this.otherOrderServeList();
      console.log(data);
      this.otherOrderId = data.orderId;
      this.otherOrderVisible = true;
    },
    //附加合同提交
    otherSumbit() {
      let _data = JSON.parse(JSON.stringify(this.otherOrder));
      let _dataSubmit = {
        templateId: _data.templateId,
        orderId: this.otherOrderId,
      };
      console.log(_dataSubmit);
      if (!this.otherOrder.fwvalue || !this.otherOrder.templateId) {
        this.showMessage("error", "选择内容不能为空");
      } else {
        this.addOtherOrder(_dataSubmit);
      }
    },
    closeOther() {
      this.otherOrder.fwvalue = "";
      if (this.$refs.otherOrder) this.$refs.otherOrder.resetFields();
    },
    selectFwLx(val) {
      if (val) {
        this.otherOrder.templateId = null;
        this.getMoBanLeiX(val);
      } else {
        this.otherOrder.templateId = null;
      }
    },
    //查看
    gotoShow(data) {
      console.log(data);
      this.pushParams({ id: data.orderId, type: "order" });
      this.$router.push({ path: "/order/details" });
    },
    //编辑
    gotoEditor(data) {
      console.log(data);
      this.pushParams({ id: data.id, orderId: data.orderId });
      this.$router.push({ path: "/order/edit" });
    },
    // 分页
    selectPages(val) {
      this.page = parseInt(val - 1);
      this.getList();
    },
    /* 接口 */
    //获取用户管理部门列表
    async getUserDepList() {
      let _resp = await this.Axios.get(`ucenter-api/admindep/tree`);
      if (_resp.data.result.length > 0) {
        this.myDepHide = false;
        this.depListOptions = [this.dataAssembly2(_resp.data.result[0])];
      } else {
        this.myDepHide = true;
      }
    },
    async getList() {
      this.loading = true;
      try {
        let _resp = await this.Axios.get(`order-api/orderlist/query?pageNum=${this.page}&pageSize=${this.pageSize}&skuIds=${this.skuids}&orderStatus=${this.orderStatus}&deptId=${this.deptId}&isMyself=${this.isMyself}&keyword=${this.keyword}`);
        this.loading = false;
        this.totle = _resp.data.total;
        this.arrOrderList = _resp.data.result || [];
      } catch (error) {
        this.loading = false;
        this.arrOrderList = [];
      }
    },
    async getDepList() {
      let _resp = await this.Axios.get(`ucenter-api/departmentlist/tree`);
      // let resp = [this.dataAssembly2(_resp.data.result[0])];
      // console.log(resp, "输出====");
      // this.depListOptions = [this.dataAssembly2(_resp.data.result[0])];
    },
    //联动
    async getList1() {
      let _resp = await this.Axios.get(`product-api/productgroup/list?firstLevel=0`);
      console.log(_resp);
      this.options1 = _resp.data.result;
    },
    async getList2(path) {
      let _id1 = await this.Axios.get(`product-api/productgroup/getIdByPath?path=${path}`);
      this.tempId1 = _id1.data.result;
      let _resp2 = await this.Axios.get(`product-api/productgroup/list?firstLevel=${_id1.data.result}`);
      console.log(_resp2.data.result);
      this.options2 = _resp2.data.result;
    },
    async getList3(path) {
      let _id2 = await this.Axios.get(`product-api/productgroup/getIdByPath?path=${path}`);
      let _resp2 = await this.Axios.get(`product-api/skulist/getSkuListByParams?areaId=3&pageSize=999&pageNum=0&firstLevel=${this.tempId1}&secondLevel=${_id2.data.result}}`);

      this.options3 = _resp2.data.result;
    },
    async getList4(productId) {
      let _resp = await this.Axios.get(`product-api/skulist/skuAttrListByParams?areaId=3&productId=${productId}`);
      console.log(_resp.data.result);
      this.options4 = _resp.data.result;
    },
    //删除
    async deleteList(id) {
      let _resp = await this.Axios.get(`order-api/orderlist/remove?id=${id}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "删除成功");
        this.getList();
      }
    },
    //附加合同服务列表
    async otherOrderServeList() {
      let _resp = await this.Axios.get("product-api/productgroup/list?firstLevel=0");
      this.serveList = _resp.data.result;
    },
    async getMoBanLeiX(groupId) {
      let res = await this.Axios.get(`order-api/contractconfig/query/by/serve?groupId=${groupId}&type=3`);
      this.templateList = res.data.result;
    },
    //附加合同提交
    async addOtherOrder(data) {
      let _resp = await this.Axios.post(`order-api/orderlist/contract/subjoin`, data, "postJson");
      console.log(_resp.data.result);
      this.$router.push({ path: "/order/addorder" });
      this.pushParams({
        result: _resp.data.result,
        orderId: this.otherOrderId,
        groupId: this.otherOrder.fwvalue,
        type: 1,
      });
    },

    /* 数据处理 */
    dataAssembly2(data) {
      let _data2 = JSON.parse(JSON.stringify(data)); //深拷贝
      function change2(data2) {
        Object.keys(data2).forEach((val) => {
          if (val == "children") {
            if (data2[val] == null || data2[val].length == 0) {
              delete data2[val];
              return false;
            }
            data2[val].forEach((val2) => {
              change2(val2);
            });
          }
        });
      }
      change2(_data2);
      return _data2;
    },
  },
};
</script>
<style>
.el-cascader-panel .el-radio {
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  top: 0px;
  right: 10px;
}
.el-cascader-node__label {
  width: 157px;
}
.el-cascader-panel .el-radio__input {
  visibility: hidden;
}
.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}
</style>
<style scoped lang="less">
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
.orderlist {
  .pages {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  //输入框
  .input_label {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-right: 20px;
    margin-bottom: 10px;
    .input_label_title {
      flex: none;
      margin-right: 2px;
    }
    .input_select {
      width: 170px;
      margin: 0 2px;
    }
  }

  .table_list_style .order_title {
    display: flex;
    flex-direction: column;
  }
  .dialog {
    .dialog_btn {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
    .el-form-item {
      margin-bottom: 10px;
      display: flex;
      /deep/ .el-form-item__content {
        display: inline-block !important;
        width: 100%;
        margin-left: 0px !important;
      }
      /deep/ .el-select {
        display: inline-block !important;
        width: 100%;
      }
    }
  }
}

.el-cascader-panel .el-radio {
  width: 100%;
  height: 100%;
  z-index: 10;
  position: absolute;
  top: 0px;
  right: 10px;
}
.el-cascader-node__label {
  width: 157px;
}
.el-cascader-panel .el-radio__input {
  visibility: hidden;
}
.el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}
</style>
