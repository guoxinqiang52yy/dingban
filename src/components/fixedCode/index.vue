<!--
 * @Author:  固定字段
 * @Date: 2020-12-09 16:19:25
 * @LastEditTime: 2020-12-30 19:37:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\fixedCode\index.vue
-->

<template>
  <div class="fixedCode">
    <el-form class="from_input_code" :model="codeList" ref="ruleForm" size="small" label-width="170px">
      <template v-if="this.number >= 1 && this.type != 2">
        <el-row v-for="(item, index) in codeList.codeFixed" :key="index">
          <el-col :span="14">
            <el-form-item :label="item.fieldCode.replace(/%/g, '')" :prop="'codeFixed.' + index + '.fieldValue'" :rules="testVail(item.fieldCode)">
              <el-input :disabled="disabled" v-model="item.fieldValue"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <el-row>
        <el-col :span="14">
          <el-form-item label="乙方名称" :prop="partb" :rules="{ required: true, message: '选择不能为空', trigger: 'blur' }">
            <el-select size="mini" v-model="partb">
              <el-option v-for="(item, index) in partbList" :key="index" :label="item.partyName" :value="item.partyName"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-row>
        <el-col :span="14">
          <el-form-item>
            <el-select size="mini" v-model="scope.row.secondName" placeholder="请选择" >
              <el-option v-for="(item, index) in serveList1" :key="index" :label="item.name" :value="item.name"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: ["datas", "contractId", "orderId", "number", "type", "partAname"],
  data() {
    return {
      disabled: this.type == 3,
      phoneNum: "",
      contractIds: this.contractId,
      orderIds: this.orderId,
      //乙方信息列表
      partbList: [],
      partb: "",
      tempPartB: {},
      //字段列表ewqe
      codeList: {
        //固定字段
        codeFixed: [
          { fieldName: "甲方名称", fieldCode: "%甲方名称%", fieldType: 1, fieldValue: "" },
          { fieldName: "乙方名称", fieldCode: "%乙方名称%", fieldType: 1, fieldValue: "" },
          { fieldName: "邮寄地址", fieldCode: "%邮寄地址%", fieldType: 1, fieldValue: "" },
          { fieldName: "邮编", fieldCode: "%邮编%", fieldType: 1, fieldValue: "" },
          { fieldName: "电话", fieldCode: "%电话%", fieldType: 1, fieldValue: "" },
          { fieldName: "企业负责人", fieldCode: "%企业负责人%", fieldType: 1, fieldValue: "" },
        ],
        //添加字段
        codeIn: [
          // { fieldName: "甲方名称", fieldCode: "%甲方名称%", fieldType: 2, fieldValue: "" },
          // { fieldName: "乙方名称", fieldCode: "%乙方名称%", fieldType: 2, fieldValue: "" },
          // { fieldName: "邮寄地址", fieldCode: "%邮寄地址%", fieldType: 2, fieldValue: "" },
          // { fieldName: "邮编", fieldCode: "%邮编%", fieldType: 2, fieldValue: "" },
        ],
      },
    };
  },
  computed: {
    //表单验证
    testVail() {
      return function(data) {
        let _data = [];
        if (data.includes("邮编")) {
          _data = [
            { required: true, message: "请输入邮编", trigger: "blur" },
            { pattern: /^[0-9]*$/, message: "只能输入数字" },
            { min: 1, max: 6, message: "字数应在1-6字之内" },
          ];
        } else if (data.includes("名称")) {
          _data = [
            { required: true, message: "输入不能为空" },
            { min: 1, max: 50, message: "字数应在1-50字之内" },
          ];
        } else if (data.includes("人")) {
          _data = [
            { required: true, message: "输入不能为空", trigger: "blur" },
            { min: 1, max: 20, message: "字数应在1-20字之内" },
          ];
        } else if (data.includes("地址")) {
          _data = [
            { required: true, message: "输入不能为空", trigger: "blur" },
            { min: 1, max: 100, message: "字数应在1-100字之内" },
          ];
        } else if (data.includes("电话")) {
          _data = [
            { required: true, message: "请输入电话", trigger: "blur" },
            { pattern: /^[0-9]*$/, message: "只能输入数字" },
          ];
        } else {
          _data = [{ required: true, message: "输入不能为空" }];
        }
        return _data;
      };
    },
  },
  watch: {},
  created() {},
  mounted() {
    console.log(this.type);
    this.init();
    this.getPartBList();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    get() {},
    init() {
      if (this.datas && this.type == 3) {
        this.addFixed(this.datas[0].contractId, this.codeList.codeFixed);
        this.delPartB();
        this.codeList.codeFixed = this.filterData(this.datas); //提取固定字段
      } else if (this.datas && this.type != 3) {
        this.codeList.codeFixed = this.filterData(this.datas); //提取固定字段
        console.log(this.codeList.codeFixed);
        this.delPartB();
        this.addFixed(this.contractIds, this.codeList.codeFixed);
      } else {
        this.addFixed(this.contractIds, this.codeList.codeFixed);
        if (this.partAname) {
          let _num = this.codeList.codeFixed.findIndex((item) => {
            return (item.fieldName = "甲方名称");
          });
          this.codeList.codeFixed[_num].fieldValue = this.partAname;
        }
      }
    },
    /*父级获取*/
    showData() {
      let _data = [];
      //判断订单中有多个合同 且有人才合同 不判断 固定输入字段
      if (this.number > 1 && this.type == 2) {
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            _data = this.addPartB();
          } else {
            _data = [{ fieldValue: "字段输入有误" }];
          }
        });
      } else {
        _data = this.addPartB();
      }

      return _data;
    },
    //获取乙方列表
    async getPartBList() {
      let _resp2 = await this.Axios.get(`order-api/secondparty/query/echo`);
      this.partbList = _resp2.data.result;
      console.log(_resp2.data);
    },
    // 输入内容 添加到固定字段
    addFixed(contractId, arr) {
      let _arr = arr.filter((item) => {
        return item.fieldName != "支付" && item.fieldName != "自有列表" && item.fieldName != "服务列表" && item.fieldName != "外聘列表";
      });
      let _data = _arr.map((val) => {
        return { ...val, contractId: contractId };
      });
      this.codeList.codeFixed = _data;
      this.delPartB();
    },
    //过滤字段
    filterData(arr) {
      let _data = arr.filter((item) => {
        return item.fieldType == 1;
      });
      return _data;
    },
    /* 数据处理 */
    //将某固定字段改为下拉，并删除相应字段
    delPartB() {
      let _num = this.codeList.codeFixed.findIndex((val) => {
        return val.fieldCode.includes("乙方名称");
      });
      if (_num < 0) {
        return;
      }
      if (_num > -1) {
        this.tempPartB = this.codeList.codeFixed[_num];
        this.partb = this.codeList.codeFixed[_num].fieldValue;
        this.codeList.codeFixed.splice(_num, 1);
      }
    },
    //将某下拉字段，添加到固定字段中
    addPartB() {
      let _tempArr = JSON.parse(JSON.stringify(this.codeList.codeFixed));
      let _num = _tempArr.findIndex((val) => {
        return val.fieldName == "乙方名称";
      });
      if (_num < 0) {
        this.tempPartB.fieldValue = this.partb;
        _tempArr.push(this.tempPartB);
      } else {
        _tempArr[_num].fieldValue = this.partb;
      }
      return _tempArr;
    },
  },
};
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.fixedCode {
  width: 100%;
  margin-top: 15px;
  padding: 20px 20px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  .table_list_table {
    margin-top: 15px;
    padding: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  }
  .el-select {
    width: 100%;
  }
}
</style>
