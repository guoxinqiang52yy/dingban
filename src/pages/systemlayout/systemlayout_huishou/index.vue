<template>
  <div class="uesr_org">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>线索系统</el-breadcrumb-item>
      <el-breadcrumb-item>回收配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="uesr_org_content">
      <article class="uesr_org_content_left">
        <tree showlength="true" :list="list" @nodeClick="nodeClick"></tree>
      </article>
      <article class="uesr_org_content_right">
        <div class="org_button">
          <div class="right">
            <!--<el-button type="primary" size="small" @click.prevent="guize_button">回收规则</el-button>-->
          </div>
        </div>

        <div class="org_table">
          <el-table
            :cell-style="cellStyle"
            :data="tableList"
            :header-cell-style="table_heard_style"
            :row-key="row_key"
            stripe
            style="width: 100%"
          >
            <el-table-column align="center" label="回收范围" prop="scopeName" width="80"></el-table-column>
            <el-table-column align="center" label="回收规则" min-width="100" prop="callNumber,visitNumber,followNumber">
              <template slot-scope="scope">
                <span class="tabe_input"
                  >跟进记录
                  <el-input @input="scope.row.followNumber=scope.row.followNumber.replace(/^(0+)|[^\d]+/g, '')"
                    size="small"
                    style="width: 15%;"
                    clearable
                    v-model="scope.row.followNumber"
                  ></el-input>
                  次
                </span>
                <!-- <span class="tabe_input">拜访记录
                                    <el-input auto-complete="off" size="small" style="width: 15%;" type="number" clearable
                                              v-model="scope.row.visitNumber"></el-input>
                                次 </span> -->
                <span class="tabe_input"
                  >通话记录
                  <el-input @input="scope.row.callNumber=scope.row.callNumber.replace(/^(0+)|[^\d]+/g, '')"
                    size="small"
                    style="width: 15%;"
                    clearable
                    v-model="scope.row.callNumber"
                  ></el-input>
                  次
                </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="回收时间" min-width="100" prop="recoveryTime">
              <template slot-scope="scope">
                <span class="tabe_input"
                  >超过
                  <el-input @input="scope.row.recoveryTime=scope.row.recoveryTime.replace(/^(0+)|[^\d]+/g, '')"
                    size="small"
                    style="width: 15%;"
                    clearable
                    v-model="scope.row.recoveryTime"
                  ></el-input>
                  天,未完成以上两个条件,自动回收</span
                >
              </template>
            </el-table-column>
            <el-table-column align="center" label="回收目的地" min-width="80" prop="destination">
              <template slot-scope="scope">
                <el-cascader
                  :options="depListOptionss"
                  :props="listProps"
                  :show-all-levels="false"
                  clearable
                  ref="cascader"
                  style="width: 50%;"
                  clearable
                  v-model="scope.row.destination"
                >
                </el-cascader>
              </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="110">
              <template slot-scope="scope">
                <el-button @click="table_submit(scope.row)" size="small" type="text" v-has="'/xiansuo-huishou/get-add-look'">保存</el-button>
                <el-button @click="deleteList(scope.row)" size="small" v-has="'/xiansuo-huishou/get-add-look'" style="color: red;" type="text">
                  清空
                </el-button>
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
  name: "index",
  components: {tree},
  mixins: [myMixin],
  props: [],
  data() {
    return {
      listshow:false,
      depListOptionss: [],
      //筛选
      valueType: 0,
      searchUInput: null,
      /* 树状图按钮显示隐藏 */
      tdkshow: true,
      addshow: true,
      editshow: false,
      delshow: true,
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
      /*树状图*/
      list: [],
      tempData: {},
      isAddOrEditorTree: 1,
      titleTree: "添加组织名称",
      treeFormVisible: false,
    };
  },
  async mounted() {
    await this.getOrgList();
    this.getPerList();
    this.getPower();
  },
  methods: {
    getPower() {
      this.listshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-huishou/get-list-look");
      // this.addshow = this.verification(this.$store.state.selectBtnJurisdiction, "/user/org-btn-add");
      // this.editshow = false;
      // this.delshow = this.verification(this.$store.state.selectBtnJurisdiction, "/user/org-btn-delete");
    },
    //点击节点
    nodeClick(s, d, n) {
      this.depId = d.depId;
      this.getPerList();
    },
    //表格列表
    async getPerList() {
      let resp = await this.Axios.get(`leads-api/recoverystrategy/queryByDeptId?deptId=${this.depId}`);
      if (resp.data.code === 0) {
        this.tableList = resp.data.result;
        this.tableList.forEach(val=>{
          if (val.destination !== 0){
            let arrs = [];
            arrs = this.changeDetSelect(val.destination, this.depListOptionss);
            console.log(arrs);
            console.log(this.depListOptionss);
            val.destination = arrs
          }
        })
      }
    },
    //级联下拉回显(多级)
    changeDetSelect(key, treeData) {
      let arr = []; // 在递归时操作的数组
      let returnArr = []; // 存放结果的数组
      let depth = 0; // 定义全局层级
      // 定义递归函数
      function childrenEach(childrenData, depthN) {
        for(var j = 0; j < childrenData.length; j++) {
          depth = depthN; // 将执行的层级赋值 到 全局层级
          arr[depthN] = childrenData[j].depId;
          if (childrenData[j].depId == key) {
            returnArr = arr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
            break;
          } else {
            if (childrenData[j].children) {
              depth++;
              childrenEach(childrenData[j].children, depth);
            }
          }
        }
        return returnArr;
      }

      return childrenEach(treeData, depth);
    },
    //获取组织列表
    async getOrgList() {
      let a = {},
        arr = {};
      let _resp = await this.Axios.get(`ucenter-api/departmentlist/tree`);
      this.depId = _resp.data.result[0].depId;
      a = {
        depId: "0",
        name: "公海库",
        children: [],
      };
      arr = JSON.parse(JSON.stringify(_resp.data.result));
      this.depListOptionss = [...arr];
      this.depListOptionss.push(a);
      this.data_(this.depListOptionss);
      this.list = [this.dataAssembly(_resp.data.result[0])];
    },
    //保存
    async table_submit(row) {
      let destinations = [];
      if (!this.isobjEmpty(row.destination)) {
        destinations = row.destination;
      }
      let data = {
        scope: row.scopeId,
        scopeType: row.scopeType,
        destination: destinations[0] === "0" ? 0 : destinations[destinations.length - 1],
        destinationType: destinations[0] === "0" ? 0 : 1,
        followNumber: row.followNumber,
        visitNumber: row.visitNumber,
        callNumber: row.callNumber,
        recoveryTime: row.recoveryTime,
      };
      this.removeNullItem(data);
      if (this.isobjEmpty(data.destination)) {
        this.showMessage("info", "回收目的地不能为空");
      } else if (this.isobjEmpty(data.recoveryTime)) {
        this.showMessage("info", "回收时间不能为空");
      } else if (this.isobjEmpty(data.followNumber) && this.isobjEmpty(data.visitNumber) && this.isobjEmpty(data.callNumber)) {
        this.showMessage("info", "回收规则至少填写一项");
      } else {
        let res = await this.Axios.post("leads-api/recoverystrategy/updateRecovery", data, "postJson");
        if (res.data.code === 0) {
          this.showMessage("success", "保存成功");
          this.getPerList();
        }
      }
    },
    //清空
    deleteList(row) {
      this.$confirm("确认清空吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delete(row.id);
        })
        .catch(() => {
          this.showMessage("info", "已取消操作");
        });
    },
    //删除
    async delete(id) {
      let res = await this.Axios.get(`leads-api/recoverystrategy/deleteById?id=${id}`);
      if (res.data.code === 0) {
        this.showMessage("success", "清空成功");
        this.getPerList();
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
  },
};
</script>
<style scoped lang="less">
@import url("./index.css");
/deep/ .el-dialog__wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  .el-dialog{
    margin-top: 0 !important;
  }
}
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
  /*overflow-x: auto;*/
}

.tabe_input {
  /deep/ .el-input__inner {
    padding: 0 5px;
    width: 100%;
  }
}
</style>
