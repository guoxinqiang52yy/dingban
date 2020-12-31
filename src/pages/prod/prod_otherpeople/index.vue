<!--
 * @Author:   人才标准库(考办证人员)
 * @Date: 2020-08-14 14:53:16
 * @LastEditTime: 2020-12-29 20:12:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\user\uesr_org\index.vue
-->

<template>
  <div class="prod_list" v-loading="loading">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品库</el-breadcrumb-item>
      <el-breadcrumb-item>人才标准库</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <section class="prod_list_content">
      <article class="prod_list_list">
        <div class="prod_attr_button">
          <el-button v-has="'/prod/otherpeople-btn-add'" type="primary" size="small" @click="add">+新建专业人员</el-button>
        </div>
        <div class="prod_people_list">
          <el-table :data="tableData" stripe max-height="700px" border style="width: 99%" :header-cell-style="table_heard_style">
            <el-table-column prop="postName" align="center" label="岗位" min-width="100"></el-table-column>
            <el-table-column prop="levelName" align="center" label="等级" min-width="100"></el-table-column>
            <el-table-column prop="majorName" align="center" label="专业" min-width="100"></el-table-column>
            <!-- <el-table-column :formatter="formatStatusType" prop="registerStatus " align="center" label="注册状态" min-width="100"></el-table-column>
            <el-table-column :formatter="formatIsBType" prop="isB" align="center" label="B本情况" min-width="100"></el-table-column>
            <el-table-column :formatter="formatSocialTyep" prop="socialStatus" align="center" label="社保情况" min-width="100"></el-table-column>
            <el-table-column prop="ageLimit" align="center" label="工作年限" min-width="100"></el-table-column>
            <el-table-column prop="engPrice" align="center" label="参考价" min-width="100"></el-table-column> -->
            <el-table-column prop="examPrice" align="center" label="考证价" min-width="100"></el-table-column>
            <el-table-column prop="dealPrice" align="center" label="办证价" min-width="100"></el-table-column>
            <!-- <el-table-column prop="name" align="center" label="创建人" min-width="100"></el-table-column> -->
            <el-table-column prop="addTime" align="center" label="创建时间"></el-table-column>
            <el-table-column align="center" label="操作" min-width="80" fixed="right">
              <template slot-scope="scope">
                <el-button v-has="'/prod/otherpeople-btn-del'" @click="deleteThis(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pages">
          <p></p>
          <el-pagination background :current-page.sync="cur_page" layout="prev, pager, next" :page-size="pageSize" :total="totle" @next-click="selectProductPages" @prev-click="selectProductPages" @current-change="selectProductPages"> </el-pagination>
        </div>
      </article>
    </section>
    <!-- 新建专业人员 -->
    <el-dialog class="prod_list_people" :title="titleProduct" :close-on-click-modal="false" :visible.sync="isEditFormProduct" width="40%" @close="closeD">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editFormProduct" :model="editFormProduct" :rules="rulesProd">
        <el-form-item label="岗位" prop="postName">
          <el-select size="mini" v-model="editFormProduct.postName" placeholder="请选择" @change="chooseJob($event)">
            <el-option v-for="item in jobSelect" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="等级" prop="levelName">
          <el-select size="mini" :disabled="!editFormProduct.postName" v-model="editFormProduct.levelName" placeholder="请选择等级" @change="chooseGrade($event)">
            <el-option v-for="item in gradeSelect" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业" prop="majorName">
          <el-select size="mini" :disabled="!editFormProduct.postName && !editFormProduct.levelName" v-model="editFormProduct.majorName" placeholder="请选择专业" @change="chooseMajor($event)">
            <el-option v-for="item in professionSelect" :key="item.attributeId" :label="item.attributeName" :value="item.attributeName"> </el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="社保情况" prop="socialStatus">
          <el-select size="mini" v-model="editFormProduct.socialStatus" placeholder="请选择社保情况">
            <el-option v-for="item in socialType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="工作年限" prop="ageLimit">
          <el-input size="small" v-model.number="editFormProduct.ageLimit" auto-complete="off" placeholder="请输入工作年限"></el-input>
        </el-form-item>

        <el-form-item label="B本情况" prop="isB">
          <el-select :disabled="!editFormProduct.postName.includes('建造师')" size="mini" v-model="editFormProduct.isB" placeholder="请选择">
            <el-option v-for="item in carryBType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册状态" prop="registerStatus">
          <el-select :disabled="!editFormProduct.postName.includes('建造师')" size="mini" v-model="editFormProduct.registerStatus" placeholder="请选择">
            <el-option v-for="item in registerStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参考价" prop="engPrice">
          <el-input size="small" v-model.number="editFormProduct.engPrice" auto-complete="off" placeholder="请输入参考价"></el-input>
        </el-form-item> -->
        <el-form-item label="考证价" prop="examPrice">
          <el-input size="small" v-model.number="editFormProduct.examPrice" auto-complete="off" placeholder="请输入考证价"></el-input>
        </el-form-item>
        <el-form-item label="办证价" prop="dealPrice">
          <el-input size="small" v-model.number="editFormProduct.dealPrice" auto-complete="off" placeholder="请输入办证价"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitFormProd">创建并提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import myMixin from "../../../assets/js/minx/minx";
import tree from "../../../components/tree/tree";
import editor from "../../../components/editor";

export default {
  name: "",
  components: { tree, editor },
  props: [],
  mixins: [myMixin],
  data() {
    return {
      //地区
      areaId: this.getDataStorge("userMessage").areaId || "",
      loading: false,
      typeAddOrEdit: 1,
      pageSize: 10,
      number: 0,
      totle: 0,
      cur_page: 0,
      /* 下拉选项 */
      jobSelect: [],
      gradeSelect: [],
      professionSelect: [],
      /* 列表*/
      tableData: [],
      /* 新建 专业人员 */
      editFormProduct: {
        postName: "",
        levelName: "",
        majorName: "",
        // socialStatus: "",
        // registerStatus: "",
        // ageLimit: "",
        // isB: "",
        // engPrice: "",
        examPrice: "",
        dealPrice: "",
      },
      isEditFormProduct: false,
      titleProduct: "新建专业人员",

      rulesProd: {
        postName: [{ required: true, message: "请选择岗位", trigger: "blur" }],
        levelName: [{ required: true, message: "请选择等级", trigger: "blur" }],
        majorName: [{ required: true, message: "请选择专业", trigger: "blur" }],
        // socialStatus: [{ required: true, message: "请选择社保状态", trigger: "blur" }],
        // registerStatus: [{ required: true, message: "请选注册状态", trigger: "blur" }],
        // ageLimit: [
        //   { required: true, message: "请选择年限", trigger: "blur" },
        //   { pattern: /^[0-9]*$/, message: "只能输入数字" },
        // ],
        // isB: [{ required: true, message: "请选择B本情况", trigger: "blur" }],
        dealPrice: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "只能输入数字" },
        ],
        // engPrice: [
        //   { required: true, message: "请输入价格", trigger: "blur" },
        //   { pattern: /^[0-9]*$/, message: "只能输入数字" },
        // ],
        examPrice: [
          { required: true, message: "请输入价格", trigger: "blur" },
          { pattern: /^[0-9]*$/, message: "只能输入数字" },
        ],
      },
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
      //注册状态
      registerStatusList: [
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
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getPower();
    this.getJob();
    this.getPeople();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    getPower() {
      this.titleshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/list-btn-treeAddFirst");
      this.tdkshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/list-btn-treeEdit");
      this.addshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/list-btn-treeAddOther");
      this.editshow = false;
      this.delshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/list-btn-treeDelete");
    },
    /*列表过滤*/
    formatDate(row, column) {
      // return row.addTime.split(" ")[0];
    },
    formatSocialTyep(row, column) {
      row.socialStatus;
      let _data = { 1: "临时", 2: "唯一", 3: "不上" };
      return _data[row.socialStatus];
    },
    formatIsBType(row, column) {
      let _data = { 1: "无", 2: "有" };
      return _data[row.isB] || "-";
    },
    formatStatusType(row, column) {
      let _data = { 1: "初始注册", 2: "变更注册", 3: "重新注册", 4: "延续注册" };
      return _data[row.registerStatus] || "-";
    },
    /* 页面点击 */
    add() {
      this.titleProduct = "新建专业人员";
      this.isEditFormProduct = true;
      this.closeD();
    },
    closeDialog() {
      this.closeD();
      this.isEditFormProduct = false;
    },
    closeD() {
      this.editFormProduct = {
        postName: "",
        levelName: "",
        majorName: "",
        socialStatus: "",
        registerStatus: "",
        ageLimit: "",
        isB: "",
        engPrice: "",
        examPrice: "",
        dealPrice: "",
      };
      if (this.$refs.editFormProduct) this.$refs.editFormProduct.resetFields();
    },
    deleteThis(data) {
      this.$confirm("是否删除此条数据？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.tableData.length < 2) this.number = this.number - 1;
        this.deletePeople(data.id);
      });
    },
    /* 联动选择 */
    chooseJob(e) {
      console.log(e);
      let obj = this.jobSelect.find((item) => {
        return item.attributeName == e;
      });
      if (e == "建造师") {
        this.editFormProduct.isB = "";
        this.editFormProduct.registerStatus = "";
      } else {
        this.editFormProduct.isB = 0;
        this.editFormProduct.registerStatus = 0;
      }
      this.editFormProduct.postId = +obj.attributeId;
      this.getGrade(obj.attributeId);
    },
    chooseGrade(e) {
      let obj = this.gradeSelect.find((item) => {
        return item.attributeName == e;
      });
      this.editFormProduct.levelId = +obj.attributeId;
      this.getProfession(obj.attributeId);
    },
    chooseMajor(e) {
      let obj = this.professionSelect.find((item) => {
        return item.attributeName == e;
      });
      this.editFormProduct.majorId = +obj.attributeId;
    },
    /*分页*/

    selectProductPages(val) {
      this.number = parseInt(val - 1);
      this.getPeople();
    },
    /* 发布 */
    submitFormProd() {
      this.$refs.editFormProduct.validate((val) => {
        if (!val) {
          this.showMessage("error", "所填内容不能为空");
          return false;
        } else {
          this.editFormProduct.cityId = +this.getDataStorge("userMessage").areaId;
          let _data = this.deleteCode(["majorName", "levelName", "postName"], this.editFormProduct);
          this.addPeople(_data);
        }
      });
    },

    /*接口*/
    //人员联动
    //岗位
    async getJob() {
      let _resp = await this.Axios.get(`product-api/standardattribute/list?parentId=0`);
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
      this.professionSelect = _resp.data.result;
    },
    //商品
    async addProductList(data) {
      console.log(data);
      let _resp = await this.Axios.post(`product-api/standardunlicensedlist/add`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getProductList();
      } else {
        this.showMessage("error", "操作失败");
      }
      this.closeD();
    },
    async getProductList() {
      console.log("分页");
      console.log(this.prodPage);
      let _resp = await this.Axios.get(`product-api/standardunlicensedlist/list?pageNum=${this.prodPage}&pageSize=8&groupId=${this.groupId}`);
      this.totle = _resp.data.result;
      this.totle = _resp.data.total;
    },
    async updProductList(data) {
      let _resp = await this.Axios.post(`product-api/standardunlicensedlist/update`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
      } else {
        this.showMessage("error", "操作失败");
      }
      this.closeD();
    },
    //添加人才标准
    async addPeople(data) {
      let _resp = await this.Axios.post(`/product-api/standardunlicensedlist/add`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.closeDialog();
        this.getPeople();
      }
    },
    //查看人才标准
    async getPeople() {
      let _resp = await this.Axios.get(`/product-api/standardunlicensedlist/page?pageNum=${this.number}&pageSize=${this.pageSize}`);

      this.tableData = _resp.data.result;
      this.totle = _resp.data.total;
    },
    //删除数据
    async deletePeople(id) {
      let _resp = await this.Axios.get(`/product-api/standardunlicensedlist/delete?id=${id}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getPeople();
      }
    },

    /*数据处理*/
    //删除字段(对象)
    deleteCode(code = [], obj) {
      code.forEach((i) => {
        delete obj[i];
      });
      return obj;
    },
  },
};
</script>
<style></style>
<style scoped>
@import url("./index.css");
.pages {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.prod_list_content .prod_list_list {
  flex: 1;
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  padding-left: 5px;
}
.prod_list /deep/ .el-form--inline .el-form-item__content {
  width: 270px;
}
.editorForm /deep/ .el-dialog__body {
  overflow-y: auto;
  height: 65vh;
}

.editorForm /deep/ .el-input__inner {
  height: 32px !important;
}
.editorForm /deep/ .el-form--inline .el-form-item {
  margin-right: 0;
}
.el-form--inline .el-form-item {
  display: flex !important;
  width: 100%;
}
.prod_people_list {
  flex: 1;
  height: auto;
  overflow-x: auto;
}
.prod_list_people /deep/ .el-dialog {
  margin-top: 5vh !important;
}
.prod_list_people /deep/ .el-form .el-form-item__content {
  flex: 1;
}
.prod_list_people /deep/ .el-form .el-form-item__content .el-select {
  width: 100%;
}
</style>
