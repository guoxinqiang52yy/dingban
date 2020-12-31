<!--
 * @Author:  组织架构++
 * @Date: 2020-08-14 14:53:16
 * @LastEditTime: 2020-12-05 15:38:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\user\uesr_org\index.vue
-->
<template>
  <div class="uesr_org">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item>组织架构</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="uesr_org_content">
      <article class="uesr_org_content_left">
        <tree :tdkshow="tdkshow" :addshow="addshow" :editshow="editshow" :delshow="delshow" :list="list" @nodeAdd="nodeAdd" @nodeClick="nodeClick" @startEditor="startEditor" @startTdk="startTdk" @deleteEditor="deleteEditor"></tree>
      </article>
      <article class="uesr_org_content_right">
        <p class="title">
          <span>{{ pageTitle }}</span>
          <span class="number"> 总人数：{{ totleList }}</span>
          <!-- <span v-for="(item, index) in pageTitle" :key="index">{{item}}</span> -->
        </p>
        <div class="org_button">
          <div class="left">
            <el-input class="select_input" placeholder="搜索姓名" v-model="searchUInput">
              <el-button @click="searchTitle" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <div class="right">
            <el-select v-model="valueType" placeholder="筛选状态" @change="selectValueType" class="right-selects">
              <el-option label="在职" :value="0"> </el-option>
              <el-option label="离职" :value="1"> </el-option>
            </el-select>
            <el-button v-has="'/user/org-btn-addExcel'" size="small">导入花名册</el-button>
            <el-button v-has="'/user/org-btn-addNum'" type="primary" size="small" @click="add">添加成员</el-button>
          </div>
        </div>

        <div class="org_table">
          <el-table :data="tableList" stripe style="width: 100%">
            <!-- <el-table-column prop="id" align="center" label="序号" min-width="50"></el-table-column> -->
            <el-table-column prop="realName" align="center" label="姓名" min-width="90"></el-table-column>
            <el-table-column prop="telephone" align="center" label="电话" min-width="100"></el-table-column>
            <el-table-column prop="number" align="center" label="工号" min-width="100">
              <template slot-scope="scope">
                <span>QST{{ scope.row.number | PrefixInteger }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="email" align="center" label="企业邮箱" min-width="120"></el-table-column>
            <el-table-column prop="depName" align="center" label="部门" min-width="120"></el-table-column>
            <el-table-column prop="role" align="center" label="角色" min-width="140">
              <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.role" :key="index">{{ item.roleName }} </span>
              </template>
            </el-table-column>
            <el-table-column prop="status" align="center" label="职位状态" min-width="80">
              <template slot-scope="scope">
                <b v-if="scope.row.status == 0">在职</b>
                <b v-else>离职</b>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" min-width="80" fixed="right">
              <template slot-scope="scope">
                <el-button v-has="'/user/org-btn-editNum'" @click="editList(scope.row)" type="text" size="small">编辑</el-button>
                <!-- <el-button @click="deleteList(scope.row)" type="text" size="small">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="pages">
          <p></p>
          <el-pagination background layout="prev, pager, next" :page-size="pageListSize" :total="totleList" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
        </div>
      </article>
    </div>

    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @close="closeDialog()">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="姓名" prop="userName">
          <el-input size="small" v-model="editForm.userName" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="userMobile">
          <el-input size="small" v-model="editForm.userMobile" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="userNumber" class="input_number"> <span> QST </span><el-input size="small" v-model="editForm.userNumber" auto-complete="off" placeholder="请输入工号"></el-input> </el-form-item>
        <el-form-item label="企业邮箱" prop="userMail">
          <el-input size="small" v-model="editForm.userMail" auto-complete="off" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="depList">
          <el-cascader ref="cascader" v-model="editForm.depList" :props="listProps" :options="depListOptions" :show-all-levels="false" @change="tableListChange"></el-cascader>
        </el-form-item>
        <el-form-item label="在职状态" prop="status">
          <el-select size="small" v-model="editForm.status" placeholder="请选择">
            <el-option label="在职" value="0"></el-option>
            <el-option label="离职" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色" prop="roles">
          <el-select v-model="editForm.roles" multiple placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.value" :label="item.roleName" :value="item.roleId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所在地区" prop="city">
          <el-select size="small" v-model="editForm.city" placeholder="请选择">
            <el-option v-for="(item, index) in cityList" :key="index" :label="item.cityName" :value="item.addressId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">提交</el-button>
      </div>
    </el-dialog>

    <!-- 树状图 添加&编辑 -->
    <el-dialog :title="titleTree" :visible.sync="treeFormVisible" width="50%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="treeForm" :model="treeForm" :rules="rulesTree">
        <el-form-item label="单位名称" prop="compName">
          <el-input size="small" v-model="treeForm.compName" auto-complete="off" placeholder="请输入单位名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitFormTree">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tree from "../../../components/tree/tree";
import myMixin from "../../../assets/js/minx/minx";
import axios from "axios";
export default {
  name: "user_org",
  components: { tree },
  mixins: [myMixin],
  props: [],
  data() {
    return {
      //筛选
      valueType: 0,
      searchUInput: "",
      /* 树状图按钮显示隐藏 */
      tdkshow: true,
      addshow: true,
      editshow: false,
      delshow: true,
      /* 页面 */
      pageTitle: "",
      /* 列表 */
      listProps: {
        value: "depId",
        label: "name",
        children: "children",
        checkStrictly: true,
        expandTrigger: "click",
      },
      tempListData: {},
      pageList: 0, //当前页
      pageListSize: 10, //单页数量
      totleList: 0, //总数量
      isListAddOrEdit: 1,
      tableList: [],
      depList: [],
      depListOptions: [], //级联部门列表
      depId: "",
      //城市列表
      cityList: [],
      //角色列表
      roleList: [],
      //已选角色
      roles: [],
      //弹框内容
      loading: false, //是显示加载
      title: "编辑成员信息",
      editFormVisible: false, //控制编辑页面显示与隐藏
      // 编辑与添加
      editForm: {
        userName: "",
        userMobile: "",
        userNumber: "",
        userMail: "",
        department: "", //部门
        status: "", //在职状态
        roles: "", //角色
        city: "",
      },
      // rules表单验证
      rules: {
        userName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        userNumber: [
          { required: true, message: "请输入工号", trigger: "blur" },
          {
            pattern: /^[0-9]*$/,
            message: "只能输入数字",
          },
        ],
        userMail: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: "请输入正确的邮箱",
          },
        ],
        depList: [{ required: true, message: "请选择部门.", trigger: "blur" }],
        city: [{ required: true, message: "请选择城市", trigger: "blur" }],
        status: [{ required: true, message: "请选择在职状态", trigger: "blur" }],
        roles: [{ required: true, message: "请选择角色", trigger: "blur" }],
        userMobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
            // required: true,
            message: "请输入正确的手机号",
            // trigger: "blur",
          },
        ],
      },

      /*树状图*/
      list: [],
      tempData: {},
      isAddOrEditorTree: 1,
      titleTree: "添加组织名称",
      treeFormVisible: false,
      treeForm: {
        compName: "",
      },
      rulesTree: {
        compName: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
      },
    };
  },
  filters: {
    PrefixInteger(num) {
      return ("000000000" + num).substr(-5);
    },
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getCitys();
    this.getOrgList();
    // this.getPerList();
    this.getRoleList();
    this.getPower();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    PrefixInteger(num) {
      return ("000000000" + num).substr(-5);
    },
    selectValueType() {
      this.getPerList();
    },
    searchTitle() {
      if (this.searchUInput == "") {
        this.searchUInput = null;
      }
      this.getPerList();
    },
    getPower() {
      this.tdkshow = this.verification(this.$store.state.selectBtnJurisdiction, "/user/org-btn-edit");
      this.addshow = this.verification(this.$store.state.selectBtnJurisdiction, "/user/org-btn-add");
      this.editshow = false;
      this.delshow = this.verification(this.$store.state.selectBtnJurisdiction, "/user/org-btn-delete");
    },
    /* ==列表操作== */
    add() {
      this.getTableList();
      this.isListAddOrEdit = 1;
      this.title = "添加成员信息";
      this.editFormVisible = true;
    },
    editList(data) {
      console.log(data);
      this.getTableList();
      this.isListAddOrEdit = 2;
      this.title = "编辑成员信息";
      this.editFormVisible = true;
      this.tempListData = JSON.parse(JSON.stringify(data));
      //console.log(this.tempListData);
      let _idList = this.dataAssembly3(this.tempListData.depTree);
      _idList.push(this.tempListData.depId);
      this.editForm.userName = data.realName;
      this.editForm.userMobile = data.telephone;
      this.editForm.userNumber = this.PrefixInteger(data.number);
      this.editForm.userMail = data.email;
      this.editForm.depList = _idList;
      this.editForm.status = data.status.toString();
      this.editForm.roles = this.dataAssemblyArray(data.role, "roleId");
      this.editForm.city = parseInt(data.areaId);
    },
    //关闭对话框
    closeDialog() {
      this.editFormVisible = false;
      this.treeFormVisible = false;
      if (this.$refs.treeForm) this.$refs.treeForm.resetFields();
      if (this.$refs.editForm) this.$refs.editForm.resetFields();
      this.treeForm.compName = "";
      this.editForm.userName = "";
      this.editForm.userMobile = "";
      this.editForm.userNumber = "";
      this.editForm.userMail = "";
      this.editForm.depList = [];
      this.editForm.status = "";
      this.editForm.roles = "";
      //console.log(this.editForm);
      if (this.$refs.cascader) {
        this.$refs.cascader.$refs.panel.activePath = [];
      }
    },
    //提交表单
    submitForm() {
      this.$refs.editForm.validate((val) => {
        //console.log(this.editForm);
        if (val) {
          if (this.isListAddOrEdit == 1) {
            //console.log("add");
            let data = {
              realname: this.editForm.userName,
              number: this.editForm.userNumber,
              telephone: this.editForm.userMobile,
              email: this.editForm.userMail,
              status: this.editForm.status,
              areaId: this.editForm.city,
              roleIds: this.editForm.roles.join(","),
              depId: this.editForm.depList.slice(-1)[0], //待定
            };
            this.addPerList(data);
          } else {
            //console.log("edit");
            let data = {
              userId: this.tempListData.userId,
              id: this.tempListData.id,
              type: 2,
              realname: this.editForm.userName,
              number: this.editForm.userNumber,
              telephone: this.editForm.userMobile,
              email: this.editForm.userMail,
              status: this.editForm.status,
              areaId: this.editForm.city,
              roleIds: this.editForm.roles.join(","),
              depId: this.editForm.depList.slice(-1)[0], //待定
            };

            this.updPerList(data);
          }
        } else {
          this.showMessage("error", "输入内容不能为空");
        }
      });
    },
    //删除
    deleteList(data) {},
    //分页
    selectPages(val) {
      this.pageList = parseInt(val - 1);
      this.getPerList();
    },
    //级联部门列表
    tableListChange(data) {
      this.editForm.depList = [];
      this.editForm.depList = data;
      console.log(this.editForm.depList);
    },

    /*==树状图操作==*/
    //提交
    submitFormTree() {
      this.$refs.treeForm.validate((val) => {
        if (val) {
          if (this.isAddOrEditorTree == 1) {
            let _data = {
              parentId: this.tempData.depId,
              name: this.treeForm.compName,
            };
            this.addOrgList(_data);
          } else {
            let _data = {
              id: this.tempData.id,
              parentId: this.tempData.parentId,
              name: this.treeForm.compName,
            };
            this.updOrgList(_data);
          }
        } else {
          this.showMessage("error", "输入内容不能为空");
        }
      });
    },
    //点击节点
    nodeClick(s, d, n) {
      this.depId = d.depId;
      this.pageList = 0;
      this.getPerList();
      console.log(this.list);
      console.log(d.depId);
      this.pageTitle = this.dataAssembly5(this.list, d.depId).join("--");
    },
    //添加节点
    nodeAdd(s, d, n) {
      console.log(d);
      console.log(n.level);
      this.tempData = d;
      if (n.level <= 3) {
        this.isAddOrEditorTree = 1;
        this.treeFormVisible = true;
        this.titleTree = "添加子单位";
      }
    },
    //删除节点
    deleteEditor(s, d, n) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delOrgList(d.id);
        })
        .catch(() => {
          return;
        });
    },
    //编辑节点
    startEditor() {},
    startTdk(s, d, n) {
      //console.log("编辑");
      //console.log(d);
      this.tempData = d;
      this.isAddOrEditorTree = 2;
      this.treeFormVisible = true;
      this.titleTree = "编辑子单位";
      this.treeForm.compName = d.name;
    },
    /* 接口 */
    // ===获取地区列表
    async getCitys() {
      let resp = await this.Axios.get(`common-api/citysite/list`);

      this.cityList = resp.data.result;
    },
    // ===获取角色列表
    async getRoleList() {
      let resp = await this.Axios.get(`ucenter-api/rolelist/query?pageNum=0&pageSize=1000`);

      this.roleList = resp.data.result;
    },
    // =====组织列表
    //表单获取组织列表
    async getTableList() {
      let _resp = await this.Axios.get(`ucenter-api/departmentlist/tree`);

      this.depListOptions = [this.dataAssembly2(_resp.data.result[0])];
    },
    //获取组织列表
    async getOrgList() {
      let _resp = await this.Axios.get(`ucenter-api/departmentlist/tree`);
      this.depId = _resp.data.result[0].depId;
      this.pageTitle = _resp.data.result[0].name;
      //console.log(this.depId);
      // this.depListOptions = _resp.data.result;
      this.list = [this.dataAssembly(_resp.data.result[0])];
      // this.depListOptions = [this.dataAssembly2(_resp.data.result[0])];
      this.getPerList();
    },
    //添加组织
    async addOrgList(data) {
      let _resp = await this.Axios.post(`ucenter-api/departmentlist/add`, data);

      if (_resp.data.code == 0) {
        this.showMessage("success", "创建成功");
        this.getOrgList();
      } else {
        this.showMessage("error", _resp.data.message);
      }
      this.closeDialog();
    },
    //修改组织
    async updOrgList(data) {
      let _resp = await this.Axios.post(`ucenter-api/departmentlist/update`, data);

      if (_resp.data.code == 0) {
        this.showMessage("success", "修改成功");
        this.getOrgList();
      } else {
        this.showMessage("error", _resp.data.message);
      }
      this.closeDialog();
    },
    //删除组织
    async delOrgList(id) {
      let _resp = await this.Axios.get(`ucenter-api/departmentlist/delete?id=${id}`);

      if (_resp.data.code == 0) {
        this.showMessage("success", "删除成功");
        this.getOrgList();
      } else {
        this.showMessage("error", _resp.data.message);
      }
      this.closeDialog();
    },
    // ===人物列表
    async getPerList() {
      // let _data = {
      //   depId: this.depId,
      //   pageNum: this.pageList,
      //   pageSize: this.pageListSize,
      //   status: this.valueType,
      //   realname: this.searchUInput,
      // };
      // if (!this.searchUInput) {
      //   delete _data.realname;
      // }
      // console.log(_data);
      let resp = await this.Axios.get(`ucenter-api/userlist/getUserList?depId=${this.depId}&pageNum=${this.pageList}&pageSize=${this.pageListSize}&status=${this.valueType}&realname=${this.searchUInput}`);
      // let resp = await this.Axios.get(`ucenter-api/userlist/getUserList?depId=${this.depId}&pageNum=${this.pageList}&pageSize=${this.pageListSize}&status=${parseInt(this.valueType)}`);

      this.tableList = resp.data.result;
      this.totleList = resp.data.total;
    },
    async addPerList(data) {
      let resp = await this.Axios.post(`ucenter-api/userlist/add`, data);
      if (resp.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.getPerList();
      } else {
        this.showMessage("error", resp.data.message);
      }
      this.closeDialog();
    },
    async updPerList(data) {
      let resp = await this.Axios.post(`ucenter-api/userlist/updateUser`, data);
      if (resp.data.code == 0) {
        this.showMessage("success", "修改成功");
        this.getPerList();
      } else {
        this.showMessage("error", resp.data.message);
      }
      this.closeDialog();
    },
    async delPerList() {
      let resp = await this.Axios.get(`ucenter-api/userlist/add`);
      if (resp.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.getPerList();
      } else {
        this.showMessage("error", resp.data.message);
      }
      this.closeDialog();
    },

    // ==== 数据处理
    dataAssembly(data) {
      let _data = JSON.parse(JSON.stringify(data)); //深拷贝
      function change(data) {
        Object.keys(data).forEach((val) => {
          Object.assign(data, { isFirst: false, isEdit: false });
          if (val == "children") {
            data[val].forEach((val2) => {
              change(val2);
            });
          }
        });
      }
      change(_data);
      return _data;
    },
    dataAssembly2(data) {
      let _data2 = JSON.parse(JSON.stringify(data)); //深拷贝
      function change2(data2) {
        Object.keys(data2).forEach((val) => {
          if (val == "children") {
            if (data2[val].length == 0) {
              delete data2[val];
              return false;
            }
            data2[val].forEach((val2) => {
              change2(val2);
            });
          }
        });
      }
      change2(_data2);
      return _data2;
    },
    //提取组织结构级联id 组成新数组
    dataAssembly3(data) {
      if (data.length == 0) {
        return [];
      }
      let _data = JSON.parse(JSON.stringify(data)); //深拷贝
      let _arrList = [];
      function change(data) {
        Object.keys(data).forEach((val) => {
          if (val == "children") {
            _arrList.push(data.depId);
            if (data[val].length == 0) {
              return false;
            }
            data[val].forEach((val2) => {
              change(val2);
            });
          }
        });
      }
      change(_data[0]);
      return _arrList.reverse();
    },
    //提取id 组成新数组
    dataAssemblyArray(data, name) {
      let _array = [];
      data.forEach((data) => {
        _array.push(data[name]);
      });
      return _array;
    },
    //通过子节点获父级级联列表 名称
    dataAssembly5(data, id) {
      let _data = JSON.parse(JSON.stringify(data)); //深拷贝
      function _dataAss(data2, ids, arrs) {
        data2.forEach((ele) => {
          if (ele.depId == ids) {
            arrs.unshift(ele.name);
            _dataAss(data, ele.parentId, arrs);
            return false;
          } else {
            if (!!ele.children) {
              _dataAss(ele.children, ids, arrs);
            }
          }
        });
        return arrs;
      }
      let res = _dataAss(_data, id, []);
      return res;
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
.org_table {
  flex: 1;
  height: auto;
  overflow-x: auto;
}
.el-form--inline .el-form-item {
  display: flex !important;
  width: 100%;
}
.el-form-item__content {
  flex: 1;
}
.el-select {
  width: 100%;
}
</style>
