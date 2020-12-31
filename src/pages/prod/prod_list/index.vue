<!--
 * @Author:   商品列表
 * @Date: 2020-08-14 14:53:16
 * @LastEditTime: 2020-12-19 10:01:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\user\uesr_org\index.vue
-->

<template>
  <div class="prod_list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品库</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <section class="prod_list_content">
      <article class="prod_list_type" v-loading="typeLoading">
        <p>商品分类</p>
        <div class="top_line"></div>
        <tree
          title="创建一级分类"
          :titleshow="titleshow"
          :tdkshow="tdkshow"
          :addshow="addshow"
          :editshow="editshow"
          :delshow="delshow"
          :list="treeList"
          @nodeAdd="nodeAdd"
          @nodeClick="nodeClick"
          @addTop="addTop"
          @completeEditor="completeEditor"
          @startEditor="startEditor"
          @startTdk="startTdk"
          @deleteEditor="deleteEditor"
        ></tree>
        <!-- <div class="pages">
          <p></p>
          <el-pagination background layout="prev, pager, next" :page-size="15" :total="typeTotle" @next-click="selectTypePages" @prev-click="selectTypePages" @current-change="selectTypePages"> </el-pagination>
        </div> -->
      </article>
      <article class="prod_list_list">
        <div class="prod_attr_button">
          <el-button v-has="'/prod/list-btn-add'" type="primary" size="small" @click="add">新建商品</el-button>
        </div>
        <el-table :data="tableData" stripe max-height="640px" style="width: 99%">
          <el-table-column prop="name" align="center" label="商品名称" min-width="250"></el-table-column>
          <el-table-column :formatter="formatDate" prop="addTime" align="center" label="创建时间"></el-table-column>
          <el-table-column align="center" label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button v-has="'/prod/list-btn-edit'" @click="editThis(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages">
          <p></p>
          <el-pagination background :current-page.sync="cur_page" layout="prev, pager, next" :page-size="8" :total="prodTotle" @next-click="selectProductPages" @prev-click="selectProductPages" @current-change="selectProductPages"> </el-pagination>
        </div>
      </article>
    </section>

    <!-- 新建商品分类 -->
    <el-dialog :title="title" :visible.sync="isEditFormType" width="40%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editFormType" :model="editFormType" :rules="rulesType">
        <el-form-item label="分类名称" prop="name">
          <el-input size="small" v-model="editFormType.name" auto-complete="off" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input :disabled="disable" size="small" v-model="editFormType.path" auto-complete="off" placeholder="请输入路径名称"></el-input>
        </el-form-item>
        <el-form-item label="分类title" prop="title">
          <el-input size="small" v-model="editFormType.title" auto-complete="off" placeholder="请输入分类title"></el-input>
        </el-form-item>
        <el-form-item label="分类key" prop="key">
          <el-input size="small" v-model="editFormType.key" auto-complete="off" placeholder="请输入分类key"></el-input>
        </el-form-item>
        <el-form-item label="分类desc" prop="descrip">
          <el-input size="small" v-model="editFormType.descrip" auto-complete="off" placeholder="请输入分类description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeD">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitFormType">生成</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 标题 & TDK 信息 -->
    <!-- <el-dialog :title="titleTdk" :visible.sync="isEditFormTdk" width="30%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editFormTdk" :model="editFormTdk" :rules="rulesTdk">
        <el-form-item label="分类标题" prop="title">
          <el-input size="small" v-model="editFormTdk.name" auto-complete="off" placeholder="请输入分类title"></el-input>
        </el-form-item>

        <el-form-item label="分类title" prop="title">
          <el-input size="small" v-model="editFormTdk.title" auto-complete="off" placeholder="请输入分类title"></el-input>
        </el-form-item>
        <el-form-item label="分类key" prop="key">
          <el-input size="small" v-model="editFormTdk.key" auto-complete="off" placeholder="请输入分类key"></el-input>
        </el-form-item>
        <el-form-item label="分类desc" prop="descrip">
          <el-input size="small" v-model="editFormTdk.descrip" auto-complete="off" placeholder="请输入分类description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitFormTdk">新建</el-button>
      </div>
    </el-dialog> -->

    <!-- 新建& 编辑商品 -->
    <el-dialog class="editorForm" :title="titleProduct" :visible.sync="isEditFormProduct" width="70%" @close="closeD">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editFormProduct" :model="editFormProduct" :rules="rulesProd">
        <el-form-item label="商品名称" prop="name">
          <el-input size="small" v-model="editFormProduct.name" auto-complete="off" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="title" prop="title">
          <el-input size="small" v-model="editFormProduct.title" auto-complete="off" placeholder="请输入商品title"></el-input>
        </el-form-item>

        <el-form-item label="key" prop="key">
          <el-input size="small" v-model="editFormProduct.key" auto-complete="off" placeholder="请输入商品key"></el-input>
        </el-form-item>

        <el-form-item label="descrip" prop="descrip">
          <el-input size="small" v-model="editFormProduct.descrip" auto-complete="off" placeholder="请输入商品descrip"></el-input>
        </el-form-item>
        <el-form-item label="属性分类" prop="typeList" style="margin-right:0px">
          <el-select :disabled="disabled" class="skuTypeList" v-model="editFormProduct.typeList" multiple placeholder="请选择">
            <el-option v-for="item in optionType" :key="item.id" :label="item.name" :value="item.cateId">
              <span>{{ item.name }}</span>
              <span style="color:#aaa;margin-left:15px">({{ item.description }})</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品详情" prop="editor">
          <div class="editor">
            <editor v-model="editFormProduct.editor"></editor>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeD">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitFormProd">生成</el-button>
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
      /* 树状图按钮显示隐藏 */
      titleshow: true,
      tdkshow: true,
      addshow: true,
      editshow: false,
      delshow: true,
      treeList: [
        {
          id: 11,
          name: "办理性质",
          ProSort: 111,
          pid: "",
          // isEdit: false,
          children: [
            {
              id: 121,
              name: "办理性质--",
              ProSort: 113,
              pid: "",
            },
          ],
        },
        {
          id: 22,
          name: "办理性质2",
          ProSort: 121,
          pid: "",
          // isEdit: false,
          children: [],
        },
      ],
      typeAddOrEdit: 1,
      //分类一级id
      typeFirstId: 0,
      typePage: 0,
      typeTotle: 0,
      tempTypeData: {},
      tempProdData: {},
      //商品id
      prodId: "",
      groupId: "",
      prodPage: 0,
      tableData: [],
      prodTotle: 0,
      cur_page: 0,
      // 编辑时禁止修改属性分类
      disabled: false,
      typeLoading: false,
      /*商品类型弹框*/
      title: "新建分类名称",
      isEditFormType: false,
      loading: false,
      editFormType: {
        name: "",
        title: "",
        key: "",
        descrip: "",
        path: "",
      },
      rulesType: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        title: [{ required: true, message: "请输入分类title", trigger: "blur" }],
        key: [{ required: true, message: "请输入分类key", trigger: "blur" }],
        descrip: [{ required: true, message: "请输入分类descrip", trigger: "blur" }],
        path: [
          { required: true, message: "请输入路径", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "长度应大于1个字符",
          },
          {
            pattern: /^(\w){1,20}$/,
            message: "只能输入字母、数字、下划线",
          },
        ],
      },
      /* 属性分类列表 */
      optionType: [
        {
          values: "选项1",
          label: "黄金糕",
        },
        {
          values: "选项2",
          label: "双皮奶",
        },
        {
          values: "选项5",
          label: "北京烤鸭",
        },
      ],
      /* 新建&编辑 商品 */
      //是否为二级分类(获取parentId)
      isSecondId: 0,
      prodAddOrEdit: 1,
      isEditFormProduct: false,
      titleProduct: "新建商品",
      editFormProduct: {
        name: "",
        title: "",
        key: "",
        descrip: "",
        editor: "",
        typeList: "",
      },
      rulesProd: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        title: [{ required: true, message: "请输入商品title", trigger: "blur" }],
        key: [{ required: true, message: "请输入商品key", trigger: "blur" }],
        descrip: [{ required: true, message: "请输入商品descrip", trigger: "blur" }],
        // editor: [{ required: true, message: "请输入商品详情", trigger: "blur" }],
        typeList: [{ required: true, message: "请输入分类属性", trigger: "blur" }],
      },
      //路径可以新建 不可编辑
      disable: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getTypeProduct();
    this.getTypeList();
    this.getPower();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 验证树状图权限 */
    // /prod/list-btn-treeAddFirst  /prod/list-btn-treeAddOther /prod/list-btn-treeEdit /prod/list-btn-treeDelete
    //验证权限
    //  if(!this.verification(store.state.selectBtnJurisdiction,'/offcial/link-btn-show')){
    //    this.showMessage('error','无此权限')
    //   return false
    //  }
    getPower() {
      this.titleshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/list-btn-treeAddFirst");
      this.tdkshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/list-btn-treeEdit");
      this.addshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/list-btn-treeAddOther");
      this.editshow = false;
      this.delshow = this.verification(this.$store.state.selectBtnJurisdiction, "/prod/list-btn-treeDelete");
    },
    /*列表过滤*/
    formatDate(row, column) {
      return row.addTime.split(" ")[0];
    },
    /* 页面点击 */
    add() {
      this.disabled = false;
      if (this.isSecondId == 0) {
        this.$alert("请选择左侧二级分类后创建商品", "提示");
        return false;
      }
      this.prodAddOrEdit = 1;
      this.titleProduct = "新建商品";
      this.isEditFormProduct = true;
      this.closeDialog();
    },
    closeDialog() {
      this.editFormProduct.name = "";
      this.editFormProduct.title = "";
      this.editFormProduct.key = "";
      this.editFormProduct.descrip = "";
      this.editFormProduct.editor = "";
      this.editFormProduct.typeList = "";

      // if (this.$refs.editFormType) this.$refs.editFormType.resetFields();
      // if (this.$refs.editFormProduct) this.$refs.editFormProduct.resetFields();
    },
    deleteDataType() {
      this.editFormType.name = "";
      this.editFormType.title = "";
      this.editFormType.key = "";
      this.editFormType.descrip = "";
      this.editFormType.path = "";
    },
    closeD() {
      this.isEditFormType = false;
      this.isEditFormTdk = false;
      this.isEditFormProduct = false;
      this.closeDialog();
    },
    editThis(data) {
      this.disabled = true;
      console.log(data);
      this.prodAddOrEdit = 2;
      this.titleProduct = "编辑商品";
      this.isEditFormProduct = true;
      this.tempProdData = data;
      this.editFormProduct.name = data.name;
      this.editFormProduct.title = data.tdkTitle;
      this.editFormProduct.key = data.tdkKeywords;
      this.editFormProduct.descrip = data.tdkDescription;
      this.editFormProduct.editor = data.information;
      this.editFormProduct.typeList = data.attrCateIds.split(",");
    },
    /*分页*/
    selectTypePages(val) {
      this.typePage = parseInt(val - 1);
      this.getTypeProduct();
    },
    selectProductPages(val) {
      this.prodPage = parseInt(val - 1);
      this.getProductList();
    },
    /* 发布 */
    submitFormType() {
      this.$refs.editFormType.validate((val) => {
        if (!val) {
          this.showMessage("error", "内容不能为空");
          return false;
        }
        if (this.editFormType.name.length > 20) {
          this.showMessage("error", "内容输入过长");
          return false;
        }
        if (this.typeAddOrEdit == 1) {
          //创建分类
          let _data = {};
          _data.name = this.editFormType.name;
          _data.tdkTitle = this.editFormType.title;
          _data.tdkKeywords = this.editFormType.key;
          _data.tdkDescription = this.editFormType.descrip;
          _data.path = this.editFormType.path;
          _data.parentId = this.typeFirstId;
          this.addTypeProduct(_data);
        } else {
          //编辑分类
          console.log("编辑");
          let _editData = Object.assign({}, this.tempTypeData); //深度拷贝，防止改变其他数据
          // let _editData = this.tempTypeData;
          _editData.name = this.editFormType.name;
          _editData.tdkTitle = this.editFormType.title;
          _editData.tdkKeywords = this.editFormType.key;
          _editData.tdkDescription = this.editFormType.descrip;
          _editData.path = this.editFormType.path;
          console.log(_editData);
          this.updTypeProduct(_editData);
        }
      });
    },
    submitFormTdk() {},
    submitFormProd() {
      this.$refs.editFormProduct.validate((val) => {
        if (!val) {
          this.showMessage("error", "所填内容不能为空");
          return false;
        }
        if (this.editFormProduct.name.length > 25) {
          this.showMessage("error", "内容输入过长");
          return false;
        }
        if (this.prodAddOrEdit == 1) {
          //新建
          let _data = {};
          _data.groupId = this.groupId;
          _data.name = this.editFormProduct.name;
          _data.description = this.editFormProduct.name;
          _data.tdkTitle = this.editFormProduct.title;
          _data.tdkKeywords = this.editFormProduct.key;
          _data.tdkDescription = this.editFormProduct.descrip;
          _data.information = this.editFormProduct.editor;
          _data.attrCateIds = this.editFormProduct.typeList.join(",");
          _data.status = 1;
          console.log(_data);
          this.addProductList(_data);
        } else {
          //编辑
          let _dat = this.tempProdData;
          _dat.name = this.editFormProduct.name;
          _dat.description = this.editFormProduct.name;
          _dat.tdkTitle = this.editFormProduct.title;
          _dat.tdkKeywords = this.editFormProduct.key;
          _dat.tdkDescription = this.editFormProduct.descrip;
          _dat.information = this.editFormProduct.editor;
          _dat.attrCateIds = this.editFormProduct.typeList.join(",");
          console.log(_dat);
          this.updProductList(_dat);
        }
      });
    },

    /*树状图点击*/
    nodeClick(s, d, n) {
      console.log(this.prodPage);
      console.log(d);
      this.isSecondId = d.parentId;
      this.groupId = d.groupId;
      if (d.parentId != 0) {
        this.prodPage = 0;
        this.cur_page = 0;
        console.log(this.prodPage);
        this.getProductList();
      }
    },
    addTop() {
      this.disable = false;
      console.log("创建一级");
      this.title = "新建一级分类名称";
      this.typeAddOrEdit = 1;
      this.isEditFormType = true;
      this.typeFirstId = 0;
      this.deleteDataType();
    },
    //添加子节点
    nodeAdd(s, d, n) {
      this.disable = false;
      this.typeAddOrEdit = 1;
      this.closeDialog();
      console.log("添加子节点");
      this.title = "新建二级分类名称";
      this.isEditFormType = true;
      this.deleteDataType();
      console.log(d);
      this.typeFirstId = d.groupId;
      console.log(this.editFormType);
      //创建二级后不加 children

      return false;
      d.children.push({
        id: ++this.maxexpandId,
        name: "新增节点",
        pid: d.id,
        isEdit: false,
        children: [],
      });
    },
    completeEditor() {},
    startEditor() {},
    deleteEditor(s, d, n) {
      console.log(d);
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(d);
          this.delTypeProduct(d.id);
        })
        .catch(() => {
          return false;
        });
    },
    startTdk(s, d, n) {
      this.disable = true;
      console.log(d);
      this.typeAddOrEdit = 2;
      let _d = d;
      delete _d.children;
      delete _d.productGroupVOList;
      this.tempTypeData = _d;
      this.title = "编辑分类名称";
      this.typeFirstId = d.parentId;
      this.isEditFormType = true;
      this.editFormType.name = d.name;
      this.editFormType.title = d.tdkTitle;
      this.editFormType.key = d.tdkKeywords;
      this.editFormType.descrip = d.tdkDescription;
      this.editFormType.path = d.path;
    },
    /* 数据组装 */
    dataTypeAssemble(data) {
      let _data = [];
      data.forEach((element) => {
        let _dat = element;
        let _array = element.productGroupVOList;
        // for (let _arr of element.productGroupVOList) {
        //   let _tempArr = _arr;
        //   _tempArr.name = _arr.attributeName;
        //   Object.assign(_tempArr, { isFirst: false, isEdit: false });
        //   _array.push(_tempArr);
        // }
        Object.assign(_dat, { isFirst: false, isEdit: false, children: _array });
        _data.push(_dat);
        // delete _dat.attributeListVOList; //删除 子对象列表 添加 children
      });
      return _data;
    },
    /*接口*/
    //获取属性分类
    async getTypeList() {
      let typeList = await this.Axios.get(`product-api/attributecategory/list?pageNum=0&pageSize=10000`);
      console.log(typeList.data.result);
      this.optionType = typeList.data.result;
    },
    //商品分类
    async getTypeProduct() {
      this.typeLoading = true;
      let _resp = await this.Axios.get(`product-api/productgroup/getProdGroupListWithLevel?pageNum=0&pageSize=9999`);
      this.typeLoading = false;
      this.typeTotle = _resp.data.total;
      let _arr = this.dataTypeAssemble(_resp.data.result);
      this.treeList = _arr;
    },
    async addTypeProduct(data) {
      let _resp = await this.Axios.post(`product-api/productgroup/add`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getTypeProduct();
      } else {
        this.showMessage("error", "操作失败");
      }
      this.closeD();
    },
    async delTypeProduct(id) {
      let _resp = await this.Axios.get(`product-api/productgroup/delete?id=${id}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getTypeProduct();
      } else {
        this.showMessage("error", _resp.data.message);
      }
    },
    async updTypeProduct(data) {
      let _resp = await this.Axios.post(`product-api/productgroup/update`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getTypeProduct();
      } else {
        this.showMessage("error", _resp.data.message);
      }
      this.closeD();
    },

    //商品
    async addProductList(data) {
      console.log(data);
      let _resp = await this.Axios.post(`product-api/productlist/add`, data, "postJson");
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
      let _resp = await this.Axios.get(`product-api/productlist/list?pageNum=${this.prodPage}&pageSize=8&groupId=${this.groupId}`);
      this.tableData = _resp.data.result;
      this.prodTotle = _resp.data.total;
    },
    // async delProductList(id) {
    //   let _resp = await this.Axios.post(`product-api/productlist/delete`, data);
    // },
    async updProductList(data) {
      let _resp = await this.Axios.post(`product-api/productlist/update`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
      } else {
        this.showMessage("error", "操作失败");
      }
      this.closeD();
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
.pages {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.prod_list_content .prod_list_list {
  flex: 1;
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
</style>
