<!--
 * @Author:  部门管理
 * @Date: 2020-08-14 14:53:16
 * @LastEditTime: 2020-12-05 15:41:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\user\uesr_org\index.vue
-->

<template>
  <div class="uesr_dep">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item>部门管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <article class="uesr_dep_list">
      <div class="dep_button">
        <el-button v-has="'/user/dep-btn-add'" type="primary" size="small" @click="add">添加部门管理员</el-button>
      </div>
      <div class="table_list">
        <el-table class="table_list_list" :data="tableData" stripe style="width: 100%">
          <el-table-column prop="realname" align="center" label="姓名" min-width="80"></el-table-column>
          <el-table-column prop="depName" align="center" label="管理部门" min-width="280">
            <template slot-scope="scope">
              <span>{{ scope.row.depTree | selectName }}</span>
              <span>{{ scope.row.depName }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="status" align="center" label="启用状态" min-width="80">
            <template slot-scope="scope">
              <b v-if="scope.row.adStatus == 0">正常</b>
              <b v-else>禁用</b>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="80" fixed="right">
            <template slot-scope="scope">
              <el-button v-has="'/user/dep-btn-edit'" @click="handleClick(scope.row)" type="text" size="small">编辑 </el-button>
              <el-button v-has="'/user/dep-btn-open'" v-if="scope.row.adStatus == 1" @click="startOrStop(scope.row)" type="text" size="small">启用</el-button>
              <el-button v-has="'/user/dep-btn-open'" v-else @click="startOrStop(scope.row)" type="text" size="small">停用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pages">
        <p></p>
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="totle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
      </div>
    </article>

    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="姓名" prop="userName">
          <el-select size="small" v-model="editForm.userName" filterable placeholder="请选择" @change="selectUsr">
            <el-option v-for="(item, index) in userList" :key="index" :label="item.realname" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="depList">
          <el-cascader :disabled="isCascader" ref="cascader" :props="listProps" v-model="editForm.depList" :options="depListOptions" :show-all-levels="false" @change="tableListChange"></el-cascader>
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
export default {
  name: "",
  components: {},
  props: [],
  mixins: [myMixin],
  data() {
    return {
      page: 0,
      pageSize: 11,
      totle: 0,
      /* 列表字段 */
      listProps: {
        value: "depId",
        label: "name",
        children: "children",
        checkStrictly: true,
        expandTrigger: "click",
      },
      //编辑数据
      tempData: {},
      //添加 &编辑
      isAddOrEdit: 1,
      //已绑定部门id
      alreadDepIdList: [],
      //部门列表
      depListOptions: [],
      tableData: [],
      userList: [],
      //弹框内容
      isCascader: true, //未点击人员部门无法选中
      loading: false, //是显示加载
      title: "添加部门管理员",
      editFormVisible: false, //控制编辑页面显示与隐藏
      editForm: {
        userName: "",
        depList: "",
      },
      // rules表单验证
      rules: {
        userName: [{ required: true, message: "请选择用户", trigger: "change" }],
        depList: [{ required: true, message: "请选择部门", trigger: "change" }],
      },
    };
  },
  computed: {},
  filters: {
    selectName: function(data) {
      if (data.length < 1) {
        return "";
      }
      let _data = JSON.parse(JSON.stringify(data)); //深拷贝
      let _arrList = [];
      function change(data) {
        Object.keys(data).forEach((val) => {
          if (val == "children") {
            _arrList.push(data.name);
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
      return _arrList.reverse().join(" - ") + " - ";
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.getDepList();
    this.getAllUser();
    this.getAlldep();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    add() {
      this.isAddOrEdit = 1;
      this.isCascader = true;
      this.title = "添加部门管理员";
      this.editFormVisible = true;
    },
    //编辑
    handleClick(data) {
      console.log(data);
      this.tempData = data;
      this.isAddOrEdit = 2;
      this.title = "编辑部门管理员";
      this.editFormVisible = true;
      this.isCascader = false;
      this.tempListData = JSON.parse(JSON.stringify(data));
      let _idList = this.dataAssembly3(this.tempListData.depTree);
      _idList.push(this.tempListData.depId);
      this.editForm.userName = data.userId;
      this.editForm.depList = _idList;
      this.getUserDep(data.userId);
    },
    //停用&启用
    startOrStop(data) {
      console.log(data);
      let _data = {
        id: data.id,
        adStatus: data.adStatus == 0 ? 1 : 0,
      };
      this.$confirm("是否修改状态？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.typeList(_data);
        })
        .catch(() => {});
    },
    //选择用户
    selectUsr(value) {
      let obj = this.userList.find(function(item) {
        return item.userId === value;
      });
      this.getUserDep(obj.userId);

      this.isCascader = false;
      this.editForm.depList = [];
      if (this.$refs.cascader) {
        this.$refs.cascader.$refs.panel.activePath = [];
      }
      // this.editForm.depList = this.dataAssembly4(this.depListOptions, obj.depId);
    },
    //选择部门
    tableListChange(data) {
      console.log(data);
    },
    //提交表单
    submitForm() {
      this.$refs.editForm.validate((val) => {
        if (val) {
          if (this.isAddOrEdit == 1) {
            console.log("add");
            let data = {
              depId: this.editForm.depList.slice(-1)[0],
              userId: this.editForm.userName,
            };
            console.log(data);
            this.addDepList(data);
          } else {
            console.log("edit");
            let data = {
              id: this.tempData.id,
              depId: this.editForm.depList.slice(-1)[0],
              userId: this.editForm.userName,
            };
            console.log(data);
            this.updDepList(data);
          }
        } else {
          this.showMessage("error", "内容不能为空");
        }
      });
    },
    closeDialog() {
      this.editFormVisible = false;
      if (this.$refs.editForm) this.$refs.editForm.resetFields();
      this.editForm.userName = "";
      this.editForm.depList = [];
      if (this.$refs.cascader) {
        this.$refs.cascader.$refs.panel.activePath = [];
      }
    },
    selectPages(val) {
      this.page = parseInt(val - 1);
      this.getDepList();
    },
    /* 接口*/
    //获取所有用户
    async getAllUser() {
      let resp = await this.Axios.get(`ucenter-api/userlist/queryAll`);
      console.log(resp.data.result);
      this.userList = resp.data.result;
    },
    //获取用户绑定部门
    async getUserDep(uesrId) {
      let depUsrList = await this.Axios.get(`ucenter-api/admindep/query?userId=${uesrId}`);
      console.log(depUsrList.data);
      this.alreadDepIdList = depUsrList.data.result.map((x) => {
        return x.depId;
      });
      let _arr = this.dataAssembly5(this.depListOptions[0], this.alreadDepIdList);
      this.depListOptions = [_arr];
    },
    //获取所有部门
    async getAlldep() {
      let _resp = await this.Axios.get(`ucenter-api/departmentlist/tree`);
      this.depListOptions = [this.dataAssembly2(_resp.data.result[0])];
      console.log(this.depListOptions);
    },
    async getDepList() {
      let resp = await this.Axios.get(`ucenter-api/admindep/query?pageNum=${this.page}&pageSize=${this.pageSize}`);
      this.totle = resp.data.total;
      this.tableData = resp.data.result;
      console.log(this.tableData);
    },
    async addDepList(data) {
      let typeList = await this.Axios.get(`ucenter-api/admindep/setManager`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.getDepList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
    async updDepList(data) {
      let typeList = await this.Axios.get(`ucenter-api/admindep/updateManager`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "修改成功");
        this.getDepList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
      this.editFormVisible = false;
    },
    delDepList() {},
    //启用 & 停用
    async typeList(data) {
      let typeList = await this.Axios.get(`ucenter-api/admindep/updateAdStatus`, data);
      if (typeList.data.code == 0) {
        this.showMessage("success", "修改成功");
        this.getDepList();
      } else {
        this.showMessage("error", typeList.data.message);
      }
    },
    /*== 数据处理 ==*/
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
    //通过子节点获父级级联列表
    dataAssembly4(data, id) {
      let _data = JSON.parse(JSON.stringify(data)); //深拷贝
      function _dataAss(data2, ids, arrs) {
        data2.forEach((ele) => {
          if (ele.depId == ids) {
            arrs.unshift(ele.depId);
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
    //部门列表添加禁止选项
    dataAssembly5(data, ids = []) {
      let _data2 = JSON.parse(JSON.stringify(data)); //深拷贝
      function change2(data2) {
        Object.keys(data2).forEach((val) => {
          delete data2["disabled"];
          if (ids.includes(data2.depId)) {
            data2["disabled"] = true;
          }
          if (val == "children") {
            if (data2[val].length == 0) {
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
  },
};
</script>
<style scoped>
@import url("./index.css");
</style>
