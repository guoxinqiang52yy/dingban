<!--
 * @Author: 人才列表编辑 
 * @Date: 2020-11-17 15:08:49
 * @LastEditTime: 2020-12-24 11:54:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\tablelist2\index.vue
-->
<template>
  <div class="table_list tablelsit2">
    <p class="title"><b>人才合同</b></p>
    <!-- 固定表单 -->
    <div class="table_list_table">
      <el-form class="from_input" :model="codeList" ref="ruleForm" size="small" label-width="170px">
        <el-row v-for="(item, index) in codeList.codeFixed" :key="index">
          <el-col :span="16">
            <el-form-item
              :label="item.fieldCode.replace(/%/g, '')"
              :prop="'codeFixed.' + index + '.fieldValue'"
              :rules="{
                required: true,
                message: '输入不能为空',
                trigger: 'blur',
              }"
            >
              <el-input v-model="item.fieldValue"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="table_title"><b>外聘人员：</b></div>
    <div class="table_list_table">
      <el-table size="mini" :data="tablePeople" border style="width: 100%" :header-cell-style="table_heard_style">
        <el-table-column align="center" prop="job" label="岗位">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.postName" placeholder="请选择" @change="chooseJob(scope.$index, $event)">
              <el-option v-for="item in jobSelect" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="grade" label="等级">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.levelName" placeholder="请选择" @change="chooseGrade(scope.$index, $event)">
              <el-option v-for="item in gradeSelect" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="profession" label="专业">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.professionalName" placeholder="请选择" @change="chooseProfession(scope.$index, $event)">
              <el-option v-for="item in professionType" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="profession" label="证书情况" width="100">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.registerStatus" placeholder="请选择">
              <el-option v-for="item in diplomaType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="carryB" label="B本" width="80">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.hasB" placeholder="请选择">
              <el-option v-for="item in carryBType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="carryB" label="发证年限" width="80">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.ageLimit" placeholder="年限"></el-input>
            <!-- <el-select size="mini" v-model="scope.row.ageLimit" placeholder="请选择">
              <el-option v-for="item in ageLimitType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select> -->
          </template>
        </el-table-column>

        <el-table-column align="center" prop="staffCostPrice" label="标准价" width="80"> </el-table-column>
        <el-table-column align="center" prop="staffCount" label="人数" width="115">
          <template slot-scope="scope">
            <el-input-number size="mini" v-model="scope.row.staffCount" @change="changeNum(scope.$index, scope.row)" :min="0"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="staffPrice" label="单价" width="80">
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
            <el-input size="mini" v-model="scope.row.cycleValue" placeholder="时长"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="socialStatus" label="社保" width="90">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.socialStatus" placeholder="请选择">
              <el-option v-for="item in socialType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input type="textarea" resize="none" :autosize="true" size="mini" v-model="scope.row.remark"></el-input>
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

    <div class="table_title" v-if="codeList.codeIn.length > 0"><b>自定义输入:</b></div>
    <div class="table_list_table" v-if="codeList.codeIn.length > 0">
      <el-form class="from_input" :model="codeList" ref="ruleForm" size="small" label-width="170px">
        <el-row v-for="(item, index) in codeList.codeIn" :key="index">
          <el-col :span="12">
            <el-form-item
              :label="item.fieldCode.replace(/%/g, '')"
              :prop="'codeIn.' + index + '.fieldValue'"
              :rules="{
                required: true,
                message: '输入不能为空',
                trigger: 'blur',
              }"
            >
              <el-input v-model="item.fieldValue"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <pay ref="pay" :datas="payLists" :price="totlePrice"></pay>
  </div>
</template>

<script>
import pay from "../../components/pay/index.vue";
import myMixin from "../../assets/js/minx/minx";
export default {
  name: "",
  mixins: [myMixin],
  components: { pay },
  props: ["datas", "tax", "type", "groupId", "orderId", "contractId", "templateLists"],
  data() {
    return {
      //临时数据
      tempData: this.datas,
      contractIds: "",
      orderIds: "",
      templateList: "",
      //字段列表
      codeList: {
        codeFixed: [
          { fieldName: "甲方名称", fieldCode: "%甲方名称%", fieldType: 1, fieldValue: "" },
          { fieldName: "乙方名称", fieldCode: "%乙方名称%", fieldType: 1, fieldValue: "" },
          { fieldName: "邮寄地址", fieldCode: "%邮寄地址%", fieldType: 1, fieldValue: "" },
          { fieldName: "邮编", fieldCode: "%邮编%", fieldType: 1, fieldValue: "" },
          { fieldName: "电话", fieldCode: "%电话%", fieldType: 1, fieldValue: "" },
          { fieldName: "企业负责人", fieldCode: "%企业负责人%", fieldType: 1, fieldValue: "" },
        ],
        codeIn: [
          // { fieldName: "甲方名称", fieldCode: "%甲方名称%", fieldType: 2, fieldValue: "" },
          // { fieldName: "乙方名称", fieldCode: "%乙方名称%", fieldType: 2, fieldValue: "" },
          // { fieldName: "邮寄地址", fieldCode: "%邮寄地址%", fieldType: 2, fieldValue: "" },
          // { fieldName: "邮编", fieldCode: "%邮编%", fieldType: 2, fieldValue: "" },
        ],
      },

      //含税
      isPeopleTaxPrice: 1,
      //支付
      payLists: [],
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
          label: "临时注册",
        },
      ],
      //b本情况
      carryBType: [
        {
          value: 2,
          label: "有",
        },
        {
          value: 1,
          label: "无",
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
        {
          postId: "",
          postName: "",
          postLevel: "",
          levelName: "",
          postProfessional: "",
          professionalName: "",
          registerStatus: "",
          hasB: "",
          ageLimit: "",
          staffCostPrice: 120, //标准价(后台获取)
          // staffOrgPrice: 122, //标准价(后台获取)
          staffPrice: 0, //手输入价格
          cycleType: "",
          cycleValue: "",
          socialStatus: "",
          staffCount: "",
          totlePrice: 0, //计算
          remark: "人员手填",
          // updateTime: "2020-11-11",
        },
      ],
    };
  },
  computed: {
    totlePrice() {
      let sum = this.tablePeople.reduce((t, b) => {
        return parseInt(t) + parseInt(b.totlePrice || 0);
      }, 0);
      return parseInt(this.isPeopleTaxPrice * sum);
    },
  },
  watch: {},
  created() {
    if (this.type == "add") {
      this.init();
    } else {
      this.edit();
    }
  },
  mounted() {},
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 父级操作 */
    getData() {
      let _pay = this.$refs.pay.getData();
      let _peopleData = JSON.parse(JSON.stringify(this.tablePeople));
      let _payList = this.addeteCode({ orderId: this.orderIds, contractId: this.contractIds }, _pay);
      let _tablePeople = this.addeteCode({ orderId: this.orderIds, contractId: this.contractIds }, _peopleData);
      console.log(_tablePeople);
      _tablePeople = this.deleteCode(["totlePrice"], _tablePeople);
      let _tempData = {
        contractDetail: [...this.codeList.codeFixed, ...this.codeList.codeIn],
        orderTalent: [..._tablePeople],
        contractList: {
          contractId: this.contractIds,
          contractName: this.tempData.contractName,
          contractType: this.tempData.contractType,
          orderId: this.orderIds,
          templateId: this.tempData.templateId,
          contractCode: this.tempData.contractCode,
          callBack: 0,
          signTime2: 0,
          signTime1: 0,
        },
        paymentList: [..._payList],
        totlePrice: parseInt(this.totlePrice),
        tempCode: parseInt(this.isPeopleTaxPrice == 1 ? 0 : 4),
      };

      return _tempData;
    },
    //初始化
    init() {
      console.log(this.tempData);
      this.contractIds = this.tempData.contractId;
      this.orderIds = this.tempData.orderId;
      this.templateList = this.tempData.templateLists;
      console.log(this.contractIds, "合同id");
      console.log(this.orderIds, "订单id");
      console.log(this.groupId, "服务id");
      console.log(this.templateList, "模板");
      //将orderId 输入内容 添加到字段中
      this.addFixed(this.contractIds, this.templateList);
      this.getJob();
    },
    //编辑初始化
    edit() {
      this.getJob();
      this.contractIds = this.tempData.contractId;
      this.orderIds = this.orderId;
      console.log(this.tempData);
      //获取输入框数据
      this.addFixed2(this.tempData.contractDetail);

      //获取列表数据
      let _aa = JSON.parse(JSON.stringify(this.tempData.orderTalent));
      this.tablePeople = this.addRow(_aa, "staffCount", "staffPrice");
      //支付
      this.payLists = JSON.stringify(this.tempData.paymentList);
      //获取含税状态
      let codes = this.tax;
      (codes & 0x04) == 0 ? (this.isPeopleTaxPrice = 1) : (this.isPeopleTaxPrice = 1.04);

      //计算服务row总价

      //计算人员row 总价
    },
    //测试用 获取输入内容
    gettest() {
      console.log([...this.codeList.codeFixed, ...this.codeList.codeIn]);
    },

    deletePeopel(index, data) {
      this.tablePeople.splice(index, 1);
    },
    addPeople() {
      let PeopleTemplate = {
        postId: "",
        postName: "",
        postLevel: "",
        levelName: "",
        postProfessional: "",
        professionalName: "",
        registerStatus: "",
        hasB: "",
        ageLimit: "",
        staffCostPrice: 120, //标准价(后台获取)
        staffPrice: 0, //手输入价格
        cycleType: "",
        cycleValue: "",
        socialStatus: "",
        staffCount: "",
        totlePrice: 0, //计算
        remark: "人员手填",
      };
      this.tablePeople.push(PeopleTemplate);
    },
    changeNum(index, data) {
      data.totlePrice = parseInt(data.staffCount) * parseInt(data.staffPrice);
    },
    changePrice(index, data) {
      data.staffPrice.replace(/[^\d.]/g, "");
      if (data.staffPrice != "") data.totlePrice = parseInt(data.staffCount) * parseInt(data.staffPrice);
      console.log(data.totlePrice);
    },
    //人员3级联动
    chooseJob(index, e) {
      let obj = this.jobSelect.find((item) => {
        return item.attributeName == e;
      });
      this.tablePeople[index].postId = obj.attributeId;
      console.log(obj.attributeId);
      this.tablePeople[index].levelName = "";
      this.tablePeople[index].postLevel = "";
      this.tablePeople[index].postProfessional = "";
      this.tablePeople[index].professionalName = "";
      this.getGrade(obj.attributeId);
    },
    chooseGrade(index, e) {
      let obj = this.gradeSelect.find((item) => {
        return item.attributeName == e;
      });
      this.tablePeople[index].postLevel = obj.attributeId;
      this.tablePeople[index].postProfessional = "";
      this.tablePeople[index].professionalName = "";
      this.getProfession(obj.attributeId);
    },
    chooseProfession(index, e) {
      console.log(e);
      // this.professionalName = "";
      // this.postProfessional = "";
      let obj = this.professionType.find((item) => {
        return item.attributeName == e;
      });
      this.tablePeople[index].postProfessional = obj.attributeId;
      console.log(this.tableAlreadyPeople);
    },
    /* 接口 */
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
        item.totlePrice = parseInt(item.staffCount) * parseInt(item.staffPrice);
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
<style scoped lang="less">
.tablelsit2 {
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
    margin-right: 0;
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
