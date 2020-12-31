<!--
 * @Author:商品属性  
 * @Date: 2020-08-15 09:16:43
 * @LastEditTime: 2020-12-03 20:09:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage(0815)\src\pages\prod\prod_attr\index.vue
-->

<template>
  <div class="prod_attr">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品库</el-breadcrumb-item>
      <el-breadcrumb-item>商品属性</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <section class="prod_attr_list">
      <article class="prod_attr_add">
        <div class="top">
          <!-- <p>属性分类</p> -->
          <!-- <el-button type="primary" size="small" @click="addType"><i class="el-icon-plus"></i> 添加分类</el-button> -->
        </div>
        <article class="tree_list" v-loading="typeLoading">
          <tree title="添加属性分类" :titleshow="titleshow" :descripshow="descripshow" :addshow="addshow" :editshow="editshow" :delshow="delshow" :list="treeList" @nodeClick="nodeClick" @addTop="addTop" @completeEditor="completeEditor" @startEditor="startEditor" @deleteEditor="deleteEditor"></tree>
          <div class="pages">
            <p></p>
            <el-pagination background layout="prev, pager, next" :page-size="20" :total="typeTotle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
          </div>
        </article>
        <!-- <div class="top_line"></div> -->
      </article>
      <article class="prod_attr_content">
        <div class="prod_attr_button">
          <el-button v-has="'/prod/attr-btn-add'" type="primary" size="small" @click="add">新建属性</el-button>
        </div>
        <el-table :data="tableData" stripe max-height="550px" style="width: 100%">
          <el-table-column prop="attributeName" align="center" label="属性名称" min-width="150"></el-table-column>
          <el-table-column :formatter="formatDate" prop="addTime" align="center" label="创建时间"></el-table-column>
          <el-table-column align="center" label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button v-has="'/prod/attr-btn-edit'" @click="editorThis(scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-has="'/prod/attr-btn-deletet'" @click="deleteThis(scope.row)" style="color:#f56c6c" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </article>
    </section>
    <!-- 新建&编辑属性 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="属性名称" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="请输入属性名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>

    <!-- 新建属性分类 -->
    <el-dialog title="添加属性分类" :visible.sync="typeFormVisible" width="30%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="90px" ref="editFormType" :model="editFormType" :rules="rulesType">
        <el-form-item label="分类名称" prop="name">
          <el-input size="small" v-model="editFormType.name" auto-complete="off" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="属性描述" prop="descp">
          <el-input size="small" v-model="editFormType.descp" auto-complete="off" placeholder="请输入属性描述"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loadingType" class="title" @click="submitFormType">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myMixin from "../../../assets/js/minx/minx";
import tree from "../../../components/tree/tree";
export default {
  name: "",
  components: { tree },
  mixins: [myMixin],
  props: [],
  data() {
    return {
      /* 树状图按钮显示隐藏 */
      titleshow: true,
      descripshow: true,
      addshow: false,
      editshow: true,
      delshow: true,

      tableData: [],
      treeList: [],
      typeLoading: false,
      page: 0,
      typeTotle: 0,
      /* 添加属性操作  */
      loading: false, //是显示加载
      title: "新增属性",
      editFormVisible: false, //控制编辑页面显示与隐藏
      rules: {
        name: [{ required: true, message: "请输入属性名称", trigger: "blur" }],
      },
      disabled: true,
      typeId: "",
      cateId: "",
      editForm: {
        name: "",
      },
      updListData: {},
      /* 添加&编辑分类操作 */
      addOrEditor: 1,
      loadingType: false,
      typeFormVisible: false,
      editFormType: {
        name: "",
        // descp: "",
      },
      rulesType: {
        name: [{ required: true, message: "请输入属性名称", trigger: "blur" }],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getTypeList();
    this.getPower();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 验证树状图权限 */
    // /prod/attr-btn-typeAdd /prod/attr-btn-typeEdit /prod/attr-btn-typeDelete
    //验证权限
    //  if(!this.verification(store.state.selectBtnJurisdiction,'/offcial/link-btn-show')){
    //    this.showMessage('error','无此权限')
    //   return false
    //  }
    getPower() {
      this.titleshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/attr-btn-typeAdd");
      this.editshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/attr-btn-typeEdit");
      this.addshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/list-btn-treeAddOther");
      this.delshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/attr-btn-typeDelete");
    },
    /*列表过滤*/
    formatDate(row, column) {
      return row.addTime.split(" ")[0];
    },
    /* 页面操作 */
    add() {
      if (this.typeId == "") {
        this.$alert("请选择左侧分类后，点击新建", "提示");
        return false;
      }
      this.title = "新增属性";
      this.editFormVisible = true;
      this.addOrEditor = 1;
      this.editFormType.name = "";
      this.editFormType.descp = "";
      this.editForm.name = "";
    },
    editorThis(data) {
      this.title = "编辑属性";
      this.editFormVisible = true;
      this.addOrEditor = 2;
      console.log(data);
      this.editForm.name = data.attributeName;
      this.updListData = data;
    },
    closeDialog() {
      this.editFormVisible = false;
      this.typeFormVisible = false;
      this.editFormType.name = "";
      this.editFormType.descp = "";
      this.editForm.name = "";
      if (this.$refs.editFormType) this.$refs.editFormType.resetFields();
      if (this.$refs.editForm) this.$refs.editForm.resetFields();
    },
    deleteThis(data) {
      this.$confirm("是否删除此属性？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delList(data.id);
        })
        .catch(() => {
          return false;
        });
    },
    /*初始化第一组数据*/
    initData(TypeList) {
      let _firstId = TypeList[0].cateId;
      console.log(_firstId);
      this.cateId = _firstId;
      this.getList();
    },
    /*提交*/
    submitForm() {
      this.$refs.editForm.validate((val) => {
        if (!val) {
          this.showMessage("error", "内容不能为空");
          return false;
        }
        if (this.editForm.name.length > 8) {
          this.showMessage("error", "所添加内容过长");
          return false;
        }
        if (this.addOrEditor == 1) {
          console.log("新建");
          let _data = {};
          _data.attributeName = this.editForm.name;
          _data.cateId = this.cateId;
          this.addList(_data);
        } else {
          this.updListData.attributeName = this.editForm.name;
          this.updList(this.updListData);
        }
      });
    },
    submitFormType() {
      this.$refs.editFormType.validate((val) => {
        if (this.editFormType.name.length > 8) {
          this.showMessage("error", "所添加内容过长");
          return false;
        }
        if (val) {
          let _data = { name: this.editFormType.name, description: this.editFormType.descp };
          this.addTypeList(_data);
        } else {
          this.showMessage("error", "内容不能为空");
        }
      });
    },
    /*分页*/
    selectPages(val) {
      this.page = parseInt(val - 1);
      this.getTypeList();
    },
    /* 树状图操作 */
    nodeClick(s, d, n) {
      console.log(d);
      this.typeId = d.id;
      this.cateId = d.cateId;
      this.getList();
    },
    addTop(s, d, n) {
      this.typeFormVisible = true;
    },
    startEditor(s, d, n) {
      console.log("开始编辑");
      this.TypeListId = d.cateId;
      console.log(d);
    },
    completeEditor(s, d, n) {
      console.log("编辑完成");
      let _data = d;
      this.updTypeList(_data);
    },

    deleteEditor(s, d, n) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delTypeList(d.id);
        })
        .catch(() => {
          return false;
        });
    },
    /* 树状图数据组装 */
    typeListData(data) {
      let __data = [];
      data.forEach((element) => {
        let _data = element;
        Object.assign(_data, { isFirst: false, isEdit: false });
        __data.push(_data);
      });

      return __data;
    },
    /* 接口 */
    /*属性分类  */
    async getTypeList() {
      this.typeLoading = true;
      let typeList = await this.Axios.get(`product-api/attributecategory/list?pageNum=${this.page}&pageSize=20`);
      console.log(typeList.data);
      this.typeTotle = typeList.data.total;
      this.treeList = this.typeListData(typeList.data.result);
      this.typeLoading = false;
      this.initData(this.treeList);
    },
    async addTypeList(data) {
      let typeList = await this.Axios.post(`product-api/attributecategory/add`, data, "postJson");
      if (typeList.data.code == 0) {
        this.showMessage("success", "编辑成功");
        this.getTypeList();
      } else {
        this.showMessage("error", "编辑失败");
      }
      this.typeFormVisible = false;
    },

    async updTypeList(data) {
      let typeList = await this.Axios.post(`product-api/attributecategory/update`, data, "postJson");
      if (typeList.data.code == 0) {
        this.showMessage("success", "编辑成功");
        this.getTypeList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
    },
    async delTypeList(id) {
      let typeList = await this.Axios.get(`product-api/attributecategory/delete?id=${id}`);
      if (typeList.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getTypeList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
    },
    /*属性 */
    async getList() {
      let typeList = await this.Axios.get(`product-api/attributelist/query?cateId=${this.cateId}`);
      console.log(typeList.data.result);
      this.tableData = typeList.data.result;
    },
    async updList(data) {
      let typeList = await this.Axios.post(`product-api/attributelist/update`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getList();
      } else {
        this.showMessage("error", "编辑失败");
      }
      this.editFormVisible = false;
    },
    async delList(id) {
      let typeList = await this.Axios.get(`product-api/attributelist/update?id=${id}`);
      if (typeList.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getList();
      } else {
        this.showMessage("error", "操作失败");
      }
    },
    async addList(data) {
      let typeList = await this.Axios.post(`product-api/attributelist/add`, data, "postJson");
      if (typeList.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
</style>
