<template>
  <div class="systemlayoutbox">
    <div class="navbar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>流程配置</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="top_line"></div>
    </div>
    <div class="nodepage">
      <div class="nodepageleftbox">
        <tree
          title="添加流程"
          :processconfig="processconfig"
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
        <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
      </div>
      <div class="nodepageright">
        <!-- <div class="servicename">服务流程配置</div> -->
        <el-table style="width: 1100px" class="titlehead">
          <el-table-column label="任务名称" width="240"> </el-table-column>
          <el-table-column label="计划工时" width="120"> </el-table-column>
          <el-table-column label="关联表表单" width="260"> </el-table-column>
          <el-table-column label="操作范围（部门/角色/人员）" width="320">
          </el-table-column>
          <el-table-column label="启用状态" width="160"> </el-table-column>
        </el-table>
        <div class="nodata" v-if="nodelist == null">暂无数据</div>
        <div v-else>
          <div class="nodeitem" v-for="(item, index) in nodelist" :key="index">
            <div class="nodeitemright">
              <div class="nodeitemrighttop">
                {{ item.nodeName }}
                <i
                  class="el-icon-circle-plus-outline additem"
                  @click="addnode(item, index)"
                ></i>
              </div>
              <div class="rightitembox">
                <el-table
                  :data="item.children"
                  :show-header="false"
                  style="width: 100%"
                  class="nodeitemnode"
                >
                  <el-table-column prop="taskName" label="任务名称" width="240">
                  </el-table-column>
                  <el-table-column width="120" prop="planTime" label="计划工时">
                  </el-table-column>
                  <el-table-column width="260" prop="fromName" label="关联表单">
                  </el-table-column>
                  <el-table-column
                    prop="bindValueName"
                    width="320"
                    label="操作范围"
                  >
                  </el-table-column>
                  <el-table-column width="160" prop="address" label="启用状态">
                    <template slot-scope="scope">
                      <div class="switchbtn">
                        <el-switch
                          style="display: block"
                          v-model="scope.row.checked"
                          active-color="#409EFF"
                          inactive-color="#C0C0C0"
                          @change="selectstates(scope.$index, scope.row)"
                        >
                        </el-switch>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column width="50" prop="address">
                    <template slot-scope="scope"
                      ><i
                        class="el-icon-remove-outline reduiceitem"
                        @click="deletenode(scope.$index, scope.row)"
                      ></i
                    ></template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加节点弹出层 -->
    <el-dialog
      :title="titletext"
      width="550px"
      :visible.sync="addnodeVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
      >
        <el-form-item label="流程名称：" prop="name">
          <el-input
            v-model="ruleForm.name"
            @blur="entername($event)"
          ></el-input>
        </el-form-item>
        <el-form-item label="bpmn文件：" prop="bmpnfile" v-if="isedit != 2">
          <!-- <el-input v-model="ruleForm.bmpnfile"></el-input> -->
          <div class="upbmp">
            <div class="upbmpleft">
              <div class="upbmptext">{{ filename }}</div>
              <i
                class="el-icon-error closeimgbtn"
                v-if="filename != ''"
                @click="deletebumpn"
              ></i>
            </div>
            <div class="upbmpnmae">
              上传
              <input type="file" class="upfilebmpn" @change="upbmpfile" />
            </div>
          </div>
        </el-form-item>
        <div class="actfooter">
          <el-button
            type="primary"
            @click="adddata('ruleForm')"
            size="small"
            v-if="isedit == 1"
            >确定</el-button
          >
          <el-button
            type="primary"
            @click="updatedata('ruleForm')"
            size="small"
            v-if="isedit == 2"
            >确定</el-button
          >
          <el-button size="small" @click="cancelnodevisiable">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--  节点流程弹出层-->
    <el-dialog
      title="添加节点任务"
      width="600px"
      :visible.sync="addnodeprocessVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="noderuleForm"
        :rules="noderules"
        ref="noderuleForm"
        label-width="130px"
      >
        <el-form-item label="任务名称：" prop="taskName">
          <el-input
            v-model="noderuleForm.taskName"
            @blur="entertaskname($event)"
          ></el-input>
        </el-form-item>
        <el-form-item label="计划工时：" prop="planTime">
          <div class="planhour">
            <el-input
              type="number"
              v-model="noderuleForm.planTime"
              class="planinput"
              @blur="enterplantime($event)"
            ></el-input>

            <div class="planname">小时</div>
          </div>
        </el-form-item>
        <el-form-item label="关联表单：" prop="fromId">
          <el-select
            v-model="noderuleForm.fromId"
            placeholder="请选择关联表单"
            class="relateform"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in formlist"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作范围：" prop="bindType">
          <div class="operaterangearr">
            <el-radio-group v-model="noderuleForm.bindType">
              <el-radio :label="1">部门</el-radio>
              <el-radio :label="2">角色</el-radio>
              <el-radio :label="3">人员</el-radio>
            </el-radio-group>
          </div>
          <div class="operateselect">
            <!-- 角色选择 -->
            <el-select
              v-model="rolevalue"
              placeholder="请选择"
              v-if="noderuleForm.bindType == 2"
              @change="selectrole"
            >
              <el-option
                v-for="(item, index) in rolelist"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- 部门选择 -->
            <el-tree
              :data="sectionlist"
              :props="defaultProps"
              @node-click="handlesectionClick"
              v-if="noderuleForm.bindType == 1"
            ></el-tree>
            <!-- 人员选择 -->
            <el-select
              v-model="membervalue"
              filterable
              placeholder="请选择"
              :filter-method="selectmember"
              v-if="noderuleForm.bindType == 3"
              @change="selectmemberarr"
            >
              <el-option
                v-for="(item, index) in showmemberlist"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <div class="actfooter">
          <el-button
            type="primary"
            @click="onSubmitnodeprocess('noderuleForm')"
            size="small"
            >确定</el-button
          >
          <el-button size="small" @click="cancelprocessnodevisiable"
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
      value2: false,
      treeList: [
        {
          id: 1,
          label: "一级",
        },
        {
          id: 2,
          label: "二级",
        },
        {
          id: 3,
          label: "三级",
        },
        {
          id: 4,
          label: "四级",
        },
      ],

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
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      addnodeVisible: false, //添加节点
      ruleForm: {
        name: "",
        bmpnfile: "",
      },
      rules: {
        name: [{ required: true, message: "请输入流程名称", trigger: "blur" }],
        bmpnfile: [
          {
            type: "string",
            required: true,
            message: "请选择bmpn文件",
            trigger: "change",
          },
        ],
      },
      addnodeprocessVisible: false, //添加节点流程弹出层
      radio: "", //操作范围
      options: [
        //  {value:1,label:'测试1'},
        //  {value:2,label:'测试2'},
        //  {value:3,label:'测试3'}
      ],
      sectionvalue: "",
      membervalue: "",
      editid: "",
      titletext: "添加流程",
      isedit: 1, //1 添加流程 2 编辑流程
      fileparams: "",
      filename: "", //文件名字
      nodelist: [], //节点列表
      rolevalue: "",
      membervalue: "",
      noderuleForm: {
        nodeTemplateId: "",
        taskName: "",
        planTime: "",
        fromId: "",
        bindType: "",
        bindValue: "",
      },
      noderules: {
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
        ],
        planTime: [
          { required: true, message: "请输入计划工时", trigger: "blur" },
        ],
        fromId: [
          { required: true, message: "请选择关联表单", trigger: "change" },
        ],
        bindType: [
          { required: true, message: "请选择操作范围", trigger: "change" },
        ],
      },
      formlist: [], //关联的表单
      rolelist: [], //角色列表
      sectionlist: [], //部门列表
      memberlist: [], //人员列表
      showmemberlist: [],
      defaultProps: {
        label: "name",
      },
      processconfig: true, //判断显示字的数量
    };
  },
  created() {
    // 获取左侧流程列表
    this.getprocess();
    // 获取关联的表单
    this.getrelateform();
    // 获取 角色列表
    this.getrolelist();
    // 获取部门列表
    this.getsectionlist();
    // 获取人员列表
    this.getpeoplelist();
    let todos = [
      {
        id: 1,
        name: "GO TO STORE",
        complate: false,
      },
      {
        id: 2,
        name: "GO TO STORE1",
        complate: false,
      },
      {
        id: 3,
        name: "GO TO STORE3",
        complate: false,
      },
    ];
  },
  methods: {
    // 获取角色
    async getrolelist() {
      let res = await this.Axios.get(`ucenter-api/rolelist/query`);
      let data = res.data.result;
      data.forEach((value) => {
        let obj = {
          label: value.roleName,
          value: value.roleId,
        };
        this.rolelist.push(obj);
      });
    },
    //获取部门列表
    async getsectionlist() {
      let res = await this.Axios.get(`ucenter-api/departmentlist/tree`);
      this.sectionlist = res.data.result;
      console.log(this.sectionlist, "获取的部门");
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
      });
    },
    // 选择角色
    selectrole(e) {
      this.noderuleForm.bindValue = e;
    },
    // 选择人员
    selectmemberarr(e) {
      this.noderuleForm.bindValue = e;
    },
    // 选择部门
    handlesectionClick(e) {
      console.log(e, "选择人员");
      this.noderuleForm.bindValue = e.depId;
    },
    // 获取关联的表单
    async getrelateform() {
      let res = await this.Axios.get(`workflow-api/formlist/list`);
      if (res != null) {
        let data = res.data.result;
        data.forEach((value) => {
          let obj = {
            label: value.formName,
            value: value.formId,
          };
          this.formlist.push(obj);
        });
        // this.formlist=res.data.result
      }
    },
    // 获取流程节点
    async getnodelist(id) {
      let res = await this.Axios.get(
        `workflow-api/templatenode/list?flowTemplateId=${id}`
      );
      // 获取流程节点列表
      this.getnodeprocesslist();
      this.nodelist = res.data.result;
    },
    // 获取流程节点下的列表
    async getnodeprocesslist() {
      let res = await this.Axios.get(`workflow-api/taskconfig/list`);
      if (res.data.result != null) {
        let data = res.data.result;
        if (this.nodelist != null) {
          this.nodelist.forEach((value, index, array) => {
            value.children = [];
            data.forEach((valuek, indexk, arrayk) => {
              if (valuek.status == 1) {
                valuek.checked = true;
              } else if (valuek.status == 2) {
                value.checked = false;
              }
              if (value.nodeTemplateId == valuek.nodeTemplateId) {
                value.children.push(valuek);
              }
            });
          });
          this.nodelist = this.nodelist;
          this.$forceUpdate();
        }
      }
    },
    // 添加节点
    addnode(item, index) {
      let obj = {
        nodeTemplateId: "",
        taskName: "",
        planTime: "",
        fromId: "",
        bindType: "",
        bindValue: "",
      };
      this.noderuleForm = obj;
      this.rolevalue = "";
      this.membervalue = "";
      this.addnodeprocessVisible = true;
      this.noderuleForm.nodeTemplateId = item.nodeTemplateId;
    },
    // 判断 流程名称字数
    entername(e) {
      if (e.currentTarget.value.length > 15) {
        this.$message({
          message: "流程名称要小于15个字",
          type: "warning",
        });
      }
    },
    // 判断任务名称只能输入<20 个字
    entertaskname(e) {
      if (e.currentTarget.value.length > 20) {
        this.$message({
          message: "任务名称要小于20个字",
          type: "warning",
        });
      }
    },
    // 输入计划工时
    enterplantime(e) {
      console.log(e.currentTarget.value, "99999");
      // let word = e.currentTarget.value;
      // console.log(typeof word);
      // var pattern3 = new RegExp("[0-9]+");
      // if (!pattern3.test(word)) {
      //   this.$message({
      //     message: "请输入数字",
      //     type: "warning",
      //   });
      //   return false;
      // }
    },
    // 删除节点
    deletenode(index, row) {
      console.log(index, row, "节点节点节点");
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deletenodelist(row.id, row, index);
        })
        .catch(() => {});
    },
    async deletenodelist(id, row, index) {
      console.log(id, row, index);
      let res = await this.Axios.get(
        `workflow-api/taskconfig/logicalDelete?id=${id}`
      );
      if (res.data.code == 0) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.nodelist.forEach((valuek, indexk, array) => {
          if (valuek.nodeTemplateId == row.nodeTemplateId) {
            this.nodelist[indexk].children.splice(index, 1);
          }
        });
        this.nodelist = this.nodelist;
      }
    },
    //  更改启用状态
    async selectstates(index, row) {
      console.log(index, row);
      console.log(row.checked);
      let status = "";
      if (row.checked == true) {
        status = 1;
      } else if (row.checked == false) {
        status = 2;
      }
      let param = {
        id: row.id,
        status: status,
      };
      let res = await this.Axios.post(
        `workflow-api/taskconfig/update`,
        param,
        "postJson"
      );
      console.log(res, "更新状态");
    },
    // 上传bmpn 文件
    upbmpfile(e) {
      console.log(e);
      this.fileparams = e.target.files[0];
      console.log(this.fileparams);
      let name = this.fileparams.name.split(".")[1];
      if (name != "bpmn") {
        this.$message({
          message: "请上传bpmn类型的文件",
          type: "warning",
        });
      } else {
        this.ruleForm.bmpnfile = this.fileparams.name;
        this.filename = this.fileparams.name;
      }
    },
    // 删除文件
    deletebumpn() {
      this.filename = "";
      this.formdata = "";
      this.fileparams = "";
      this.ruleForm.bmpnfile = "";
    },
    // 获取流程
    async getprocess() {
      let res = await this.Axios.get(`workflow-api/templateflow/list`);
      if (res.data.result != null) {
        let newtreeList = res.data.result;
        this.treeList = this.dataAssembly(newtreeList);
        if (res.data.result.length != 0) {
          let id = res.data.result[0].templateId;
          // 获取节点列表
          this.getnodelist(id);
        } else {
          let id = "";
          // 获取节点列表
          this.getnodelist(id);
        }
        console.log(res, "获取流程");
      }
    },
    // 取消节点流程弹出层
    cancelprocessnodevisiable() {
      this.addnodeprocessVisible = false;
    },
    // 确定添加节点流程
    onSubmitnodeprocess(formNamek) {
      let that = this;

      this.$refs[formNamek].validate((valid) => {
        if (valid) {
          // var pattern3 = new RegExp("[0-9]+");
          // if (!pattern3.test(this.noderuleForm.planTime)) {
          //   this.$message({
          //     message: "请输入数字",
          //     type: "warning",
          //   });
          //   return false;
          // }
          if (this.noderuleForm.taskName.length > 20) {
            this.$message({
              message: "任务名称要小于20个字",
              type: "warning",
            });
            return false;
          }
          if (this.noderuleForm.bindValue == "") {
            this.$message({
              message: "请选择操作范围",
              type: "warning",
            });
            return false;
          }
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          }); //显示弹出层
          let param = this.noderuleForm;
          that.Axios.post(`workflow-api/taskconfig/add`, param, "postJson")
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
                that.addnodeprocessVisible = false;
                loading.close();
                this.getprocess();
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

    // 取消弹出层
    cancelnodevisiable() {
      this.addnodeVisible = false;
    },
    // ==== 数据处理
    dataAssembly(data) {
      let _data = Object.assign([], data);
      _data.forEach((data) => {
        Object.assign(data, {
          name: data.definitionShowName,
          isFirst: false,
          isEdit: false,
        });
        delete data.definitionShowName;
      });
      return _data;
    },
    // 添加数据
    adddata(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        console.log(valid);
        if (valid) {
           if (this.ruleForm.name.length > 15) {
            this.$message({
              message: "流程名称要小于15个字",
              type: "warning",
            });
            return false
          }
          let name = this.fileparams.name.split(".")[1];
          if (name != "bpmn") {
            this.$message({
              message: "请上传bpmn类型的文件",
              type: "warning",
            });
            return false;
          }
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          }); //显示弹出层

          var param = new FormData();
          param.append("file", this.fileparams);
          param.append("definitionShowName", this.ruleForm.name);

          let config = {
            headers: { "Content-Type": "multipart/form-data" },
          }; //添加请求头
          axios
            .post(
              "http://gateway.kuaiban.cn/workflow-api/templateflow/add  ",
              param,
              config
            )
            .then((res) => {
              console.log(res, "上传成功之后");
              loading.close();
              this.addnodeVisible = false;
              this.getprocess();
            })
            .catch((err) => {
              loading.close();
              this.showMessage("error", "图片上传错误");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 更新数据
    updatedata(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        console.log(valid);
        if (valid) {
          if (this.ruleForm.name.length > 15) {
            // this.$message({
            //   message: "流程名称要小于15个字",
            //   type: "warning",
            // });
            return false
          }
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          }); //显示弹出层
          let param = {
            definitionShowName: that.ruleForm.name,
            id: this.editid,
          };
          that.Axios.post(`workflow-api/templateflow/update`, param, "postJson")
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
                // this.getprocess();
                this.treeList.forEach((value, index, array) => {
                  if (value.id == this.editid) {
                    value.definitionName = this.ruleForm.name;
                    value.name = this.ruleForm.name;
                  }
                });
                this.treeList = this.treeList;
                this.$forceUpdate();
                console.log(this.treeList, "树形结构");

                // this.page = 1;
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
    // 删除数据
    async deletedata(id) {
      let res = await this.Axios.get(
        `workflow-api/templateflow/logicalDelete?id=${id}`
      );
      console.log(res, "删除文件");
      let newtreeList = this.treeList;
      newtreeList.forEach((value, index, array) => {
        if (value.id == id) {
          newtreeList.splice(index, 1);
        }
      });
      this.treeList = newtreeList;
    },
    // 点击流程节点
    nodeClick(s, d, n) {
      console.log(d, "点击的节点");
      this.titleName = d.name;
      this.isActive = 0;
      // 获取流程列表
      this.getnodelist(d.templateId);
    },
    // 编辑流程
    startTdk(s, d, n) {
      this.isedit = 2;
      console.log("编辑", s, d, n);
      this.addnodeVisible = true;
      this.ruleForm.name = d.name;
      this.editid = d.id;
      this.titletext = "编辑流程";
      console.log(this.editid, "编辑的id");
    },

    // 添加流程
    addTop() {
      console.log("添加");
      this.addnodeVisible = true;
      this.ruleForm.name = "";
      this.ruleForm.bmpnfile = "";
      this.fileparams = "";
      this.filename = "";
      this.isedit = 1;
      this.titletext = "添加流程";
    },
    completeEditor() {},
    startEditor() {},
    // 删除流程
    deleteEditor(s, d, n) {
      console.log("当前页");
      console.log(this.page);
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deletedata(d.id);
        })
        .catch(() => {});
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