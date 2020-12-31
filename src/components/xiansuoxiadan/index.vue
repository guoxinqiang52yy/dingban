<template>
  <el-dialog :close-on-click-modal="false" :visible.sync="xiadan_dalig" @close="closeDialog" title="选择合同模板" width="20%">
    <el-form :model="xaidan_form" :rules="xaidanRulesFrom" class="form_xiadan" label-width="79px" ref="XiaDanform" size="small">
      <el-form-item label="选择服务" prop="fwvalue">
        <el-select @change="selectFwLx" clearable placeholder="请选择服务类型" v-model="xaidan_form.fwvalue">
          <el-option :key="index" :label="item.name" :value="item.groupId" v-for="(item, index) in yxGenJinData"></el-option>
        </el-select>
      </el-form-item>
      <!--这个是先选一级服务   再选关联的模板只有选择了资质才显示包含人才合同的勾选-->
      <el-form-item label="选择模板" prop="templateId">
        <el-select clearable placeholder="请选择模板类型" v-model="xaidan_form.templateId">
          <el-option :key="index" :label="item.templateName" :value="item.templateId" v-for="(item, index) in options_mblx"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="xaidan_form.isTalent">包含人才合同</el-checkbox>
      </el-form-item>
    </el-form>
    <span class="dialog-footer" slot="footer">
      <el-button @click="xdClose" size="mini">取消</el-button>
      <el-button @click="xiadan_Submit('XiaDanform')" size="mini" type="primary">确认创建</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import myMixin from "../../assets/js/minx/minx";

    export default {
        name: "index",
        mixins: [myMixin],
        props: ['xiadan_dalig', 'yxGenJinData', 'leadsId', 'companyNamePush'],
        data() {
            return {
                options_mblx: [] /*模板类型*/,
                xaidan_form: {
                    fwvalue: null,
                    templateId: null,
                    isTalent: false,
                } /*下单*/,
                xaidanRulesFrom: {
                    fwvalue: [{required: true, message: "请选择服务类型", trigger: "change"}],
                    templateId: [{required: true, message: "请选择模板类型", trigger: "change"}],
                },
                pushGroup: {},
                labelName: ''
            }
        },
        methods: {
            //下单提交
            xiadan_Submit(formData) {
                this.$refs[formData].validate((valid) => {
                    if (valid) {
                        let data = JSON.parse(JSON.stringify(this.xaidan_form));
                        this.pushGroup = {
                            labelName: this.labelName,
                            companyName: this.companyNamePush,
                            groupId: data.fwvalue
                        }
                        delete data.fwvalue;
                        data = {...data, leadId: this.leadsId}
                        data.isTalent ? (data.isTalent = 1) : (data.isTalent = 0);
                        this.functionXiaDan(data)
                    }
                })
            },
            async functionXiaDan(data) {
                let res = await this.Axios.post(`order-api/orderlist/get/detail`, data, "postJson");
                if (res.data.code === 0) {
                    this.showMessage("success", "创建成功");
                    this.$emit("xiadanNo")
                    this.pushGroup = {...this.pushGroup, result: res.data.result}
                    this.pushParams({...this.pushGroup})
                    this.$router.push({path: "/order/addorder"});
                }
            },
            selectFwLx(val) {
                if (val) {
                    let obj = {};
                    obj = this.yxGenJinData.find((item) => {//这里的userList就是上面遍历的数据源
                        return item.groupId === val;//筛选出匹配数据
                    });
                    this.labelName = obj.name
                    this.getMoBanLeiX(val);
                } else {
                    this.xaidan_form.templateId = null;
                }
            },
            //选择服务获取模板类型
            async getMoBanLeiX(groupId) {
                let res = await this.Axios.get(`order-api/contractconfig/query/by/serve?groupId=${groupId}&type=1`);
                this.options_mblx = res.data.result;
            },
            xdClose() {
                this.$emit("xiadanNo")
            },
            closeDialog() {
                this.$refs.XiaDanform && this.$refs.XiaDanform.resetFields();
            }
        }
    }
</script>

<style scoped lang="less">
.form_xiadan {
  /deep/ .el-form-item__content {
    width: 171px;
  }

  .description {
    color: darkred;
    margin-top: 14px;
  }
}
</style>


