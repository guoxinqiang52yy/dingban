<!--
 * @Author: 政策列表
 * @Date: 2020-08-15 09:16:43
 * @LastEditTime: 2020-12-04 11:15:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage(0815)\src\pages\policy\policy_list\index.vue
-->

<template>
  <div class="policy_list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>政策库</el-breadcrumb-item>
      <el-breadcrumb-item>政策列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <section class="policy_list_content">
      <article class="policy_list_type" v-loading="typeLoading">
        <p>政策分类</p>
        <div class="top_line"></div>
        <tree
          title="添加分类"
          :titleshow="titleshow"
          :tdkshow="tdkshow"
          :addshow="addshow"
          :editshow="editshow"
          :delshow="delshow"
          @startTdk="startTdk"
          :list="treeList"
          @nodeClick="nodeClick"
          @addTop="addTop"
          @completeEditor="completeEditor"
          @startEditor="startEditor"
          @deleteEditor="deleteEditor"
        ></tree>
      </article>
      <!-- 列表 -->
      <article class="policy_list_list" v-loading="listLoading">
        <div class="policy_list_button">
          <div>
            <span style="margin-right:10px">地区筛选:</span>
            <el-select class="select_city" v-model="selectCity" placeholder="请选择" @change="selectCt">
              <el-option key="" label="全部" value=""> </el-option>
              <el-option v-for="item in options" :key="item.values" :label="item.label" :value="item.values"> </el-option>
            </el-select>
          </div>
          <div>
            <!-- <el-input class="select_input" placeholder="搜索名称" v-model="search">
              <el-button @click="searchTitle" slot="append" icon="el-icon-search"></el-button>
            </el-input> -->
            <el-button v-has="'/policy/policylist-btn-add'" type="primary" size="small" @click="add">新建政策文章</el-button>
          </div>
        </div>
        <el-table :data="tableData" stripe max-height="570" style="width: 100%">
          <!-- <el-table-column prop="id" align="center" label="序号" min-width="50"></el-table-column> -->
          <el-table-column prop="pic" align="center" label="展示封面" min-width="100">
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl" width="90" height="40" />
            </template>
          </el-table-column>

          <el-table-column :show-overflow-tooltip="true" prop="title" align="center" label="政策标题" min-width="180"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="description" align="center" label="政策简介" min-width="180"></el-table-column>

          <el-table-column :formatter="formatCity" prop="areaId" align="center" label="创建地区" min-width="120"> </el-table-column>
          <el-table-column :formatter="formatDate" prop="addTime" align="center" label="创建时间" min-width="120"></el-table-column>
          <el-table-column align="center" label="操作" min-width="80" fixed="right">
            <template slot-scope="scope">
              <el-button v-has="'/policy/policylist-btn-edit'" @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-has="'/policy/policylist-btn-delete'" @click="handleClickDelete(scope.row)" type="text" style="color:red;" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pages">
          <p></p>
          <el-pagination :current-page.sync="cur_page" background layout="total,prev, pager, next" :page-size="8" :total="totle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
        </div>
      </article>
    </section>

    <!-- 新建&编辑 政策文章 -->
    <el-dialog class="zhengce" v-bind:title="title" :visible.sync="editFormVisible" width="70%" :before-close="closeDialogNews">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editForm1" :model="editForm" :rules="rules">
        <el-form-item label="文章标题" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="请输入文章标题"></el-input>
        </el-form-item>

        <el-form-item label="地区选择" prop="seleAreaId">
          <el-select class="select_city" v-model="editForm.seleAreaId" placeholder="请选择">
            <el-option v-for="item in options" :key="item.values" :label="item.label" :value="item.values"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择分类" prop="seleType">
          <!-- editForm.seleType -->
          <el-select class="select_city" v-model="editForm.seleType" placeholder="请选择">
            <el-option v-for="item in treeList" :key="item.typeId" :label="item.name" :value="item.typeId"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="展示封面" prop="imageUrl" class="upload_pic">
          <el-upload class="avatar-uploader" action="" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :http-request="suceessAvataruploadPic">
            <img v-if="editForm.imageUrl" :src="editForm.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <i class="upload_info">图片纵横比1:2</i>
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input size="small" v-model="editForm.title" auto-complete="off" placeholder="请输入Title"></el-input>
        </el-form-item>

        <el-form-item label="Key" prop="key">
          <el-input size="small" v-model="editForm.key" auto-complete="off" placeholder="请输入Key"></el-input>
        </el-form-item>

        <el-form-item label="description" prop="description">
          <el-input type="textarea" :rows="3" resize="none" size="small" v-model="editForm.description" auto-complete="off" placeholder="请输入文章description"></el-input>
        </el-form-item>

        <el-form-item label="文章详情" prop="editor">
          <div class="editor">
            <editor v-model="editForm.editor"></editor>
            <!-- <quillEditor v-model="editForm.editor" ref="vueQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)"> </quillEditor> -->
          </div>
          <!-- <el-input type="textarea" :rows="3" resize=none size="small" v-model="editForm.description" auto-complete="off" placeholder="请输入商品名称"></el-input> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialogNews">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitFormArticle">提交</el-button>
      </div>
    </el-dialog>
    <!-- 新建 编辑 分类 -->
    <el-dialog :title="titleType" :visible.sync="typeFormVisible" width="40%" :before-close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="90px" ref="editFormType" :model="editFormType" :rules="rulesType">
        <el-form-item label="分类名称" prop="name">
          <el-input size="small" v-model="editFormType.name" auto-complete="off" placeholder="请输入分类名称"></el-input>
        </el-form-item>

        <el-form-item label="path" prop="path">
          <el-input :disabled="isPath" size="small" v-model="editFormType.path" auto-complete="off" placeholder="请输入路径"></el-input>
        </el-form-item>

        <el-form-item label="title" prop="tdkTitle">
          <el-input size="small" v-model="editFormType.tdkTitle" auto-complete="off" placeholder="请输入title"></el-input>
        </el-form-item>

        <el-form-item label="key" prop="tdkKeywords">
          <el-input size="small" v-model="editFormType.tdkKeywords" auto-complete="off" placeholder="请输入key"></el-input>
        </el-form-item>
        <el-form-item label="description" prop="tdkDescription">
          <el-input size="small" v-model="editFormType.tdkDescription" auto-complete="off" placeholder="请输入description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loadingType" class="title" @click="submitFormType">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myMixin from "../../../assets/js/minx/minx";
import axios from "axios";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import editor from "../../../components/editor";
import tree from "../../../components/tree/tree";
export default {
  name: "",
  components: { tree, quillEditor, editor },
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
      /* loding */
      typeLoading: false,
      listLoading: false,
      articleId: "",
      selectCity: "",
      tableData: [
        {
          articleId: 1112,
          pic: "123",
          title: "这是标题，文字不超过20个",
          description: "这是简介，文字不超过20个，第20个字",
          areaId: "天津",
          addTime: "2020-07-29",
        },
      ],
      articleId: 0,
      /* 树状图*/
      treeId: 0,
      treeList: [],
      /* 文章 */
      //弹框数据

      loading: false,
      editFormVisible: false,
      addOrEditType: 1,
      title: "新建政策列表",
      titleType: "新建分类",
      editForm: {
        name: "",
        title: "",
        key: "",
        description: "",
        imageUrl: "",
        editor: "",
        seleAreaId: "",
        seleType: "",
      },
      areaList: [
        { name: "天津", value: 3 },
        { name: "广州", value: 1601 },
        { name: "哈尔滨", value: 698 },
        { name: "太原", value: 303 },
      ],
      // rules表单验证
      rules: {
        name: [{ required: true, message: "请输入标题", trigger: "blur" }],
        title: [{ required: true, message: "请输入title", trigger: "blur" }],
        key: [{ required: true, message: "请输入key", trigger: "blur" }],
        description: [{ required: true, message: "请输入description", trigger: "blur" }],
        imageUrl: [{ required: true, message: "请添加图片", trigger: "blur" }],
        editor: [{ required: true, message: "请输入内容", trigger: "blur" }],
        seleAreaId: [{ required: true, message: "请选择地区", trigger: "blur" }],
        seleType: [{ required: true, message: "请选择地区", trigger: "blur" }],
      },
      /*分类*/
      typeFormVisible: false,
      loadingType: false,
      editFormType: {
        name: "",
        path: "",
        tdkTitle: "",
        tdkKeywords: "",
        tdkDescription: "",
      },
      rulesType: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
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
        tdkTitle: [{ required: true, message: "请输入tdk名称", trigger: "blur" }],
        tdkKeywords: [{ required: true, message: "请输入tdk关键字", trigger: "blur" }],
        tdkDescription: [{ required: true, message: "请输入tdk描述", trigger: "blur" }],
      },
      /* 富文本*/
      detail: "",
      adOrcomp: 1, //添加1 编辑-1

      /* 获取文章列表传值 */
      typeId: "",
      areaId: "",
      title: "",
      totle: 10,
      number: 0,
      cur_page: 0,
      search: "",
      isPath: false,
      /*编辑文章的id*/
      id: 0,
      tempCity: [],
      /* 编辑分类 */
      tempTypeId: 0,
      isEditType: false,
    };
  },
  computed: {
    //获取城市
    options() {
      return this.$store.state.cityList;
    },
  },
  watch: {},
  filters: {},
  beforeCreate() {},
  created() {
    this.tempCity = this.$store.state.cityList;
    console.log(this.tempCity);
  },
  mounted() {
    this.getTypeList();
    this.getPower();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 验证树状图权限 */
    // /policy/policylist-btn-treeAdd /policy/policylist-btn-treeEdit /policy/policylist-btn-treeDelete
    //验证权限
    //  if(!this.verification(store.state.selectBtnJurisdiction,'/offcial/link-btn-show')){
    //    this.showMessage('error','无此权限')
    //   return false
    //  }
    getPower() {
      this.titleshow = this.verification(this.$store.state.selectBtnJurisdiction, "/policy/policylist-btn-treeAdd");
      this.tdkshow = this.verification(this.$store.state.selectBtnJurisdiction, "/policy/policylist-btn-treeEdit");
      this.addshow = true;
      this.editshow = false;
      this.delshow = this.verification(this.$store.state.selectBtnJurisdiction, "/policy/policylist-btn-treeDelete");
    },
    /*列表过滤*/
    formatCity(row, column) {
      let [...arr2] = this.options;
      let _resp = arr2.find((val) => {
        return row.areaId == val.values;
      });
      if (_resp) return _resp.label; //有旧数据残留 数据结构不同
    },
    formatDate(row, column) {
      return row.addTime.split(" ")[0];
    },

    aaa(val) {
      console.log(this.editForm.seleType);
    },
    /*接口*/
    //获取分类
    async getTypeList() {
      this.typeLoading = true;
      let typeList = await this.Axios.get(`news-api/articletype/list`);
      this.typeLoading = false;
      this.addTreeList(typeList.data.result);
    },
    //编辑分类
    async textType(data) {
      let typeList = await this.Axios.post(`news-api/articletype/update`, data);
      console.log(typeList.data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "编辑成功");
        this.getTypeList();
      } else {
        this.showMessage("error", "编辑失败");
      }
      this.closeDialog();
    },
    //添加分类
    async addType(dat) {
      let data = dat;
      let typeList = await this.Axios.get(`news-api/articletype/add?` + data);
      console.log(typeList.data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.closeDialog();
        this.getTypeList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
    },
    //删除分类
    async deleteType(id) {
      let typeList = await this.Axios.get(`news-api/articletype/delete?id=${id}`);
      console.log(typeList.data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "删除成功");
        this.getTypeList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
    },
    //获取文章列表
    async getArticleList() {
      this.listLoading = true;
      let list = await this.Axios.get(`news-api/article/list?pageSize=8&pageNum=${this.number}&type=${this.typeId}&areaId=${this.areaId}&title=${this.search}`);
      this.listLoading = false;
      this.tableData = list.data.result;
      this.totle = list.data.total;
    },
    //新建文章
    async addArticle(data) {
      let resp = await this.Axios.post(`news-api/article/add`, data);
      // console.log(resp.data);
      if (resp.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.editFormVisible = false;
        this.getArticleList();
      } else {
        this.showMessage("error", "操作失败");
      }
    },
    //编辑文章
    async editArticle(data) {
      let resp = await this.Axios.post(`news-api/article/update`, data);
      console.log(resp.data);
      if (resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.editFormVisible = false;
        this.getArticleList();
      } else {
        this.showMessage("error", "操作失败");
      }
    },
    //删除文章
    async deltetArticle(id) {
      let resp = await this.Axios.post(`news-api/article/delete?id=${id}`);
      if (resp.data.code == 0) {
        this.showMessage("success", "删除成功");
        this.getArticleList();
      } else {
        this.showMessage("error", "操作失败");
      }
    },
    /*==文章操作==*/
    //搜索标题
    searchTitle() {
      this.getArticleList();
    },
    //选择地区
    selectCt() {
      this.areaId = this.selectCity;
      this.getArticleList();
    },

    selectPages(val) {
      console.log(val);
      this.number = parseInt(val - 1);
      this.getArticleList();
    },
    //清除内容
    clearEditor() {
      this.editForm.name = "";
      this.editForm.title = "";
      this.editForm.description = "";
      this.editForm.key = "";
      this.editForm.editor = "";
      this.editForm.imageUrl = "";
      this.editForm.seleType = "";
      this.editForm.seleAreaId = "";
    },

    // 点击编辑
    handleClick(data) {
      console.log(data);
      this.adOrcomp = -1;
      this.articleId = data.articleId;
      this.id = data.id;
      this.articleId = data.articleId;
      this.title = "编辑政策文章";
      this.editFormVisible = true;
      this.editForm.name = data.title;
      this.editForm.title = data.tdkTitle;
      this.editForm.description = data.tdkDescription;
      this.editForm.key = data.tdkKeywords;
      this.editForm.editor = data.articleInfo;
      this.editForm.imageUrl = data.imgUrl || "";
      this.editForm.seleAreaId = parseInt(data.areaId);
      this.editForm.seleType = data.type.toString();
    },
    //删除
    handleClickDelete(data) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deltetArticle(data.id);
        })
        .catch(() => {
          return false;
        });
    },
    // 点击添加
    add() {
      this.adOrcomp = 1;
      this.editFormVisible = true;
      this.clearEditor();
    },
    //添加& 编辑 文章提交
    submitFormArticle() {
      this.$refs.editForm1.validate((val) => {
        if (val) {
          console.log(this.adOrcomp);
          let _data = {
            areaId: this.editForm.seleAreaId,
            title: this.editForm.name,
            type: this.editForm.seleType,
            articleInfo: this.editForm.editor,
            tdkTitle: this.editForm.title,
            tdkKeywords: this.editForm.key,
            tdkDescription: this.editForm.description,
            imgUrl: this.editForm.imageUrl,
          };
          if (this.adOrcomp == 1) {
            console.log(_data);
            this.addArticle(_data);
          } else {
            _data.id = this.id;
            _data.articleId = this.articleId;
            console.log("文章id");
            console.log(this.articleId);
            console.log(_data);
            this.editArticle(_data);
          }
        } else {
          this.$message.error("添加内容不能为空！");
        }
      });
    },

    //获取上传图片
    getPicture(data) {
      this.editForm.imageUrl = `http://applet-second.oss-cn-qingdao.aliyuncs.com/` + data;
    },
    /*==树状图节点操作==*/
    nodeClick(s, d, n) {
      console.log("点击");
      console.log(d);
      this.typeId = d.typeId;
      this.number = 0;
      this.cur_page = 0;
      this.getArticleList();
    },
    addTop() {
      this.titleType = "添加分类";
      this.addOrEditType = 1;
      this.isPath = false;
      this.typeFormVisible = true;
      this.isEditType = false;
      this.editFormType.name = "";
      this.editFormType.path = "";
      this.editFormType.tdkTitle = "";
      this.editFormType.tdkKeywords = "";
      this.editFormType.tdkDescription = "";
      return false; //添加父级节点 使用后端接口实现 暂不使用本地添加
      this.treeList.push({
        id: 100154,
        name: "新增节点+",
        pid: "",
        isEdit: false,
        children: [],
      });
    },
    startTdk(s, d, n) {
      this.titleType = "编辑分类";
      this.addOrEditType = 2;
      this.isPath = true;
      console.log("add");
      this.typeFormVisible = true;
      this.isEditType = true;
      console.log(d);
      this.tempTypeId = d.id;
      this.title = "编辑分类";
      this.tempData = d;
      this.editFormType.name = d.name;
      this.editFormType.path = d.path;
      this.editFormType.tdkTitle = d.tdkTitle;
      this.editFormType.tdkDescription = d.tdkDescription;
      this.editFormType.tdkKeywords = d.tdkKeywords;
    },
    startEditor(s, d, n) {
      console.log(d);
      this.treeId = d.id;
    },
    completeEditor(s, d, n) {
      console.log("编辑完成");
      console.log(d);
      this.textType(d.id, d.name);
    },
    deleteEditor(s, d, n) {
      console.log(d);
      let that = this;
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(d);
          that.deleteType(d.id);
        })
        .catch(() => {
          return false;
        });
    },
    submitFormType() {
      this.$refs.editFormType.validate((val) => {
        if (val) {
          console.log(this.isPath);
          if (this.addOrEditType == 1) {
            let _data = `sortNum=0&status=1&parentId=0&name=${this.editFormType.name}&path=${this.editFormType.path}&tdkTitle=${this.editFormType.tdkTitle}&tdkKeywords=${this.editFormType.tdkKeywords}&tdkDescription=${this.editFormType.tdkDescription}`;
            this.addType(_data);
          } else {
            let _data = {
              id: this.tempTypeId,
              path: this.tempData.path,
              name: this.editFormType.name,
              tdkTitle: this.editFormType.tdkTitle,
              tdkKeywords: this.editFormType.tdkKeywords,
              tdkDescription: this.editFormType.tdkDescription,
              typeId: this.tempData.typeId,
            };
            this.textType(_data);
          }
        }
      });
    },

    //富文本
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件

    //添加到树状图
    addTreeList(data) {
      this.treeList = [];
      let _arr = [];
      // this.treeList = [];
      data.forEach((element) => {
        let _data = element;
        Object.assign(_data, { isFirst: false, isEdit: false });
        this.treeList.push(_data);
      });
      this.typeId = this.treeList[0].typeId;
      this.getArticleList();
    },
    //取消
    closeDialog() {
      this.editFormType.name = "";
      this.editFormType.path = "";
      this.editFormType.tdkTitle = "";
      this.editFormType.tdkKeywords = "";
      this.editFormType.tdkDescription = "";
      this.typeFormVisible = false;

      this.$refs.editFormType.resetFields(); //表单清除
    },
    closeDialogNews() {
      this.editFormVisible = false;
      this.$refs.editForm1.resetFields(); //表单清除
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
.zhengce /deep/ .el-form-item__content {
  width: 80%;
}
.zhengce /deep/ .el-dialog__body {
  overflow-y: auto;
  height: 65vh;
}
.zhengce /deep/ .el-form-item .el-form-item__label {
  width: 150px !important;
}

.upload_pic /deep/ .el-form-item__content i {
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

.policy_list /deep/ .el-form-item__content {
  flex: 1;
}
.policy_list /deep/ .el-select {
  width: 100%;
}
</style>
