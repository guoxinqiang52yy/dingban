<template>
  <div class="serviceformtwobox">
    <!--服务部需求单 服务部专员操作后流转到人才 状态是4 的时候 选择人才是否符合要求-->
    <div class="require">
      <el-dialog
        :title="companyname"
        :visible.sync="requiredialogshow"
        width="1391px"
        class="requiredialog"
         :close-on-click-modal="false"
         @close="cancelrequiredialog"
      >
        <div class="requirebox flexone">
          <div style="width: 100%">
            <el-table
              :data="requiretableData"
              border
              style="width: 100%"
              max-height="450"
              class="servicerequirelist"
            >
              <el-table-column prop="postName" label="岗位" width="80">
              </el-table-column>
              <el-table-column prop="levelName" label="等级" width="50">
              </el-table-column>
              <el-table-column prop="professionalName" label="专业" width="100">
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
               <el-table-column label="B本情况" width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row.hasB == 0">无</div>
                  <div v-if="scope.row.hasB == 1">有</div>
                </template>
              </el-table-column>
              <el-table-column label="社保情况" width="80">
                <template slot-scope="scope">
                  <div v-if="scope.row.socialStatus == 1">临时</div>
                  <div v-if="scope.row.socialStatus == 2">唯一</div>
                  <div v-if="scope.row.socialStatus == 3">不变</div>
                </template>
              </el-table-column>
             
              <el-table-column
                prop="staffOrgPrice"
                label="参考价(元)"
                width="100"
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
                 {{scope.row.cycleValue}}
                </template>
              </el-table-column>

              <el-table-column prop="remark" label="合同备注" width="110" :show-overflow-tooltip="true">
                <template>
                  <div style="height: 27px; line-height: 27px">备注</div>
                </template>
              </el-table-column>
              <el-table-column  label="姓名" width="80">
                <template slot-scope="scope">
                  {{scope.row.talentsName==null?'--':scope.row.talentsName}}
                </template>
              </el-table-column>

              <el-table-column
                label="人才备注"
                width="120"
                :show-overflow-tooltip="true"
              >
              <template slot-scope="scope">{{scope.row.talentsRemark==null?'--':scope.row.talentsRemark}}</template>
              </el-table-column>
              <el-table-column label="状态" width="70">
                <template slot-scope="scope">
                   <div v-if="scope.row.status == 11">--</div>
                  <div v-if="scope.row.status == 20">待审核</div>
                  <div v-if="scope.row.status == 21">已通过</div>
                  <div v-if="scope.row.status == 22">未通过</div>
                  <div v-if="scope.row.status == 30">已绑定</div>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="80">
               
                <template slot-scope="scope">
                  <el-select
                   
                    :disabled="scope.row.talentsName==null||scope.row.status==30"
                    v-model="scope.row.surename"
                    placeholder="待定"
                    class="operatesel nonei"
                    @change="selectstatus(scope.$index, scope.row)"
                   
                  >
                    <el-option
                      v-for="item in requireoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div slot="footer" class="dialog-footer" style="padding-top: 0">
          <el-button @click="cancelrequiredialog" size="small">取 消</el-button>
          <el-button type="primary" @click="saverequire"  size="small">保存</el-button>
          <el-button type="primary" @click="submitrequire"  size="small">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: ["requiretableData", "requiredialogshow", "companyname"],
  data() {
    return {
      requireoptions: [
        {
          value: "21",
          label: "确认",
        },
        {
          value: "22",
          label: "退回",
        },
        {
          value: "20",
          label: "待定",
        },
      ],
      statusvalue: "",
    };
  },
  methods: {
    // 取消弹出
    cancelrequiredialog(){
         this.$emit("ishowwrap",false)
    },
    selectstatus(index, row) {
      console.log(index, row);
      this.requiretableData[index].status = this.requiretableData[index].surename;
      this.requiretableData = this.requiretableData;
    },
    //   保存需求确认单
    async saverequire() {
       const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let newrequiretableData = this.requiretableData;
      newrequiretableData.forEach((value, index, array) => {
        value.addTime = null;
        value.updateTime = null;

        delete value["talentsName"];
        delete value["talentsPrice"];
        delete value["talentsRemark"];
        delete value["secondPartyId"];
        delete value["secondPartyName"];
        delete value["firstPartyId"];
        delete value["firstPartyName"];
         delete value["surename"];
      });
      console.log(newrequiretableData);

      let param = {
        requireTalentList: newrequiretableData,
      };
      let res = await this.Axios.post(
        `talents-api/requirelist/talentConfirmSave`,
        param,
        'postJson'
      );
      if (res.data.code == 0) {
        this.$message({
          message: "提交成功",
          type: "success",
        });
        loading.close()
        this.requiredialogshow = false;
      }else{
         loading.close()
      }
    },
    //  提交需求确认单
    async submitrequire() {
       const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let newrequiretableData = this.requiretableData;
      newrequiretableData.forEach((value, index, array) => {
        value.addTime = null;
        value.updateTime = null;

        delete value["talentsName"];
        delete value["talentsPrice"];
        delete value["talentsRemark"];
        delete value["secondPartyId"];
        delete value["secondPartyName"];
        delete value["firstPartyId"];
        delete value["firstPartyName"];
          delete value["surename"];
      });
      console.log(newrequiretableData);

      let param = {
        requireTalentList: newrequiretableData,
      };
      let res = await this.Axios.post(
        `talents-api/requirelist/talentConfirmSubmit`,
        param,
        'postJson'
      );
      if (res.data.code == 0) {
        this.$message({
          message: "提交成功",
          type: "success",
        });
        loading.close()
        this.requiredialogshow = false;
      }else{
         loading.close()
      }
    },
  },
};
</script>

<style>
</style>