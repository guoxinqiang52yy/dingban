<!--
 * @Author:自有人员列表组件
 * @Date: 2020-12-09 14:22:46
 * @LastEditTime: 2020-12-30 17:51:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\listHavePeople\index.vue
-->

<template>
  <div class="haveList">
    <div class="table_title"><b>自有人员:</b></div>
    <div class="table_list_box">
      <el-table size="mini" :data="tableAlreadyPeople" border style="width: 100%" :header-cell-style="table_heard_style">
        <el-table-column align="center" prop="type" label="类型" width="120">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.staffType" placeholder="请选择" @change="chooseType(scope.$index, $event, scope.row)">
              <el-option v-for="item in typeDropList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="job" label="岗位" width="160">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.postName" placeholder="请选择" @change="chooseJob(scope.$index, $event)">
              <el-option v-for="item in scope.row.jobList" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="grade" label="等级" width="160">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.levelName" placeholder="请选择" @change="chooseGrade(scope.$index, $event)">
              <el-option v-for="item in scope.row.levelList" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="profession" label="专业" width="160">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.professionalName" placeholder="请选择" @change="chooseProfession(scope.$index, $event)">
              <el-option v-for="item in scope.row.professList" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="registerStatus" label="证书情况" width="120">
          <template slot-scope="scope">
            <!-- scope.row.postName.includes('建造师') -->
            <el-select size="mini" :disabled="scope.row.staffType != 1 || !scope.row.postName.includes('建造师')" v-model="scope.row.registerStatus" placeholder="请选择" @change="choosRegister(scope.$index, $event)">
              <el-option v-for="item in diplomaType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="hasB" label="B本" width="100">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="scope.row.staffType != 1 || !scope.row.postName.includes('建造师')" v-model="scope.row.hasB" placeholder="请选择" @change="choosHsB(scope.$index, $event)">
              <el-option v-for="item in carryBType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="social" label="社保" width="120">
          <template slot-scope="scope">
            <el-select :disabled="scope.row.staffType != 1" size="mini" v-model="scope.row.social" placeholder="请选择" @change="choosSociety(scope.$index, $event)">
              <el-option v-for="item in socialType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ageLimit" label="年限" width="80">
          <template slot-scope="scope">
            <el-input :disabled="scope.row.staffType != 1" size="mini" v-model="scope.row.ageLimit" @input="choosInput(scope.$index, $event)"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="staffCount" label="人数" width="115">
          <template slot-scope="scope">
            <el-input-number size="mini" v-model="scope.row.staffCount" @change="changeNum(scope.$index, scope.row)" :min="1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="staffCostPrice" label="标准价" width="80"> </el-table-column>
        <el-table-column align="center" prop="staffPrice" label="单价" width="100">
          <template slot-scope="scope">
            <el-input size="mini" :disabled="scope.row.staffType == 1" v-model="scope.row.staffPrice" placeholder="价格" @keyup.native="inputPrice(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="totlePrice" label="总价" width="80"> </el-table-column>

        <el-table-column align="center" prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input type="textarea" resize="none" size="mini" :autosize="true" placeholder="请输入备注" v-model="scope.row.remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="people" label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" plain @click="deletePeopel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table_btn">
        <div></div>
        <el-button type="primary" size="mini" plain @click="addPeople">添加自有人员</el-button>
      </div>
      <!-- 价格 -->
      <div class="table_price">
        <p></p>
        <div class="table_price_content">
          <el-radio-group v-model="isPeopleTaxPrice" class="radio_price_selete">
            <el-radio :label="1.04">含税</el-radio>
            <el-radio :label="1">不含税</el-radio>
          </el-radio-group>
          <span class="price"> 人员咨询费合计：{{ totleAlreadyPeople }} 元</span>
        </div>
      </div>
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
      tempData: this.datas,
      contractIds: this.contractId,
      orderIds: this.orderId,
      templateList: "",
      //含税否
      isPeopleTaxPrice: 1,
      tableAlreadyPeople: [
        // {
        //   staffType: "",
        //   postId: "",
        //   postName: "",
        //   postLevel: "",
        //   levelName: "",
        //   postProfessional: "",
        //   professionalName: "",
        //   registerStatus: "",
        //   hasB: "",
        //   staffCount: 1,
        //   staffCostPrice: 0, // 获取
        //   // staffOrgPrice: 120, // 获取
        //   staffPrice: 0, //手输入
        //   totlePrice: 0,
        //   ageLimit: "",
        //   social: "",
        //   remark: "人员手填",
        // },
      ],
      //自有人员类型下拉
      typeDropList: [
        {
          value: 1,
          label: "有证",
        },
        {
          value: 2,
          label: "考证",
        },
        {
          value: 3,
          label: "办证",
        },
      ],
      //岗位
      jobSelect: [
        {
          value: 33,
          label: "黄金糕2",
        },
        {
          value: 34,
          label: "双皮奶2",
        },
        {
          value: 35,
          label: "蚵仔煎2",
        },
      ],
      //等级
      gradeSelect: [
        {
          value: 41,
          label: "黄金糕2",
        },
        {
          value: 42,
          label: "双皮奶2",
        },
        {
          value: 43,
          label: "蚵仔煎2",
        },
      ],
      //专业
      professionType: [
        {
          value: 51,
          label: "黄金糕2",
        },
        {
          value: 52,
          label: "双皮奶2",
        },
        {
          value: 53,
          label: "蚵仔煎2",
        },
      ],
      //证书情况
      diplomaType: [
        {
          value: 1,
          label: "初始注册",
        },
        {
          value: 2,
          label: "变更注册",
        },
        {
          value: 3,
          label: "重新注册",
        },
        {
          value: 4,
          label: "延续注册",
        },
      ],
      //B本情况
      carryBType: [
        {
          value: 2,
          label: "带B",
        },
        {
          value: 1,
          label: "不带B",
        },
      ],
      //社保情况
      socialType: [
        {
          value: 1,
          label: "临时",
        },
        {
          value: 2,
          label: "唯一",
        },
        {
          value: 3,
          label: "不上",
        },
      ],
      payLists: [],
      //获取价格
      isB: "",
      postId: "",
      levelId: "",
      majorId: "",
      socialStatus: "",
      registerStatus: "",
    };
  },
  computed: {
    //手输价格总计
    totleAlreadyPeople() {
      let sum = this.tableAlreadyPeople.reduce((t, b) => {
        return parseInt(t) + parseFloat(b.totlePrice || 0).toFixed(2);
      }, 0);
      // this.$emit("haveprice", parseInt(this.isPeopleTaxPrice * sum), parseInt(this.isPeopleTaxPrice == 1 ? 0 : 2));
      // return parseInt(this.isPeopleTaxPrice * sum);
      this.$emit("haveprice", parseFloat(sum), parseInt(this.isPeopleTaxPrice == 1 ? 0 : 2));
      return parseFloat(sum);
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.inti();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  filters: {
    // formatType(row) {
    //   console.log(row, "表格~~~~");
    //   if (row.registerStatus == 0) {
    //     return "-";
    //   } else {
    //     return row.registerStatus;
    //   }
    // },
  },
  methods: {
    /* 父级操作 */
    showData() {
      let _peopleData = JSON.parse(JSON.stringify(this.tableAlreadyPeople));
      let _tableAlreadyPeople = this.addeteCode({ orderId: this.orderIds, contractId: this.contractIds }, _peopleData);
      _tableAlreadyPeople = this.deleteCode(["totlePrice", "jobList", "levelList", "professList"], _tableAlreadyPeople);
      return _tableAlreadyPeople;
    },

    /* 初始化 */
    inti() {
      this.getJob();
      if (this.datas) {
        let _bb = JSON.parse(JSON.stringify(this.tempData));
        this.tableAlreadyPeople = this.addRow(_bb, "staffCount", "staffPrice");
        (this.tax & 0x02) == 0 ? (this.isPeopleTaxPrice = 1) : (this.isPeopleTaxPrice = 1.04);
      }
    },
    /*自有人员列表操作*/
    addPeople() {
      let AlreadyPeopleTemplate = {
        //临时数组
        jobList: this.jobSelect,
        levelList: [],
        professList: [],
        staffType: "",
        postId: "",
        postName: "",
        postLevel: "",
        levelName: "",
        postProfessional: "",
        professionalName: "",
        registerStatus: "",
        hasB: "",
        // standardId: "", //传给后端使用 获取价格
        staffCount: 1,
        staffCostPrice: 0, // 获取
        staffPrice: 0, //手输入
        totlePrice: 0,
        ageLimit: "",
        social: "",
        remark: "",
      };
      this.tableAlreadyPeople.push(AlreadyPeopleTemplate);
    },
    chooseType(index, e, data) {
      console.log(e);
      if (e == 1) {
        this.tableAlreadyPeople[index].staffPrice = 0;
        data.totlePrice = (parseFloat(data.staffCount) * parseFloat(data.staffPrice)).toFixed(2);

        this.tableAlreadyPeople[index].social = "";
        this.tableAlreadyPeople[index].hasB = "";
        this.tableAlreadyPeople[index].ageLimit = "";
        this.tableAlreadyPeople[index].registerStatus = "";
      } else {
        this.tableAlreadyPeople[index].social = 0;
        this.tableAlreadyPeople[index].hasB = 0;
        this.tableAlreadyPeople[index].ageLimit = 0;
        this.tableAlreadyPeople[index].registerStatus = 0;
      }
    },
    //人员3级联动
    async chooseJob(index, e) {
      let _thisdata = this.tableAlreadyPeople[index];
      let obj = this.tableAlreadyPeople[index].jobList.find((item) => {
        return item.attributeName == e;
      });
      this.tableAlreadyPeople[index].postId = obj.attributeId;
      console.log(obj.attributeId);
      this.tableAlreadyPeople[index].levelName = "";
      this.tableAlreadyPeople[index].postLevel = "";
      this.tableAlreadyPeople[index].postProfessional = "";
      this.tableAlreadyPeople[index].professionalName = "";
      this.getGrade(obj.attributeId, index);
      //岗位为建造师 固定证书 B本的值
      console.log(this.tableAlreadyPeople[index], "岗位");
      if (obj.attributeName.includes("建造师") && _thisdata.staffType == 1) {
        console.log("==建造师==");
        this.tableAlreadyPeople[index].registerStatus = "";
        this.tableAlreadyPeople[index].hasB = "";
      } else {
        this.tableAlreadyPeople[index].registerStatus = 0;
        this.tableAlreadyPeople[index].hasB = 0;
      }

      //根据id 获取价格
      this.getPrice2(index, this.tableAlreadyPeople[index]);
    },
    async chooseGrade(index, e) {
      let obj = this.tableAlreadyPeople[index].levelList.find((item) => {
        return item.attributeName == e;
      });
      this.tableAlreadyPeople[index].postLevel = obj.attributeId;
      this.tableAlreadyPeople[index].postProfessional = "";
      this.tableAlreadyPeople[index].professionalName = "";
      this.getProfession(obj.attributeId, index);
      //根据等级id 获取价格

      this.getPrice2(index, this.tableAlreadyPeople[index]);
    },
    async chooseProfession(index, e) {
      console.log(e);
      // this.professionalName = "";
      // this.postProfessional = "";
      let obj = this.tableAlreadyPeople[index].professList.find((item) => {
        return item.attributeName == e;
      });
      this.tableAlreadyPeople[index].postProfessional = obj.attributeId;
      console.log(obj);

      //根据专业id 获取价格
      this.getPrice2(index, this.tableAlreadyPeople[index]);
      // this.majorId = obj.attributeId;
      // let _a = await this.getPrice(this.postId, this.levelId, this.majorId);
      // this.tableAlreadyPeople[index].staffCostPrice = _a;
    },
    choosRegister(index, e) {
      this.getPrice2(index, this.tableAlreadyPeople[index]);
    },
    choosHsB(index, e) {
      this.getPrice2(index, this.tableAlreadyPeople[index]);
    },
    choosInput(index, e) {
      this.getPrice2(index, this.tableAlreadyPeople[index]);
    },
    choosSociety(index, e) {
      this.getPrice2(index, this.tableAlreadyPeople[index]);
    },
    deletePeopel(index, data) {
      console.log(index);
      this.tableAlreadyPeople.splice(index, 1);
    },
    //自有人员价格计算（手输价格）
    changeNum(index, data) {
      data.totlePrice = (parseFloat(data.staffCount) * parseFloat(data.staffPrice)).toFixed(2);
    },
    inputPrice(data) {
      data.staffPrice = data.staffPrice.replace(/[^\d.^\.]/g, "");
      if (data.staffPrice != "") data.totlePrice = (parseFloat(data.staffCount) * parseFloat(data.staffPrice)).toFixed(2);
      console.log(data.totlePrice);
    },

    /* 接口 */
    //服务联动
    async getSecondList(id) {
      //  let _id1 = await this.Axios.get(`product-api/productgroup/getIdByPath?path=${path}`);
      // this.tempId1 = _id1.data.result;
      let _resp2 = await this.Axios.get(`product-api/productgroup/list?firstLevel=${id}`);
      console.log(_resp2.data.result);
      this.serveList1 = _resp2.data.result;
    },

    async getThirdList(id1, id2) {
      let _resp2 = await this.Axios.get(`product-api/skulist/getSkuListByParams?areaId=3&pageSize=999&pageNum=0&firstLevel=${id1}&secondLevel=${id2}}`);

      this.serveList2 = _resp2.data.result;
    },
    async getType(productId) {
      let _resp = await this.Axios.get(`product-api/skulist/skuAttrListByParams?areaId=3&productId=${productId}`);

      this.serveList3 = _resp.data.result;
    },
    //获取标准人员信息
    async getPeoList(productId) {
      let _resp = await this.Axios.get(`product-api/skulist/skuAttrListByParams?areaId=3&productId=${productId}`);
      console.log(_resp.data.result);
    },
    //人员联动
    //岗位
    async getJob() {
      let _resp = await this.Axios.get(`product-api/standardattribute/list?parentId=0`);
      console.log(_resp.data.result);
      this.jobSelect = _resp.data.result;
    },
    //等级
    async getGrade(id, index) {
      let _resp = await this.Axios.get(`product-api/standardattribute/list?parentId=${id}`);
      console.log(_resp.data);
      this.gradeSelect = _resp.data.result;
      this.tableAlreadyPeople[index].levelList = _resp.data.result;
    },
    //专业
    async getProfession(id, index) {
      let _resp = await this.Axios.get(`product-api/standardattribute/list?parentId=${id}`);
      console.log(_resp.data);
      this.professionType = _resp.data.result;
      this.tableAlreadyPeople[index].professList = _resp.data.result;
    },
    //获取人员标准列表
    async getPeopleType(productId) {
      let _resp = await this.Axios.get(`product-api/skustandard/list?areaId=${this.areaId}&productId=${productId}`);
      console.log(_resp.data);
    },

    //获取参考价格
    async getPrice() {
      if (!this.postId || !this.levelId || !this.majorId) {
        return;
      }
      let _resp = await this.Axios.get(`product-api/standardlist/getByParams?postId=${this.postId}&levelId=${this.levelId}&majorId=${this.majorId}&socialStatus=${this.socialStatus}&registerStatus=${this.registerStatus}&isB=${this.isB}`).catch(() => {});
      console.log(_resp);
      let _a = 0;
      if (_resp) {
        _a = _resp.data.result.examPrice;
      } else {
        _a = 0;
      }
      return _a;
    },
    async getPrice2(index, arr) {
      let _resp;
      console.log(arr);
      if (this.tableAlreadyPeople[index].staffType == 1) {
        return;
        if (arr.postId && arr.postLevel && arr.postProfessional && arr.registerStatus && arr.hasB && arr.ageLimit && arr.social)
          _resp = await this.Axios.get(
            `product-api/standardlist/getByParams?postId=${arr.postId}&levelId=${arr.postLevel}&majorId=${arr.postProfessional}&socialStatus=${arr.social}&registerStatus=${arr.registerStatus}&isB=${arr.hasB}&ageLimit=${arr.ageLimit == 0 ? "" : arr.ageLimit}`
          ).catch(() => {});
      } else {
        if (arr.postId && arr.postLevel && arr.postProfessional) _resp = await this.Axios.get(`product-api/standardunlicensedlist/getByParams?postId=${arr.postId}&levelId=${arr.postLevel}&majorId=${arr.postProfessional}`).catch(() => {});
      }
      console.log(_resp);
      let _a = 0;
      if (_resp) {
        if (arr.staffType == 1) {
          _a = _resp.data.result.engPrice;
        } else if (arr.staffType == 2) {
          _a = _resp.data.result.examPrice;
        } else {
          _a = _resp.data.result.dealPrice;
        }
      } else {
        _a = 0;
      }
      this.tableAlreadyPeople[index].staffCostPrice = _a;
    },
    /* 数据处理 */
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
      console.log(_arr);
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
.haveList {
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
    justify-content: space-between;
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

  .el-input-number--mini {
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
}
</style>
