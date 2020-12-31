<!--
 * @Author: 官网配置 banner
 * @Date: 2020-08-15 09:16:43
 * @LastEditTime: 2020-12-24 09:06:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage(0815)\src\pages\official\official_banner\index.vue
-->

<template>
  <div class="official_banner">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>官网配置</el-breadcrumb-item>
      <el-breadcrumb-item>banner</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="official_banner_top">
      <div class="official_banner_search">
        <span style="margin-right:10px">地区筛选:</span>
        <el-select class="select_city" v-model="selectCy" placeholder="请选择" @change="selectCity">
          <el-option key="" label="全部" value=""> </el-option>
          <el-option v-for="item in options" :key="item.values" :label="item.label" :value="item.values"> </el-option>
        </el-select>
      </div>
      <div>
        <el-button v-has="'/offcial/banner-btn-add'" type="primary" size="small" @click="add">新建banner</el-button>
      </div>
    </div>

    <el-table :data="tableData" stripe max-height="650px" style="width: 100%" v-loading="listLoading">
      <el-table-column prop="pic" align="center" label="图片" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" width="100" height="40" />
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="名称" min-width="140"></el-table-column>
      <el-table-column :formatter="formatType" prop="type" align="center" label="类型" min-width="140"></el-table-column>

      <el-table-column prop="jumpValue" align="center" label="链接" min-width="240"></el-table-column>
      <el-table-column :formatter="formatDate" prop="addTime" align="center" label="创建日期" min-width="150"></el-table-column>

      <el-table-column align="center" label="操作" min-width="80" fixed="right">
        <template slot-scope="scope">
          <el-button v-has="'/offcial/banner-btn-delete'" @click="deleteThis(scope.row)" type="text" style="color:#f56c6c;" size="small">删除</el-button>
          <el-button v-has="'/offcial/banner-btn-edit'" @click="editorThis(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages">
      <p></p>
      <el-pagination background layout="total,prev, pager, next" :page-size="7" :total="totle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
    </div>
    <!-- 编辑banner -->
    <el-dialog class="banner_input" :title="title" :visible.sync="editFormVisible" width="43%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="100px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="Banner图片" prop="imageUrl" style="width:100%">
          <el-upload class="avatar-uploader" action="" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :http-request="suceessAvataruploadPic">
            <img v-if="editForm.imageUrl" :src="editForm.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="地区选择" prop="seleCity" style="width:100%">
          <el-select class="select_citys" v-model="editForm.seleCity" placeholder="请选择">
            <el-option v-for="item in options" :key="item.values" :label="item.label" :value="item.values"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="banner名称" prop="name" style="width:100%">
          <el-input class="banner_inputs" style="width:100%" size="small" v-model="editForm.name" auto-complete="off" placeholder="请输入banner名称"></el-input>
        </el-form-item>

        <el-form-item label="图片title" prop="title" style="width:100%">
          <el-input class="banner_inputs" size="small" v-model="editForm.title" auto-complete="off" placeholder="请输入图片title"></el-input>
        </el-form-item>

        <el-form-item label="banner类型" prop="type" style="width:100%">
          <el-select class="select_citys" v-model="editForm.type" placeholder="请选择">
            <el-option key="1" label="大banner" value="1"> </el-option>
            <el-option key="2" label="小banner" value="2"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="跳转链接" prop="link" style="width:100%">
          <el-input class="banner_inputs" size="small" v-model="editForm.link" auto-complete="off" placeholder="请输入跳转链接"></el-input>
        </el-form-item>

        <el-form-item label="描述" prop="descrip" style="width:100%">
          <el-input class="banner_inputs" size="small" v-model="editForm.descrip" auto-complete="off" placeholder="请输入banner描述"></el-input>
        </el-form-item>

        <el-form-item label="ALT" prop="alt" style="width:100%">
          <el-input class="banner_inputs" size="small" v-model="editForm.alt" auto-complete="off" placeholder="请输入alt"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myMixin from "../../../assets/js/minx/minx";
import axios from "axios";
export default {
  name: "",
  mixins: [myMixin],
  components: {},
  props: [],
  data() {
    return {
      listLoading: false,
      selectCy: 3,
      // options: [],
      tableData: [],
      number: 0,
      totle: 0,
      //弹框数据
      editFormVisible: false,
      title: "新建banner",
      editForm: {
        name: "",
        link: "",
        imageUrl: "",
        seleCity: "",
        descrip: "",
        alt: "",
        title: "",
        type: "",
      },
      loading: false,
      addOrEdit: 1, //添加1 & 编辑2
      // rules表单验证
      rules: {
        name: [{ required: true, message: "请输入banner名称", trigger: "blur" }],
        link: [{ required: true, message: "请输入banner链接", trigger: "blur" }],
        imageUrl: [{ required: true, message: "请输入banner图片", trigger: "blur" }],
        descrip: [{ required: true, message: "请输入banner描述", trigger: "blur" }],
        seleCity: [{ required: true, message: "请选择地区", trigger: "blur" }],
        alt: [{ required: true, message: "请添加alt", trigger: "blur" }],
        type: [{ required: true, message: "请添选择banner类型", trigger: "blur" }],
        title: [{ required: true, message: "请添选择banner类型", trigger: "blur" }],
      },
      //编辑时的id
      id: 0,
    };
  },
  computed: {
    options() {
      return this.$store.state.cityList;
    },
  },
  watch: {
    uploadProgress(i) {
      console.log("监听");
      console.log(i);
    },
  },
  beforeCreate() {},
  created() {},
  mounted() {
    //获取城市地址

    console.log(this.options);
    this.listBanner();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 列表格式化 */
    formatDate(row, column) {
      return row.addTime.split(" ")[0];
    },
    formatType(row, column) {
      if (row.type == 1) return "大banner";
      if (row.type == 2) return "小banner";
    },
    formatCity(row, column) {
      let _resp = this.options.find((val) => {
        return val.value == row.areaId;
      });
      return _resp.label;
    },
    /* 页面操作 */
    selectCity() {
      this.number = 0;
      this.listBanner();
    },
    add() {
      this.deleteForm();
      this.editFormVisible = true;
      this.title = "新建banner";
      this.addOrEdit = 1;
    },
    editorThis(data) {
      this.id = data.id;
      this.title = "编辑banner";
      this.editFormVisible = true;
      this.addOrEdit = 2;
      this.editForm.link = data.jumpValue;
      this.editForm.name = data.name;
      this.editForm.seleCity = data.cityId;
      this.editForm.imageUrl = data.imgUrl;
      this.editForm.descrip = data.description;
      this.editForm.alt = data.alt;
      this.editForm.type = data.type.toString();
      this.editForm.title = data.title;
    },
    deleteThis(data) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delBanner(data.id);
        })
        .catch(() => {
          return false;
        });
    },
    closeDialog() {
      this.editFormVisible = false;
      this.deleteForm();
    },
    /*分页*/
    selectPages(val) {
      this.number = parseInt(val - 1);
      this.listBanner();
    },
    /*表单操作*/
    //清除表单
    deleteForm() {
      this.editForm.imageUrl = "";
      this.editForm.name = "";
      this.editForm.link = "";
      this.editForm.title = "";
      this.editForm.descrip = "";
      this.editForm.seleCity = "";
      this.editForm.alt = "";
      this.editForm.type = "";
    },
    //提交表单(新建)
    submitForm() {
      this.$refs.editForm.validate((val) => {
        let _data = {};
        _data.jumpValue = this.editForm.link;
        _data.name = this.editForm.name;
        _data.cityId = this.editForm.seleCity;
        _data.imgUrl = this.editForm.imageUrl;
        _data.description = this.editForm.descrip;
        _data.alt = this.editForm.alt;
        _data.type = this.editForm.type;
        _data.title = this.editForm.title;
        _data.jumpType = 1;
        if (val) {
          if (this.addOrEdit == 1) {
            console.log("新建");
            this.addBanner(_data);
          }
          if (this.addOrEdit == 2) {
            _data.id = this.id;
            console.log("编辑");
            this.editorBanner(_data);
          }
        } else {
          this.showMessage("error", "添加内容不能为空");
        }
      });
    },
    //获取图片
    getPicture(dat) {
      this.editForm.imageUrl = `http://applet-second.oss-cn-qingdao.aliyuncs.com/` + dat;
    },
    callBackTime(a) {
      console.log(a);
    },
    /* 接口 */
    //获取列表
    async listBanner() {
      this.listLoading = true;
      let _resp = await this.Axios.get(`kuaiban-api/banner/list?pageSize=7&pageNum=${this.number}&cityId=${this.selectCy}`);

      this.listLoading = false;
      this.tableData = _resp.data.result;
      this.totle = _resp.data.total;
    },
    //新建banner
    async addBanner(data) {
      let _resp = await this.Axios.post(`kuaiban-api/banner/add`, data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.listBanner();
        this.closeDialog();
      } else {
        this.showMessage("error", _resp.data.message);
        this.closeDialog();
      }
    },
    //删除banner
    async delBanner(val) {
      let _resp = await this.Axios.get(`kuaiban-api/banner/delete?id=${val}`);
      console.log(_resp.data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.listBanner();
      } else {
        this.showMessage("error", _resp.data.message);
      }
    },
    //编辑banner
    async editorBanner(data) {
      let _resp = await this.Axios.post(`kuaiban-api/banner/update`, data);
      console.log(_resp.data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.listBanner();
        this.closeDialog();
      } else {
        this.showMessage("error", _resp.data.message);
        this.closeDialog();
      }
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
.pages {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.select_citys {
  height: 32px;
}
.select_citys /deep/ .el-input__inner {
  height: 32px;
}

.banner_input /deep/ .el-dialog__body {
  overflow-y: auto;
  height: 65vh;
}

.official_banner /deep/ .el-form-item__content {
  flex: 1;
}
.official_banner /deep/ .el-select {
  width: 100%;
}
.official_banner_search {
  display: flex;
  align-items: center;
}
.official_banner_search > span {
  flex: none;
}
</style>
