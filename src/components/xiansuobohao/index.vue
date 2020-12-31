<template>
    <el-dialog
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            :title="`${rowData.companyName} - ${rowData.contactName} - ${rowData.contactValue}`"
            :visible.sync="bohao_dialog"
            @close="closeDialog"
            class="dialogBoHaoClass"
            width="24%"
    >
        <div class="dalig_bohao">
            <img alt="" src="../../assets/qst/bohaoGif.gif"/>
            <!-- <div class="dalig_bohao_header">
              <div class="bohao_header_left">
                <p class="company_name_">{{ rowData.companyName }}</p>
                <p class="left_in">{{ rowData.contactName }}</p>
                <p>{{ rowData.contactValue }}</p>
              </div>
              <div class="bohao-header_right">
                <div><img alt="" src="../../../assets/qst/bohao1.gif" /></div>
                <p>正在录音</p>
              </div>
            </div> -->
            <el-form :model="baoHao_form" :rules="rulesBoHao" label-position="left" label-width="79px" ref="BoHaoform"
                     size="small">
                <el-form-item label="意向度" prop="intentionLevel">
                    <el-radio-group
                            :disabled="!change_show_radio2"
                            @change="radio_change"
                            v-model="baoHao_form.intentionLevel"
                    >
                        <el-radio :key="index" :label="val.id" v-for="(val, index) in yixData">{{ val.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="意向服务" prop="intentionId" style="margin: 10px 0 16px 0;width: 50%;"
                              v-if="change_show_radio">
                    <el-select :disabled="!change_show_radio" v-model="baoHao_form.intentionId">
                        <el-option :key="index" :label="val.name" :value="val.groupId"
                                   v-for="(val, index) in yxGenJinData"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="意向服务" style="margin: 10px 0 16px 0;width: 50%;" v-if="!change_show_radio">
                    <el-select :disabled="!change_show_radio" v-model="baoHao_form.intentionId">
                        <el-option :key="index" :label="val.name" :value="val.groupId"
                                   v-for="(val, index) in yxGenJinData"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电话状态" prop="callStatus" style="margin-top: 10px;">
                    <el-radio-group v-model="baoHao_form.callStatus">
                        <el-radio
                                :key="index"
                                :label="val.id"
                                @change="statusRadio(baoHao_form.callStatus, baoHao_form.intentionLevel)"
                                v-for="(val, index) in phoneTelData"
                        >
                            {{ val.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="followRecords" style="margin-top: 10px;margin-bottom: 19px;">
                    <el-input
                            :autosize="{ minRows: 2, maxRows: 4}"
                            :disabled="!change_show_radio2"
                            maxlength="100"
                            placeholder="请填写备注"
                            resize="none"
                            show-word-limit
                            type="textarea"
                            v-model="baoHao_form.followRecords"
                    ></el-input>
                </el-form-item>
                <el-form-item class="info_button">
                    <div class="infos_buttons">
                        <div class="info">
                            添加备注才能关闭该窗口，进行重新拨号
                        </div>
                        <div class="buttons" v-if="siyouBohao">
                            <el-button @click="bohaoSubmit('BoHaoform')" size="mini" type="primary">确定</el-button>
                        </div>
                        <div class="buttons" v-if="!siyouBohao">
                            <el-button @click="bohaoSubmit('BoHaoform')" size="mini" type="primary" v-if="!change_show_radio2">确定</el-button>
                            <el-button @click="bohaoGHSubmitCacle('BoHaoform')" size="mini" v-if="change_show_radio2">不领取</el-button>
                            <el-button @click="bohaoGHSubmit('BoHaoform',1)" size="mini" type="success" v-if="change_show_radio2">领取</el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "index",
        props: ['bohao_dialog', 'rowData','change_show_radio2','change_show_radio','yixData','yxGenJinData','phoneTelData','userCheckJIludata','siyouBohao'],
        data() {
            // 校验跟进记录长度
            let isfollowRecords = function isfollowRecords(rule, value, callback) {
                if (value.length < 10) {
                    callback(new Error("请输入最少10个字符"));
                } else {
                    callback();
                }
            };
            return {
                baoHao_form: {
                    intentionId: null,
                    intentionLevel: null,
                    callStatus: null,
                    followRecords: "",
                } /*拨号表单*/,
                rulesBoHao: {
                    intentionId: [{required: true, message: "请选择意向服务", trigger: "change"}],
                    intentionLevel: [{required: true, message: "请选择意向度", trigger: "change"}],
                    callStatus: [{required: true, message: "请选择电话状态", trigger: "change"}],
                    followRecords: [{required: true, message: "请输入备注", trigger: "blur"},
                        {validator: isfollowRecords, trigger: "blur"}],
                },
            }
        },
        methods: {
            //公海库拨号提交并领取
            bohaoGHSubmit(formData, num) {
                this.$refs[formData].validate((valid) => {
                    if (valid) {
                        this.$confirm("执行领取操作后,线索添加到到私有库,确认领取吗?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        })
                            .then(() => {
                                let data_ = {
                                    updateType: 0,
                                    leadsId: [this.userCheckJIludata.leadsId],
                                };
                                this.$emit("lingqu_func",data_, num)
                                this.bohaoSubmit(formData);
                            })
                            .catch(() => {
                                this.showMessage("info", "已取消此操作");
                            });
                    }
                })

            },
            //公海库拨号提交不领取
            bohaoGHSubmitCacle(formData) {
                this.$refs[formData].validate((valid) => {
                    if (valid) {
                        this.$confirm("执行不领取操作后,线索会流转到公海且该线索自动隐藏,确认放弃吗?", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                        })
                            .then(() => {
                                this.bohaoSubmit(formData);
                            })
                            .catch(() => {
                                this.showMessage("info", "已取消此操作");
                            });
                    }
                })
            },
            //拨号提交
            bohaoSubmit(formData, num) {
                if (!this.change_show_radio2) {
                    let data1 = {
                        followType: 0,
                        callStatus: this.baoHao_form.callStatus,
                    };
                    let datas = data1;
                    Object.assign(datas, this.userCheckJIludata);
                    if (this.userCheckJIludata.status) {
                        delete datas.status;
                        this.$emit("updateUserData",datas)
                    } else {
                        this.$emit("updateUserData",datas)
                    }
                } else {
                    this.$refs[formData].validate((valid) => {
                        if (valid) {
                            let data2 = {
                                callStatus: this.baoHao_form.callStatus,
                                intentionId: this.baoHao_form.intentionId,
                                intentionLevel: this.baoHao_form.intentionLevel,
                                followRecords: this.baoHao_form.followRecords,
                                followType: 0 /*跟进类型(0:电话 1:跟进 2:拜访)*/,
                            };
                            let datas = data2;
                            Object.assign(datas, this.userCheckJIludata);
                            if (this.userCheckJIludata.status) {
                                delete datas.status;
                                this.$emit("updateUserData",datas)
                            } else {
                                this.$emit("updateUserData",datas)
                            }
                        }
                    });
                }
            },
            statusRadio(val, num){
                this.$emit("statusRadio", val, num)
            },
            radio_change(val) {
                this.$emit("radio_change", val)
            },
            closeDialog() {
                this.$refs.BoHaoform && this.$refs.BoHaoform.resetFields();
            }
        },
        mounted() {

        }
    }
</script>

<style scoped lang="less">
    .dialogBoHaoClass {
        /deep/ .el-dialog__header {
            border-bottom: #f2f2f2 1px solid;
            height: 38px;
            display: flex;
            align-items: center;
        }

        .dalig_bohao {
            img {
                width: 30px;
                position: absolute;
                right: 10px;
                top: 3px;
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