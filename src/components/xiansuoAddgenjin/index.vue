<template>
   <el-dialog
    :close-on-click-modal="false"
    :visible.sync="genjin_dialog"
    @close="closeDialog"
    class="dialog_add_jilu"
    title="添加跟进记录"
    width="24%"
   >
      <div class="dalig_bohao">
         <el-form :model="genjin_form" :rules="rulesGenJin" label-position="left" label-width="79px" ref="GenJinform" size="small">
            <el-form-item label="意向度" prop="intentionLevel">
               <el-radio-group @change="radio_change" v-model="genjin_form.intentionLevel">
                  <el-radio :key="index" :label="val.id" v-for="(val, index) in yixData">{{ val.label }}</el-radio>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="意向服务" prop="intentionId" style="margin: 10px 0 16px 0;width: 50%;" v-if="change_show_radio">
               <el-select :disabled="!change_show_radio" v-model="genjin_form.intentionId">
                  <el-option :key="index" :label="val.name" :value="val.groupId" v-for="(val, index) in yxGenJinData"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="意向服务" style="margin: 10px 0 16px 0;width: 50%;" v-if="!change_show_radio">
               <el-select :disabled="!change_show_radio" v-model="genjin_form.intentionId">
                  <el-option :key="index" :label="val.name" :value="val.groupId" v-for="(val, index) in yxGenJinData"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="followRecords" style="margin-bottom: 19px;">
               <el-input
                :autosize="{ minRows: 2, maxRows: 4}"
                maxlength="100"
                placeholder="请填写备注"
                resize="none"
                show-word-limit
                type="textarea"
                v-model="genjin_form.followRecords"
               ></el-input>
            </el-form-item>
            <div class="infos_buttons">
               <div class="info"></div>
               <div class="buttons">
                  <el-button @click="genjindialogClose" size="mini">取消</el-button>
                  <el-button @click="onSubmitGenJin('GenJinform')" size="mini" type="primary">提交</el-button>
               </div>
            </div>
         </el-form>
      </div>
   </el-dialog>
</template>

<script>
  export default {
    name: "index",
    props: ["genjin_dialog", 'yixData', 'yxGenJinData', 'change_show_radio', 'leadsId'],
    data() {
      let isfollowRecords = function isfollowRecords(rule, value, callback) {
        if (value.length < 10) {
          callback(new Error("请输入最少10个字符"));
        } else {
          callback();
        }
      };
      return {
        genjin_form: {
          intentionId: null,
          intentionLevel: null,
          followRecords: "",
        } /*跟进表单*/,
        rulesGenJin: {
          intentionId: [{required: true, message: "请选择意向服务", trigger: "change"}],
          intentionLevel: [{required: true, message: "请选择意向度", trigger: "change"}],
          followRecords: [
            {required: true, message: "请输入备注", trigger: "blur"},
            {validator: isfollowRecords, trigger: "blur"},
          ],
        },
      }
    },
    methods: {
      //提交备注
      onSubmitGenJin(formData) {
        this.$refs[formData].validate((valid) => {
          if (valid) {
            let data = {
              intentionId: this.genjin_form.intentionId,
              intentionLevel: this.genjin_form.intentionLevel,
              followRecords: this.genjin_form.followRecords,
              leadsId: this.leadsId,
              followType: 1,
            };
            this.$emit('genJinFunc', data)
          }
        });
      },
      radio_change(val) {
        this.$emit("radio_change", val)
      },
      genjindialogClose(){
        this.$emit("gjClose")
      },
      closeDialog() {
        this.$refs.GenJinform && this.$refs.GenJinform.resetFields();
      }
    },
    mounted() {}
  }
</script>

<style scoped lang="less">
   .dalig_bohao {
      img {
         width: 30px;
         position: absolute;
         right: 10px;
         top: 3px;
      }

      .el-textarea {
         /deep/ .el-input__count {
            line-height: 13px;
            bottom: -15px;
            right: 0;
         }
      }

      .dalig_bohao_header {
         display: flex;
         padding: 10px 20px;
         width: 100%;
         border: 1px solid #f2f2f2;
         border-radius: 3px;
         height: 137px;

         .bohao_header_left {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            .left_in {
               margin: 10px 0;
               font-weight: 600;
               font-size: 20px;
            }
         }

         .bohao-header_right {
            width: 50%;
            flex-direction: column;
            display: flex;
            justify-content: center;
            align-items: center;

            div {
               width: 122px;
               height: 122px;
               margin-bottom: 10px;

               img {
                  width: 100%;
               }
            }

            p {
               color: darkred;
            }
         }
      }

      .infos_buttons {
         width: 100%;
         display: flex;
         justify-content: space-between;
         padding-bottom: 5px;
      }

      .info_button {
         /deep/ .el-form-item__content {
            display: flex;
            flex-direction: row !important;
         }

         /deep/ .el-form-item__content {
            margin-left: 0 !important;
         }

         .info {
            display: inline-block;
            font-size: 12px;
            color: darkred;
         }
      }
   }
</style>