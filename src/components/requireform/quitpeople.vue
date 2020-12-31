<template>
  <div class="talentformbox">
    <div class="require">
      <el-dialog
        title="人才清退列表"
        :visible.sync="quitdialogshow"
        width="1441px"
        class="requiredialog"
        :close-on-click-modal="false"
        @close="cancelquiredialog"
      >
       <!-- <el-checkbox v-model="checked">备选项</el-checkbox> -->
        <div class="requirebox flexone">
          <div style="width: 100%">
            <el-table
              :data="quittableData"
              border
              style="width: 100%"
              max-height="450"
              class="requirelist"
            >
              <!-- <el-table-column
                prop="secondPartyName"
                label="合同所属"
                width="80"
              >
              </el-table-column> -->
              <el-table-column prop="postName" label="岗位" width="80">
              </el-table-column>
              <el-table-column prop="levelName" label="等级" width="50">
              </el-table-column>
              <el-table-column prop="professionalName" label="专业" width="80">
              </el-table-column>
              <el-table-column label="证书状况" width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row.registerStatus == 1">初始注册</div>
                  <div v-if="scope.row.registerStatus == 2">变更注册</div>
                  <div v-if="scope.row.registerStatus == 3">重新注册</div>
                  <div v-if="scope.row.registerStatus == 4">延续注册</div>
                </template>
              </el-table-column>
              <el-table-column label="发证年限" width="80">
                <template slot-scope="scope">
                  {{scope.row.ageLimit}}年
                </template>
              </el-table-column>
               <el-table-column prop="address" label="B本情况" width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row.hasB == 0">无</div>
                  <div v-if="scope.row.hasB == 1">有</div>
                </template>
              </el-table-column>
              <el-table-column prop="zip" label="社保情况" width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row.socialStatus == 1">临时</div>
                  <div v-if="scope.row.socialStatus == 2">唯一</div>
                  <div v-if="scope.row.socialStatus == 3">不变</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="staffOrgPrice"
                label="参考价(元)"
                width="90"
              >
              </el-table-column>
              <el-table-column prop="staffPrice" label="单价(元)" width="80">
              </el-table-column>
              <el-table-column label="聘用类型" width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row.cycleType == 1">次数</div>
                  <div v-if="scope.row.cycleType == 2">时间</div>
                </template>
              </el-table-column>
                <el-table-column label="聘用周期" width="80">
                <template slot-scope="scope">
                  {{scope.row.cycleValue}}个月
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="合同备注" width="90" :show-overflow-tooltip="true">
                <!-- <template>
                  <div style="height: 27px; line-height: 27px">备注</div>
                </template> -->
              </el-table-column>
              <el-table-column prop="talentsName" label="姓名" width="70">
              </el-table-column>
              <el-table-column
                prop="talentsPrice"
                label="成本价(元)"
                width="90"
              >
              </el-table-column>
              <el-table-column prop="talentsRemark" label="人才备注" width="90" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="province" label="状态" width="70">
                <template slot-scope="scope">
                  <div v-if="scope.row.status == 30">未清退</div>
                  <div v-if="scope.row.status == 40">已清退</div>
                </template>
              </el-table-column>
                 <el-table-column prop="remark" label="是否共用" width="80" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                 {{scope.row.flowId==1?'是':"否"}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="50">
                <template slot-scope="scope">
                <!-- <el-checkbox v-model="scope.row.checked"></el-checkbox> -->
                    <!-- <el-checkbox v-model="scope.row.checked">备选项</el-checkbox> -->
                   <el-checkbox v-model="scope.row.checked" :disabled="scope.row.disabled"
                    @change="selectlist(scope.$index, scope.row)"></el-checkbox> 
               
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="padding-top: 0">
          <el-button @click="cancelquiredialog" size="small">取 消</el-button>
          <el-button type="primary" @click="submittalent" :disabled="isshow" size="small"
            >弹出</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: ["quittableData", "quitdialogshow"],
  data() {
    return {
      isshow: true,
      arr: [],
      
     
     
    };
  },
  methods: {
    cancelquiredialog() {
      this.quitdialogshow = false;
      this.$emit("ishowwrap", false);
    },
 
    // 选择多选框
    selectlist(index, row) {
      console.log(index, row,'哈哈哈哈哈哈哈');
      // this.quittableData[index].sel = !this.quittableData[index].sel;
      // console.log(this.quittableData[index].sel);
      if (this.quittableData[index].checked == true) {
        this.arr.push(this.quittableData[index]);
      } else {
        this.arr.forEach((value, index, array) => {
          if (value.id == this.quittableData[index].id) {
            this.arr.splice(index, 1);
            this.arr = this.arr;
          }
        });
      }
      console.log(this.arr);
      if (this.arr.length != 0) {
        this.isshow = false;
      } else {
        this.isshow = true;
      }
    },

    async submittalent() {
      let newarr = this.arr;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      newarr.forEach((value, index, array) => {
        delete value["addTime"];
        delete value["updateTime"];
        delete value["sel"];
        delete value["talentsName"];
        delete value["talentsPrice"];
        delete value["talentsRemark"];
        delete value["firstPartyId"];
        delete value["firstPartyName"];
        delete value["secondPartyId"];
        delete value["secondPartyName"];
         delete value["checked"];
        value.status = 40;
      });
      this.arr = newarr;

      let param = {
        requireTalentList: this.arr,
      };
      let res = await this.Axios.post(
        `talents-api/requirelist/talentClearSubmit`,
        param,
        'postJson'
      );
      if (res.data.code == 0) {
        this.$message({
          message: "提交成功",
          type: "success",
        });
        this.quitdialogshow = false;
        loading.close();
      }else{
         loading.close()
      }
    },
  },
};
</script>

<style>
</style>