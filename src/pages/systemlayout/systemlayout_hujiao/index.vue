<template>
   <div class="uesr_org">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item>线索系统</el-breadcrumb-item>
         <el-breadcrumb-item>呼叫配置</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="top_line"></div>
      <div class="uesr_org_content">
         <article class="uesr_org_content_left">
            <tree showlength="true" :list="list" @nodeClick="nodeClick"></tree>
         </article>
         <article class="uesr_org_content_right">
            <div class="org_button"></div>
            <div style="display: flex;flex: 1;flex-direction: column">
               <div class="org_table">
                  <el-table :cell-style="cellStyle" :data="tableList" :header-cell-style="table_heard_style" :row-key="row_key" stripe style="width: 100%">
                     <el-table-column align="center" label="姓名" min-width="90" prop="realName"></el-table-column>
                     <el-table-column align="center" label="电话" min-width="100" prop="telephone"></el-table-column>
                     <el-table-column align="center" label="工号" min-width="100" prop="number"></el-table-column>
                     <el-table-column align="center" label="企业邮箱" min-width="120" prop="email"></el-table-column>
                     <el-table-column align="center" label="部门" min-width="120" prop="depName"></el-table-column>
                     <el-table-column align="center" label="角色" min-width="140" prop="role">
                        <template slot-scope="scope">
                           <span :key="index" v-for="(item, index) in scope.row.role">{{ item.roleName }} </span>
                        </template>
                     </el-table-column>
                     <el-table-column align="center" label="职位状态" min-width="80" prop="status">
                        <template slot-scope="scope">
                           <b v-if="scope.row.status == 0">在职</b>
                           <b v-else>离职</b>
                        </template>
                     </el-table-column>
                     <el-table-column align="center" fixed="right" label="操作" min-width="80">
                        <template slot-scope="scope">
                           <el-switch @change="no_off($event,scope.row)" :disabled="!switchStatus"
                                      active-color="#13ce66"
                                      inactive-color="#ff4949"
                                      v-model="scope.row.ecStatus">
                           </el-switch>
                        </template>
                     </el-table-column>
                  </el-table>
               </div>
               <!--分页器-->
               <div class="pagination_clumun">
                  <el-pagination
                   :current-page="selectPages"
                   :page-size="pageListSize"
                   :page-sizes="[10, 20, 30]"
                   :total="totleList" @next-click="selectPages" @prev-click="selectPages"
                   @current-change="selectPages"
                   @size-change="handleSizeChange"
                   layout="total, sizes, prev, pager, next, jumper"
                  >
                  </el-pagination>
               </div>
            </div>

         </article>
      </div>

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
        switch_status: true,
        //筛选
        valueType: 0,
        searchUInput: null,
        /* 树状图按钮显示隐藏 */
        listshow: true,
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
        titleTree: "添加组织名称",
        treeFormVisible: false,
        treeForm: {
          compName: "",
        },
        rulesTree: {
          compName: [{required: true, message: "请输入单位名称", trigger: "blur"}],
        },
        switchStatus:false,
      };
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
      this.getOrgList();
      this.getPower();
    },
    beforeCreate() {
    },
    updated() {
    },
    beforeDestroy() {
    },
    methods: {
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
        this.listshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-hujiao/get-status-look");/*查看列表*/
        this.switchStatus = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-hujiao/get-statusbtn-look");/*禁用启用*/
      },

      //分页
      selectPages(val) {
        this.pageList = parseInt(val - 1);
        this.getPerList();
      },
      handleSizeChange(val) {
        this.pageListSize = val;
        this.getPerList();
      },
      //禁用启用
      async no_off(val, row) {
        if (val) {
          row.ecStatus = 1
        } else {
          row.ecStatus = 0
        }
        try {
          let res = await this.Axios.get(`leads-api/userconfig/update?userId=${row.userId}&ecStatus=${row.ecStatus}`);
          this.showMessage("success", "修改成功")
          this.getPerList();
        }catch (error) {
          this.getPerList();
        }
      },
      //级联部门列表
      tableListChange(data) {
        //console.log(this.editForm.depList);
      },
      //点击节点
      nodeClick(s, d, n) {
        this.depId = d.depId;
        this.pageList = 0;
        this.getPerList();
        this.pageTitle = this.dataAssembly5(this.list, d.depId).join("--");
      },
      //获取组织列表
      async getOrgList() {
        let _resp = await this.Axios.get(`ucenter-api/departmentlist/tree`);
        this.depId = _resp.data.result[0].depId;
        this.pageTitle = _resp.data.result[0].name;
        this.list = [this.dataAssembly(_resp.data.result[0])];
        this.getPerList();
      },
      //表格列表
      async getPerList() {
        let resp = await this.Axios.get(`leads-api/userconfig/queryConfig?deptId=${this.depId}&pageNum=${this.pageList}&pageSize=${this.pageListSize}`);
        if (resp.data.code === 0) {
          this.tableList = resp.data.result;
          this.tableList.forEach(val => {
            val.ecStatus === 1 ? val.ecStatus = true : val.ecStatus = false
          })
          this.totleList = resp.data.total;
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
   .el-table__body-wrapper::-webkit-scrollbar {
     width: 0;
   }
      /deep/ .el-table .cell {
         line-height: 15px !important;
         padding: 0 5px !important;
      }
      .org_table {
         flex: 1;
         height: auto;
      }
      .pagination_clumun {
         margin-bottom: 20px;
         box-sizing: border-box;
         width: 100%;
         background: #ffffff;
         align-items: center;
         display: flex;
         justify-content: flex-end;

      }
      .pagination_clumun span {
         font-size: 13px;
         font-weight: 400;
         color: #606266;
      }
</style>
