<template>
  <div class="exportbox">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>人才系统</el-breadcrumb-item>
      <el-breadcrumb-item>外销列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <!-- 外销列表筛选 -->
    <div class="select firstselect">
      <div class="selectoption flexone">
        <div class="selectname lettername">岗&nbsp;&nbsp;位：</div>
        <div class="selectitem">
          <el-select
            v-model="selectRuleform.postId"
            placeholder="请选择"
            @change="selectstation"
            @clear="clearselectstation"
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
            v-model="selectRuleform.levelId"
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
            v-model="selectRuleform.registerStatus"
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
            v-model="selectRuleform.hasB"
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
    <!-- 外销列表 -->
    <div class="personbox">
      <el-table :data="tableList" stripe style="width: 100%">
        <!-- <el-table-column prop="id" align="center" label="序号" min-width="50"></el-table-column> -->
        <el-table-column
          prop="realName"
          align="center"
          label="姓名"
          min-width="90"
        ></el-table-column>
        <el-table-column
          
          align="center"
          label="身份证号"
          min-width="180"
        >
        <template slot-scope="scope">
          {{scope.row.cardId==""?'--':scope.row.cardId}}
        </template>
        
        </el-table-column>
        <el-table-column
          prop="telephone"
          align="center"
          label="手机号"
          min-width="120"
        >
        </el-table-column>

        <el-table-column
          prop="postName"
          align="center"
          label="岗位"
          min-width="100"
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
          min-width="100"
        >
        </el-table-column>
        <el-table-column align="center" label="证书状态" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.registerStatus == 1">初始注册</div>
            <div v-if="scope.row.registerStatus == 2">变更注册</div>
            <div v-if="scope.row.registerStatus == 3">重新注册</div>
            <div v-if="scope.row.registerStatus == 4">延续注册</div>
             <div v-if="scope.row.registerStatus == -1">--</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="Bstatus"
          align="center"
          label="B本情况"
          min-width="80"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.hasB == 0">无</div>
            <div v-if="scope.row.hasB == 1">有</div>
             <div v-if="scope.row.hasB == -1">--</div>
          </template>
        </el-table-column>
        <el-table-column
          
          align="center"
          label="签发日期 "
          min-width="140"
        >
         <template slot-scope="scope">
          {{scope.row.signDate==0?'--':scope.row.signDate}}
        </template>
        </el-table-column>
        <!-- <el-table-column
          prop="signTime"
          align="center"
          label="人才聘用时间 "
          min-width="140"
        >
        </el-table-column> -->
        <!-- <el-table-column
          prop="overTime"
          align="center"
          label="人才结束时间 "
          min-width="140"
        >
        </el-table-column> -->
        <el-table-column align="center" label="社保状态" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.socialStatus == 1">临时</div>
            <div v-if="scope.row.socialStatus == 2">唯一</div>
            <div v-if="scope.row.socialStatus == 3">不变</div>
          </template>
        </el-table-column>

        <!-- <el-table-column
          prop="price"
          align="center"
          label="人才费（元）"
          min-width="120"
        >
        </el-table-column> -->
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
        <!-- <el-table-column align="center" label="证书来源" min-width="150">
          <template slot-scope="scope">
            <div>
              {{ scope.row.sourceAndName }}
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <el-pagination
        v-if="totalsize != 0"
        class="pagelist"
        background
        layout="prev, pager, next"
        :total="totalsize"
        @current-change="changecurrent"
      >
      </el-pagination> -->
       <el-pagination
         v-if="totalsize != 0"
        class="pagelist"
        @size-change="changesize"
        @current-change="changecurrent"
        :current-page="currentPage4"
         :page-sizes="[10, 20, 30, 40,50]"
         :page-size="10"
        layout="total, sizes,prev, pager, next, jumper"
        :total="totalsize"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { subtr } from "../../../../src/assets/js/minx/common"; //截取时间

import axios from "axios";
export default {
  data() {
    return {
      isshowone: true, //等级是否选择
      isshowtwo: true, //专业是否显示
      station: [], //岗位
      stationname: "", //岗位名称
      stationname: "", //岗位名称
      rankarr: [], //等级
      rankname: "", //等级名字
      majorarr: [],
      majorname: "", //专业名字
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
      selectRuleform: {
        postId: "", //岗位id
        levelId: "", //等级id
        majorId: "", //专业id
        registerStatus: "", //证书 状态
        hasB: "", //B本情况，
        sellStatus: 1, //已加入外销
        pageNum: 0,
        pageSize: 10,
      },
      architect: true, //建筑师是否显示,
      tableList: [], //外销列表数据
      totalsize: 0,
      certificatestatus: true,
      currentPage4:1
    };
  },
  created() {
    // 获取外销列表
    this.getpersonlist();
    // 获取岗位
    this.getstation();
  },
  methods: {
    getstation() {
      //  let res = await this.Axios.post(`talents-api/talentslist/stop`, param);
      let config = {
        //  headers: { "Content-Type": "application/json" }
      }; //添加请求头
     

      axios
        .post("http://172.16.1.16:3003/api/standardattribute/list?parentId=0")
        .then((res) => {
          console.log(res, "获取岗位等级");
          let result = res.data.result;
          result.forEach((value, index, array) => {
            let obj = {};
            obj.value = value.attributeId;
            obj.label = value.attributeName;
            this.station.push(obj);
          });
          console.log(this.station);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取等级
    getrank(parebtId) {
      axios
        .post("http://172.16.1.16:3003/api/standardattribute/list?parentId="+parebtId)
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
        .post("http://172.16.1.16:3003/api/standardattribute/list?parentId="+parebtId)
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
    // 获取外销列表
    async getpersonlist() {
      let res = await this.Axios.post(
        `talents-api/talentslist/querySellList`,
        this.selectRuleform
        // `talents-api/requirelist/queryTalentDemandList`,
      );
      console.log(res);
      this.tableList = res.data.result;
      if (res.data.total != 0) {
        this.totalsize = res.data.total;
      }
      this.tableList.forEach((value) => {
        if (value.signDate != 0) {
          value.signDate = subtr(value.signDate + "");
        }
        if (value.signTime != 0) {
          value.signTime = subtr(value.signTime + "");
        }
        if(value.overTime!=0){
           value.overTime = subtr(value.overTime + "");
        }
      });
      this.tableList = this.tableList;
    },
    // 外销列表改变页码
    changecurrent(val) {
      this.currentPage4=val
      this.selectRuleform.pageNum = val - 1;
      console.log(this.page);
      this.getpersonlist();
    },
    // 改变每一页的条数
    changesize(e){
      this.selectRuleform.pageSize=e;
      this.getpersonlist()

    },
    //  选择岗位(筛选你条件)
    selectstation(e) {
      console.log(e);
      this.stationname = e;
      this.selectRuleform.postId=e
      if (this.stationname != "") {
        this.isshowone = false;
        this.selectRuleform.levelId='';
        this.rankarr=[];
        this.majorarr=[]
        this.selectRuleform.majorId='';
        this.majorname=''
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
    // 清除等级
    clearselectstation(e){
      this.certificatestatus=true;
      this.isshowone=true;
      this.isshowtwo=true
    },
    // 选择等级（筛选条件）
    selectrank(e) {
      this.rankname = e;
      this.selectRuleform.levelId=e;
      if (this.rankname != "") {
        this.isshowtwo = false;
         this.majorarr=[]
        this.selectRuleform.majorId='';
        this.majorname=''
        this.getmajor(e);
      } else {
        this.isshowtwo = true;
      }
    },
    // 选择专业（筛选条件）
    selectmajor(e) {
      this.selectRuleform.majorId=e
      // this.majorname = e;
    },
    // 查询
    searchperson() {
      this.selectRuleform.pageNum=0;
      this.currentPage4=1;
      this.getpersonlist();
    },
  },
};
</script>

<style scoped>
@import url("../person_list/index.css");
</style>