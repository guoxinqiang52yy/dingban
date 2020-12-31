<!--
 * @Author: 自定义字段
 * @Date: 2020-12-09 16:20:37
 * @LastEditTime: 2020-12-28 18:50:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\components\customCode\index.vue
-->

<template>
  <div class="customCode" v-if="codeList.codeIn.length > 0">
    <div class="table_title"><b>自定义表单:</b></div>
    <el-form class="from_input_code" :model="codeList" ref="ruleForm" size="small" label-width="170px">
      <el-row v-for="(item, index) in codeList.codeIn" :key="index">
        <el-col :span="16">
          <el-form-item
            :label="item.fieldCode.replace(/%/g, '')"
            :prop="'codeIn.' + index + '.fieldValue'"
            :rules="{
              required: true,
              message: '输入不能为空',
              trigger: 'blur',
            }"
          >
            <el-input v-model="item.fieldValue"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: ["datas", "contractId", "orderId", "type"],
  data() {
    return {
      contractIds: this.contractId,
      orderIds: this.orderId,
      //字段列表
      codeList: {
        //固定字段
        codeFixed: [
          // { fieldName: "甲方名称", fieldCode: "%甲方名称%", fieldType: 1, fieldValue: "" },
          // { fieldName: "乙方名称", fieldCode: "%乙方名称%", fieldType: 1, fieldValue: "" },
          // { fieldName: "邮寄地址", fieldCode: "%邮寄地址%", fieldType: 1, fieldValue: "" },
          // { fieldName: "邮编", fieldCode: "%邮编%", fieldType: 1, fieldValue: "" },
          // { fieldName: "电话", fieldCode: "%电话%", fieldType: 1, fieldValue: "" },
          // { fieldName: "企业负责人", fieldCode: "%企业负责人%", fieldType: 1, fieldValue: "" },
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
  computed: {},
  watch: {},
  created() {},
  mounted() {
    console.log(this.datas, "自定义");
    this.init();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    init() {
      if (this.type == "edit") {
        console.log(this.datas, "编辑");
        if (this.datas && this.datas.length > 0) {
          this.codeList.codeIn = this.filterData(this.datas);
        }
      } else {
        this.addFixed(this.contractIds, this.datas);
      }
    },
    /*父级获取*/
    showData() {
      let _data = [];
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          _data = this.codeList.codeIn;
        } else {
          _data = [{ fieldValue: "字段输入有误" }];
        }
      });
      return _data;
    },
    // 输入内容 添加到固定字段
    addFixed(contractId, arr) {
      if (!arr) return;
      let _arrList = arr.filter((item) => {
        return item.fieldType == 2;
      });
      if (_arrList == []) {
        this.codeList.codeIn = [];
        return;
      }
      let _data2 = _arrList.map((val) => {
        return { ...val, contractId: contractId, fieldValue: "" };
      });
      this.codeList.codeIn = _data2;
    },
    //过滤字段
    filterData(arr) {
      let _data = arr.filter((item) => {
        return item.fieldType == 2;
      });
      return _data;
    },
  },
};
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.customCode {
  padding: 20px 20px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  .table_list_table {
    margin-top: 15px;
    padding: 10px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  }
}
</style>
