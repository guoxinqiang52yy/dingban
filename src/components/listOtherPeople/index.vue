<!--
 * @Author:  外聘人员列表组件
 * @Date: 2020-12-09 14:22:36
 * @LastEditTime: 2020-12-30 17:02:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\listOtherPeople\index.vue
-->
<template>
  <div class="otherList">
    <div class="table_title"><b>外聘人员：</b></div>
    <div class="table_list_table">
      <el-table size="mini" :data="tablePeople" border style="width: 100%" :header-cell-style="table_heard_style">
        <el-table-column align="center" prop="job" label="岗位">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.postName" placeholder="请选择" @change="chooseJob(scope.$index, $event)">
              <el-option v-for="item in scope.row.jobList" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="grade" label="等级">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.levelName" placeholder="请选择" @change="chooseGrade(scope.$index, $event)">
              <el-option v-for="item in scope.row.levelList" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="profession" label="专业">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.professionalName" placeholder="请选择" @change="chooseProfession(scope.$index, $event)">
              <el-option v-for="item in scope.row.professList" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="profession" label="证书情况" width="100">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="!scope.row.postName.includes('建造师')" v-model="scope.row.registerStatus" placeholder="请选择" @change="choosRegister(scope.$index, $event)">
              <el-option v-for="item in diplomaType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="carryB" label="B本" width="80">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="!scope.row.postName.includes('建造师')" v-model="scope.row.hasB" placeholder="请选择" @change="choosHsB(scope.$index, $event)">
              <el-option v-for="item in carryBType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="socialStatus" label="社保" width="90">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.socialStatus" placeholder="请选择" @change="choosSociety(scope.$index, $event)">
              <el-option v-for="item in socialType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="carryB" label="年限" width="80">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.ageLimit" placeholder="年限" @input="choosInput(scope.$index, $event, scope.row)"></el-input>
            <!-- <el-select size="mini" v-model="scope.row.ageLimit" placeholder="请选择">
              <el-option v-for="item in ageLimitType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select> -->
          </template>
        </el-table-column>

        <el-table-column align="center" prop="staffCostPrice" label="标准价" width="80"> </el-table-column>
        <el-table-column align="center" prop="staffCount" label="人数" width="115">
          <template slot-scope="scope">
            <el-input-number size="mini" v-model="scope.row.staffCount" @change="changeNum(scope.$index, scope.row)" :min="1"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="staffPrice" label="单价" width="100">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.staffPrice" placeholder="价格" @keyup.native="changePrice(scope.$index, scope.row)"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="totlePrice" label="总价" width="80"> </el-table-column>
        <el-table-column align="center" prop="year" label="聘用周期" width="95">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.cycleType" placeholder="请选择">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="cycleValue" label="聘用时长(月)" width="100">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.cycleValue" placeholder="时长" @keyup.native="changeValue(scope.$index, scope.row)"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input type="textarea" resize="none" placeholder="请输入备注" :autosize="true" size="mini" v-model="scope.row.remark"></el-input>
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
        <el-button type="primary" size="mini" plain @click="addPeople">添加外聘人员</el-button>
      </div>
      <div class="table_price">
        <p></p>
        <div class="table_price_content">
          <el-radio-group v-model="isPeopleTaxPrice" class="radio_price_selete">
            <el-radio :label="1.04">含税</el-radio>
            <el-radio :label="1">不含税</el-radio>
          </el-radio-group>
          <span class="price"> 人员咨询费合计：{{ totlePrice }} 元</span>
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
      //临时数据
      tempData: this.datas,
      contractIds: this.contractId,
      orderIds: this.orderId,
      templateList: "",
      //含税
      isPeopleTaxPrice: 1,
      //岗位
      jobSelect: [
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
      //等级
      gradeSelect: [
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
      //发证年限
      ageLimitType: [
        {
          value: 5,
          label: "满5年",
        },
        {
          value: 8,
          label: "满8年",
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
      //b本情况
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
      //聘用周期
      typeList: [
        {
          value: 1,
          label: "次数",
        },
        {
          value: 2,
          label: "时间",
        },
      ],
      //社保
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
      //人才列表
      tablePeople: [
        // {
        //   postId: "",
        //   postName: "",
        //   postLevel: "",
        //   levelName: "",
        //   postProfessional: "",
        //   professionalName: "",
        //   registerStatus: "",
        //   hasB: "",
        //   ageLimit: "",
        //   staffCostPrice: 120, //标准价(后台获取)
        //   // staffOrgPrice: 122, //标准价(后台获取)
        //   staffPrice: 0, //手输入价格
        //   cycleType: "",
        //   cycleValue: "",
        //   socialStatus: "",
        //   staffCount: "",
        //   totlePrice: 0, //计算
        //   remark: "人员手填",
        // },
      ],
      //获取价格
      postId: "",
      levelId: "",
      majorId: "",
    };
  },
  computed: {
    //手输价格总计
    totlePrice() {
      let sum = this.tablePeople.reduce((t, b) => {
        return parseInt(t) + parseFloat(b.totlePrice || 0).toFixed(2);
      }, 0);
      this.$emit("otherprice", parseFloat(sum).toFixed(2), parseInt(this.isPeopleTaxPrice == 1 ? 0 : 4));
      return parseFloat(sum);
      // this.$emit("otherprice", parseInt(this.isPeopleTaxPrice * sum), parseInt(this.isPeopleTaxPrice == 1 ? 0 : 4));
      // return parseInt(this.isPeopleTaxPrice * sum);
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
    /*初始化*/
    init() {
      this.getJob();
      if (this.datas) {
        let _aa = JSON.parse(JSON.stringify(this.tempData));
        this.tablePeople = this.addRow(_aa, "staffCount", "staffPrice");
        (this.tax & 0x04) == 0 ? (this.isPeopleTaxPrice = 1) : (this.isPeopleTaxPrice = 1.04);
      }
    },
    /* 父级操作 */
    showData() {
      let _peopleData = JSON.parse(JSON.stringify(this.tablePeople));
      let _tablePeople = this.addeteCode({ orderId: this.orderIds, contractId: this.contractIds }, _peopleData);
      _tablePeople = this.deleteCode(["totlePrice", "jobList", "levelList", "professList"], _tablePeople);
      return _tablePeople;
    },
    deletePeopel(index, data) {
      this.tablePeople.splice(index, 1);
    },
    addPeople() {
      let PeopleTemplate = {
        //临时数组
        jobList: this.jobSelect,
        levelList: [],
        professList: [],
        postId: "",
        postName: "",
        postLevel: "",
        levelName: "",
        postProfessional: "",
        professionalName: "",
        registerStatus: "",
        hasB: "",
        ageLimit: "",
        staffCostPrice: 0, //标准价(后台获取)
        staffPrice: 0, //手输入价格
        cycleType: "",
        cycleValue: "",
        socialStatus: "",
        staffCount: "",
        totlePrice: 0, //计算
        remark: "",
      };
      this.tablePeople.push(PeopleTemplate);
    },
    changeNum(index, data) {
      data.totlePrice = (parseFloat(data.staffCount) * parseFloat(data.staffPrice)).toFixed(2);
    },
    changePrice(index, data) {
      data.staffPrice = data.staffPrice.replace(/[^\d^\.]/g, "");

      if (data.staffPrice != "") data.totlePrice = (parseFloat(data.staffCount) * parseFloat(data.staffPrice)).toFixed(2);
    },
    changeValue(index, data) {
      data.cycleValue = data.cycleValue.replace(/[^\d]/g, "");
    },
    //人员3级联动
    async chooseJob(index, e) {
      let obj = this.tablePeople[index].jobList.find((item) => {
        return item.attributeName == e;
      });
      this.tablePeople[index].postId = obj.attributeId;
      console.log(obj.attributeId);
      this.tablePeople[index].levelName = "";
      this.tablePeople[index].postLevel = "";
      this.tablePeople[index].postProfessional = "";
      this.tablePeople[index].professionalName = "";
      this.getGrade(obj.attributeId, index);
      //岗位为建造师 固定证书 B本的值
      console.log(obj.attributeName);
      if (obj.attributeName.includes("建造师")) {
        this.tablePeople[index].registerStatus = "";
        this.tablePeople[index].hasB = "";
      } else {
        this.tablePeople[index].registerStatus = 0;
        this.tablePeople[index].hasB = 0;
      }
      //根据岗位id 获取价格
      //根据id 获取价格
      this.getPrice2(index, this.tablePeople[index]);
      // this.postId = obj.attributeId;
      // let _a = await this.getPrice(this.postId);
      // this.tablePeople[index].staffCostPrice = _a;
    },
    async chooseGrade(index, e) {
      let obj = this.tablePeople[index].levelList.find((item) => {
        return item.attributeName == e;
      });
      this.tablePeople[index].postLevel = obj.attributeId;
      this.tablePeople[index].postProfessional = "";
      this.tablePeople[index].professionalName = "";
      this.getProfession(obj.attributeId, index);
      //根据等级id 获取价格
      //根据id 获取价格
      this.getPrice2(index, this.tablePeople[index]);
      // this.levelId = obj.attributeId;
      // let _a = await this.getPrice(this.postId, this.levelId);
      // this.tablePeople[index].staffCostPrice = _a;
    },
    async chooseProfession(index, e) {
      console.log(e);
      // this.professionalName = "";
      // this.postProfessional = "";
      let obj = this.tablePeople[index].professList.find((item) => {
        return item.attributeName == e;
      });
      this.tablePeople[index].postProfessional = obj.attributeId;

      //根据等级id 获取价格
      //根据id 获取价格
      this.getPrice2(index, this.tablePeople[index]);
      // this.majorId = obj.attributeId;
      // let _a = await this.getPrice(this.postId, this.levelId, this.majorId);
      // this.tablePeople[index].staffCostPrice = _a;
    },
    choosRegister(index, e) {
      this.getPrice2(index, this.tablePeople[index]);
    },
    choosHsB(index, e) {
      this.getPrice2(index, this.tablePeople[index]);
    },
    choosInput(index, e, data) {
      data.ageLimit = data.ageLimit.replace(/[^\d]/g, "");
      this.getPrice2(index, this.tablePeople[index]);
    },
    choosSociety(index, e) {
      this.getPrice2(index, this.tablePeople[index]);
    },

    /* 接口 */
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
      this.tablePeople[index].levelList = _resp.data.result;
    },
    //专业
    async getProfession(id, index) {
      let _resp = await this.Axios.get(`product-api/standardattribute/list?parentId=${id}`);
      console.log(_resp.data);
      this.professionType = _resp.data.result;
      this.tablePeople[index].professList = _resp.data.result;
    },
    //获取参考价格
    async getPrice(postId = "", levelId = "", majorId = "") {
      let _resp = await this.Axios.get(`product-api/standardlist/getByParams?postId=${postId}&levelId=${levelId}&majorId=${majorId}`).catch(() => {});
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
      if (this.tablePeople[index].postName == "建造师") {
        if (arr.postId && arr.postLevel && arr.postProfessional && arr.registerStatus && arr.hasB && arr.ageLimit && arr.socialStatus)
          _resp = await this.Axios.get(
            `product-api/standardlist/getByParams?postId=${arr.postId}&levelId=${arr.postLevel}&majorId=${arr.postProfessional}&socialStatus=${arr.socialStatus}&registerStatus=${arr.registerStatus}&isB=${arr.hasB}&ageLimit=${arr.ageLimit == 0 ? "" : arr.ageLimit}`
          ).catch(() => {});
      } else {
        if (arr.postId && arr.postLevel && arr.postProfessional && arr.ageLimit && arr.socialStatus)
          _resp = await this.Axios.get(
            `product-api/standardlist/getByParams?postId=${arr.postId}&levelId=${arr.postLevel}&majorId=${arr.postProfessional}&socialStatus=${arr.socialStatus}&registerStatus=${arr.registerStatus}&isB=${arr.hasB}&ageLimit=${arr.ageLimit == 0 ? "" : arr.ageLimit}`
          ).catch(() => {});
      }
      console.log(_resp);
      let _a = 0;
      if (_resp) {
        _a = _resp.data.result.engPrice;
        // if (arr.staffType == 1) {
        //   _a = _resp.data.result.engPrice;
        // } else if (arr.staffType == 2) {
        //   _a = _resp.data.result.examPrice;
        // } else {
        //   _a = _resp.data.result.dealPrice;
        // }
      } else {
        _a = 0;
      }
      this.tablePeople[index].staffCostPrice = _a;
    },
    /* 数据处理 */
    //输入框内容拆分固定 & 添加
    addFixed2(arr) {
      this.codeList.codeFixed = arr.filter((item) => {
        return item.fieldType == 1;
      });
      this.codeList.codeIn = arr.filter((item) => {
        return item.fieldType == 2;
      });
    },
    //orderId & 输入内容 添加到固定字段
    addFixed(orderId, arr) {
      this.codeList.codeFixed = this.codeList.codeFixed.map((val) => {
        return { ...val, contractId: orderId };
      });
      if (arr) {
        this.codeList.codeIn = arr.map((val) => {
          return { ...val, contractId: orderId, fieldValue: "" };
        });
      }

      console.log(this.codeList);
      // this.codeFixed = _arrTotle;
    },
    //计算row总价
    addRow(arr) {
      return arr.map((item) => {
        item.totlePrice = (parseFloat(item.staffCount) * parseFloat(item.staffPrice)).toFixed(2);
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
.otherList {
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
    font-weight: 600;
    font-size: 16px;
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
    margin-left: 170px;
  }
  .el-form-item {
    display: block;
  }
}
</style>
