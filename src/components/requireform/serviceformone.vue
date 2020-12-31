<template>
  <div class="serviceonebox">
    <!--服务部需求单 专员操作后流转到人才 状态是1 的时候-->
    <div class="operatepeople">
      <el-dialog :title="companyname" :visible.sync="peopledialogshow" width="1331px" :close-on-click-modal="false" @close="cancelrequiredialog">
        <div class="selfpeople">企业自有人员列表</div>
        <el-form>
          <el-table class="selpeoplelist" :data="peopleData" border style="width: 100%">
            <el-table-column label="类型" width="50">
              <template slot-scope="scope">
                <div v-if="scope.row.staffType == 1">有证</div>
                <div v-if="scope.row.staffType == 2">考证</div>
                <div v-if="scope.row.staffType == 3">办证</div>
              </template>
            </el-table-column>
            <el-table-column prop="postName" label="岗位" width="80"> </el-table-column>
            <el-table-column prop="levelName" label="等级" width="50"> </el-table-column>
            <el-table-column prop="professionalName" label="专业" width="80"> </el-table-column>
            <el-table-column prop="professionalName" label="证书状况" width="100">
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
                <div v-if="scope.row.hasB == 2">--</div>
              </template>
            </el-table-column>
            <el-table-column prop="socialstate" label="社保情况" width="80">
              <template slot-scope="scope">
                <div v-if="scope.row.social == 0">无</div>
                <div v-if="scope.row.social == 1">有</div>
              </template>
            </el-table-column>
            <el-table-column prop="ageLimit" label="发证年限（年）" width="120"> </el-table-column>
            <el-table-column prop="staffCount" label="人数" width="50"> </el-table-column>
            <el-table-column prop="staffOrgPrice" label="参考价（元）" width="120"> </el-table-column>
            <el-table-column prop="staffPrice" label="单价（元）" width="100"> </el-table-column>
            <el-table-column prop="totalprice" label="总价（元）" width="100"> </el-table-column>
            <el-table-column prop="remark" label="备注" width="200" :show-overflow-tooltip="true"> </el-table-column>

            <el-table-column prop="operate" label="操作" width="80">
              <template slot-scope="scope">
                <!--  @click="handleEdit(scope.$index, scope.row)" -->
                <el-select class="nonei" size="small" v-model="scope.row.statusname" placeholder="待定" @change="selfpersonselect(scope.$index, scope.row)">
                  <el-option label="待定" value="待定"></el-option>
                  <el-option label="有效" value="有效"></el-option>
                  <el-option label="无效" value="无效"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form>

        <div class="selfpeople external">外聘人员需求列表</div>
        <el-form>
          <el-table class="selpeoplelist" :data="companypeople" border style="width: 100%">
            <el-table-column prop="postName" label="岗位" width="80"> </el-table-column>
            <el-table-column prop="levelName" label="等级" width="50"> </el-table-column>
            <el-table-column prop="professionalName" label="专业" width="80"> </el-table-column>
            <el-table-column prop="certificate" label="证书状况" width="80">
              <template slot-scope="scope">
                <div v-if="scope.row.registerStatus == 1">初始注册</div>
                <div v-if="scope.row.registerStatus == 2">变更注册</div>
                <div v-if="scope.row.registerStatus == 3">重新注册</div>
                <div v-if="scope.row.registerStatus == 4">延续注册</div>
              </template>
            </el-table-column>
            <el-table-column prop="Bstatus" label="B本情况" width="80">
              <template slot-scope="scope">
                <div v-if="scope.row.hasB == 0">无</div>
                <div v-if="scope.row.hasB == 1">有</div>
                <div v-if="scope.row.hasB == 2">--</div>
              </template>
            </el-table-column>
            <el-table-column label="社保情况" width="80">
              <template slot-scope="scope">
                <div v-if="scope.row.socialStatus == 0">无</div>
                <div v-if="scope.row.socialStatus == 1">有</div>
              </template>
            </el-table-column>
            <el-table-column prop="ageLimit" label="发证年限（年）" width="100"> </el-table-column>
            <el-table-column prop="ageLimit" label="发证年限（年）" width="80"> </el-table-column>

            <el-table-column prop="staffOrgPrice" label="参考价（元）" width="80"> </el-table-column>
            <el-table-column prop="staffPrice" label="单价（元）" width="120"> </el-table-column>
            <el-table-column prop="hiredate" label="聘用类型" width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.cycleType == 1">次数</div>
                <div v-if="scope.row.cycleType == 2">时间（月）</div>
              </template>
            </el-table-column>
            <el-table-column prop="hiredate" label="聘用周期" width="80">
              <template slot-scope="scope">
                {{ scope.row.cycleValue }}个月
                <!-- <div v-if="scope.row.cycleType == 1">次数</div>
                <div v-if="scope.row.cycleType == 2">时间（月）</div> -->
              </template>
            </el-table-column>
            <el-table-column prop="hiredate" label="关联服务" width="100">
              <template slot-scope="scope">
                <el-select class="nonei" v-model="scope.row.flowName" placeholder="请选择" @change="selectservice(scope.$index, scope.row)" size="small">
                  <el-option :label="item.label" :value="item.value" size="small" v-for="(item, index) in servicelist" :key="index"></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="remark" label="备注" width="180" :show-overflow-tooltip="true"> </el-table-column>

            <el-table-column prop="operate" label="操作" width="80">
              <template slot-scope="scope">
                <!--  @click="handleEdit(scope.$index, scope.row)" -->
                <el-select class="nonei" v-model="scope.row.statusname" placeholder="待定" @change="outpersonselect(scope.$index, scope.row)" size="small">
                  <el-option label="待定" value="待定" size="small"></el-option>
                  <el-option label="有效" value="有效" size="small"></el-option>
                  <el-option label="无效" value="无效" size="small"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelrequiredialog" size="small">取 消</el-button>
          <el-button type="primary" @click="saverequire" size="small">保存</el-button>
          <el-button type="primary" @click="surerequire" :disabled="issave" size="small">提交</el-button>

          <el-button type="primary" @click="quitrequireshow" size="small">退回 </el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 是否提交需求单 -->
    <div class="requirewrap">
      <el-dialog title="提示" :visible.sync="requiredialogVisible" width="30%" :close-on-click-modal="false">
        <span>当前页面有无效人才，是否继续提交</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="requiredialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureinvalidrequire">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 退回弹出层 -->
    <div class="quitwrap">
      <el-dialog title="退回原因" :visible.sync="quitdialogshow" width="800px" :close-on-click-modal="false">
        <!--  备注-->
        <div class="flex remarkbox">
          <div class="remarkname">退回原因：</div>
          <el-input type="textarea" class="entermark" :class="isquitremark == true ? 'entermarktext' : ''" :rows="2" placeholder="请输入退回原因" v-model="quitremark" autofocus="true"> </el-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelquitdialog">取 消</el-button>

          <el-button type="primary" @click="quitrequire">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: ["peopledialogshow", "peopleData", "companypeople", "issave", "requiretext", "companyname", "servicelist"],
  data() {
    return {
      //  peopledialogshow:false,//是否显示弹出层

      requiredialogVisible: false, //显示无效人员是否提交

      quitremark: "", //点退定的时候备注
      isquitremark: false,
      quitdialogshow: false, //退回弹出层
    };
  },
  created() {},
  methods: {
    // 取消弹出
    cancelrequiredialog() {
      this.$emit("ishowwrap", false);
    },
    //选择关联服务
    selectservice(index, row) {
      this.servicelist.forEach((value) => {
        if (value.value == row.flowName) {
          this.companypeople[index].flowId = value.value;
        }
      });
      this.companypeople = this.companypeople;
    },

    //自有人才 操作
    selfpersonselect(index, row) {
      console.log(index, row);
      if (row.statusname == "待确定") {
        this.peopleData[index].status = 10;
        this.$emit("issave", true); //判断提交按钮是否可以点击
      } else if (row.statusname == "有效") {
        this.peopleData[index].status = 11;
        this.companypeople.forEach((value, index, array) => {
          if (value.status == 10) {
            this.$emit("issave", true);
          } else {
            this.$emit("issave", false);
          }
        });
      } else if (row.statusname == "无效") {
        this.peopleData[index].status = 12;
        this.companypeople.forEach((value, index, array) => {
          if (value.status == 10) {
            this.$emit("issave", true);
          } else {
            this.$emit("issave", false);
          }
        }); //判断提交按钮是否可以点击
      }
      this.peopleData = this.peopleData;
      this.$forceUpdate();
      console.log(this.peopleData);
    },
    // 外聘人才操作
    outpersonselect(index, row) {
      if (row.statusname == "待确定") {
        this.companypeople[index].status = 10;
        this.$emit("issave", true); //判断提交按钮是否可以点击
      } else if (row.statusname == "有效") {
        this.companypeople[index].status = 11;
        this.peopleData.forEach((value, index, array) => {
          if (value.status == 10) {
            this.$emit("issave", true);
          } else {
            this.$emit("issave", false);
          }
        });
      } else if (row.statusname == "无效") {
        this.peopleData.forEach((value, index, array) => {
          if (value.status == 10) {
            this.$emit("issave", true);
          } else {
            this.$emit("issave", false);
          }
        });
        this.companypeople[index].status = 12;
      }
      this.companypeople = this.companypeople;
      console.log(this.issave, "判断提交按钮是否保存");
      this.$forceUpdate();
      console.log(this.companypeople);
    },
    // 服务人员保存需求单
    async saverequire() {
      let newpeopleData = this.peopleData;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      newpeopleData.forEach((value, index, array) => {
        delete value["addTime"];
        delete value["updateTime"];
        delete value["statusname"];
        delete value["totalprice"];
        delete value["hasinvalid"];
      });
      this.peopleData = newpeopleData;
      let newcompanypeople = this.companypeople;
      newcompanypeople.forEach((value, index, array) => {
        delete value["addTime"];
        delete value["updateTime"];
        delete value["statusname"];
        delete value["hasinvalid"];
        delete value["flowName"];
      });

      let param = {
        requireStaffList: this.peopleData,
        requireTalentList: this.companypeople,
      };
      let res = await this.Axios.post(`talents-api/requirelist/requireConfirmSave`, param, "postJson");
      if (res.data.code == 0) {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        loading.close();
      } else {
        loading.close();
      }
      this.peopledialogshow = false;
      this.requiredialogVisible = false;
      console.log(res);
    },
    // 服务人员提交 需求单
    async surerequire() {
      let newpeopleData = this.peopleData;
      newpeopleData.forEach((value, index, array) => {
        delete value["addTime"];
        delete value["updateTime"];
        delete value["statusname"];
        delete value["totalprice"];
        if (value.status == 12) {
          value.hasinvalid = 1;
        } else {
          delete value["hasinvalid"];
        }
      });
      console.log(newpeopleData, "自有人员列表");
      console.log(newpeopleData.every((item) => !("hasinvalid" in item)));
      // 判断自有人员列表是否有无效的人员
      if (newpeopleData.every((item) => !("hasinvalid" in item)) == false) {
        this.requiredialogVisible = true;
        return false;
      }

      this.peopleData = newpeopleData;
      let newcompanypeople = this.companypeople;
      newcompanypeople.forEach((value, index, array) => {
        delete value["addTime"];
        delete value["updateTime"];
        delete value["statusname"];
        delete value["flowName"];
        if (value.status == 12) {
          value.hasinvalid = 1;
        } else {
          delete value["hasinvalid"];
        }
      });
      // 判断外聘人员列表是否有无效的
      if (newcompanypeople.every((item) => !("hasinvalid" in item)) == false) {
        this.requiredialogVisible = true;
        return false;
      }

      let newrequire = this.requiretext;
      delete newrequire["addTime"];
      delete newrequire["updateTime"];
      delete newrequire["status"];
      this.requiretext = newrequire;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let param = {
        require: this.requiretext,
        requireStaffList: this.peopleData,
        requireTalentList: this.companypeople,
      };

      let res = await this.Axios.post(`talents-api/requirelist/requireConfirmSubmit`, param, "postJson");
      console.log(res, "tijaotijao");
      if (res.data.code == 0) {
        this.$message({
          message: "提交成功",
          type: "success",
        });
        loading.close();
      } else {
        loading.close();
      }
      this.$emit("ishowwrap", false);
      this.peopledialogshow = false;
      console.log(res);
    },
    //有无效 人员的时候确认提交
    async sureinvalidrequire() {
      let newpeopleData = this.peopleData;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      newpeopleData.forEach((value, index, array) => {
        delete value["addTime"];
        delete value["updateTime"];
        delete value["statusname"];
        delete value["totalprice"];
        delete value["hasinvalid"];
      });
      this.peopleData = newpeopleData;
      let newcompanypeople = this.companypeople;
      newcompanypeople.forEach((value, index, array) => {
        delete value["addTime"];
        delete value["updateTime"];
        delete value["statusname"];
        delete value["hasinvalid"];
        delete value["flowName"];
      });
      let newrequire = this.requiretext;
      delete newrequire["addTime"];
      delete newrequire["updateTime"];
      delete newrequire["status"];
      this.requiretext = newrequire;
      let param = {
        require: this.requiretext,
        requireStaffList: this.peopleData,
        requireTalentList: this.companypeople,
      };
      let res = await this.Axios.post(`talents-api/requirelist/requireConfirmSubmit`, param, "postJson");
      if (res.data.code == 0) {
        this.$message({
          message: "提交成功",
          type: "success",
        });
        loading.close();
      } else {
        loading.close();
      }
      this.peopledialogshow = false;
      this.$emit("ishowwrap", false);
      this.requiredialogVisible = false;
      console.log(res);
    },
    // 退回需求单
    async quitrequire() {
      if (this.quitremark == "") {
        this.isquitremark = true;
        this.$message({
          message: "请填写退回原因",
          type: "warning",
        });
      } else {
        this.isquitremark = false;
        console.log("4rererer");
        let newpeopleData = this.peopleData;
        newpeopleData.forEach((value, index, array) => {
          delete value["addTime"];
          delete value["updateTime"];
          delete value["statusname"];
          delete value["totalprice"];
          delete value["hasinvalid"];
        });
        this.peopleData = newpeopleData;
        let newcompanypeople = this.companypeople;
        newcompanypeople.forEach((value, index, array) => {
          delete value["addTime"];
          delete value["updateTime"];
          delete value["statusname"];
          delete value["hasinvalid"];
        });
        let newrequire = this.requiretext;
        delete newrequire["addTime"];
        delete newrequire["updateTime"];
        delete newrequire["status"];
        this.requiretext = newrequire;
        let reason = {
          orderId: this.requiretext.orderId,
          reason: this.quitremark,
        };
        let param = {
          require: this.requiretext,
          requireStaffList: this.peopleData,
          requireTalentList: this.companypeople,
          reason: reason,
        };
        let res = await this.Axios.post(`talents-api/requirelist/requireConfirmSendBack?`, param, "postJson");
        if (res.data.code == 0) {
          this.$message({
            message: "退回成功",
            type: "success",
          });
        } else {
          loading.close();
        }
        this.quitremark = ""; //清空退回的内容
        this.peopledialogshow = false;
        this.$emit("ishowwrap", false);

        this.quitdialogshow = false;
        console.log(res);
      }
    },
    quitrequireshow() {
      this.quitdialogshow = true;
      this.$emit("ishowwrap", false);
    },
    // 退回原因说明
    cancelquitdialog() {
      this.quitdialogshow = false;
      this.peopledialogshow = true;
    },
  },
};
</script>
