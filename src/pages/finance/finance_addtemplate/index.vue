<!--
 * @Author:创建模板
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-16 20:04:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="finance_add">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>财务系统</el-breadcrumb-item>
      <el-breadcrumb-item> <router-link :to="{ path: '/finance/template' }">模板列表</router-link> </el-breadcrumb-item>
      <el-breadcrumb-item> <router-link :to="{ path: '/finance/addtemplate' }">模板编辑</router-link> </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="finance_add_content">
      <!-- <div class="finance_add_content_title">模板配置-新建合同模板</div> -->
      <div class="finance_add_content_body">
        <div class="titel">
          <el-form :inline="true" :model="formInline" class="formList" ref="editForm" :rules="editForm">
            <el-form-item label="合同模板名称：" class="form_input" prop="templateName">
              <el-input size="mini" v-model="formInline.templateName" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="合同模板类型：" class="form_input" prop="templateType">
              <el-radio-group v-model="formInline.templateType" @change="selectType">
                <el-radio label="1">服务合同</el-radio>
                <el-radio label="2">人才合同</el-radio>
                <el-radio label="3">附加合同</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="合同模板备注：" class="form_input">
              <el-input size="mini" v-model="formInline.remark" placeholder="备注"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="content">
          <div class="edit">
            <p class="title">字段模块列表</p>
            <div class="content_editor">
              <editor ref="editor" :datas="detail" @change="change"></editor>
            </div>
          </div>
          <div class="list">
            <p class="title">字段模块列表</p>
            <p class="small_title">固定字段</p>
            <div class="content_list_btn">
              <p class="content_list_btn_list" v-for="(item, index) in btnList" :key="index" @click="add(item.fieldCode)">
                <template>
                  <span>{{ item.fieldName }}</span>
                  <span class="btns">
                    <!-- <b class="el-icon-edit" @click="editThis(index, item)"></b>
                  <b class="el-icon-delete" @click="deleteThis(index)"></b> -->
                  </span>
                </template>
              </p>
            </div>
            <p class="small_title">添加字段</p>
            <div class="content_list_btn">
              <p class="content_list_btn_list" v-for="(item, index) in addBtnList" :key="index" @click="add(item.fieldCode)">
                <span>{{ item.fieldName }}</span>
                <span class="btns">
                  <b class="el-icon-edit" @click.stop="editThis(index, item)"></b>
                  <b class="el-icon-delete" @click.stop="deleteThis(index)"></b>
                </span>
              </p>
            </div>
            <div class="content_list_bot">
              <el-button size="mini" type="primary" plain @click="addCode">创建新字段</el-button>
            </div>
          </div>
        </div>
        <div class="bot">
          <!-- <el-button size="mini" type="primary" plain>返回</el-button> -->
          <el-button size="mini" type="success" plain @click="gotoShow">预览</el-button>
          <!-- <el-button size="mini" type="info" plain>仅保存</el-button> -->
          <el-button size="mini" v-if="type == 0" type="warning" plain @click="submit">保存并创建</el-button>
          <el-button size="mini" v-if="type == 1" type="warning" plain @click="submit">保存</el-button>
        </div>
      </div>
    </div>
    <el-dialog :title="titleType" :visible.sync="typeFormVisible" width="40%" :before-close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="90px" ref="editFormType" :model="editFormType" :rules="rulesType">
        <el-form-item label="分类名称" prop="name">
          <el-input size="small" v-model="editFormType.name" auto-complete="off" placeholder="请输入分类名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" @click="submitFormType">确定</el-button>
      </div>
    </el-dialog>
    <div id="showTemplate" v-if="showBack">
      <div class="showTemplate_content">
        <div class="showTemplate_content_title">
          <b>合同预览</b>
          <el-button type="primary" size="mini" @click="goback">返回</el-button>
        </div>
        <div class="showTemplate_content_show" v-html="tempEditData"></div>
      </div>
    </div>
    <!-- <input type="file" @change="upload($event)" /> -->
  </div>
</template>
<script>
import editor from "../../../components/editor/index.vue";
import myMixin from "../../../assets/js/minx/minx";
export default {
  name: "",
  mixins: [myMixin],
  components: { editor },
  props: [],
  data() {
    return {
      showBack: false,
      //ID
      id: "",
      // 类型
      type: "", // 0 新建 1 编辑
      detail: "",
      formInline: {
        templateName: "",
        templateType: "",
        remark: "",
        content: "",
        templateFields: [],
      },
      editData: "",
      btnList: [
        { fieldName: "甲方名称", fieldCode: "%甲方名称%", fieldType: 1 },
        { fieldName: "乙方名称", fieldCode: "%乙方名称%", fieldType: 1 },
        { fieldName: "邮寄地址", fieldCode: "%邮寄地址%", fieldType: 1 },
        { fieldName: "邮编", fieldCode: "%邮编%", fieldType: 1 },
        { fieldName: "电话", fieldCode: "%电话%", fieldType: 1 },
        { fieldName: "企业负责人", fieldCode: "%企业负责人%", fieldType: 1 },
        { fieldName: "划款信息", fieldCode: "%划款信息%", fieldType: 1 },
        { fieldName: "服务列表", fieldCode: "%服务列表%", fieldType: 1 },
        { fieldName: "自有列表", fieldCode: "%自有列表%", fieldType: 1 },
        { fieldName: "外聘列表", fieldCode: "%外聘列表%", fieldType: 1 },
        { fieldName: "支付", fieldCode: "%支付%", fieldType: 1 },
      ],
      addBtnList: [],
      tempEditData: "",
      //弹框
      isAddOrEdit: 1, //添加 & 编辑 ,1 & 2
      index: 0,
      typeFormVisible: false,
      titleType: "创建字段",
      editFormType: { name: "" },
      rulesType: {
        name: [{ required: true, message: "请输入字段名称", trigger: "blur" }],
      },
      editForm: {
        templateName: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        templateType: [{ required: true, message: "请输入模板类型", trigger: "blur" }],
        remark: [{ required: true, message: "请输入模板描述", trigger: "blur" }],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.init();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    //页面初始化
    init() {
      let _data = this.getDataStorge("templateData");
      this.id = _data.val;
      this.type = _data.type;
      if (this.type != 0) {
        this.getTemplte(this.id);
      }
    },
    add(data) {
      this.$refs.editor.inputDom(data);
    },
    /* 弹框 */
    //添加字段
    addCode() {
      this.isAddOrEdit = 1;
      this.typeFormVisible = true;
    },
    editThis(index, data) {
      this.isAddOrEdit = 2;
      this.index = index;
      this.editFormType.name = data.code;
      console.log(data);
      this.typeFormVisible = true;
    },
    closeDialog() {
      this.typeFormVisible = false;
      this.editFormType.name = "";
      this.$refs.editFormType.resetFields();
    },
    submitFormType() {
      this.$refs.editFormType.validate((val) => {
        if (!val) {
          this.showMessage("error", "输入内容不能为空");
        } else {
          if (this.isAddOrEdit == 1) {
            this.addBtnList.push({
              fieldName: this.editFormType.name,
              fieldCode: `%${this.editFormType.name}%`,
              fieldType: 2,
            });
          } else {
            this.addBtnList[this.index].fieldCode = `%${this.editFormType.name}%`;
            this.addBtnList[this.index].fieldName = this.editFormType.name;
            this.addBtnList[this.index].fieldType = 2;
          }
        }
        this.typeFormVisible = false;
        this.addDataStorge("code", this.addBtnList);
      });
    },
    deleteThis(val) {
      this.addBtnList.splice(val, 1);
    },
    selectType(data) {
      console.log(data);
      let resArr = this.btnList.filter((item) => {
        return item.fieldName != "服务列表" && item.fieldName != "外聘列表";
      });
      this.btnList = resArr;
      if (data == 2) {
        this.btnList.push({
          fieldName: "外聘列表",
          fieldCode: "%外聘列表%",
          fieldType: 1,
        });
      } else if (data == 1) {
        this.btnList.push({
          fieldName: "服务列表",
          fieldCode: "%服务列表%",
          fieldType: 1,
        });
      } else {
        this.btnList.push(
          {
            fieldName: "外聘列表",
            fieldCode: "%外聘列表%",
            fieldType: 1,
          },
          {
            fieldName: "服务列表",
            fieldCode: "%服务列表%",
            fieldType: 1,
          }
        );
      }
    },
    /*  富文本 */
    change(data) {
      this.editData = data;
      this.formInline.content = data;
    },
    gotoShow() {
      this.showBack = true;
      this.tempEditData = this.$refs.editor.getData();
      // let _data = this.$refs.editor.getData();
    },
    goback() {
      this.showBack = false;
    },
    /*提交模板 */
    submit() {
      this.$refs.editForm.validate((val) => {
        if (!val) {
          this.showMessage("error", "输入内容不能为空");
        } else {
          let _dataFields = [...this.btnList, ...this.addBtnList];
          let _data = this.formInline;
          _data.templateFields = _dataFields;
          if (this.type == 1) {
            _data = {};
            _data.id = parseInt(this.id);
            _data.content = this.$refs.editor.getData();
            _data.templateName = this.formInline.templateName;
            _data.templateType = this.formInline.templateType;
            _data.templateFields = _dataFields;
            _data.remark = this.formInline.remark;
            this.updTemplte(_data);
          } else {
            this.addTemplte(_data);
          }
        }
      });
    },

    /* 接口 */
    //添加模板
    async addTemplte(data) {
      let _resp = await this.Axios.post("/order-api/templatelist/add", data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.$router.push({ path: "/finance/template" });
      }
    },
    //编辑模板
    async updTemplte(data) {
      let _resp = await this.Axios.post("/order-api/templatelist/add", data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "编辑成功");
        this.$router.push({ path: "/finance/template" });
      }
    },
    //获取模板
    async getTemplte(val) {
      let _resp = await this.Axios.get(`/order-api/templatelist/get?id=${val}`);
      console.log(_resp.data);
      this.formInline = _resp.data.result;
      this.formInline.templateType = this.formInline.templateType.toString();
      this.$refs.editor.inputDom(this.formInline.content);
      this.filterBtn(_resp.data.result.templateFieldS);
      this.getTypeCode(_resp.data.result.templateType);
    },
    //根据type类型显示固定字段
    getTypeCode(id) {
      let resArr = this.btnList.filter((item) => {
        return item.fieldName != "服务列表" && item.fieldName != "外聘列表";
      });
      this.btnList = resArr;
      if (id == 2) {
        this.btnList.push({
          fieldName: "外聘列表",
          fieldCode: "%外聘列表%",
          fieldType: 1,
        });
      } else if (id == 1) {
        this.btnList.push({
          fieldName: "服务列表",
          fieldCode: "%服务列表%",
          fieldType: 1,
        });
      } else {
        this.btnList.push(
          {
            fieldName: "外聘列表",
            fieldCode: "%外聘列表%",
            fieldType: 1,
          },
          {
            fieldName: "服务列表",
            fieldCode: "%服务列表%",
            fieldType: 1,
          }
        );
      }
    },
    //过滤自定义按钮
    filterBtn(data) {
      let _arrTemp = data.filter((i) => {
        return i.fieldType == 2;
      });
      this.addBtnList = _arrTemp;
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
#showTemplate {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
}
#showTemplate .showTemplate_content {
  width: 1200px;
  padding: 15px;
  height: 100%;
  margin: 0 auto;
  overflow-y: auto;
  border: 1px solid #cccccc;
}
#showTemplate .showTemplate_content b {
  font-size: 14px;
}
#showTemplate .showTemplate_content_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#showTemplate .showTemplate_content_show {
  height: calc(100% - 45px);
  margin-top: 15px;
}
#showTemplate .showTemplate_content_show {
  line-height: 1.5;
  padding: 10px;
  border: 1px solid #ddd;
}
.dialog_link /deep/ .el-form-item__content {
  width: 400px;
}
.official_link /deep/ .el-switch.is-disabled {
  opacity: 1;
}
.official_link /deep/ .el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}
.pages {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
