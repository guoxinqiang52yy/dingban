<template>
  <div class="systemlayoutbox">
    <div class="navbar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>依赖配置</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="top_line"></div>
    </div>
    <div class="nodepagek">
      <div class="examinerightk replaypagelist">
        <!-- <div class="servicename">依赖配置</div> -->
        <div class="addreplay">
          <div class="addreplaybtn" @click="addreplay">添加依赖</div>
        </div>
        <el-table :data="tableData" style="width: 100%" class="numberbox replaytable">
          <el-table-column label="序号" width="180">
            <template slot-scope="scope">
              <div class="number">  {{ scope.$index + 1 }}</div>
            
            </template>
          </el-table-column>
          <el-table-column prop="group1Name" label="依赖分组" width="480">
          </el-table-column>
          <el-table-column prop="group2Name" label="被依赖分组" width="450">
          </el-table-column>
          <el-table-column width="220" prop="address" label="操作">
            <template slot-scope="scope">
              <div
                class="delbtn"
                @click="deletereplay(scope.$index, scope.row)"
              >
                删除
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- <el-pagination
        v-if="totalsize!=0"
        class="pagelist"
        @size-change="changesize"
        @current-change="changecurrent"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40,50]"
         :page-size="10"
        layout="total,sizes, prev, pager, next, jumper"
        :total="totalsize"
      >
      </el-pagination> -->
      </div>
    </div>

    <!-- 添加审批人 -->
    <el-dialog
      title="添加依赖分组"
      width="450px"
      :visible.sync="relayVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="replayruleForm"
        :rules="replayrules"
        ref="replayruleForm"
        label-width="130px"
      >
        <el-form-item label="依赖分组" prop="replay">
          <el-select
            v-model="replayruleForm.replay"
            placeholder="请选依赖分组"
            size="small"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in grouplist"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="被依赖分组" prop="bereplay">
          <el-select
            v-model="replayruleForm.bereplay"
            placeholder="请选择被依赖分组"
            size="small"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in grouplist"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <div class="actfooter">
          <el-button
            type="primary"
            @click="onSubmitreplay('replayruleForm')"
            size="small"
            >确定</el-button
          >
          <el-button size="small" @click="cancelreplayvisiable">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import tree from "../../../components/tree/tree";
export default {
  components: { tree },
  data() {
    return {
      tableData: [],
      relayVisible: false,
      replayruleForm: {
        replay: "",
        bereplay: "",
      },
      replayrules: {
        replay: [
          { required: true, message: "请选依赖分组", trigger: "change" },
        ],
        bereplay: [
          { required: true, message: "请选被依赖分组", trigger: "change" },
        ],
      },
      grouplist: [], //分组列表
      areaId: "",
      pageNum:0,
      pageSize:10,
      currentPage4:1,
      totalsize:0
    };
  },
  created() {
    // 获取分组依赖的列表
    this.getreplay();
    // 获取分组
    this.getgrouplist();
    // 获取areaid
    let userMessage = JSON.parse(sessionStorage.getItem("userMessage"));
    this.areaId = userMessage.areaId;
  },
  methods: {
    // 获取分组
    async getgrouplist() {
      let res = await this.Axios.get(`workflow-api/grouplist/list`);
      let data = res.data.result;
      data.forEach((value) => {
        let obj = {
          value: value.groupId,
          label: value.groupName,
        };
        this.grouplist.push(obj);
      });
    },
    // 添加依赖
    addreplay() {
      this.relayVisible = true;
      this.replayruleForm.replay='';
      this.replayruleForm.bereplay='';
    },
    // 确定提交依赖
    onSubmitreplay(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.replayruleForm.replay == this.replayruleForm.bereplay) {
            this.$message({
              message: "依赖分组和被依赖分组不能一样",
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
          let param = {
            cityId: this.areaId,
            group1: this.replayruleForm.replay,
            group2: this.replayruleForm.bereplay,
          };

          that.Axios.post(
            `workflow-api/dependencyconfig/add`,
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
                that.relayVisible = false;
                loading.close();
                this.getreplay();
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
    // 获取分组依赖列表
    async getreplay() {
      // let param={
      //   pageNum:this.pageNum,
      //   pageSize:this.pageSize
      // }
      let res = await this.Axios.get(`workflow-api/dependencyconfig/list`);
      this.tableData = res.data.result;
      // this.totalsize=res.data.total
    },

    cancelreplayvisiable() {
      this.relayVisible = false;
    },
     // 改变页数
    changecurrent(val) {
      this.pageNum = val - 1;
      console.log(this.page);
      this.currentPage4 = val;
      this.getreplay();
    },
     // 列表显示多少条
    changesize(e){
      this.pageSize=e;
      this.getreplay()
    },
    // ==== 数据处理
    dataAssembly(data) {
      let _data = Object.assign([], data);
      _data.forEach((data) => {
        Object.assign(data, {
          name: data.roleName,
          isFirst: false,
          isEdit: false,
        });
        delete data.roleName;
      });
      return _data;
    },

    deletereplay(index,row) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.suredeletereplay(index,row.id);
        })
        .catch(() => {});
    },
    async suredeletereplay(index,id){
         let res = await this.Axios.get(`workflow-api/dependencyconfig/delete?id=${id}`);
         if(res.data.code==0){
           this.$message({
                  message: "删除成功",
                  type: "success",
                });
          this.tableData.splice(index,1);
          this.tableData=this.tableData;
          if(this.tableData.length==0){
            this.totalsize=0
          }
          this.$forceUpdate()
         }
    },
  },
};
</script>

<style scoped>
@import url("./index.css");
@import url("../../../assets/css/base.css");
</style>