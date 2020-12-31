<template>
  <!-- 人才和需求匹配 人才一直看的列表 -->
  <div class="talentformbox">
    <div class="require">
      <el-dialog
        :title="companyname"
        :visible.sync="rtalentdialogshow"
        width="1361px"
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
                  {{ scope.row.ageLimit }}年
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
                  {{ scope.row.cycleValue }}个月
                </template>
              </el-table-column>

              <el-table-column
                prop="zip"
                label="合同备注"
                width="80"
                :show-overflow-tooltip="true"
              >
                <template>
                  <div style="height: 27px; line-height: 27px">备注</div>
                </template>
              </el-table-column>
              <el-table-column prop="talentsName" label="姓名" width="60">
                <template slot-scope="scope">{{
                  scope.row.talentsName == "" || scope.row.talentsName == null
                    ? "--"
                    : scope.row.talentsName
                }}</template>
              </el-table-column>
              <el-table-column label="成本价(元)" width="90">
                <template slot-scope="scope">{{
                  scope.row.talentsPrice == "" || scope.row.talentsPrice == null
                    ? "--"
                    : scope.row.talentsPrice
                }}</template>
              </el-table-column>
              <el-table-column
                label="人才备注"
                width="80"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  {{
                    scope.row.talentsRemark == "" ||
                    scope.row.talentsRemark == null
                      ? "--"
                      : scope.row.talentsRemark
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="province" label="状态" width="70">
                <template slot-scope="scope">
                  <div v-if="scope.row.status == 11">--</div>
                  <div v-if="scope.row.status == 20">待审核</div>
                  <div v-if="scope.row.status == 21">已通过</div>
                  <div v-if="scope.row.status == 22">被退回</div>
                  <div v-if="scope.row.status == 30">已绑定</div>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <div class="flexone">
                    <div
                      @click="selectrequirepeople(scope.$index, scope.row)"
                      class="addbtn"
                    >
                      选择
                    </div>
                    <div
                      v-if="
                        scope.row.talentsName != '' &&
                        scope.row.talentsName != null
                      "
                      @click="clearpeople(scope.$index, scope.row)"
                      class="addbtn clearbtn"
                      style="margin-left: 10px"
                    >
                      清空
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="padding-top: 0">
          <el-button @click="cancelrequiredialog" size="small">取 消</el-button>
          <el-button type="primary" @click="savetalent" size="small"
            >保存</el-button
          >
          <el-button type="primary" @click="submittalent" size="small" :disabled="selectpersonsub"
            >提交</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!-- 人才选择需求单的人才 -->
    <div class="outtablentlistwrap">
      <el-dialog
        title="人才系统-人才列表"
        :visible.sync="outtablistwrapshow"
        width="1380px"
        class="requiredialog"
         :close-on-click-modal="false"
        @close="closeouttablistwrapshow"
      >
        <!-- 人才列表筛选 -->
        <div class="select firstselect">
          <div class="selectoption flexone">
            <div class="selectname lettername">岗&nbsp;&nbsp;位：</div>
            <div class="selectitem">
              <el-select
                v-model="selettablentform.postId"
                placeholder="请选择"
                @change="selectstation"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in station"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="selectoption flexone">
            <div class="selectname lettername">等级：</div>
            <div class="selectitem">
              <el-select
                v-model="selettablentform.levelId"
                placeholder="请选择"
                :disabled="isshowone"
                @change="selectrank"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in rankarr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="selectoption flexone">
            <div class="selectname lettername">专业：</div>
            <div class="selectitem">
              <el-select
                v-model="majorname"
                placeholder="请选择"
                :disabled="isshowtwo"
                @change="selectmajor"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in majorarr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="selectoption flexone" v-if="architect">
            <div class="selectname">证书状态：</div>
            <div class="selectitem">
              <el-select
                v-model="selettablentform.registerStatus"
                placeholder="请选择"
                :disabled="certificatestatus"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in registerstatusarr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <!-- B本情况 -->
          <div class="selectoption flexone" v-if="architect">
            <div class="selectname">B本情况：</div>
            <div class="selectitem">
              <el-select
                v-model="selettablentform.hasB"
                placeholder="请选择"
                :disabled="certificatestatus"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in selectBarr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <el-button
            type="primary"
            class="btnperson"
            @click="searchperson"
            style="margin-left: 15px"
            size="small"
            >查询</el-button
          >
        </div>
        <!-- 只有销售人员可以看的列表   选择人才列表 -->
        <div class="personbox">
          <el-table :data="selecttableList" stripe style="width: 100%">
            <!-- <el-table-column prop="id" align="center" label="序号" min-width="50"></el-table-column> -->
            <el-table-column
              prop="realName"
              align="center"
              label="姓名"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="cardId"
              align="center"
              label="身份证号"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="telephone"
              align="center"
              label="手机号"
              width="110"
            >
            </el-table-column>

            <el-table-column
              prop="postName"
              align="center"
              label="岗位"
              min-width="80"
            ></el-table-column>
            <el-table-column
              prop="levelName"
              align="center"
              label="等级"
              min-width="80"
            >
            </el-table-column>
            <el-table-column
              prop="majorName"
              align="center"
              label="专业"
              min-width="80"
            >
            </el-table-column>
            <el-table-column align="center" label="证书状态" min-width="80">
              <template slot-scope="scope">
                <div v-if="scope.row.registerStatus == -1">--</div>
                <div v-if="scope.row.registerStatus == 1">初始注册</div>
                <div v-if="scope.row.registerStatus == 2">变更注册</div>
                <div v-if="scope.row.registerStatus == 3">重新注册</div>
                <div v-if="scope.row.registerStatus == 4">延续注册</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="Bstatus"
              align="center"
              label="B本情况"
              min-width="50"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.hasB == -1">--</div>
                <div v-if="scope.row.hasB == 0">无</div>
                <div v-if="scope.row.hasB == 1">有</div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="签发日期 "
              min-width="100"
            >
            <template slot-scope="scope">
              {{scope.row.signDate==0?'--':scope.row.signDate}}
            </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="人才聘用时间 "
              width="110"
            >
            <template slot-scope="scope">
              {{scope.row.signTime==0?'--':scope.row.signTime}}
            </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="人才结束时间 "
              width="110"
            >
            <template slot-scope="scope">
              {{scope.row.overTime==0?'--':scope.row.overTime}}
            </template>
            </el-table-column>
            <el-table-column align="center" label="社保状态" min-width="80">
              <template slot-scope="scope">
                <div v-if="scope.row.socialStatus == 1">临时</div>
                <div v-if="scope.row.socialStatus == 2">唯一</div>
                <div v-if="scope.row.socialStatus == 3">不变</div>
              </template>
            </el-table-column>

            <el-table-column
              prop="creatorName"
              align="center"
              label="创建人"
              min-width="80"
            >
            </el-table-column>
            <el-table-column
              prop="addTime"
              align="center"
              label="创建时间"
              min-width="100"
            >
            </el-table-column>

            <el-table-column align="center" label="操作" min-width="90">
              <template slot-scope="scope">
                <el-button
                  @click="sureaddpeople(scope.$index, scope.row)"
                  type="text"
                  size="small"
                  >确定加入</el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <!-- <el-pagination
            v-if="selecttotal != 0"
            class="pagelist"
            background
            layout="prev, pager, next"
            :total="selecttotal"
            @current-change="selectchangecurrent"
          >
          </el-pagination> -->
          <el-pagination
            v-if="selecttotal != 0"
            class="pagelist"
            @size-change="changesize"
            @current-change="selectchangecurrent"
            :current-page="currentPage4"
             :page-sizes="[10, 20, 30, 40,50]"
             :page-size="10"
            layout="total,sizes, prev, pager, next, jumper"
            :total="selecttotal"
          >
          </el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { subtr } from "../../assets/js/minx/common"; //截取时间
import axios from "axios";
export default {
  props: ["requiretableData", "rtalentdialogshow", "companyname", "station","selectpersonsub"],
  data() {
    return {
      isshowone: true, //等级是否选择
      isshowtwo: true, //专业是否显示
      stationname: "", //岗位名称
      rankarr: [], //等级
      rankname: "", //等级名字
      majorarr: [],
      majorname: "", //专业名字
      certificatestatus: true,
      registerstatusarr: [
        { value: 1, label: "初始注册" },
        { value: 2, label: "变更注册" },
        { value: 3, label: "重新注册" },
        { value: 4, label: "延续注册" },
      ], //证书状态
      selectBarr: [
        { value: 0, label: "无" },
        { value: 1, label: "有" },
      ], //B本情况
      outtablistwrapshow: false,
      requiretableindex: "",
      selecttableList: [], //人才列表 人才列表选择人才
      selettablentform: {
        pageNum: 0,
        pageSize: 10,
        postId: "",
        levelId: "",
        majorId: "",
        registerStatus: "",
        hasB: "",
        orderId: "1331153702055321600",
      },
      selecttotal: 0,
      architect: true, //建筑师是否显示,
      selectRuleform: {
        postId: "", //岗位id
        levelId: "", //等级id
        majorId: "", //专业id
        registerStatus: "", //证书 状态
        hasB: "", //B本情况，
      },
      currentPage4: 1,
      selpretalentid: "", //上一个人的人才id
    };
  },

  methods: {
    //   取消弹出
    cancelrequiredialog() {
      this.rtalentdialogshow = false;
      this.$emit("ishowwrap", false);
    },

    // 获取等级
    getrank(parebtId) {
      axios
        .post(
          "http://172.16.1.16:3003/api/standardattribute/list?parentId=" +
            parebtId
        )
        .then((res) => {
          console.log(res, "获取等级");
          let result = res.data.result;
          result.forEach((value, index, array) => {
            let obj = {};
            obj.value = value.attributeId;
            obj.label = value.attributeName;
            this.rankarr.push(obj);
          });
          console.log(this.station);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getmajor(parebtId) {
      axios
        .post(
          "http://172.16.1.16:3003/api/standardattribute/list?parentId=" +
            parebtId
        )
        .then((res) => {
          console.log(res, "获取等级");
          let result = res.data.result;
          result.forEach((value, index, array) => {
            let obj = {};
            obj.value = value.attributeId;
            obj.label = value.attributeName;
            this.majorarr.push(obj);
          });
          console.log(this.station);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //  选择岗位(筛选你条件)
    selectstation(e) {
      console.log(e);
      this.stationname = e;
      this.selettablentform.postId = e;
      if (this.stationname != "") {
        this.isshowone = false;
        this.rankarr = [];
        this.selettablentform.levelId = "";
        this.majorarr = [];
        this.selettablentform.majorId = "";
        this.majorname = "";
        this.getrank(e);
        this.station.forEach((value) => {
          if (value.value == e) {
            if (value.label == "建造师") {
              this.certificatestatus = false;
            } else {
              this.certificatestatus = true;
            }
          }
        });
      } else {
        this.isshowone = true;
      }
    },
    // 选择等级（筛选条件）
    selectrank(e) {
      this.rankname = e;
      this.selettablentform.levelId = e;
      if (this.rankname != "") {
        this.isshowtwo = false;
        this.majorarr = [];
        this.selettablentform.majorId = "";
        this.majorname = "";
        this.getmajor(e);
      } else {
        this.isshowtwo = true;
      }
    },
    // 选择专业（筛选条件）
    selectmajor(e) {
      console.log(e, "选择专业");
      this.selettablentform.majorId = e;
      // this.majorname = e;
    },
    // 添加人才
    selectrequirepeople(index, row) {
      console.log(index, row, "添加人才");
      this.outtablistwrapshow = true;
      this.rtalentdialogshow = false;
      this.requiretableindex = index;
      if (row.talentsName != null) {
        if(row.oldId){
            this.selpretalentid = row.oldId; //上一个人的人才id
        }else{
           this.selpretalentid = row.talentsId; //上一个人的人才id
        }
      }
      this.gettablentlist();
    },
    // 清空添加的人才
    async clearpeople(index, row) {
      console.log(row, "lalall ");
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      let param = {
        talentsId: row.talentsId,
        id: row.id,
      };
      let res = await this.Axios.post(
        `talents-api/requirelist/talentRequireClear`,
        param
      );
      console.log(res, "清空人才");
      if (res.data.code == 0) {
        this.$message({
          message: "清空成功",
          type: "success",
        });
        this.requiretableData[index].talentsName = "";
        this.requiretableData[index].talentsPrice = "";
        this.requiretableData[index].talentsRemark = "";
        this.requiretableData[index].status = 11;
        this.requiretableData[index].originalTalentsId = row.talentsId;
        this.requiretableData[index].oldId = row.talentsId; //把上一个id 赋值，
        this.requiretableData[index].talentsId = 0;
        this.requiretableData = this.requiretableData;
        console.log(this.requiretableData[index]);
        loading.close()
        this.$emit("changeselectpersonsub",true)

      }else{
        loading.close()
      }
    },
    closeouttablistwrapshow() {
      this.outtablistwrapshow = false;
      this.rtalentdialogshow = true;
    },
    // 确定选择人才
    sureaddpeople(index, row) {
      this.requiretableData[this.requiretableindex].talentsName = row.realName;
      this.requiretableData[this.requiretableindex].talentsPrice = row.price;
      this.requiretableData[this.requiretableindex].talentsRemark = row.remark;
      this.requiretableData[this.requiretableindex].status = 20;
      this.requiretableData[this.requiretableindex].talentsId = row.talentsId;
      console.log(this.selpretalentid, "选择的选择的id");
      if (this.selpretalentid == "") {
        this.requiretableData[this.requiretableindex].originalTalentsId = 0;
      } else {
        this.requiretableData[
          this.requiretableindex
        ].originalTalentsId = this.selpretalentid;
      }

      this.requiretableData = this.requiretableData;
      this.outtablistwrapshow = false;
      this.rtalentdialogshow = true;
      console.log( this.requiretableData,'选择的人人人人')
      let isSome = this.requiretableData.some(item=>item.talentsName ==null||item.talentsName=='');//判断列表里是否选择人才
      if(isSome==false){
          this.$emit("changeselectpersonsub",false)
      }else{
        this.$emit("changeselectpersonsub",true)
      }
    
    },
    // 人才选择人才列表人才一直显示
    async gettablentlist() {
      let res = await this.Axios.post(
        `talents-api/requirelist/queryRequireTalentList`,
        this.selettablentform
      );
      this.selecttableList = res.data.result;
      if (this.selecttableList.length != 0) {
        this.selecttableList.forEach((value) => {
          if (value.signDate != 0) {
            value.signDate = subtr(value.signDate + "");
          }
          if (value.signTime != 0) {
            value.signTime = subtr(value.signTime + "");
          }
          if (value.overTime != 0) {
            value.overTime = subtr(value.overTime + "");
          }
        });
        this.selecttableList = this.selecttableList;
        this.selecttotal = res.data.total;
      }
    },
    //选择人才页码改变
    selectchangecurrent(val) {
      this.currentPage4 = val;
      this.selettablentform.pageNum = val - 1;
      console.log(this.page);
      this.gettablentlist();
    },
    // 改变每一页显示的条数
    changesize(e){
      this.selettablentform.pageSize=e;
       this.gettablentlist();
    },
    //查询
    searchperson() {
      this.selettablentform.pageNum=0;
      this.currentPage4=1;
      this.gettablentlist();
    },
    // 提交
    async submittalent() {
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
        if(value.oldId){
          delete value["oldId"]
        }
      });

      let param = {
        requireTalentList: newrequiretableData,
      };
      console.log(newrequiretableData, "表单");
      let res = await this.Axios.post(
        `talents-api/requirelist/talentRequireSubmit`,
        param,
        "postJson"
      );
      if (res.data.code == 0) {
        this.$message({
          message: "提交成功",
          type: "success",
        });
        this.rtalentdialogshow = false;
        loading.close();
      } else {
        loading.close();
      }
    },
    // 保存
    async savetalent() {
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
         delete value["originalTalentsId"];
      });
      let param = {
        requireTalentList: newrequiretableData,
      };
      let res = await this.Axios.post(
        `talents-api/requirelist/talentRequireSave`,
        param,
        "postJson"
      );
      if (res.data.code == 0) {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        loading.close();
        this.rtalentdialogshow = false;
      } else {
        loading.close();
      }
      console.log(res, "提交");
    },
  },
};
</script>

<style scoped>
</style>