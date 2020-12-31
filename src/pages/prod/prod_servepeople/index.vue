<!--
 * @Author:  服务人才配置
 * @Date: 2020-08-14 14:53:16
 * @LastEditTime: 2020-12-29 20:22:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\user\uesr_org\index.vue
-->

<template>
  <div class="prod_sku  servePeopel">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品库</el-breadcrumb-item>
      <el-breadcrumb-item>服务人才配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <section class="prod_sku_content">
      <article class="prod_sku_type">
        <p>服务分类</p>
        <div class="top_line"></div>
        <div class="tree_list">
          <tree :list="treeList" showlength="true" @nodeClick="nodeClick"></tree>
        </div>
      </article>

      <article class="list people_list">
        <div class="prod_sku_button">
          <div style="display:flex;align-items: center;"></div>
          <el-button v-has="'/prod/servepeople-btn-add'" type="primary" size="small" @click="add">批量创建</el-button>
        </div>
        <el-table class="prod_people" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="attributeNames" align="center" label="商品属性" width="100"> </el-table-column>
          <el-table-column prop="skuStandardVOList" align="center" label="人员配置" min-width="150">
            <template slot-scope="scope">
              <p v-for="(item, index) in scope.row.skuStandardVOList" :key="index">
                岗位:{{ item.standardListVO.postName }} &nbsp;&nbsp;--&nbsp;&nbsp;等级:{{ item.standardListVO.levelName }} &nbsp;&nbsp;--&nbsp;&nbsp;专业:{{ item.standardListVO.majorName }} &nbsp;&nbsp;--&nbsp;&nbsp;注册状态:{{
                  item.standardListVO.registerStatus | isStatus
                }}
                &nbsp;&nbsp;--&nbsp;&nbsp; B本情况:{{ item.standardListVO.isB | isB }} &nbsp;&nbsp;--&nbsp;&nbsp;社保情况:{{ item.standardListVO.socialStatus | socialTypes }} &nbsp;&nbsp;--&nbsp;&nbsp;工作年限:{{ item.standardListVO.ageLimit }}年 &nbsp;&nbsp;--&nbsp;&nbsp;人数:{{ item.amount }}人
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="price" align="center" label="禁用/启用" width="150">
            <template slot-scope="scope">
              <el-switch
                v-if="scope.row.skuStandardVOList"
                v-model="scope.row.skuStandardVOList[0].status"
                disabled
                :active-value="1"
                :inactive-value="2"
                @click.native="handleUpdate(scope.row.skuStandardVOList, scope.row.skuStandardVOList[0].status)"
                @change="changeSwitch(scope.row.skuStandardVOList, scope.row.skuStandardVOList[0].status)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button v-has="'/prod/sku-btn-edit'" @click="editThis(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages">
          <p></p>
          <el-pagination :current-page.sync="cur_page" background layout="prev, pager, next" :page-size="size" :total="totle" @next-click="selectSkuPages" @prev-click="selectSkuPages" @current-change="selectSkuPages"> </el-pagination>
        </div>
      </article>
    </section>

    <!-- 编辑人员表单 -->
    <el-dialog class="formSku_list_people" :title="titleSku" :visible.sync="isEditFormSku" width="50%" :close-on-click-modal="false" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="100px" ref="editFormSku" :model="servePeopleList" :rules="rulesSku">
        <el-form-item label="服务名称" prop="descrip">
          <el-input size="mini" :disabled="true" v-model="servePeopleList.serveName" auto-complete="off" placeholder="请输入工作年限"></el-input>
        </el-form-item>
        <el-form-item label="商品属性" prop="descrip">
          <el-input size="mini" :disabled="true" v-model="servePeopleList.serveType" auto-complete="off" placeholder=""></el-input>
          <!-- <div class="formSku_list_people_addType"><el-button type="primary" size="mini" @click="innerClick">选择属性</el-button></div> -->
        </el-form-item>

        <div class="formSku_list_people_add"><el-button type="primary" size="mini" @click="addTable(tableAlreadyPeople)">添加配置</el-button></div>
        <el-table :data="tableAlreadyPeople" border style="width: 100%" height="350" :header-cell-style="table_heard_style">
          <el-table-column property="job" label="人才标准">
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row.standardId" placeholder="请选择" @change="chooseJob(scope.$index, $event)">
                <el-option v-for="item in peopleList" :key="item.standardId" :label="`${item.postName}-${item.levelName}-${item.majorName}-${registerType(item.registerStatus)}-${selectIsB(item.isB)}-${socialTypes(item.socialStatus)}-${ageLimit(item.ageLimit)}`" :value="item.standardId"> </el-option>
                <!-- <el-option v-for="item in peopleList" :key="item.standardId" :label="item.postName + '-' + item.levelName + '-' + item.majorName" :value="item.standardId"> </el-option> -->
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="amount" label="人数" width="200">
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.amount" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="people" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" plain @click="deletePeopel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- <el-table :data="tableAlreadyPeople" border style="width: 100%" height="350" :header-cell-style="table_heard_style">
          <el-table-column property="job" label="岗位">
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row.postName" placeholder="请选择" @change="chooseJob(scope.$index, $event)">
                <el-option v-for="item in scope.row.jobList" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column property="grade" label="等级">
            <template slot-scope="scope">
              <el-select size="mini" :disabled="false" v-model="scope.row.levelName" placeholder="请选择" @change="chooseGrade(scope.$index, $event)">
                <el-option v-for="item in scope.row.levelList" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column property="profession" label="专业">
            <template slot-scope="scope">
              <el-select size="mini" :disabled="false" v-model="scope.row.professionalName" placeholder="请选择" @change="chooseProfession(scope.$index, $event)">
                <el-option v-for="item in scope.row.professList" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="social" label="社保" width="120">
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row.social" placeholder="请选择">
                <el-option v-for="item in socialType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="hasB" label="B本" width="100">
            <template slot-scope="scope">
              <el-select size="mini" :disabled="!scope.row.postName.includes('建造师')" v-model="scope.row.hasB" placeholder="请选择">
                <el-option v-for="item in carryBType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="ageLimit" label="年限" width="80">
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.ageLimit"></el-input>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="staffCount" label="人数" width="115">
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.staffCount" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="people" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" plain @click="deletePeopel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button :disabled="disable" size="small" type="primary" :loading="loading" class="title" @click="submitForm">编辑</el-button>
      </div>
    </el-dialog>

    <!-- 批量添加 -->
    <el-dialog class="formSku_list_people" title="批量添加" :visible.sync="isEditFormAdd" width="50%" :close-on-click-modal="false" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="100px" ref="editFormSku" :model="servePeopleListAdd">
        <el-form-item label="服务名称" prop="descrip">
          <el-input size="mini" :disabled="true" v-model="servePeopleListAdd.serveName" auto-complete="off"></el-input>
        </el-form-item>
        <div class="formSku_list_people_add"><el-button type="primary" size="mini" @click="addTableAdd">添加配置</el-button></div>
        <el-table :data="tableAlreadyPeopleAdd" border style="width: 100%" height="350" :header-cell-style="table_heard_style">
          <el-table-column property="standardId" label="人才标准">
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row.standardId" placeholder="请选择">
                <el-option v-for="item in peopleList" :key="item.standardId" :label="`${item.postName}-${item.levelName}-${item.majorName}-${registerType(item.registerStatus)}-${selectIsB(item.isB)}-${socialTypes(item.socialStatus)}-${ageLimit(item.ageLimit)}`" :value="item.standardId"> </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="amount" label="人数" width="200">
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.amount" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="people" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" plain @click="deletePeopelAdd(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitFormAdd">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tree from "../../../components/tree/tree";
import myMixin from "../../../assets/js/minx/minx";
import editor from "../../../components/editor";
export default {
  name: "",
  components: { tree, editor },
  mixins: [myMixin],
  props: [],
  filters: {
    isB(data) {
      let _data = { 1: "无B本", 2: "有B本" };
      return _data[data] || "空";
    },
    isStatus(data) {
      let _data = { 1: "初始注册", 2: "变更注册", 3: "重新注册", 4: "延续注册" };
      return _data[data] || "空";
    },
    //社保
    socialTypes(data) {
      let _data = { 1: "临时社保", 2: "唯一社保", 3: "不上社保" };
      return _data[data];
    },
    //年限
    ageLimit(data) {
      return `${data}年`;
    },
  },
  data() {
    return {
      aaa: "1",
      //地区
      areaId: this.getDataStorge("userMessage").areaId || "",
      selectCity: 3,
      //点击编辑临时数据
      tempServeId: "",
      tempServeName: "",
      //弹框表格数据
      gridData: [{ job: 1 }],

      //SKU列表数据
      tableData: [],
      //树状图数据
      treeList: [],

      /*  表单操作 */
      titleSku: "批量编辑",
      isEditFormSku: false,

      /* 表单提交数据 */
      editFormSku: {
        serveName: this.tempServeName,
        serveType: 231,
      },
      //多选skuid列表
      tableSkuIds: [],
      //表格数据
      tableAlreadyPeople: [],

      /* 二级弹框 */
      innerVisible: false,
      /*3级联动 & 下拉数据*/
      jobSelect: [],
      gradeSelect: [],
      professionType: [],
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
      /* 验证 */
      loading: false,
      rulesSku: {
        // selectPrice: [{ required: true, message: "请选择价格", trigger: "blur" }],
        // seleAreaId: [{ required: true, message: "请选择地区", trigger: "blur" }],
        // imageUrl: [{ required: true, message: "请上传图片", trigger: "blur" }],
        //content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      //新建sku数据
      productId: "",
      productName: "",
      groupId: "",
      skuPage: 0,
      getProdId: "",
      skuTotle: 0,
      cur_page: 0,
      skuId: "",
      tempSkuData: {},
      //临时城市数据

      /* ====修改后==== */
      //分页
      number: 0,
      size: 3,
      totle: 0,
      //添加弹框
      showProdName: "",
      isEditFormAdd: false,
      servePeopleListAdd: {
        serveName: "",
      },
      tableAlreadyPeopleAdd: [],
      //弹框数据
      //skuid
      showSkuId: "",
      //产品id
      showProdId: "",
      peopleList: [],
      servePeopleList: {
        serveName: this.tempServeName,
        serveType: 231,
      },
      //添加重复数据
      disable: false,
    };
  },
  computed: {
    //获取城市
    options() {
      return this.$store.state.cityList;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.getProdType();
    this.getJob();
    this.getPeopleList();
    // this.getSkuPeopleList();
    console.log(this.options);
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /*列表过滤*/
    formatDate(row, column) {
      return row.addTime.split(" ")[0];
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
    //过滤字符串
    //b本
    selectIsB(data) {
      let _data = { 1: "无B本", 2: "有B本" };
      return _data[data] || "B本空";
    },
    //社保
    socialTypes(data) {
      let _data = { 1: "临时社保", 2: "唯一社保", 3: "不上社保" };
      return _data[data];
    },
    //注册状态
    registerType(data) {
      let _data = { 1: "初始注册", 2: "变更注册", 3: "重新注册", 4: "延续注册" };
      return _data[data] || "空";
    },
    //年限
    ageLimit(data) {
      return `${data}年`;
    },
    /* 页面操作*/
    //批量创建
    add() {
      this.servePeopleListAdd = {};
      if (!this.showProdId) {
        this.showMessage("error", "请选择左侧商品分类");
        return;
      }
      this.servePeopleListAdd.serveName = this.showProdName;
      this.isEditFormAdd = true;
    },
    //切换状态
    handleUpdate(data1, data) {
      //验证权限
      if (!this.verification(this.$store.state.selectBtnJurisdiction, "/prod/servepeople-btn-change")) {
        this.showMessage("error", "无此权限");
        return false;
      }
      console.log(data1);
      console.log(data);
      let _data1 = JSON.parse(JSON.stringify(data1));

      let _data = 0;
      data == 1 ? (_data = 2) : (_data = 1);
      console.log(_data);

      let _resp = _data1.map((item) => {
        return { productId: this.showProdId, skuId: item.skuId, standardId: item.standardId, status: _data, amount: item.amount, cityId: item.cityId };
      });
      console.log(_resp);
      this.$confirm("是否修改设置？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.edit(_resp);
        })
        .catch(() => {
          return false;
        });
    },
    //单个删除人员配置
    deleteThis(data) {
      this.$confirm("是否删除此人员配置", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {});
    },
    //编辑人员配置
    editThis(data) {
      console.log(data.skuStandardVOList);
      let _data = JSON.parse(JSON.stringify(data.skuStandardVOList));
      let _resp = _data.map((item) => {
        return { productId: this.showProdId, standardId: item.standardId, amount: item.amount, skuId: item.skuId, status: item.status };
      });

      this.showSkuId = data.skuId;
      this.servePeopleList.serveName = data.productName;
      this.servePeopleList.serveType = data.attributeNames;

      this.tableAlreadyPeople = _resp;
      this.isEditFormSku = true;
    },
    //添加表格
    // addTable() {
    //   let AlreadyPeopleTemplate = {
    //     //临时数组
    //     jobList: this.jobSelect,
    //     levelList: [],
    //     professList: [],
    //     postId: "",
    //     postName: "",
    //     postLevel: "",
    //     levelName: "",
    //     postProfessional: "",
    //     professionalName: "",
    //     registerStatus: "",
    //     hasB: "",
    //     ageLimit: "",
    //     staffCount: 1,
    //   };
    //   this.tableAlreadyPeople.push(AlreadyPeopleTemplate);
    // },
    addTable(data) {
      console.log(data[0]);
      let AlreadyPeopleTemplate = {
        skuId: data[0].skuId,
        standardId: "",
        amount: 1,
        status: data[0].status,
        productId: this.showProdId,
      };
      // AlreadyPeopleTemplate.skuId = this.showSkuId;
      this.tableAlreadyPeople.push(AlreadyPeopleTemplate);
    },
    addTableAdd() {
      let AlreadyPeopleTemplate = {
        standardId: "",
        amount: 1,
      };
      // AlreadyPeopleTemplate.skuId = this.showProdId;
      this.tableAlreadyPeopleAdd.push(AlreadyPeopleTemplate);
    },
    /* 表单提交 */
    submitForm() {
      console.log(this.tableAlreadyPeople);
      console.log(this.selecEmpty(this.tableAlreadyPeople));
      if (this.selecEmpty(this.tableAlreadyPeople)) {
        this.showMessage("error", "添加内容不能为空");
      } else {
        this.edit(this.tableAlreadyPeople);
      }
    },
    //批量添加
    submitFormAdd() {
      console.log(this.tableAlreadyPeopleAdd);
      if (this.selecEmpty(this.tableAlreadyPeopleAdd)) {
        this.showMessage("error", "添加内容不能为空");
      } else {
        let _data = {
          productId: this.showProdId,
          skuStandardVOList: this.tableAlreadyPeopleAdd,
        };
        this.addAll(_data);
        console.log(_data);
      }
    },
    changePirice(val) {
      console.log(val);
      if (val == -1) {
        this.editFormSku.priceOrgi = "";
        this.editFormSku.priceDisc = "";
      }
    },
    deletePeopel(index, data) {
      console.log(index);
      this.tableAlreadyPeople.splice(index, 1);
    },
    deletePeopelAdd(index, data) {
      console.log(index);
      this.tableAlreadyPeopleAdd.splice(index, 1);
    },
    /* 二级表单 */
    innerClick() {
      this.innerVisible = true;
    },
    //获取多选id
    handleSelectionChange(val) {
      this.tableSkuIds = val;
      console.log(val);
      this.editFormSku.serveType = this.tableSkuIds
        .map((val) => {
          return val.attributeNames;
        })
        .join(" ");
    },
    //人员3级联动
    async chooseJob(index, e) {
      console.log(e);
      let _arrs = JSON.parse(JSON.stringify(this.tableAlreadyPeople));
      let _arr = _arrs.filter((item) => {
        return item.standardId == e;
      });
      console.log(_arr.length);
      if (_arr.length > 1) {
        this.disable = true;
        this.showMessage("error", "重复添加");
      } else {
        this.disable = false;
      }
    },
    async chooseGrade(index, e) {
      let obj = this.tableAlreadyPeople[index].levelList.find((item) => {
        return item.attributeName == e;
      });
      this.tableAlreadyPeople[index].postLevel = obj.attributeId;
      this.tableAlreadyPeople[index].postProfessional = "";
      this.tableAlreadyPeople[index].professionalName = "";
      this.getProfession(obj.attributeId, index);
    },
    async chooseProfession(index, e) {
      console.log(e);
      let obj = this.tableAlreadyPeople[index].professList.find((item) => {
        return item.attributeName == e;
      });
      this.tableAlreadyPeople[index].postProfessional = obj.attributeId;
      console.log(obj);
    },
    /* 节点点击 */
    nodeClick(s, d, n) {
      this.showProdId = "";
      this.showProdName = "";
      console.log(d);
      //二级分类添加子集
      this.tableData = [];
      this.skuTotle = 0;
      if (d.parentId == 0) {
        return false;
      }
      console.log(d);
      //获取商品列表
      this.getProdList(d.groupId).then((_resp) => {
        d.children = _resp;
        n.expanded = true;
      });
      //判断是否为商品列表
      if (d.hasOwnProperty("attrCateIds")) {
        this.skuPage = 0;
        this.number = 0;
        this.cur_page = 0;
        this.showProdId = d.productId;
        this.showProdName = d.name;
        this.productName = d.name;
        this.groupId = d.groupId;
        this.getProdId = d.productId; //点击获取
        // this.getSkuList();
        this.getSkuPeopleList();
      }
    },
    closeDialog() {
      this.isEditFormSku = false;
      this.isEditFormAdd = false;
      this.$refs.editFormSku.resetFields();
      // this.editFormSku.selectPrice = "";
      // this.editFormSku.priceDisc = "";
      // this.editFormSku.priceOrgi = "";
      // this.editFormSku.imageUrl = "";
      // this.editFormSku.content = "";
      this.tableAlreadyPeople = [];
      this.tableAlreadyPeopleAdd = [];
    },

    /* 分页 */
    selectSkuPages(val) {
      this.number = parseInt(val - 1);
      this.getSkuPeopleList();
    },
    /* 接口 */
    //获取人才标准列表
    async getPeopleList() {
      let _resp = await this.Axios.get(`product-api/standardlist/list`);
      console.log(_resp.data.result);
      this.peopleList = _resp.data.result;
    },
    //获取商品分类
    async getProdType() {
      let _resp = await this.Axios.post(`product-api/productgroup/getProdGroupListWithLevel`);
      let _array = this.dataTypeAssemble(_resp.data.result);
      console.log("分类");
      console.log(_array);
      this.treeList = _array;
    },
    //根据分类获取商品列表
    async getProdList(groupId) {
      let _resp = await this.Axios.get(`product-api/productlist/list?pageNum=0&pageSize=1000&groupId=${groupId}`);
      return _resp.data.result;
    },
    async getSkuPeopleList() {
      let _resp = await this.Axios.get(`product-api/skustandard/page?pageNum=${this.number}&pageSize=${this.size}&areaId=${this.areaId}&productId=${this.showProdId}`);
      console.log(_resp.data.result);
      if (_resp.data.result[0].skuStandardVOList) {
        this.tableData = _resp.data.result;
        this.totle = _resp.data.total;
      } else {
        this.tableData = [];
        this.totle = 0;
      }
    },
    //批量添加
    async addAll(data) {
      let _resp = await this.Axios.post(`product-api/skustandard/add`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "创建成功");
        this.isEditFormAdd = false;
        this.tableAlreadyPeopleAdd = [];
        this.getSkuPeopleList();
      }
    },
    //编辑
    async edit(data) {
      let _resp = await this.Axios.post(`product-api/skustandard/update`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "编辑成功");
        this.isEditFormSku = false;
        this.getSkuPeopleList();
      }
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

    /* 数据处理 */
    /* 数据组装 */
    dataTypeAssemble(data) {
      let _data = [];
      data.forEach((element) => {
        let _dat = element;
        let _array = [];
        for (let _arr of element.productGroupVOList) {
          let _tempArr = _arr;
          Object.assign(_tempArr, { isFirst: false, isEdit: false, children: [] });
          _array.push(_tempArr);
        }
        Object.assign(_dat, { isFirst: false, isEdit: false, children: _array });
        _data.push(_dat);
        // delete _dat.attributeListVOList; //删除 子对象列表 添加 children
      });
      return _data;
    },
    //判断为空
    selecEmpty(o) {
      let empty = false;
      return selec(o);
      function selec(o) {
        var s = {}.toString.call(o);
        if (s == "[object Array]") {
          if (o.length > 0) {
            o.forEach((element) => {
              selec(element);
            });
          }
        } else if (s == "[object Object]") {
          for (var attr in o) {
            if (o[attr] === null || o[attr] === undefined || o[attr] === "") {
              empty = true;
            } else if (typeof o[attr] == "object") {
              selec(o[attr]);
            }
          }
        }
        return empty;
      }
    },
    //数组添加字段
    arrAddCode(arr, code) {
      let _tempArr = JSON.parse(JSON.stringify(arr));
      _tempArr.map((val) => {
        return { ...val, status: code };
      });
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
.price_input {
  width: 100px;
}
.select_city {
  height: 32px;
}

.select_city /deep/ .el-input__inner {
  height: 32px;
}

.formSku .avatar-uploader {
  margin-right: 5px;
}
.formSku .avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.formSku .avatar-uploader /deep/ .el-upload:hover {
  border-color: #409eff;
}
.formSku /deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.skuTypeList {
  /* height: 32px; */
  margin-right: 20px;
}

.skuTypeList /deep/ .el-input__inner {
  height: 32px !important;
}
.skuTypeList /deep/ .el-input--suffix {
  /* height: 32px !important; */
}
.formSku /deep/ .el-dialog__body {
  overflow-y: auto;
  height: 65vh;
}
.list /deep/ .el-switch.is-disabled {
  opacity: 1;
}
.list /deep/ .el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}
.people_list /deep/ .prod_people .cell {
  display: block !important;
}
.pages {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.coin {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #409eff;
  cursor: pointer;
}
.noDefault {
  cursor: pointer;
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid #409eff;
}
.from_group_input_box {
  display: flex;
}
.from_group_input {
  flex: none;
  width: 30vw;
  margin-right: 25px;
}
.upload_pic /deep/ .el-form-item__content {
  display: flex;
  align-items: flex-end;
}
.upload_info {
  font-size: 12px;
  font-style: normal;
  margin-left: 15px;
}
.tree_list {
  max-height: 700px;
  overflow-y: auto;
}
.formSku /deep/ .el-dialog {
  margin-top: 10vh !important;
}
.formSku /deep/ .el-form-item__label {
  flex: none;
}
/* 表单样式 */
.formSku_list_people /deep/ .formSku_list_people_add {
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
}
.formSku_list_people /deep/ .el-select {
  width: 100%;
}
.formSku_list_people /deep/ .el-form .el-form-item {
  display: flex;
  margin-bottom: 0px !important;
}
.formSku_list_people /deep/ .el-dialog {
  margin-top: 5vh !important;
}

.formSku_list_people /deep/ .el-form .el-form-item__content {
  flex: 1;
  display: flex;
}

.formSku_list_people /deep/ .el-form .formSku_list_people_addType {
  margin-left: 20px;
}
.formSku_list_people /deep/ .el-form .el-form-item__content .el-select {
  width: 100%;
}
.formSku_list_people /deep/ .el-input-number--mini {
  width: 90px;
}
</style>
