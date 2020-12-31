<!--
 * @Author:  服务合同编辑
 * @Date: 2020-11-16 11:11:12
 * @LastEditTime: 2020-12-24 11:55:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\tablelist\index.vue
-->

<template>
  <div class="table_list tablelist1" v-if="tempData">
    <p class="title"><b>服务合同</b></p>
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

    <div class="table_title"><b>服务内容：</b></div>
    <div class="table_list_box">
      <el-table size="mini" :data="tableData" border style="width: 100%" :header-cell-style="table_heard_style">
        <el-table-column align="center" prop="name" label="服务名称">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.secondName" placeholder="请选择" @change="chooseServe(scope.$index, $event)">
              <el-option v-for="(item, index) in serveList1" :key="index" :label="item.name" :value="item.name"> </el-option>
            </el-select>
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.thirdName" placeholder="请选择" @change="chooseServe1(scope.$index, $event)">
              <el-option v-for="(item, index) in serveList2" :key="index" :label="item.skuName" :value="item.skuName"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="type" label="服务性质">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.skuName" placeholder="请选择" @change="chooseServe2(scope.$index, $event)">
              <el-option v-for="(item, index) in serveList3" :key="index" :label="item.attributeNames" :value="item.attributeNames"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="skuCount" label="人数" width="150">
          <template slot-scope="scope">
            <el-input-number size="mini" v-model="scope.row.skuCount" @change="changeServeNum(scope.$index, scope.row)" :min="0"></el-input-number>
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
      <div class="table_title"><b>标准人员:</b></div>
      <el-table size="mini" :data="tablePeople" border style="width: 100%" :header-cell-style="table_heard_style">
        <el-table-column align="center" prop="job" label="岗位"> </el-table-column>
        <el-table-column align="center" prop="type" label="等级"> </el-table-column>
        <el-table-column align="center" prop="profession" label="专业"> </el-table-column>
        <el-table-column align="center" prop="carryB" label="B本情况"> </el-table-column>
        <el-table-column align="center" prop="year" label="工作年限"> </el-table-column>
        <el-table-column align="center" prop="insurance" label="社保情况"> </el-table-column>
        <el-table-column align="center" prop="people" label="人数"> </el-table-column>
      </el-table>
    </div>

    <div class="table_title"><b>自有人员:</b></div>
    <div class="table_list_box">
      <el-table size="mini" :data="tableAlreadyPeople" border style="width: 100%" :header-cell-style="table_heard_style">
        <el-table-column align="center" prop="type" label="类型" width="100">
          <template slot-scope="scope">
            <el-select size="mini" :disabled="type == 'edit' && !!scope.row.orderId" v-model="scope.row.staffType" placeholder="请选择">
              <el-option v-for="item in typeDropList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
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
        <el-table-column align="center" prop="certificate" label="证书情况" width="80">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.registerStatus" placeholder="请选择">
              <el-option v-for="item in diplomaType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="hasB" label="B本" width="80">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.hasB" placeholder="请选择">
              <el-option v-for="item in carryBType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="staffCount" label="人数" width="115">
          <template slot-scope="scope">
            <el-input-number size="mini" v-model="scope.row.staffCount" @change="changeNum(scope.$index, scope.row)" :min="0"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="staffCostPrice" label="标准价" width="80"> </el-table-column>
        <el-table-column align="center" prop="staffPrice" label="单价" width="80">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.staffPrice" placeholder="价格" @keyup.native="inputPrice(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="totlePrice" label="总价" width="80"> </el-table-column>
        <el-table-column align="center" prop="ageLimit" label="年限" width="60">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.ageLimit"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="social" label="社保" width="80">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.social" placeholder="请选择">
              <el-option v-for="item in socialType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="remark" label="备注">
          <template slot-scope="scope">
            <el-input type="textarea" resize="none" size="mini" :autosize="true" v-model="scope.row.remark"></el-input>
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
    <div class="table_title" v-if="codeList.codeIn.length > 0"><b>自定义表单:</b></div>
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
    <pay ref="pay" :datas="payLists" :price="totleServe + totleAlreadyPeople"></pay>
    <!-- <pay ref="pay" :price="totleServe + totleAlreadyPeople"></pay> -->
  </div>
</template>

<script>
import pay from "../../components/pay/index.vue";
import myMixin from "../../assets/js/minx/minx";

export default {
  name: "tables",
  props: ["datas", "tax", "type", "groupId", "orderId", "contractId", "templateLists"],
  mixins: [myMixin],
  components: { pay },
  watch: {},
  data() {
    return {
      //地区id
      areaId: this.getDataStorge("userMessage").areaId || "",
      //临时数据
      tempData: this.datas,
      contractIds: "",
      orderIds: "",
      templateList: "",
      tot: "123",
      //含税累加
      tempCode: "",
      //字段列表
      codeList: {
        //固定字段
        codeFixed: [
          { fieldName: "甲方名称", fieldCode: "%甲方名称%", fieldType: 1, fieldValue: "" },
          { fieldName: "乙方名称", fieldCode: "%乙方名称%", fieldType: 1, fieldValue: "" },
          { fieldName: "邮寄地址", fieldCode: "%邮寄地址%", fieldType: 1, fieldValue: "" },
          { fieldName: "邮编", fieldCode: "%邮编%", fieldType: 1, fieldValue: "" },
          { fieldName: "电话", fieldCode: "%电话%", fieldType: 1, fieldValue: "" },
          { fieldName: "企业负责人", fieldCode: "%企业负责人%", fieldType: 1, fieldValue: "" },
        ],
        //添加字段
        codeIn: [
          // { fieldName: "甲方名称", fieldCode: "%甲方名称%", fieldType: 2, fieldValue: "" },
          // { fieldName: "乙方名称", fieldCode: "%乙方名称%", fieldType: 2, fieldValue: "" },
          // { fieldName: "邮寄地址", fieldCode: "%邮寄地址%", fieldType: 2, fieldValue: "" },
          // { fieldName: "邮编", fieldCode: "%邮编%", fieldType: 2, fieldValue: "" },
        ],
      },
      //模拟数据
      testCode: [
        { fieldName: "甲方名称", fieldCode: "%甲方名称%", fieldType: 2 },
        { fieldName: "乙方名称", fieldCode: "%乙方名称%", fieldType: 2 },
        { fieldName: "邮寄地址", fieldCode: "%邮寄地址%", fieldType: 2 },
        { fieldName: "邮编", fieldCode: "%邮编%", fieldType: 2 },
      ],

      //是否含税
      isTaxPrice: 1,
      //服务联动
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
      //服务列表
      tableData: [
        {
          secondName: "",
          thirdName: "",
          skuName: "",
          skuType: "", //服务性质id
          skuId: 123, //结合生成id
          // typeId: "",
          skuCount: 0,
          contractPrice: 0, //手输入
          sellPrice: 0, //获取价格
          totlePrice: 0,
        },
      ],
      //标准人员
      tablePeople: [
        {
          job: "建造师",
          type: "一级",
          profession: "机电专业",
          carryB: "带b",
          year: 3,
          insurance: 1,
          people: 3,
        },
      ],

      /*自有人员*/
      //含税否
      isPeopleTaxPrice: 1,
      tableAlreadyPeople: [
        {
          staffType: "",
          postId: "",
          postName: "",
          postLevel: "",
          levelName: "",
          postProfessional: "",
          professionalName: "",
          registerStatus: "",
          hasB: "",
          staffCount: 1,
          staffCostPrice: 120, // 获取
          // staffOrgPrice: 120, // 获取
          staffPrice: 0, //手输入
          totlePrice: 0,
          ageLimit: 3,
          social: "",
          remark: "人员手填",
          // updateTime: "2020-11-11",
        },
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
          label: "临时注册",
        },
      ],
      //B本情况
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
      //社保情况
      socialType: [
        {
          value: 0,
          label: "无",
        },
        {
          value: 1,
          label: "有",
        },
      ],
      payLists: [],
    };
  },
  computed: {
    totleAlreadyPeople() {
      console.log("计算");
      let sum = this.tableAlreadyPeople.reduce((t, b) => {
        return parseInt(t) + parseInt(b.totlePrice || 0);
      }, 0);
      return parseInt(this.isPeopleTaxPrice * sum);
    },
    totleServe() {
      let sum = this.tableData.reduce((t, b) => {
        return parseInt(t) + parseInt(b.totlePrice || 0);
      }, 0);
      return parseInt(this.isTaxPrice * sum);
    },
  },
  watch: {},
  created() {
    //一级分类id
    this.firstGroupId = 201203000000007;
    this.firstGroupId = this.groupId;
    console.log(this.datas, "数据");
    console.log(this.type);
    if (this.type == "add") {
      this.init();
    } else {
      this.edit();
    }
    this.getSecondList(this.firstGroupId);
  },
  mounted() {},
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 列表过滤 */
    formatType(row, column) {
      if (row.sellPrice == -1) {
        return "面议";
      } else {
        return row.sellPrice;
      }
    },
    /* 父级操作 */
    getData() {
      let _peopleData = JSON.parse(JSON.stringify(this.tableAlreadyPeople));
      let _serveData = JSON.parse(JSON.stringify(this.tableData));
      let _pay = this.$refs.pay.getData();
      let _payList = this.addeteCode({ orderId: this.orderIds, contractId: this.contractIds }, _pay);
      let _tableAlreadyPeople = this.addeteCode({ orderId: this.orderIds, contractId: this.contractIds }, _peopleData);
      _tableAlreadyPeople = this.deleteCode(["totlePrice"], _tableAlreadyPeople);
      let _serveList = this.addeteCode({ orderId: this.orderIds, contractId: this.contractIds }, _serveData);
      _serveList = this.deleteCode(["totlePrice"], _serveList);
      let _tempData = {
        contractDetail: [...this.codeList.codeFixed, ...this.codeList.codeIn], //contractDetail
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
        orderStaff: [..._tableAlreadyPeople],
        paymentList: [..._payList],
        skuMsgS: [..._serveList],
        totlePrice: this.totleServe + this.totleAlreadyPeople,
        tempCode: parseInt(this.isPeopleTaxPrice == 1 ? 0 : 1) + parseInt(this.isTaxPrice == 1 ? 0 : 2),
      };
      return _tempData;
    },

    //新建初始化
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
      //获取一级列表
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
      console.log(this.tempData);
      //获取列表数据
      let _aa = JSON.parse(JSON.stringify(this.tempData.skuMsg));
      let _bb = JSON.parse(JSON.stringify(this.tempData.orderStaff));
      this.tableData = this.addRow(_aa, "skuCount", "contractPrice");
      this.tableAlreadyPeople = this.addRow(_bb, "staffCount", "staffPrice");
      //支付
      this.payLists = JSON.stringify(this.tempData.paymentList);
      //获取含税状态
      let codes = this.tax;
      (codes & 0x02) == 0 ? (this.isPeopleTaxPrice = 1) : (this.isPeopleTaxPrice = 1.04);
      (codes & 0x01) == 0 ? (this.isTaxPrice = 1) : (this.isTaxPrice = 1.04);
    },
    /* 输入框操作 */
    //orderId & 输入内容 添加到固定字段
    addFixed(contractId, arr) {
      this.codeList.codeFixed = this.codeList.codeFixed.map((val) => {
        return { ...val, contractId: contractId };
      });
      if (arr) {
        this.codeList.codeIn = arr.map((val) => {
          return { ...val, contractId: contractId, fieldValue: "" };
        });
      }
      console.log(this.codeList);
      // this.codeFixed = _arrTotle;
    },
    //输入框内容拆分固定 & 添加
    addFixed2(arr) {
      this.codeList.codeFixed = arr.filter((item) => {
        return item.fieldType == 1;
      });
      this.codeList.codeIn = arr.filter((item) => {
        return item.fieldType == 2;
      });
    },

    /* 服务列表操作 */
    //添加服务列表
    addServeList() {
      this.tableData.push({
        name: "",
        skuName: "",
        skuType: "", //服务性质id
        skuId: 123, //结合生成id
        // typeId: "",
        skuCount: 0,
        contractPrice: 0, //手输入
        sellPrice: 1, //获取价格
        totlePrice: 0,
      });
    },
    deleteThis(index, data) {
      console.log(index);
      console.log(data);
      this.tableData.splice(index, 1);
    },
    //服务联动
    chooseServe(index, e) {
      // console.log(index);
      // console.log(e);
      let obj = this.serveList1.find((item) => {
        return item.name == e;
      });
      console.log(obj);
      this.getThirdList(this.firstGroupId, obj.groupId);
      // this.tableData[index].nameId = e;
      // this.tableData[index].name = obj.label;
    },
    chooseServe1(index, e) {
      console.log(e);
      let obj = this.serveList2.find((item) => {
        return item.skuName == e;
      });
      this.getType(obj.productId);
    },
    chooseServe2(index, e) {
      let obj = this.serveList3.find((item) => {
        return item.attributeNames == e;
      });
      console.log(obj);
      this.tableData[index].skuId = obj.skuId;
      this.tableData[index].skuType = obj.isBack;
      if (obj.price == "面议") {
        this.tableData[index].sellPrice = -1;
      } else {
        this.tableData[index].sellPrice = price;
      }

      console.log(this.tableData);
      // this.tableData[index].typeId = e;
      this.getPeopleType(obj.productId);
    },
    //服务价格计算
    changeServeNum(index, data) {
      data.totlePrice = parseInt(data.skuCount) * parseInt(data.contractPrice);
    },
    inputPriceServe(data) {
      console.log(data);
      data.contractPrice.replace(/[^\d.]/g, "");
      if (data.contractPrice != "") data.totlePrice = parseInt(data.skuCount) * parseInt(data.contractPrice);
    },

    sortDataServe(arr) {
      let _arrList = JSON.parse(JSON.stringify(arr));
      let _arr = _arrList.map((item) => {
        delete item.updateTime;
        return item;
      });
      return _arr;
    },

    /*自有人员列表操作*/
    addPeople() {
      let AlreadyPeopleTemplate = {
        staffType: "",
        postId: "",
        postName: "",
        postLevel: "",
        levelName: "",
        postProfessional: "",
        professionalName: "",
        registerStatus: "",
        hasB: "",
        staffCount: 1,
        staffCostPrice: 120, // 获取
        staffPrice: 0, //手输入
        totlePrice: 0,
        ageLimit: 3,
        social: "",
        remark: "人员手填",
      };
      this.tableAlreadyPeople.push(AlreadyPeopleTemplate);
    },
    //人员3级联动
    chooseJob(index, e) {
      let obj = this.jobSelect.find((item) => {
        return item.attributeName == e;
      });
      this.tableAlreadyPeople[index].postId = obj.attributeId;
      console.log(obj.attributeId);
      this.tableAlreadyPeople[index].levelName = "";
      this.tableAlreadyPeople[index].postLevel = "";
      this.tableAlreadyPeople[index].postProfessional = "";
      this.tableAlreadyPeople[index].professionalName = "";
      this.getGrade(obj.attributeId);
    },
    chooseGrade(index, e) {
      let obj = this.gradeSelect.find((item) => {
        return item.attributeName == e;
      });
      this.tableAlreadyPeople[index].postLevel = obj.attributeId;
      this.tableAlreadyPeople[index].postProfessional = "";
      this.tableAlreadyPeople[index].professionalName = "";
      this.getProfession(obj.attributeId);
    },
    chooseProfession(index, e) {
      console.log(e);
      // this.professionalName = "";
      // this.postProfessional = "";
      let obj = this.professionType.find((item) => {
        return item.attributeName == e;
      });
      this.tableAlreadyPeople[index].postProfessional = obj.attributeId;
      console.log(obj);
    },

    deletePeopel(index, data) {
      console.log(index);
      this.tableAlreadyPeople.splice(index, 1);
    },
    //自有人员价格计算
    changeNum(index, data) {
      data.totlePrice = parseInt(data.staffCount) * parseInt(data.staffPrice);
    },
    inputPrice(data) {
      data.staffPrice.replace(/[^\d.]/g, "");
      if (data.staffPrice != "") data.totlePrice = parseInt(data.staffCount) * parseInt(data.staffPrice);
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
    //获取人员标准列表
    async getPeopleType(productId) {
      let _resp = await this.Axios.get(`product-api/skustandard/list?areaId=${this.areaId}&productId=${productId}`);
      console.log(_resp.data);
    },
    /* 数据处理 */
    //计算row总价
    addRow(arr, a, b) {
      return arr.map((item) => {
        item.totlePrice = parseInt(item[a]) * parseInt(item[b]);
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
<style scoped lang="less">
.tablelist1 {
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
    margin-right: 0;
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
