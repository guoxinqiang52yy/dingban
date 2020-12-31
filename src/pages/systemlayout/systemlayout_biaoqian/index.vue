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
         <el-breadcrumb-item>标签配置</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="top_line"></div>
      <div class="uesr_org_content">
         <article class="uesr_org_content_left">
            <article class="list">
               <article>
                  <tree :addshow="addshow" :delshow="delshow" :list="treeList" :tdkshow="tdkshow" :titleshow="titleshow"
                        @addTop="addTop" @deleteEditor="deleteEditor" @nodeClick="nodeClick"
                        @startEditor="startEditor" @startTdk="startTdk" showlength="true" title="添加一级分类标签"></tree>
               </article>
            </article>
         </article>
         <article class="uesr_org_content_right">
            <div class="org_button">
               <div class="right">
                  <el-button v-has="'/xiansuo-biaoqian/get-add-look'" @click="add" size="small" type="primary">添加标签内容
                  </el-button>
               </div>
            </div>
            <div class="org_table">
               <el-table :cell-style="cellStyle" :data="tableList" :header-cell-style="table_heard_style" :row-key="row_key"
                         border stripe style="width: 100%">
                  <el-table-column align="center" label="标签内容" min-width="120" prop="labelName"></el-table-column>
                  <el-table-column align="center" label="标签颜色" min-width="120" prop="colour">
                     <template slot-scope="scope">
                        <span :style="{'color':scope.row.colour===''?'':scope.row.colour}">{{scope.row.colour===''?'--':scope.row.colour}}</span>
                     </template>
                  </el-table-column>
                  <el-table-column align="center" fixed="right" label="操作" min-width="80">
                     <template slot-scope="scope">
                        <el-button v-has="'/xiansuo-biaoqian/get-edit-look'" @click="editTable(scope.row)" size="small" style="color: dodgerblue;"
                                   type="text">
                           编辑
                        </el-button>
                        <el-button v-has="'/xiansuo-biaoqian/get-del-look'" @click="deleteList(scope.row)" size="small" style="color: red;" type="text">
                           删除
                        </el-button>
                     </template>
                  </el-table-column>
               </el-table>
            </div>
         </article>
      </div>

      <!-- 树状图 添加&编辑 -->
      <el-dialog :close-on-click-modal="false" :title="titleTree" :visible.sync="treeFormVisible" @close="closeDialog" width="30%">
         <el-form :model="treeForm" :rules="rulesTree" class="from_input" label-position="right"
                  label-width="80px" ref="treeForm">
            <el-form-item label="标签分类" prop="tagName" v-if="!color_show">
               <el-input auto-complete="off" placeholder="请输入标签分类" size="small"
                         v-model="treeForm.tagName"></el-input>
            </el-form-item>
            <el-form-item label="标签内容" prop="tagName" v-if="color_show">
               <el-input auto-complete="off" placeholder="请输入标签内容" size="small"
                         v-model="treeForm.tagName"></el-input>
            </el-form-item>
            <el-form-item label="标签颜色" v-if="color_show">
               <el-color-picker v-model="treeForm.color"></el-color-picker>
            </el-form-item>
         </el-form>
         <div class="dialog-footer" slot="footer">
            <el-button @click="treeFormVisible=false" size="small">取消</el-button>
            <el-button :loading="loading" @click="submitFormTree" class="title" size="small" type="primary">保存
            </el-button>
         </div>
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
        depListOptionss: [],
        //筛选
        valueType: 0,
        searchUInput: null,
        /* 树状图按钮显示隐藏 */
        titleshow: false,
        tdkshow: false,
        addshow: true,
        delshow: false,
        color_show: false,
        /* 页面 */
        pageTitle: "",
        /* 列表 */
        listProps: {
          value: "depId",
          label: "name",
          children: "children",
        },
        tempListData: {},
        isListAddOrEdit: 1,
        tableList: [],
        depList: [],
        depListOptions: [], //级联部门列表
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
        },

        /*树状图*/
        list: [],
        tempData: {labelId: null},
        tempData1: {},
        isAddOrEditorTree: 1,
        titleTree: "添加标签分类",
        treeFormVisible: false,
        treeForm: {
          tagName: "",
          color: '#409EFF'
        },
        rulesTree: {
          tagName: [{required: true, message: "请输入标签分类", trigger: "blur"}],
        },
        listshow: false
      };
    },
    async mounted() {
      this.getPower();
      await this.get_biaoqian_list()
      this.tempData = this.treeList[0]
      this.getTableList(this.tempData.labelId)
    },
    methods: {
      getPower() {
        this.listshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-biaoqian/get-list-look");/*列表*/
        this.titleshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-biaoqian/get-add-look");/*添加一级*/
        this.tdkshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-biaoqian/get-edit-look");/*编辑一级*/
        this.delshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-biaoqian/get-del-look");/*删除一级*/
      },
      //编辑表格
      editTable(row) {
        this.tempData1 = row;
        this.isAddOrEditorTree = 2;
        this.treeFormVisible = true;
        this.titleTree = "编辑标签内容";
        this.treeForm.tagName = row.labelName;
        this.color_show = true
        this.treeForm.color = row.colour;
      },
      //提交
      submitFormTree() {
        this.$refs.treeForm.validate((val) => {
          if (val) {
            if (this.isAddOrEditorTree == 1) {
              let _data = {}
              if (this.color_show) {
                //添加内容
                console.log(this.tempData);
                _data = {
                  parentId: parseInt(this.tempData.labelId),
                  labelName: this.treeForm.tagName,
                  colour: this.treeForm.color
                }
              } else {
                //添加标签
                _data = {
                  labelName: this.treeForm.tagName,
                }
              }
              this.addOrgList(_data);
            } else {
              let _data = {}
              if (!this.color_show) {
                //编辑一级标签
                _data = {
                  id: this.tempData.id,
                  labelName: this.treeForm.tagName,
                };
              } else {
                //编辑标签内容
                _data = {
                  id: this.tempData1.id,
                  parentId: parseInt(this.tempData.labelId),
                  labelName: this.treeForm.tagName,
                  colour: this.treeForm.color
                }
              }
              this.updOrgList(_data);
            }
          } else {
            this.showMessage("error", "输入内容不能为空");
          }
        });
      },
      //删除表格标签
      deleteList(row) {
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
      //添加标签内容
      add() {
        this.isAddOrEditorTree = 1;
        this.treeFormVisible = true;
        this.titleTree = "添加标签内容";
        this.treeForm.tagName = '';
        this.color_show = true
        this.treeForm.color = '#409EFF';
      },
      //添加标签分类
      addTop() {
        this.isAddOrEditorTree = 1;
        this.titleTree = "添加标签分类";
        // this.tempData = {}
        this.treeForm.tagName = "";
        this.color_show = false
        this.treeFormVisible = true;
      },
      //添加一级标签接口
      async addOrgList(data) {
        let _resp = await this.Axios.post(`leads-api/labellist/addLabel`, data);
        if (_resp.data.code == 0) {
          this.showMessage("success", "添加成功");
          this.treeFormVisible = false;
          this.get_biaoqian_list();
          this.getTableList(this.tempData.labelId)
        } else {
          this.showMessage("error", _resp.data.message);
        }
      },

      //点击节点
      async nodeClick(s, d, n) {
        this.tempData = d
        this.getTableList(d.labelId)
      },
      async getTableList(labelId) {
        let res = await this.Axios.get(`leads-api/labellist/queryByParentId?parentId=${labelId}`)
        if (res.data.code === 0) {
          this.tableList = res.data.result
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
      startEditor() {
      },
      startTdk(s, d, n) {
        this.tempData = d;
        this.isAddOrEditorTree = 2;
        this.treeFormVisible = true;
        this.titleTree = "编辑标签";
        this.treeForm.tagName = d.name;
        this.color_show = false
      },
      //修改标签分类
      async updOrgList(data) {
        let _resp = await this.Axios.post(`/leads-api/labellist/updateById`, data);
        if (_resp.data.code == 0) {
          this.showMessage("success", "修改成功");
          this.get_biaoqian_list();
          this.getTableList(this.tempData.labelId)
        } else {
          this.showMessage("error", _resp.data.message);
        }
        this.closeDialog();
      },
      //删除标签
      async delOrgList(id) {
        let _resp = await this.Axios.get(`/leads-api/labellist/deleteById?id=${id}`);
        if (_resp.data.code == 0) {
          this.showMessage("success", "删除成功");
          this.get_biaoqian_list();
          this.getTableList(this.treeList[0].labelId)
        } else {
          this.showMessage("error", _resp.data.message);
        }
      },
      // ==== 数据处理
      dataAssembly(data) {
        let _data = JSON.parse(JSON.stringify(data)); //深拷贝
        function change(data) {
          Object.keys(data).forEach((val) => {
            Object.assign(data, {isFirst: false, isEdit: false});
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
      //关闭对话框
      closeDialog() {
        this.treeFormVisible = false;
        if (this.$refs.treeForm) this.$refs.treeForm.resetFields();
        this.treeForm.tagName = "";
        this.treeForm.color = "#409EFF";
      },

      row_key(row) {
        return row.id;
      },
      cellStyle({row, column, rowIndex, columnIndex}) {
        return "text-align:center"
      },
    },
  };
</script>
<style scoped>
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
   }

   /deep/ .el-dialog__body {
      padding: 1px 20px !important;
   }
</style>
