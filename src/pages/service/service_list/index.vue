<template>
  <div class="servicebox">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>服务系统</el-breadcrumb-item>
      <el-breadcrumb-item>服务列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <!-- 服务列表筛选 -->
    <div class="servicefilter servicefilterone">
      <div class="serviceselect">
        <div class="serviceselectname">服务筛选：</div>
        <div class="serviceselectright">
          <el-select
            v-model="selectruleForm.changeoneid"
            placeholder="请选择"
            size="small"
            class="quality"
            clearable
            @change="changeone"
              @clear="clearchangeone"
          >
            <el-option
              v-for="(item, index) in goodlist"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="selectruleForm.changetwoid"
            placeholder="请选择"
            size="small"
            class="roadwork"
            :disabled="disabletwo"
            clearable
            @change="changetwo"
              @clear="clearchangetwo"
          >
            <el-option
              v-for="(item, index) in secgoodlist"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="selectruleForm.changethreeid"
            placeholder="请选择"
            size="small"
            class="selectpeople"
            :disabled="disablethree"
            clearable
            @change="changethree"
            @clear="clearchangethree"
          >
            <el-option
              v-for="(item, index) in threegoodlist"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="selectruleForm.changefourid"
            placeholder="请选择"
            size="small"
            class="selectpeople allquality"
            :disabled="disablefour"
            clearable
           
          >
            <el-option
              v-for="(item,index) in fourgoodlist"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="serviceselect">
        <div class="serviceselectname">服务进度：</div>
        <div class="serviceselectright">
          <el-select v-model="value" placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="serviceselect">
        <div class="serviceselectname">服务优先级：</div>
        <div class="serviceselectright">
          <el-select v-model="value" placeholder="请选择" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    
    </div>
    <div class="servicefilter">
        <div class="serviceselect">
        <div class="serviceselectname">服务状态：</div>
        <div class="serviceselectright">
          <el-select
            v-model="value"
            placeholder="资质许可"
            size="small"
            class="qualitystatus"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="serviceselect">
        <div class="serviceselectname">筛选人员：</div>
        <div class="serviceselectright">
          <el-select
            v-model="value"
            placeholder="请选择"
            size="small"
            class="searchperson"
          >
            <el-option
              v-for="item in options"
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
        class=""
        style="margin-right: 8px; width: 70px"
        @click="searchservice"
        size="small"
        >筛选</el-button
      >
      <div class="entercompany">
        <el-input
          size="small"
          placeholder="输入企业名称（模糊搜索）"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <!-- 服务列表 -->
    <div class="servicepagebox">
      <el-table class="servicetable" :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="订单单号/服务单号" width="190">
        </el-table-column>
        <el-table-column prop="name" label="服务名称" width="170">
        </el-table-column>
        <el-table-column prop="companyname" width="140" label="企业名称">
        </el-table-column>
        <el-table-column width="120" prop="process" label="服务进度">
        </el-table-column>
        <el-table-column width="100" prop="servicestate" label="服务状态">
        </el-table-column>
        <el-table-column width="120" prop="servicesector" label="服务部门">
        </el-table-column>
        <el-table-column width="110" prop="servicepeople" label="服务人员">
        </el-table-column>
        <el-table-column width="120" prop="operatesector" label="业务部门">
        </el-table-column>
        <el-table-column width="120" prop="operatepeople" label="业务人员">
        </el-table-column>
        <el-table-column width="100" prop="plantime" label="计划工时">
        </el-table-column>
        <el-table-column width="100" prop="acttime" label="实际工时">
        </el-table-column>
        <el-table-column width="100" prop="outtime" label="超时时间">
        </el-table-column>
        <el-table-column width="100" prop="servicepriority" label="服务优先级">
        </el-table-column>
        <el-table-column width="130" prop="address" label="操作">
          <template slot-scope="scope">
            <div class="operatetop">
              <div class="seebtn" @click="seedetail(scope.$index, scope.row)">
                查看
              </div>
              <div class="dealbtn">处理</div>
              <div class="appointbtn">指派</div>
            </div>
            <div class="operatetop">
              <div class="rangebtn">优先级设置</div>
              <div class="stopbtn">暂停</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      value: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      tableData: [
        {
          date: "2020091415/209023001",
          name: "建筑智能化系统设计专项资质-甲级-增项",
          companyname: "天津建经工程",
          process: "资料收集-任务名称",
          servicestate: "进行中",
          servicesector: "营商客服部",
          servicepeople: "展静青",
          operatesector: "营商业务三部",
          operatepeople: "翟阳",
          plantime: "3天",
          acttime: "3天",
          outtime: "0",
          servicepriority: "紧急",
        },
      ],
      areaId: "",
      goodlist: [], //服务筛选一级
      secgoodlist: [], //二级列表
      threegoodlist: [], //三级列表
      fourgoodlist:[],
      disableone: true,
      disabletwo: true,
      disablethree: true,
      disablefour: true,
      selectruleForm: {
        changeoneid: "",
        changetwoid: "",
        changethreeid: "",
        changefourid: "",
      },
      ruleForm:{
        pageSize:10,
        pageNum:0
      }
    };
  },
  created() {
    this.getshoplist();
    // 获取areaid
    let userMessage = JSON.parse(sessionStorage.getItem("userMessage"));
    this.areaId = userMessage.areaId;
    // 获取服务列表
    this.getservicelist()
  },
  methods: {
    // 获取左侧商品一级 二级分类
    async getshoplist() {
      let res = await this.Axios.get(
        `product-api/productgroup/getProdGroupListWithLevel`
      );
      let data = res.data.result;
      data.forEach((valuek, indexk, arrayk) => {
        let obj = {
          value: valuek.groupId,
          label: valuek.name,
          productGroupVOList: valuek.productGroupVOList,
        };
        this.goodlist.push(obj);
      });
    },
    // 一级选择
    changeone(e) {
      console.log(e, "选择的选择的");
      let data = "";
      let arr = [];
      this.selectruleForm.changetwoid = "";
      this.selectruleForm.changethreeid = "";
      this.selectruleForm.changefourid = "";
      
      this.goodlist.forEach((valuek) => {
        this.disabletwo = false;
        if (valuek.value == e) {
          console.log(valuek);
          data = valuek.productGroupVOList;
        }
      });
      console.log(data,'获取的data')
      if(data!=''){
        data.forEach((valuek) => {
        let obj = {
          value: valuek.groupId,
          label: valuek.name,
        };
        arr.push(obj);
      });
      this.secgoodlist = arr;
      }
      
    },
    // 二级选择
    changetwo(e) {
      this.getgoodlist(e);
       this.disablethree = false;
        this.threegoodlist = [];
        this.selectruleForm.changethreeid = "";
      this.selectruleForm.changefourid = "";
    },
    async getgoodlist(e) {
      let res = await this.Axios.get(
        `product-api/productlist/list?groupId=${e}`
      );
     
      let data = res.data.result;
      let arr = [];
      if(data!=null){
        data.forEach((valuek) => {
        let obj = {
          value: valuek.productId,
          label: valuek.name,
        };
       this.threegoodlist.push(obj);
      });
      } 
    },
    // 三级选择
    changethree(e) {
      this.getskulist(e);
      this.disablefour=false;
      this.fourgoodlist=[];
      this.selectruleForm.changefourid = "";
    },
    // 根据商品列表获取sku列表
    async getskulist(e) {
      let res = await this.Axios.get(
        `product-api/skulist/skuAttrListByParams?productId=${e}&cityId=${this.areaId}`
      );
      let data = res.data.result;
      console.log(data, "sku列表");
      if (data != null) {
        data.forEach((valuek) => {
          let obj = {
            value:valuek.skuId,
            label:valuek.name
          };
          this.fourgoodlist.push(obj)
        });
       
      }
    },
    clearchangeone(){
      this.disabletwo=true;
       this.disablethree=true;
        this.disablefour=true;
        this.selectruleForm.changetwoid='';
        this.selectruleForm.changethreeid='';
         this.selectruleForm.changefourid='';

    },
    clearchangetwo(){
      this.disablethree=true;
      this.disablefour=true;
      this.selectruleForm.changethreeid='';
      this.selectruleForm.changefourid='';
    },
    clearchangethree(){
      this.disablefour=true;
      this.selectruleForm.changefourid='';
    },
    // 获取服务列表
    async getservicelist(){
      let res = await this.Axios.get(
        `workflow-api/servicelist/page`,
        this.ruleForm
       
      
      );
      console.log(res,'获取的服务列表')
    },
    seedetail(index, row) {
      this.$router.push("/service/detail");
    },
    // 搜索服务
    searchservice() {},
  },
};
</script>

<style scoped>
@import url("./index.css");
</style>
