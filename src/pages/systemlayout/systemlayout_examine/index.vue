<template>
  <div class="systemlayoutbox">
    <div class="navbar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>审批配置</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="top_line"></div>
    </div>
    <div class="nodepage">
      <div class="nodepageleftbox">
        <tree
          title="添加审批流程"
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
          :props="defaultProps"
        ></tree>
        <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
      </div>
      <div class="examineright">
        <!-- <div class="servicename">审批配置</div> -->
        <div class="addreplay" style="width: 1200px">
          <div class="addreplaybtn" @click="addexamine">添加审批人</div>
        </div>
        <el-table :data="tableData" style="width: 100%" class="operategroup examinetable">
          <el-table-column label="审批顺序" width="280">
            <template slot-scope="scope">
              <div >{{ scope.row.id }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="审批人" width="500">
          </el-table-column>
          <el-table-column width="420" prop="address" label="操作">
            <template slot-scope="scope">
              <div class="operatebtn">
                <div
                  class="editbtn"
                  @click="examineedit(scope.$index, scope.row)"
                >
                  编辑
                </div>
                <div
                  class="delbtn"
                  @click="examinedelete(scope.$index, scope.row)"
                >
                  删除
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        
      </div>
    </div>
    <!-- 添加审批流程 -->
    <el-dialog
      :title="titletext"
      width="450px"
      :visible.sync="addnodeVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
      >
        <el-form-item label="审批流程名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <div class="actfooter">
          <el-button
            type="primary"
            @click="sureaddexamine('ruleForm')"
            size="small"
            v-if="isedit == 1"
            >确定</el-button
          >
          <el-button
            type="primary"
            @click="sureeditexamine('ruleForm')"
            size="small"
            v-if="isedit == 2"
            >确定</el-button
          >
          <el-button size="small" @click="cancelnodevisiable">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 添加审批人 -->
    <el-dialog
      title="添加审批人"
      width="450px"
      :visible.sync="examineVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="examineruleForm"
        :rules="examinerules"
        ref="examineruleForm"
        label-width="130px"
      >
        <el-form-item label="审批人" prop="people">
          <el-select
            v-model="examineruleForm.people"
            placeholder="请选择审批人"
            size="small"
            filterable
            :filter-method="selectmember"
            @change="selectmemberarr"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in showmemberlist"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <div class="actfooter">
          <el-button
            type="primary"
            @click="onSubmitexamine('examineruleForm')"
            size="small"
            >确定</el-button
          >
          <el-button size="small" @click="cancelexaminevisiable"
            >取消</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import tree from "../../../components/tree/tree";
import { fuzzyQuery } from "../../../../src/assets/js/minx/common"; //模糊搜索

export default {
  components: { tree },
  data() {
    return {
      /* 树状图按钮显示隐藏 */
      titleshow: true,
      tdkshow: true,
      addshow: true,
      editshow: false,
      delshow: true,
      descripshow: true,
      page: 0,
      pageSizeTree: 25,
      typeTotle: 0,
      tempData: {},
      isAddOrEditorTree: 1,
      titleTree: "添加角色",
      treeFormVisible: false,
      treeForm: {
        name: "",
      },
      rulesTree: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      },
      treeList: [],
      //角色id
      roleId: "",
      tempPowerId: "",
      tableData: [],

      ruleForm: {
        name: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入审批流程名称", trigger: "blur" },
        ],
      },
      addnodeVisible: false,
      examineVisible: false,
      examineruleForm: {
        people: "",
      },
      examinerules: {
        people: [
          { required: true, message: "请选择审批人", trigger: "change" },
        ],
      },
      defaultProps: {
        label: "approvalTemplateName",
      },
      memberlist: [], //获取人员列表
      showmemberlist: [], //显示的人员列表
      isedit: 1, //1 添加审批流程  2  编辑审批流程
      iseditexamine: 1, //1 添加审批人  2 编辑审批人 3 删除审批人
      titletext: "添加审批流程",
      editId: "", //编辑id
      approvalList: [], //流程绑定的审批人
      approvalTemplateName: "", //流程绑定的审批人
      editindex: "", //编辑的索引
    };
  },
  created() {
    // 获取左侧的列表
    this.getleftexamine();
    // 获取人员列表
    this.getpeoplelist();
  },
  methods: {
    // 添加审批人
    addexamine() {
      this.examineVisible = true;
      this.examineruleForm.people = "";
      this.iseditexamine = 1; //添加审批人
      this.isedit=1;//添加审批流程
      
    },
    // 取消添加审批流程
    cancelnodevisiable() {
      this.addnodeVisible = false;
    },
    // 确定添加审批人
    onSubmitexamine(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editexamine();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消添加审批人
    cancelexaminevisiable() {
      this.examineVisible = false;
    },
    // 编辑审批人
    examineedit(index, row) {
      this.examineruleForm.people = row.name;
      this.examineVisible = true;
      this.approvalList=JSON.parse(row.approvalList)
      this.iseditexamine = 2; //编辑 审批人
      this.editindex = index; //编辑的索引
      this.isedit=1;//添加审批流程
    },
    // 删除审批人
    async examinedelete(index, row) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.iseditexamine=3;//删除审批人
           this.isedit=1;//添加审批流程
          console.log(index, row, "删除的某一行");
          this.approvalList = JSON.parse(row.approvalList);
          this.tableData.splice(index, 1);
          this.tableData = this.tableData;
          this.$forceUpdate();
          console.log(this.tableData, "3843848");
          for (var i = 0, len = this.approvalList.length; i < len; i++) {
            console.log(this.approvalList[i]);
          }
          this.approvalList.splice(index, 1);
          this.approvalList = this.approvalList;
          this.approvalList = JSON.stringify(this.approvalList);
          this.$forceUpdate();
          this.editexamine();
        })
        .catch(() => {});
    },
    
    // 获取人员列表
    async getpeoplelist() {
      let res = await this.Axios.get(`ucenter-api/userlist/queryAll`);
      let data = res.data.result;
      data.forEach((value) => {
        let obj = {
          label: value.realname,
          value: value.userId,
        };
        this.memberlist.push(obj);
        console.log(this.memberlist,'人员列表')
      });
    },

    // 模糊搜索
    selectmember(e) {
      if (e != "") {
        let list = this.memberlist;
        let arr = fuzzyQuery(list, e);
        console.log(arr);
        this.showmemberlist = arr;
      } else {
        this.showmemberlist = [];
      }
    },
    // 二维数值去重
    duplicate2(arr) {
      let res = {};
      arr.forEach((item) => {
        item.sort((a, b) => a - b);
        res[item] = item;
      });
      return Object.values(res);
    },
    // 选择审批人
    selectmemberarr(e) {
      console.log(e, "选择的审批人审批人");
      let arr = [];
      arr.push(e);
      let newapprovalList=''
        console.log(typeof(this.approvalList),'添加添加添加')
        if(typeof(this.approvalList)=='string'){
          console.log('87777')
           newapprovalList = JSON.parse(this.approvalList);
        }else{
          console.log('9999000')
          newapprovalList = this.approvalList;
        }
       
      if (this.iseditexamine == 1) {  //iseditexamine  1 添加  2 编辑
        newapprovalList.push(arr);
        this.approvalList=newapprovalList
        // 添加审批人的时候去重
        // this.approvalList = this.duplicate2(this.approvalList);
      } else if (this.iseditexamine == 2) {
        for (var i = 0, len = newapprovalList.length; i < len; i++) {
          if (this.editindex == i) {
            newapprovalList[i][0] = e;
            console.log(newapprovalList[i], "当前编辑的索引");
          }
        }
        this.approvalList = newapprovalList;
        this.$forceUpdate();
        console.log(this.approvalList, "获取选择的人选择的人");
      }

      console.log(this.approvalList, "选择的人");
      this.approvalList = JSON.stringify(this.approvalList);
    },

    // 确定添加左侧菜单的审批
    sureaddexamine(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          }); //显示弹出层
          let param = {
            approvalTemplateName: this.ruleForm.name,
            approvalList: "[]",
          };
          that.Axios.postEdit(
            `workflow-api/approvaltemplate/add`,
             param,
            "postJson"
          )
            .then((res) => {
              console.log(res);
              if (res.data.code == "400000") {
                this.$message(res.data.message);
                loading.close();
              } else if (res.data.code == 0) {
                this.$message({
                  message: "提交成功",
                  type: "success",
                });
                that.addnodeVisible = false;
                loading.close();
                this.getleftexamine();
              } else {
                loading.close();
              }
            })
            .catch((err) => {
              console.log(err);
              loading.close();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑左侧菜单的审批
    sureeditexamine(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editexamine();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑审批 添加审批人 编辑审批 人 删除审批人
    editexamine() {
      let that = this;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      }); //显示弹出层
      let param = {
        id: this.editId,
        approvalTemplateName: this.ruleForm.name,
        approvalList: this.approvalList,
      };
      that.Axios.postEdit(
        `workflow-api/approvaltemplate/update`,
        param,
        "postJson"
      )
        .then((res) => {
          console.log(res, "4474747747474747");
          if (res.data.code == "400000") {
            this.$message(res.data.message);
            loading.close();
          } else if (res.data.code == 0) {
            this.$message({
              message: "提交成功",
              type: "success",
            });
            that.addnodeVisible = false;
            this.examineVisible = false;
            loading.close();
            if(this.isedit==2){
              // 编辑左侧审批流程的名字
            this.treeList.forEach((value, index, array) => {
              if (value.id == this.editId) {
                value.approvalTemplateName = this.ruleForm.name;
                value.name = this.ruleForm.name;
              }
            });
            this.treeList = this.treeList;
            this.$forceUpdate();
            }else if(this.isedit==1){
             this.getdetail(this.editId);
            }
          } else {
            loading.close();
          }
        })
        .catch((err) => {
          console.log(err);
          loading.close();
        });
    },
    // 获取左侧审批列表
    async getleftexamine() {
      let res = await this.Axios.get(`workflow-api/approvaltemplate/list`);
      this.treeList = this.dataAssembly(res.data.result);
      console.log(this.treeList, "爱家安居客");
      this.editId = this.treeList[0].id;
      this.ruleForm.name = this.treeList[0].name;
      this.approvalTemplateName = this.treeList[0].name;
      if (this.treeList[0].approvalList != null) {
        this.approvalList = JSON.parse(this.treeList[0].approvalList);
      }
      this.getdetail(this.treeList[0].id);
    },
    // ==== 数据处理
    dataAssembly(data) {
      let _data = Object.assign([], data);
      _data.forEach((data) => {
        Object.assign(data, {
          name: data.approvalTemplateName,
          isFirst: false,
          isEdit: false,
        });
        delete data.approvalTemplateName;
      });
      return _data;
    },
    nodeClick(s, d, n) {
      console.log(d,'点击左侧')
      console.log(d.name);
      this.editId = d.id;
      this.approvalTemplateName = d.name;
      this.ruleForm.name=d.name;
      this.tableData=[];
      this.approvalList=JSON.parse(d.approvalList);
      console.log(this.approvalList,'349943838989')
      this.getdetail(d.id);
    },
    // 获取详情
    async getdetail(id) {
      let res = await this.Axios.get(
        `workflow-api/approvaltemplate/get?id=${id}`
      );
      console.log(res, "获取的详情");
      let data = res.data.result.approvalUserList;
      if (data != null) {
        data = JSON.parse(data);
        let arr = [];
        data.forEach((value, index, array) => {
          let obj = {
            id: index + 1,
            name: value[0],
            approvalUserList: res.data.result.approvalUserList,
            approvalList: res.data.result.approvalList,
          };
          arr.push(obj);
        });
        this.tableData = arr;
        console.log(this.tableData, "383883989");
      } else {
        this.tableData = [];
      }
    },
    startTdk(s, d, n) {
      console.log("编辑", d);
      this.ruleForm.name = d.name;
      this.approvalTemplateName = d.name;
      this.editId = d.id;
      this.approvalList = d.approvalList;
      this.addnodeVisible = true;
      this.titletext = "编辑审批流程";
      this.isedit = 2;
    },
    addTop() {
      console.log("添加");
      this.addnodeVisible = true;
      this.ruleForm.name = ""; //清空之前填的内容
      this.isedit = 1;
      // this.isAddOrEditorTree = 1;
      // this.openDialog();
    },
    completeEditor() {},
    startEditor() {},
    deleteEditor(s, d, n) {
      console.log("当前页");
      console.log(this.page);
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteexamine(d.id);
        })
        .catch(() => {});
    },
    // 删除审批流程
    async deleteexamine(id) {
      let res = await this.Axios.get(
        `workflow-api/approvaltemplate/delete?id=${id}`
      );
      if (res.data.code == 0) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.treeList.forEach((value, index, array) => {
          if (value.id == id) {
            this.treeList.splice(index, 1);
          }
        });
        this.treeList = this.treeList;
        this.getleftexamine()
        this.$forceUpdate();
      }
    },
    selectPages(val) {
      console.log(val);
      this.page = parseInt(val - 1);
      this.pageInit();
    },
  },
};
</script>

<style scoped>
@import url("./index.css");
@import url("../../../assets/css/base.css");
</style>