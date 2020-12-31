<!--
 * @Author:   服务列表组件
 * @Date: 2020-12-09 14:22:36
 * @LastEditTime: 2020-12-30 16:57:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\listOtherPeople\index.vue
-->

<template>
  <div class="serveList addOrder">
    <div class="table_title"><b>服务内容：</b></div>
    <div class="table_list_box">
      <el-table size="mini" :data="tableData" border style="width: 100%" :header-cell-style="table_heard_style">
        <el-table-column align="center" prop="name" label="服务名称">
          <template slot-scope="scope">
            <div class="serve_cherp">
              <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.secondName" placeholder="请选择" @change="chooseServe(scope.$index, $event)">
                <el-option v-for="(item, index) in scope.row.secondList" :key="index" :label="item.name" :value="item.name"> </el-option>
              </el-select>
              <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.thirdName" placeholder="请选择" @change="chooseServe1(scope.$index, $event)">
                <el-option v-for="(item, index) in scope.row.thirdList" :key="index" :label="item.skuName" :value="item.skuName"> </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="type" label="服务性质">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.skuName" placeholder="请选择" @change="chooseServe2(scope.$index, $event)">
              <el-option v-for="(item, index) in scope.row.skuList" :key="index" :label="item.attributeNames" :value="item.attributeNames"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="skuCount" label="数量" width="150">
          <template slot-scope="scope">
            <el-input-number size="mini" v-model="scope.row.skuCount" @change="changeServeNum(scope.$index, scope.row)" :min="1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column :formatter="formatType" align="center" prop="sellPrice" label="标准价(元)" width="150"> </el-table-column>
        <el-table-column align="center" prop="contractPrice" label="单价(元)" width="150">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.contractPrice" placeholder="价格" @keyup.native="inputPriceServe(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="totlePrice" label="总价" width="150"> </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" plain @click="deleteThis(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table_btn">
        <div></div>

        <el-button type="primary" size="mini" plain @click="addAdditional">添加附加服务</el-button>
        <el-button type="primary" size="mini" plain @click="addServeList">添加服务</el-button>
      </div>
      <div class="table_price">
        <p></p>
        <div class="table_price_content">
          <el-radio-group v-model="isTaxPrice" class="radio_price_selete">
            <el-radio :label="1.04">含税</el-radio>
            <el-radio :label="1">不含税</el-radio>
          </el-radio-group>
          <span class="price"> 咨询服务费合计：{{ totleServe }} 元</span>
        </div>
      </div>
      <div class="table_line"></div>
      <div class="table_title table_people">
        <b>标准人员参考表（仅供参考）:</b>
        <el-button type="primary" size="mini" @click="getPeopleList">获取人员列表</el-button>
      </div>
      <el-table size="mini" :data="tablePeople" border style="width: 100%" :header-cell-style="table_heard_style">
        <el-table-column align="center" prop="postName" label="岗位"> </el-table-column>
        <el-table-column align="center" prop="levelName" label="等级"> </el-table-column>
        <el-table-column align="center" prop="majorName" label="专业"> </el-table-column>
        <el-table-column :formatter="formatIsType" align="center" prop="registerStatus" label="注册状态"> </el-table-column>
        <el-table-column :formatter="formatIsB" align="center" prop="isB" label="B本情况"> </el-table-column>
        <el-table-column :formatter="formatIsSocial" align="center" prop="socialStatus" label="社保情况"> </el-table-column>
        <el-table-column align="center" prop="ageLimit" label="工作年限"> </el-table-column>

        <el-table-column align="center" prop="number" label="人数"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import myMixin from "../../assets/js/minx/minx";
export default {
  name: "",
  mixins: [myMixin],
  components: {},
  props: ["datas", "tax", "type", "groupId", "orderId", "contractId", "templateLists"],
  data() {
    return {
      //地区id
      areaId: this.getDataStorge("userMessage").areaId || "",
      //临时数据
      firstGroupId: this.groupId,
      tempData: this.datas,
      contractIds: this.contractId,
      orderIds: this.orderId,
      templateList: "",
      //是否含税
      isTaxPrice: 1,
      //附加服务1 和服务0切换
      otherServe: 1,
      //服务联动
      serveTemp: [],
      serveList1: [],
      serveList2: [],
      serveList3: [],
      serveDropLit: {
        first: [
          {
            value: 12,
            label: "黄金糕",
          },
          {
            value: 2,
            label: "双皮奶",
          },
          {
            value: 3,
            label: "蚵仔煎",
          },
        ],
        second: [
          {
            value: 4,
            label: "黄金糕2",
          },
          {
            value: 5,
            label: "双皮奶2",
          },
          {
            value: 6,
            label: "蚵仔煎2",
          },
        ],
      },
      //附加服务联动
      serveListOther1: [],
      serveListOther2: [],
      serveListOther3: [],
      //服务列表
      tableData: [
        // {
        //   secondName: "",
        //   secondList:[],
        //   thirdName: "",
        //   thirdList:[],
        //   skuName: "",
        //   skuList:[],
        //   skuType: "", //服务性质id
        //   skuId: 0, //结合生成skuid
        //   skuCount: 1,
        //   contractPrice: 0, //手输入
        //   sellPrice: 0, //获取价格
        //   totlePrice: 0,
        // },
      ],
      //标准人员
      tablePeople: [],
      //临时服务性质集合类表
      tempListServeType: [],
      //临时服务id集合
      tempListServeId: [],
    };
  },
  computed: {
    totleServe() {
      let sum = this.tableData.reduce((t, b) => {
        return parseInt(t) + parseFloat(b.totlePrice || 0).toFixed(2);
      }, 0);
      // this.$emit("serveprice", parseInt(this.isTaxPrice * sum), parseInt(this.isTaxPrice == 1 ? 0 : 1));
      // return parseInt(this.isTaxPrice * sum);
      this.$emit("serveprice", parseFloat(sum).toFixed(2), parseInt(this.isTaxPrice == 1 ? 0 : 1));
      return parseFloat(sum);
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.init();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    test() {
      console.log(this.tableData);
    },
    /* 父级调用 */
    showData() {
      let _serveData = JSON.parse(JSON.stringify(this.tableData));
      let _serveList = this.addeteCode({ orderId: this.orderIds, contractId: this.contractIds }, _serveData);
      _serveList = this.deleteCode(["totlePrice", "secondList", "thirdList", "skuList", "jobList"], _serveList);
      return _serveList;
    },

    /* 列表过滤 */
    formatType(row, column) {
      if (row.sellPrice == -1) {
        return "面议";
      } else {
        return row.sellPrice;
      }
    },
    formatIsB(row, column) {
      return row.isB == 1 ? "带B" : "不带B";
    },
    formatIsSocial(row, column) {
      let _data = { 1: "临时", 2: "唯一", 3: "不上" };
      return _data[row.isB] || "-";
    },
    formatIsType(row, column) {
      let _data = { 1: "初始注册", 2: "变更注册", 3: "重新注册", 4: "延续注册" };
      return _data[row.socialStatus] || "-";
    },
    /* 初始化 */
    init() {
      //编辑
      if (this.tempData) {
        let _aa = JSON.parse(JSON.stringify(this.tempData));
        //计算价格
        this.tableData = this.addRow(_aa, "skuCount", "contractPrice");
        (this.tax & 0x01) == 0 ? (this.isTaxPrice = 1) : (this.isTaxPrice = 1.04);

        //获取skuid集合
        this.tempListServeType = this.tableData.map((item, index) => {
          return { index: index, skuId: item.skuId };
        });

        //获取临时skuid集合
        let _skuids = this.tableData.map((item, index) => {
          return item.skuId;
        });
        console.log(_skuids);
        this.getFirstGroup(_skuids.join(","));
        // //获取服务id集合传值给支付 组件生成节点
        this.$store.commit("getServeList", this.tempListServeType);
      } else {
        console.log(this.datas, "数据");
        console.log(this.type);
        this.getSecondList(this.firstGroupId);
      }
      this.getServeAdditional();
    },

    //获取标准人员列表
    getPeopleList() {
      console.log(this.tempListServeType);
      if (this.tempListServeType.length > 0) {
        let _arr = this.tempListServeType.map((item) => {
          return item.skuId;
        });
        console.log(_arr);
        this.getPeopleType(_arr.join(","));
      }
    },

    /* 服务列表操作 */
    //添加服务列表
    addServeList() {
      this.serveList1 = this.serveTemp;
      this.tableData.push({
        secondList: this.serveList1,
        thirdList: [],
        skuList: [],
        skuName: "",
        skuType: "", //服务性质id
        skuId: "", //结合生成id
        // typeId: "",
        skuCount: 0,
        contractPrice: 0, //手输入
        sellPrice: 0, //获取价格
        totlePrice: 0,
      });
    },
    addAdditional() {
      this.serveList1 = this.serveListOther1;
      this.tableData.push({
        secondList: this.serveList1,
        thirdList: [],
        skuList: [],
        skuName: "",
        skuType: "", //服务性质id
        skuId: "", //结合生成id
        skuCount: 0,
        contractPrice: 0, //手输入
        sellPrice: 0, //获取价格
        totlePrice: 0,
      });
    },
    //删除row
    deleteThis(index, data) {
      console.log(index);
      console.log(data);
      this.tableData.splice(index, 1);
      this.tempListServeType.splice(index, 1);
    },
    //服务联动
    //二级分类
    chooseServe(index, e) {
      let obj = this.tableData[index].secondList.find((item) => {
        return item.name == e;
      });
      console.log(e);
      console.log(obj);
      this.firstGroupId = obj.parentId;
      this.getThirdList(this.firstGroupId, obj.groupId, index);
      // this.tableData[index].nameId = e;
      // this.tableData[index].name = obj.label;
      this.tableData[index].skuId = "";
      this.tableData[index].skuName = "";
      this.tableData[index].thirdName = "";
    },
    //三级分类
    chooseServe1(index, e) {
      console.log(e);
      let obj = this.tableData[index].thirdList.find((item) => {
        return item.skuName == e;
      });
      this.tableData[index].skuId = "";
      this.tableData[index].skuName = "";
      this.getType(obj.productId, index);
      //传值给支付组件生成节点 添加到服务id集合
      this.tempListServeId.push(obj.productId);
      this.tempListServeId = [...new Set(this.tempListServeId)];
      this.$store.commit("getServeList", this.tempListServeId);
    },
    chooseServe2(index, e) {
      let obj = this.tableData[index].skuList.find((item) => {
        return item.attributeNames == e;
      });
      this.tableData[index].skuId = obj.skuId;
      this.tableData[index].skuType = obj.isBack;
      if (obj.price == "面议") {
        this.tableData[index].sellPrice = -1;
      } else {
        this.tableData[index].sellPrice = price;
      }
      console.log(obj);
      this.addTypeList({ index: index, skuId: obj.skuId }, this.tempListServeType, index);
    },
    //附加服务联动(不与当前一级分类重叠)

    //服务价格计算
    changeServeNum(index, data) {
      data.totlePrice = (parseFloat(data.skuCount) * parseFloat(data.contractPrice)).toFixed(2);
    },
    inputPriceServe(data) {
      console.log(data.contractPrice);
      data.contractPrice = data.contractPrice.replace(/[^\d^\.]/g, "");
      if (data.contractPrice != "") data.totlePrice = (parseFloat(data.skuCount) * parseFloat(data.contractPrice)).toFixed(2);
    },

    sortDataServe(arr) {
      let _arrList = JSON.parse(JSON.stringify(arr));
      let _arr = _arrList.map((item) => {
        delete item.updateTime;
        return item;
      });
      return _arr;
    },

    /* 接口 */
    //服务联动
    async getSecondList(id) {
      //  let _id1 = await this.Axios.get(`product-api/productgroup/getIdByPath?path=${path}`);
      // this.tempId1 = _id1.data.result;
      let _resp2 = await this.Axios.get(`product-api/productgroup/list?firstLevel=${id}`);
      console.log(_resp2.data.result);
      this.serveTemp = _resp2.data.result;
    },
    async getThirdList(id1, id2, index) {
      let _resp2 = await this.Axios.get(`product-api/skulist/getSkuListByParams?areaId=${this.areaId}&pageSize=999&pageNum=0&firstLevel=${id1}&secondLevel=${id2}`);
      this.serveList2 = _resp2.data.result;
      this.tableData[index].thirdList = _resp2.data.result;
    },
    async getType(productId, index) {
      let _resp = await this.Axios.get(`product-api/skulist/skuAttrListByParams?areaId=${this.areaId}&productId=${productId}`);
      this.serveList3 = _resp.data.result;
      this.tableData[index].skuList = _resp.data.result;
    },
    //附加服务联动
    async getServeAdditional() {
      let _resp2 = await this.Axios.get(`product-api/productgroup/list?firstLevel=201217000006111`);
      console.log(_resp2.data.result);
      this.serveListOther1 = _resp2.data.result;
    },
    //附加服务一级
    async getServeAdditionalFirst() {
      let _resp2 = await this.Axios.get(`product-api/productgroup/list?firstLevel=${id}`);
    },
    //附加服务二级
    async getServeAdditionalSecond() {
      // this.serveListOther1
      let _resp2 = await this.Axios.get(`product-api/productgroup/list?firstLevel=${id}`);
    },
    //附加服务三级
    async getServeAdditionalSecond() {
      // this.serveListOther2
      let _resp2 = await this.Axios.get(`product-api/productgroup/list?firstLevel=${id}`);
    },
    //附加服务属性
    async getServeAdditionalAttr() {
      // this.serveListOther3
    },
    //人员联动
    //岗位
    async getJob() {
      let _resp = await this.Axios.get(`product-api/standardattribute/list?parentId=0`);
      console.log(_resp.data.result);
      this.jobSelect = _resp.data.result;
    },
    //等级
    async getGrade(id) {
      let _resp = await this.Axios.get(`product-api/standardattribute/list?parentId=${id}`);
      console.log(_resp.data);
      this.gradeSelect = _resp.data.result;
    },
    //专业
    async getProfession(id) {
      let _resp = await this.Axios.get(`product-api/standardattribute/list?parentId=${id}`);
      console.log(_resp.data);
      this.professionType = _resp.data.result;
    },
    //根据sku获取一级分类&获取服务id集合
    async getFirstGroup(skuids) {
      let _resp = await this.Axios.get(`product-api/skulist/skuWithGroup?skuIds=${skuids}`);
      console.log(_resp.data.result);
      this.firstGroupId = _resp.data.result[0].firstLevelId;
      this.getSecondList(this.firstGroupId);

      ////获取服务id集合传给pay 传值给支付组件生成节点 添加到服务id集合
      let _tempServeIds = _resp.data.result.map((item) => {
        return item.productId;
      });
      this.tempListServeId.push(..._tempServeIds);
      this.tempListServeId = [...new Set(this.tempListServeId)];
      console.log(this.tempListServeId, "服务~");
      this.$store.commit("getServeList", this.tempListServeId);
    },
    //获取人员标准列表
    async getPeopleType(skuIds) {
      let _resp = await this.Axios.get(`product-api/skustandard/list?areaId=${this.areaId}&skuIds=${skuIds}`);
      console.log(_resp.data.result);
      console.log(this.getSkuPeople(_resp.data.result));
      this.tablePeople = this.getSkuPeople(_resp.data.result);
    },
    /* 数据处理 */
    //获取sku人员集合
    getSkuPeople(arr) {
      let _arr = [];
      if (arr.length > 0) {
        arr.forEach((item) => {
          if (item.skuStandardVOList.length > 0) {
            item.skuStandardVOList.forEach((i) => {
              let _obj = Object.assign({ number: i.amount }, i.standardListVO);
              _arr.push(_obj);
            });
          }
        });
      }
      _arr = _arr.reduce((obj, item) => {
        let find = obj.find((i) => i.standardId === item.standardId);
        let _d = {
          ...item,
        };
        find ? (find.number += item.number) : obj.push(_d);
        return obj;
      }, []);

      return _arr;
    },
    //添加id到数组(组成skuid 集合)
    addTypeList(data, arr, index) {
      let _flag = arr.findIndex((item) => {
        return item.index == index;
      });
      console.log(_flag);
      if (_flag < 0) {
        arr.push(data);
      } else {
        arr[_flag].skuId = data.skuId;
      }
    },
    //计算row总价
    addRow(arr, a, b) {
      return arr.map((item) => {
        item.totlePrice = (parseFloat(item[a]) * parseFloat(item[b])).toFixed(2);
        return item;
      });
    },
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
    //添加字段
    addeteCode(code = {}, arr) {
      let _arr = arr.map((item) => {
        return Object.assign(item, code);
      });
      return _arr;
    },
  },
};
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.addOrder {
  .from_input {
    margin-top: 10px;
    width: 1000px;
    display: block;
  }
  .table_list {
    min-width: 1200px;
    width: 100%;
    margin: 10px 0;
    margin-bottom: 45px;
  }
  .table_list .title {
    font-size: 16px;
    font-weight: 600;
  }
  .table_title {
    margin: 15px 0;
  }
  .table_list_table {
    margin-top: 15px;
    padding: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  }
  .table_btn {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .table_line {
    width: 100%;
    height: 1px;
    margin: 10px 0;
    border-bottom: 1px dashed #ccc;
  }
  .table_list_box {
    padding: 20px 20px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    .serve_cherp {
      display: flex;
    }
  }
  .table_price {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .table_price_content span {
    margin-left: 15px;
  }
  .table_price_content .price {
    margin-left: 30px;
    display: inline-block;
    width: 200px;
    font-weight: bold;
  }
  .el-select {
    width: 100%;
  }
  .el-row /deep/ .el-input-number--mini {
    width: 90px;
  }
  .radio_price_selete .el-radio {
    margin-right: 15px;
  }
  .radio_price_selete /deep/ .el-radio .el-radio__label {
    padding-left: 0px;
    margin-left: 5px;
  }
  .table_list_table /deep/ .el-form-item__content {
    width: 100%;
  }
  .el-form-item {
    display: block;
  }
  .table_people {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
