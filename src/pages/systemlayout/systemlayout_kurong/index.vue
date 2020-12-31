<template>
   <div class="uesr_org">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
         <el-breadcrumb-item>线索系统</el-breadcrumb-item>
         <el-breadcrumb-item>库容配置</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="top_line"></div>
      <div class="uesr_org_content">
         <article class="uesr_org_content_left">
            <tree showlength="true" :list="list" @nodeClick="nodeClick"></tree>
         </article>
         <article class="uesr_org_content_right">
            <div class="org_table">
               <el-table :cell-style="cellStyle" :data="tableList" :header-cell-style="table_heard_style" :row-key="row_key"
                         border
                         max-height="650" stripe
                         style="width: 100%">
                  <el-table-column align="center" label="上限设定范围" min-width="90"
                                   prop="scopeName"></el-table-column>
                  <el-table-column align="center" label="上限详情" min-width="100" prop="limitNum">
                     <template slot-scope="scope">
                        私有库上限
                        <el-input :disabled="!addsshow" @change="table_input($event,scope.row)" class="require_des"
                                  style="width: 10%;" clearable @input="scope.row.limitNum=scope.row.limitNum.replace(/^(0+)|[^\d]+/g, '')"
                                  v-model="scope.row.limitNum"></el-input>
                        条
                     </template>
                  </el-table-column>
               </el-table>
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
        /* 树状图按钮显示隐藏 */
        listshow: false,
        addshow: true,
        editshow: false,
        delshow: true,
        /* 页面 */
        /* 列表 */
        listProps: {
          value: "depId",
          label: "name",
          children: "children",
        },
        tempListData: {},
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
        addsshow:false,
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
      getPower() {
        this.listshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-kurong/get-list-look");
        this.addsshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-kurong/get-add-look");
        // this.editshow = false;
        // this.delshow = this.verification(this.$store.state.selectBtnJurisdiction, "/user/org-btn-delete");
      },
      //失焦保存
      async table_input(val, row) {
        console.log(val);
        if (val === ""){
          val = -1
        }
        let data = {
          limitNum: parseInt(val),
          scopeId: parseInt(row.scopeId),
          scopeType: row.scopeType
        }
        let res = await this.Axios.post(`leads-api/userlimit/updateLimit`, data)
        if (res.data.code === 0) {
          this.showMessage("success", "保存成功")
          this.get_list_table(this.depId)
        }
      },

      //点击节点
      nodeClick(s, d, n) {
        this.depId = d.depId;
        this.get_list_table(this.depId);
      },
      //获取表格数据
      async get_list_table(deptId) {
        let res = await this.Axios.get(`leads-api/userlimit/queryByDeptId?deptId=${deptId}`)
        if (res.data.code === 0) {
          this.tableList = res.data.result
        }
      },
      //获取组织列表
      async getOrgList() {
        let _resp = await this.Axios.get(`ucenter-api/departmentlist/tree`);
        if (_resp.data.code === 0) {
          this.depId = _resp.data.result[0].depId;
          this.list = [this.dataAssembly(_resp.data.result[0])];
          this.get_list_table(this.depId)
        }
      },
      //数据处理
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

   .org_table {
      flex: 1;
      height: auto;
   }
</style>
