<template>
   <el-drawer
    :before-close="cancelForms" :visible.sync="shaixuan_drawer"
    :wrapperClosable="false"
    custom-class="demo-drawer"
    direction="rtl"
    ref="drawer"
    size="30%"
    title="更多筛选"
   >
      <div class="demo-drawer__content">
         <div class="dalig_gengduoshaixuan">
            <el-form :model="form_list_" label-width="80px" ref="form" size="mini">
               <!--<div class="demo-input-suffix">-->
               <!--Loading and unloading time:-->
               <!--<el-date-picker-->
               <!--v-model="searchInfo.startTime"-->
               <!--type="date"-->
               <!--value-format="yyyy-MM-dd"-->
               <!--form="yyyy-MM-dd"-->
               <!--size="small"-->
               <!--:picker-options="pickerOptionsStart"-->
               <!--placeholder="start time">-->
               <!--</el-date-picker>-->
               <!--<span style="width:10px; height: 1px;background-color:#000;display:inline-block; margin:0 10px"></span>-->
               <!--<el-date-picker-->
               <!--v-model="searchInfo.endTime"-->
               <!--type="date"-->
               <!--value-format="yyyy-MM-dd"-->
               <!--form="yyyy-MM-dd"-->
               <!--size="small"-->
               <!--:picker-options="pickerOptionsEnd"-->
               <!--placeholder="end time">-->
               <!--</el-date-picker>-->
               <!--</div>-->
               <el-form-item label="成立时间">
                  <el-date-picker
                   @change="dateFunction1"
                   align="right"
                   clearable
                   end-placeholder="结束日期"
                   range-separator="至"
                   start-placeholder="开始日期"
                   type="daterange"
                   unlink-panels
                   v-model="form_list_.companyInfo.foundDates"
                   value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
               </el-form-item>
               <el-form-item label="营业期限">
                  <el-select style="width: 28%;" v-model="form_list_.companyInfo.businessTerm">
                     <el-option :key="index" :label="val.label" :value="val.id" v-for="(val, index) in yq_options"></el-option>
                  </el-select>
               </el-form-item>
               <el-form-item label="实缴资本">
                  <!--<el-input-->
                  <!--placeholder="0"-->
                  <!--v-model="gengduoshaixuan_form.input3"-->
                  <!--:disabled="true">-->
                  <!--</el-input>-->
                  <!--&#45;&#45;-->
                  <!--<el-input-->
                  <!--placeholder="0"-->
                  <!--v-model="gengduoshaixuan_form.input4"-->
                  <!--:disabled="true">-->
                  <!--</el-input>-->
                  <el-radio-group
                   :key="indexs"
                   @change="sjzbFunction"
                   v-for="(items, indexs) in RMBdatas"
                   v-model="form_list_.companyInfo.contributed"
                  >
                     <div class="radio_div">
                        <el-radio :key="index" :label="val.label" v-for="(val, index) in items.RMBdata1"></el-radio>
                     </div>
                     <div class="radio_div">
                        <el-radio :key="index" :label="val.label" v-for="(val, index) in items.RMBdata2"></el-radio>
                     </div>
                  </el-radio-group>
               </el-form-item>
               <el-form-item label="注册资本">
                  <!--<el-input-->
                  <!--placeholder="0"-->
                  <!--v-model="gengduoshaixuan_form.input1"-->
                  <!--:disabled="true">-->
                  <!--</el-input>-->
                  <!--&#45;&#45;-->
                  <!--<el-input-->
                  <!--placeholder="0"-->
                  <!--v-model="gengduoshaixuan_form.input2"-->
                  <!--:disabled="true">-->
                  <!--</el-input>-->
                  <el-radio-group
                   :key="indexs"
                   @change="zczbFunction"
                   v-for="(items, indexs) in RMBdatas"
                   v-model="form_list_.companyInfo.registered"
                  >
                     <div class="radio_div">
                        <el-radio :key="index" :label="val.label" v-for="(val, index) in items.RMBdata1"></el-radio>
                     </div>
                     <div class="radio_div">
                        <el-radio :key="index" :label="val.label" v-for="(val, index) in items.RMBdata2"></el-radio>
                     </div>
                  </el-radio-group>
               </el-form-item>
               <el-form-item label="登记状态">
                  <el-radio-group v-model="form_list_.companyInfo.registeredStatus">
                     <div class="radio_div">
                        <el-radio :key="index" :label="val.id" v-for="(val, index) in dengji_options">
                           {{ val.label }}
                        </el-radio>
                     </div>
                  </el-radio-group>
               </el-form-item>
               <el-form-item label="资质情况">
                  <el-radio-group v-model="form_list_.companyType">
                     <div class="radio_div">
                        <el-radio :key="index" :label="val.id" v-for="(val, index) in zzqkdata">
                           {{ val.label }}
                        </el-radio>
                     </div>
                     <!--<el-link type="primary">查看详情</el-link>-->
                  </el-radio-group>
               </el-form-item>
            </el-form>
         </div>
      </div>
      <div class="demo-drawer__footer">
         <el-button @click="cancelForm" size="mini">重置</el-button>
         <el-button @click="onSubmit" size="mini" type="primary">确定</el-button>
      </div>
   </el-drawer>
</template>

<script>
  export default {
    name: "index",
    props: ['shaixuan_drawer', 'yq_options', 'dengji_options', 'zzqkdata'],
    data() {
      return {
        RMBdatas: [
          {
            RMBdata1: [
              {id: 1, label: "0-100万"},
              {id: 2, label: "100-500万"},
              {id: 3, label: "500-1000万"},
            ],
            RMBdata2: [
              {id: 4, label: "1000-2000万"},
              {id: 5, label: "2000万-5000万"},
              {id: 6, label: "5000万以上"},
            ],
          },
        ] /*实缴资本*/,
        form_list_: {
          companyType: null,
          companyInfo: {
            foundDates: "" /*成立日期*/,
            foundDateStart: null,
            foundDateEnd: null,
            contributed: "" /*实缴资本*/,
            contributedCapitalStart: null,
            contributedCapitalEnd: null,
            registered: "" /*注册资本*/,
            registeredCapitalStart: null,
            registeredCapitalEnd: null,
            businessTerm: null /*营业期限*/,
            registeredStatus: null,
          },
        },
      }
    },
    watch: {},
    methods: {
      //更多筛选提交按钮
      onSubmit() {
        this.$emit('tableGdSx', this.form_list_)
      },
      //抽屉重置 - 关闭
      cancelForm() {
        this.form_list_.companyType = null;
        this.form_list_.companyInfo.foundDates = "";
        this.form_list_.companyInfo.contributed = "";
        this.form_list_.companyInfo.registered = "";
        this.form_list_.companyInfo.foundDateStart = null;
        this.form_list_.companyInfo.foundDateEnd = null;
        this.form_list_.companyInfo.contributedCapitalStart = null;
        this.form_list_.companyInfo.contributedCapitalEnd = null;
        this.form_list_.companyInfo.registeredCapitalStart = null;
        this.form_list_.companyInfo.registeredCapitalEnd = null;
        this.form_list_.companyInfo.businessTerm = null;
        this.form_list_.companyInfo.registeredStatus = null;
      },
      //时间处理
      dateFunction1(val) {
        this.form_list_.companyInfo.foundDateStart = this.set_date(val[0]);
        this.form_list_.companyInfo.foundDateEnd = this.set_date(val[1]);
      },
      cancelForms() {
        this.$emit('tableGdSxFalse')
      },
      //钱处理
      sjzbFunction(val) {
        if (val.indexOf("-") === -1) {
          let e = val.split("万以上")[0];
          this.form_list_.companyInfo.contributedCapitalStart = parseInt(e);
          this.form_list_.companyInfo.contributedCapitalEnd = null;
        } else {
          let a = val;
          let b = a.split("-")[0];
          let c = a.split("-")[1];
          let d = c.split("万")[0];
          this.form_list_.companyInfo.contributedCapitalStart = parseInt(b);
          this.form_list_.companyInfo.contributedCapitalEnd = parseInt(d);
        }
      },
      //钱处理
      zczbFunction(val) {
        if (val.indexOf("-") === -1) {
          let e = val.split("万以上")[0];
          this.form_list_.companyInfo.registeredCapitalStart = parseInt(e);
          this.form_list_.companyInfo.registeredCapitalEnd = null;
        } else {
          let a = val;
          let b = a.split("-")[0];
          let c = a.split("-")[1];
          let d = c.split("万")[0];
          this.form_list_.companyInfo.registeredCapitalStart = parseInt(b);
          this.form_list_.companyInfo.registeredCapitalEnd = parseInt(d);
        }
      },
      //时间格式数据处理成20201211
      set_date(data) {
        let date1, date2, date3;
        if (data !== "" && data.length === 10) {
          date1 = data.split("-");
          date2 = parseInt(date1.join(""));
          date3 = date2;
          return date3;
        } else {
          return data;
        }
      },
    },
    mounted() {
    }
  }
</script>

<style scoped lang="less">
   /deep/ .demo-drawer {
      .el-drawer__header {
         margin-bottom: 10px;
         padding: 8px 20px 0;

         span {
            font-size: 14px !important;
         }
      }

      .demo-drawer__footer {
         padding-right: 22px;
         display: flex;
         justify-content: flex-end;

         .el-button {
            height: 28px;
         }
      }
   }

   /deep/ :focus {
      outline: 0;
   }

   .dalig_gengduoshaixuan {
      display: flex;
      flex-direction: column;

      .el-input {
         width: 35%;

         .el-input__inner {
            width: 100%;
         }
      }

      /deep/ .el-form-item__label {
         font-size: 13px !important;
         padding: 0 6px 0 0;
      }

      /deep/ .el-form-item__content {
         width: 100% !important;
      }

      .el-radio-group {
         width: 88%;
         padding: 0;

         /deep/ .el-radio__label {
            font-size: 13px !important;
         }

         .radio_div {
            font-size: 20px;

            .el-radio {
               width: 20%;
               padding: 0 0 10px 0;
            }
         }
      }
   }
</style>