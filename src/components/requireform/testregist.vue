<template>
  <div class="operatepeople">
    <el-dialog
      title="考办证服务列表"
      :visible.sync="testregistdialogshow"
      width="1351px"
       :close-on-click-modal="false"
      @close="canceltestdialog"
    >
      <!-- <div class="selfpeople">企业自有人员列表</div> -->
      <el-form>
        <el-table
          class="selpeoplelist"
          :data="testtableData"
          border
          style="width: 100%"
        >
          <el-table-column label="类型" width="70">
            <template slot-scope="scope">
              <div v-if="scope.row.staffType == 1">有证</div>
              <div v-if="scope.row.staffType == 2">考证</div>
              <div v-if="scope.row.staffType == 3">办证</div>
            </template>
          </el-table-column>
          <el-table-column prop="postName" label="岗位" width="80">
          </el-table-column>
          <el-table-column prop="levelName" label="等级" width="80">
          </el-table-column>
          <el-table-column prop="professionalName" label="专业" width="80">
          </el-table-column>
          <el-table-column prop="professionalName" label="证书状况" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.registerStatus == 1">初始注册</div>
              <div v-if="scope.row.registerStatus == 2">变更注册</div>
              <div v-if="scope.row.registerStatus == 3">重新注册</div>
              <div v-if="scope.row.registerStatus == 4">延续注册</div>
            </template>
          </el-table-column>
          <el-table-column prop="professionalName" label="B本情况" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.hasB == 0">无</div>
              <div v-if="scope.row.hasB == 1">有</div>
            </template>
          </el-table-column>
          <el-table-column prop="ageLimit" label="发证年限（年）" width="120">
          </el-table-column>

          <el-table-column prop="socialstate" label="社保情况" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.social == 0">无</div>
              <div v-if="scope.row.social == 1">有</div>
            </template>
          </el-table-column>
          <el-table-column prop="staffCount" label="人数" width="60">
          </el-table-column>
          <el-table-column
            prop="staffOrgPrice"
            label="参考价（元）"
            width="110"
          >
          </el-table-column>
          <el-table-column prop="staffPrice" label="单价（元）" width="100">
          </el-table-column>
          <el-table-column prop="totalprice" label="总价（元）" width="100">
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="180" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="operate" label="操作" width="90">
            <template slot-scope="scope">
              <!--  @click="handleEdit(scope.$index, scope.row)" -->
              <el-select
              class="nonei"
              size="small"
                v-model="scope.row.statusname"
                placeholder="未完成"
                @change="testpersonselect(scope.$index, scope.row)"
              >
                <el-option label="未完成" value="未完成"></el-option>
                <el-option label="已完成" value="已完成"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canceltestdialog">取 消</el-button>
        <el-button type="primary" @click="saverequire" size="small">保存</el-button>
        <el-button type="primary" @click="surerequire" :disabled="istest" size="small"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["testregistdialogshow", "testtableData", "istest"],
  data() {
    return {};
  },
  methods: {
    canceltestdialog() {
      this.testregistdialogshow = false;
      this.$emit("ishowwrap", false);
    },
    //选择人才需求单
    testpersonselect(index, row) {
      console.log(index, row);
      if (row.statusname == "未完成") {
        this.testtableData[index].status = 22;
        this.$emit("istestshow", true);
      } else if (row.statusname == "已完成") {
        this.testtableData[index].status = 21;
        this.$emit("istestshow", false);
        this.testtableData.forEach((value,index,array)=>{
          if(value.status==11||value.status==22){
           this.$emit("istestshow", true);
          }
        })
      }
      this.testtableData = this.testtableData;
    },
    // 保存和提交
    async saverequire() {
      let newtesttableData = this.testtableData;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      newtesttableData.forEach((value, index, array) => {
        delete value["addTime"];
        delete value["updateTime"];
        delete value["statusname"];
        delete value["totalprice"];
      });
      this.testtableData = newtesttableData;

      let param = {
        requireStaffList: this.testtableData,
      };
      let res = await this.Axios.post(
        `talents-api/requirelist/staffExamCertSave`,
        param,
        'postJson'
      );
      if (res.data.code == 0) {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        this.testregistdialogshow = false;
        loading.close();
      }else{
         loading.close();
      }
    },
    async surerequire() {
      let newtesttableData = this.testtableData;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      newtesttableData.forEach((value, index, array) => {
        delete value["addTime"];
        delete value["updateTime"];
        delete value["statusname"];
        delete value["totalprice"];
      });
      this.testtableData = newtesttableData;

      let param = {
        requireStaffList: this.testtableData,
      };
      let res = await this.Axios.post(
        `talents-api/requirelist/staffExamCertSubmit`,
        param,
        'postJson'
      );
      if (res.data.code == 0) {
        this.$message({
          message: "提交成功",
          type: "success",
        });
        this.testregistdialogshow = false;
        loading.close();
      }else{
        loading.close();
      }
    },
  },
};
</script>

<style>
</style>