<!--
 * @Author:  组织架构++
 * @Date: 2020-08-14 14:53:16
 * @LastEditTime: 2020-10-30 20:53:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\user\uesr_org\index.vue
-->

<template>
 <div class="uesr_org">
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
   <el-breadcrumb-item>线索系统</el-breadcrumb-item>
   <el-breadcrumb-item>来源配置</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="top_line"></div>
  <div class="uesr_org_content">
   <article class="uesr_org_content_left">
    <article class="list">
     <article>
      <tree showlength="true" :delshow="delshow" :list="treeListLy"
            :tdkshow="tdkshow" :titleshow="titleshow" @addTop="addTop" @deleteEditor="deleteEditor"
             @nodeClick="nodeClick" @startEditor="startEditor"
            @startTdk="startTdk" title="添加一级来源分类"></tree>
     </article>
    </article>
   </article>
   <article class="uesr_org_content_right">
    <div class="org_button">
     <div class="right">
      <el-button @click.prevent="addLy" v-has="'/xiansuo-laiyuan/get-add-look'" size="small" type="primary">添加来源</el-button>
     </div>
    </div>
    <div class="org_table">
     <el-table :cell-style="cellStyle" :data="tableLists" :header-cell-style="{'background-color': '#F3F6FD','color': '#606266','padding': '10px 0','text-align':'center'}"
               :row-key="row_key" border
               stripe
               style="width: 100%">
      <el-table-column align="center" label="来源" min-width="120" prop="sourceName"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" min-width="80">
       <template slot-scope="scope">
        <el-button v-has="'/xiansuo-laiyuan/get-edit-look'" @click="editlynr(scope.row)" size="small" style="color: cornflowerblue;" type="text">
         编辑
        </el-button>
        <el-button v-has="'/xiansuo-laiyuan/get-del-look'" @click="deletelynr(scope.row)" size="small" style="color: red;" type="text">
         删除
        </el-button>
       </template>
      </el-table-column>
     </el-table>
    </div>
    <div class="org_button" style="margin-top: 10px;">
     <div class="right">
      <el-button v-has="'/xiansuo-laiyuan/get-add-look'" @click.prevent="add" size="small" type="primary">关联部门</el-button>
     </div>
    </div>
    <div class="org_table">
     <el-table :cell-style="cellStyle" :data="tableList" :header-cell-style="table_heard_style"
               :row-key="row_key" border
               stripe
               style="width: 100%">
      <el-table-column align="center" label="指定部门" min-width="120" prop="scopeName"></el-table-column>
      <el-table-column align="center" fixed="right" label="操作" min-width="80">
       <template slot-scope="scope">
        <el-button v-has="'/xiansuo-laiyuan/get-edit-look'" @click="editList(scope.row)" size="small" style="color: cornflowerblue;" type="text">
         编辑
        </el-button>
        <el-button v-has="'/xiansuo-laiyuan/get-del-look'" @click="deleteList(scope.row)" size="small" style="color: red;" type="text">
         删除
        </el-button>
       </template>
      </el-table-column>
     </el-table>
    </div>
   </article>
  </div>

  <!-- 树状图 添加&编辑 -->
  <el-dialog :title="titleTree" :visible.sync="treeFormVisible" :close-on-click-modal="false" @close="closeDialog" width="19%">
   <el-form :inline="true" :model="treeForm" :rules="rulesTree" class="from_input" label-position="right"
            label-width="80px" ref="treeForm">
    <el-form-item label="来源分类" prop="laiyuanName" v-if="titleTree==='添加来源分类' ||titleTree==='编辑子单位'">
     <el-input auto-complete="off" placeholder="请输入来源分类" size="small"
               v-model="treeForm.sourceName"></el-input>
    </el-form-item>
    <el-form-item label="来源内容" prop="laiyuanName" v-if="titleTree==='添加来源内容'">
     <el-input auto-complete="off" placeholder="请输入来源内容" size="small"
               v-model="treeForm.sourceName"></el-input>
    </el-form-item>
    <el-form-item label="来源内容" prop="laiyuanName" v-if="titleTree==='编辑来源'">
     <el-input auto-complete="off" placeholder="请输入来源内容" size="small"
               v-model="treeForm.sourceName"></el-input>
    </el-form-item>

   </el-form>
   <div class="dialog-footer" slot="footer">
    <el-button @click="closeDialog" size="small">取消</el-button>
    <el-button :loading="loading" @click="submitFormTree" class="title" size="small" type="primary">保存
    </el-button>
   </div>
  </el-dialog>
  <!--关联部门-->
  <el-dialog :close-on-click-modal="false" :title="titleTree" :visible.sync="guanlian_dialog" width="20%">
   <el-form :inline="true" :model="guanlianForm" :rules="rulesGuanLianForm" class="from_input" label-position="right"
            label-width="80px" ref="treeForm">
    <el-form-item label="关联部门" prop="depId">
     <el-cascader :options="depListOptionss" :props="listProps" :show-all-levels="false"
                  @change="menuchange"
                  clearable
                  ref="cascader"
                  v-model="guanlianForm.depId">
     </el-cascader>
    </el-form-item>
   </el-form>
   <span class="dialog-footer" slot="footer">
                <el-button @click="guanlian_dialog = false" size="small">取 消</el-button>
                <el-button @click.prevent="guanlian_form_" size="small" type="primary">确 定</el-button>
              </span>
  </el-dialog>
 </div>
</template>

<script>
  import tree from "../../../components/tree/tree";
  import myMixin from "../../../assets/js/minx/xiansuo";

  export default {
    name: "",
    components: {tree},
    mixins: [myMixin],
    props: [],
    data() {
      return {
        guanlian_dialog: false,
        depListOptionss: [],
        treeList: [],
        tableLists: [],
        //筛选
        valueType: 0,
        searchUInput: null,
        /* 树状图按钮显示隐藏 */
        titleshow: false,
        tdkshow: false,
        delshow: false,
        list_show: false,
        list_show_table: true,
        guanlianForm: {
          depId: '',
          permit: '',
          scopeType: ''
        },
        /* 列表 */
        listProps: {
          value: "depId",
          label: "name",
          children: "children",
          checkStrictly: true,
        },
        tempListData: {},
        sourceId: '',/*节点sourceId*/
        pageList: 0, //当前页
        pageListSize: 10, //单页数量
        totleList: 0, //总数量
        isListAddOrEdit: 1,
        tableList: [],
        depList: [],
        // erji_data: {},
        //城市列表
        cityList: [],
        //角色列表
        roleList: [],
        //已选角色
        roles: [],
        //弹框内容
        loading: false, //是显示加载
        title: "编辑成员信息",
        // rules表单验证
        rules: {
          userName: [{required: true, message: "请输入姓名", trigger: "blur"}],
          userNumber: [
            {required: true, message: "请输入工号", trigger: "blur"},
            {
              pattern: /^[0-9]*$/,
              message: "只能输入数字",
            },
          ],
          userMail: [{required: true, message: "请输入邮箱", trigger: "blur"}],
          depList: [{required: true, message: "请选择部门.", trigger: "blur"}],
          city: [{required: true, message: "请选择城市", trigger: "blur"}],
          status: [{required: true, message: "请选择在职状态", trigger: "blur"}],
          roles: [{required: true, message: "请选择角色", trigger: "blur"}],
          userMobile: [
            {required: true, message: "请输入手机号", trigger: "blur"},
            {
              pattern: /^1(3\d|47|5((?!4)\d)|7(0|1|[6-8])|8\d)\d{8,8}$/,
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
        titleTree: "添加一级来源分类",
        treeFormVisible: false,
        treeForm: {
          sourceName: "",
        },
        rulesTree: {
          sourceName: [{required: true, message: "请输入来源分类", trigger: "blur"}],
        },
        rulesGuanLianForm: {
          depId: [{required: true, message: "请选择关联部门或人", trigger: "change"}]
        },
        nodesObj: [],
        status_tree: 'LyPz',
        editlynrid: '',
        editglbmid: '',
        edit_add_status: ''
      };
    },
    computed: {},
    watch: {},
    created() {
    },
    async mounted() {
      this.getPower();
      await this.get_laiyuan_list()
      this.tempData = this.treeListLy[0]
      this.getPerList(this.tempData.sourceId)
      this.laiyuanneirongList(this.tempData.sourceId)
    },
    methods: {
     //权限
     getPower() {
      this.list_show = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-laiyuan/get-list-look");/*列表*/
      this.titleshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-laiyuan/get-add-look");/*添加一级*/
      this.tdkshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-laiyuan/get-edit-look");/*编辑一级*/
      this.delshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-laiyuan/get-del-look");/*删除一级*/
      console.log(this.list_show, this.titleshow, this.tdkshow, this.delshow);
     },
      //来源表格
      async laiyuanneirongList(sourceId) {
        let resp = await this.Axios.get(`leads-api/sourcelist/manager/queryByParentId?parentId=${sourceId}`);
        this.tableLists = resp.data.result;
      },
      //指定部门表格列表
      async getPerList(sourceId) {
        let resp = await this.Axios.get(`leads-api/sourcescope/queryBySourceId?sourceId=${sourceId}`);
        this.tableList = resp.data.result;
      },
      //点击节点
      nodeClick(s, d, n) {
        this.tempData = d;
        this.getPerList(d.sourceId)
        this.laiyuanneirongList(d.sourceId)
      },
      //点击添加一级分类
      addTop() {
        this.treeFormVisible = true
        this.isAddOrEditorTree = 1;
        this.titleTree = "添加来源分类";
      },
      //编辑来源
      editlynr(row) {
        this.editlynrid = row.id
        this.treeFormVisible = true
        this.isAddOrEditorTree = 2;
        this.titleTree = "编辑来源";
        this.treeForm.sourceName = row.sourceName
      },
      //删除来源
      deletelynr(row) {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delOrgList(row.id);
        }).catch(() => {
          this.showMessage("info", "已取消操作")
        });
      },
      //编辑子单位
      startTdk(s, d, n) {
        this.tempData = d;
        this.isAddOrEditorTree = 2;
        this.treeFormVisible = true;
        this.titleTree = "编辑子单位";
        this.treeForm.sourceName = d.name;
      },
      //提交
      submitFormTree() {
        this.$refs.treeForm.validate((val) => {
          if (val) {
            let _data = {}
            if (this.isAddOrEditorTree == 1) {
              if (this.titleTree === "添加来源分类") {
                //    添加一级
                _data = {
                  sourceName: this.treeForm.sourceName,
                }
              } else {
                //    添加二级
                _data = {
                  parentId: this.tempData.sourceId,
                  sourceName: this.treeForm.sourceName,
                }
              }
              this.addOrgList(_data);
            } else {
              if (this.titleTree === '编辑子单位') {
                // 编辑一级
                _data = {
                  id: this.tempData.id,
                  sourceName: this.treeForm.sourceName,
                };
              } else {
                //编辑二级
                _data = {
                  id: this.editlynrid,
                  sourceName: this.treeForm.sourceName,
                };
              }
              this.updOrgList(_data);
            }
          } else {
            this.showMessage("error", "输入内容不能为空");
          }
        });
      },
      //添加一级分类
      async addOrgList(data) {
        let _resp = await this.Axios.post(`leads-api/sourcelist/manager/addSource`, data);
        if (_resp.data.code == 0) {
          this.showMessage("success", "添加成功");
          this.treeFormVisible = false;
          this.get_laiyuan_list()
          this.laiyuanneirongList(this.tempData.sourceId)

        } else {
          this.showMessage("error", _resp.data.message);
        }
        this.closeDialog();
      },
      //修改一级分类
      async updOrgList(data) {
        let _resp = await this.Axios.post(`/leads-api/sourcelist/manager/updateById`, data);
        if (_resp.data.code == 0) {
          this.showMessage("success", "修改成功");
          this.treeFormVisible = false;
          this.get_laiyuan_list();
          this.laiyuanneirongList(this.tempData.sourceId)
        } else {
          this.showMessage("error", _resp.data.message);
        }
      },
      //删除一级分类
      async delOrgList(id) {
        let _resp = await this.Axios.get(`/leads-api/sourcelist/manager/deleteById?id=${id}`);
        if (_resp.data.code == 0) {
          this.showMessage("success", "删除成功");
          this.get_laiyuan_list();
          this.laiyuanneirongList(this.treeListLy[0].sourceId)
        } else {
          this.showMessage("error", _resp.data.message);
        }
        this.closeDialog();
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
      //添加来源
      addLy() {
        this.isAddOrEditorTree = 1;
        this.treeFormVisible = true;
        this.titleTree = "添加来源内容"
      },
      //获取所有部门
      async getAlldep() {
        let _resp = await this.Axios.get(`ucenter-api/departmentlist/tree`);
        this.depListOptionss = [this.dataAssembly2(_resp.data.result[0])];
      },
      //关联部门
      add() {
        console.log(this.tempData);
        this.getAlldep()
        this.guanlian_dialog = true
        this.edit_add_status = '1'
      },
      //关联部门提交
      guanlian_form_() {
        this.$refs.treeForm.validate((val) => {
          if (val) {
            console.log(this.guanlianForm);
            let depid = this.guanlianForm.depId[this.guanlianForm.depId.length - 1]
            if (this.edit_add_status === '1') {
              //添加
              let data = {
                scopeId: depid,
                scopeType: 1,/*1:部门 2:用户*/
                sourceId: this.tempData.sourceId,
              }
              this.guanlian_function(data)
            } else {
              //编辑
              let data = {
                id: this.editglbmid,
                scopeType: 1,
                scopeId: depid
              }
              this.editListSubmit(data)
            }
          }
        })

      },
      async guanlian_function(data) {
        let res = await this.Axios.post("leads-api/sourcescope/addSourceScope", data)
        if (res.data.code === 0) {
          this.showMessage("success", "关联成功")
          this.guanlian_dialog = false
          this.getPerList(this.tempData.sourceId)
        }
      },
      //表格删除
      deleteList(row) {
        this.$confirm('是否确认删除来源信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delete_func(row.scopeId, this.tempData.sourceId)

        }).catch(() => {
          this.showMessage("info", "已取消操作")
        });
      },
      //表格编辑
      editList(row) {
        console.log(row);
        this.editglbmid = row.id
        this.guanlian_dialog = true
        this.titleTree = "编辑关联部门";
        this.getAlldep()
        this.guanlianForm.depId.push(row.scopeId)
        this.edit_add_status = '2'
      },
      //表格编辑提交
      async editListSubmit(data) {
        let res = await this.Axios.post("leads-api/sourcescope/updateSourceScope", data)
        if (res.data.code === 0) {
          this.showMessage("success", "编辑成功")
          this.guanlian_dialog = false
          this.getPerList(this.tempData.sourceId)
        } else {
          this.showMessage("error", res.data.message)
        }
      },
      async delete_func(scopeId, sourceId) {
        let res = await this.Axios.get(`leads-api/sourcescope/deleteByScopeIdAndSourceId?scopeId=${scopeId}&sourceId=${sourceId}`)
        if (res.data.code === 0) {
          this.showMessage("success", "删除成功")
          this.getPerList(this.tempData.sourceId)
        }
      },
      //编辑节点
      startEditor() {
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
      row_key(row) {
        return row.id;
      },
      cellStyle({row, column, rowIndex, columnIndex}) {
        return "text-align:center"
      },
      //分页
      selectPages(val) {
        this.pageList = parseInt(val - 1);
        // this.getPerList(this.erji_data.sourceId);
      },
      //三级联动change事件
      menuchange() {
        this.nodesObj = this.$refs['cascader'].getCheckedNodes()
      },
      //关闭对话框
      closeDialog() {
        this.treeFormVisible = false;
        if (this.$refs.treeForm) this.$refs.treeForm.resetFields();
        this.treeForm.sourceName = "";
        if (this.$refs.cascader) {
          this.$refs.cascader.$refs.panel.activePath = [];
        }
      },

    },
  };
</script>
<style scoped>
 /deep/ .el-dialog__wrapper{
  display: flex;
  justify-content: center;
  align-items: center;

 }
 /deep/ .el-dialog{
   margin-top: 0 !important;
  }
 @import url("./index.css");
 /deep/ .el-table td {
  padding: 5px !important;
  font-size: 12px;
 }

 /deep/ .el-table .cell {
  line-height: 15px !important;
  padding: 0 5px !important;
 }
 .el-button--primary, .el-button--danger, .el-button--success {
  height: 32px;
  padding: 0 10px;
  color: #fff;
 }

 .el-button--primary {
  background: linear-gradient(90deg, rgba(96, 157, 248, 1), rgba(84, 183, 235, 1));
 }

 .org_table {
  flex: 1;
  height: auto;
  overflow-x: auto;
 }

 /deep/ .el-dialog__body {
  padding: 1px 20px !important;
 }
</style>
