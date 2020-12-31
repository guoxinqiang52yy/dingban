<template>
    <div class="finance_tablelist">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>财务系统</el-breadcrumb-item>
            <el-breadcrumb-item>财务列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="top_line"></div>
        <!--筛选表单-->
        <div class="box_siyou">
            <div class="formClass">
                <el-form :inline="true" :model="form_caiwu_" class="report_demo_form" label-width="69px">
                    <el-form-item label="合同所属" size="small" style="width:23%">
                        <el-select @change="get_tableData" clearable v-model="form_caiwu_.belongId">
                            <el-option label="全部服务" value=""></el-option>
                            <el-option :key="index" :label="val.partyName" :value="val.partId"
                                       v-for="(val, index) in htssData"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收回状态" size="small" style="width:23%">
                        <el-select @change="get_tableData" clearable v-model="form_caiwu_.callBackStatus">
                            <el-option label="全部状态" value=""></el-option>
                            <el-option :key="index" :label="val.label" :value="val.id"
                                       v-for="(val, index) in shztData"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="查看范围" size="small" style="width:27%">
                        <el-select @change="deptOrUserChange" style="width: 86px;" v-model="form_caiwu_.deptOrUser">
                            <el-option :key="index" :label="val.label" :value="val.id"
                                       v-for="(val, index) in ckfwSelectData"></el-option>
                        </el-select>
                        <el-cascader :options="ckfwtaData" :props="listPropsckfw" @change="get_tableData" clearable
                                     placeholder="请选择部门" ref="objArrcasa" v-if="!statusUser"
                                     v-model="form_caiwu_.deptOrUserId"></el-cascader>
                        <el-select @change="get_tableData" filterable no-data-text
                                   placeholder="请输入姓名" v-if="statusUser" v-model="form_caiwu_.deptOrUserName">
                            <el-option :key="index" :label="item.realName" :value="item.userId"
                                       v-for="(item, index) in userList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="form_search" label="" size="small" style="width: 19%;">
                        <el-input @keyup.enter.native="get_tableData" clearable placeholder="请输入企业名称关键字" type="text"
                                  v-model="form_caiwu_.companyName">
                            <el-button @click.stop="get_tableData" clearable icon="el-icon-search"
                                       slot="append"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item size="small" style="width: 4%;">
                        <el-button @click="downLoad" size="mini" type="primary">导出</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!--表格-->
            <div class="table_pagination">
                <div class="tableClass">
                    <el-table :cell-style="cellStyle" :data="tableData"
                              :header-cell-style="table_heard_style"
                              :row-key="row_key"
                              @selection-change="select_checkBox"
                              border
                              class="form1"
                              element-loading-text="拼命加载中"
                              highlight-current-row
                              ref="table"
                              size="mini"
                              stripe
                              v-loading="listLoading"
                    >
                        <el-table-column :resizable="false" type="selection" width="50"></el-table-column>
                        <el-table-column label="订单编号" prop="orderId" width="120"></el-table-column>
                        <el-table-column label="合同编号" prop="contractCode" width="120"></el-table-column>
                        <el-table-column label="企业名称" prop="companyName" width="120"></el-table-column>
                        <el-table-column label="服务名称" min-width="200" prop="skuName">
                            <template slot-scope="scope">
                                <div :key="i" v-for="(val, i) in scope.row.skuSplit1">
                                    <span>{{ val }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="合同金额" prop="contractPrice" width="80">
                            <template slot-scope="scope">
                                <span>{{ scope.row.contractPrice / 100 }}元</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="标准价" prop="orgPrice" width="80">
                            <template slot-scope="scope">
                                <span>{{ scope.row.orgPrice / 100 }}元</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="差额" prop="contractPrice,orgPrice" width="80">
                            <template slot-scope="scope">
                                <!--<span v-if="scope.row.contractPrice - scope.row.orgPrice>0">{{scope.row.contractPrice - scope.row.orgPrice}}</span>-->
                                <!--<span v-if="scope.row.contractPrice - scope.row.orgPrice<=0">&#45;&#45;</span>-->
                                <span>{{ (scope.row.contractPrice - scope.row.orgPrice) / 100 }}元</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="付款批次" prop="batch" width="80"></el-table-column>
                        <el-table-column label="已付款" prop="accountPaid" width="80">
                            <template slot-scope="scope">
                                <span>{{ scope.row.accountPaid / 100 }}元</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="欠款" prop="contractPrice,accountPaid" width="80">
                            <template slot-scope="scope">
                                <!--<span v-if="scope.row.contractPrice - scope.row.accountPaid>0">{{scope.row.contractPrice - scope.row.accountPaid}}</span>-->
                                <!--<span v-if="scope.row.contractPrice - scope.row.accountPaid<=0">&#45;&#45;</span>-->
                                <span>{{ (scope.row.contractPrice - scope.row.accountPaid) / 100 }}元</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="付款明细" min-width="295" prop="payMessage">
                            <template slot-scope="scope">
                                <div :key="i" v-for="(val, i) in scope.row.skuSplit2">
                                    <span>{{ val }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="所在部门" prop="deptName" width="110"></el-table-column>
                        <el-table-column label="业务人员" prop="ownerName" width="70"></el-table-column>
                        <el-table-column label="收回状态" prop="callBackStatus" width="110">
                            <template slot-scope="scope">
                                <span>{{ scope.row.callBackStatus === 0 ? "未收回" : "已收回" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="合同所属" prop="secondName" width="110"></el-table-column>
                        <el-table-column label="成立日期" prop="setUpTime" width="90">
                            <template slot-scope="scope">
                                <span>{{ scope.row.setUpTime === "0" || scope.row.accountPaid === 0 ? "--" : scope.row.setUpTime }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="130">
                            <template slot-scope="scope">
                                <el-button @click="dayin(scope.row)" style="color:#891ce6;marginBottom:5px;padding: 0;"
                                           type="text">打印
                                </el-button>
                                <el-button :disabled="scope.row.accountPaid===0?true:false"
                                           :style="{color:scope.row.accountPaid!==0?'#f80208':'#9a9a9a',marginLeft:'6px',padding: '0',marginBottom: '5px'}"
                                           @click="tuikuan(scope.row)"
                                           type="text"
                                           v-if="scope.row.status>=200">退款
                                </el-button>
                                <!--<el-button @click="tuikuan(scope.row)"-->
                                <!--style="color:#f80208;padding: 0;margin-bottom: 5px;marginLeft:6px;"-->
                                <!--type="text" v-if="scope.row.status >= 200">退款-->
                                <!--</el-button>-->
                                <el-button :disabled="scope.row.callBackStatus === 0 ? false : true"
                                           :style="{ color: scope.row.callBackStatus === 0 ? '#08b400' : '#9a9a9a', padding: '0' }"
                                           @click="hetongshouhui(scope.row)" type="text">合同收回
                                </el-button>
                                <el-button @click="shoukuan(scope.row)" style="color:#288cf5;padding: 0;marginLeft:6px;"
                                           type="text">收款
                                </el-button>
                                <!--<el-button :disabled="(scope.row.contractPrice - scope.row.accountPaid)===0?true:false"-->
                                <!--:style="{color:scope.row.contractPrice - scope.row.accountPaid!==0?'#288cf5':'#9a9a9a',marginLeft:'6px',padding: '0'}"-->
                                <!--@click="shoukuan(scope.row)"-->
                                <!--type="text">收款-->
                                <!--</el-button>-->
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--分页器-->
                <div class="pagination_clumun">
                    <el-pagination :current-page="currentPage4" :page-size="pageSize" :page-sizes="[10, 20, 30]"
                                   :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
                </div>
            </div>
        </div>
        <!--退款-->
        <el-dialog :close-on-click-modal="false" :visible.sync="tuikuan_dalig" @close="closeDialog" title="退款"
                   width="30%">
            <div class="tuikuan_dialog">
                <div class="tuikuan_culomn1">
                    <div class="tuikuan_culomn1Left">
                        <p class="orderClass">
                            <span class="orderClassTitle">订单编号</span>: <span>{{ rowTable.orderId }}</span>
                        </p>
                        <p>
                            <span class="orderClassTitle">合同编号</span>: <span>{{ rowTable.contractCode }}</span>
                        </p>
                    </div>
                    <div class="tuikuan_culomn1Right">
                        <p class="orderClassTitle">
                            <span class="orderClassTitle">企业名称</span>: <span>{{ rowTable.companyName === null ? "--" : rowTable.companyName }}</span>
                        </p>
                    </div>
                </div>

                <div class="tuikuan_culomn2">
                    <el-card :body-style="{ padding: '5px' }" class="box-card">
                        <div class="clearfix" slot="header">
                            <span>流程操作</span>
                        </div>
                        <div>
                            <el-table :cell-style="cellStyle" :data="tuiKtableData"
                                      :header-cell-style="table_heard_style"
                                      :row-key="row_key" border highlight-current-row stripe>
                                <el-table-column label="服务名称" prop="serviceName"></el-table-column>
                                <el-table-column fixed="right" label="操作" width="115">
                                    <template slot-scope="scope">
                                        <el-checkbox @change="stopSku($event, scope.row)" v-model="scope.row.skuguo">
                                            停止该服务
                                        </el-checkbox>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                </div>
                <div class="tuikuan_culomn3">
                    <el-card :body-style="{ padding: '5px' }" class="box-card">
                        <div class="clearfix" slot="header">
                            <span>退款明细</span>
                        </div>
                        <div>
                            <el-form :model="tuikuanForm" label-width="80px" ref="tuikuanForm">
                                <el-form-item class="tuikuanForm1" label="退款金额">
                                    <el-input
                                            @input="tuikuanForm.refundAmount = tuikuanForm.refundAmount.replace(/^(0+)|[^\d]+/g, '')"
                                            placeholder="请输入退款金额" size="small"
                                            v-model="tuikuanForm.refundAmount"></el-input>
                                </el-form-item>
                                <el-form-item label="退款原因">
                                    <el-input :autosize="{ minRows: 1, maxRows: 4 }" maxlength="100"
                                              placeholder="请输入退款原因" resize="none" show-word-limit type="textarea"
                                              v-model="tuikuanForm.refundReason"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-card>
                </div>
            </div>
            <span class="dialog-footer" slot="footer">
        <el-button @click="tuikuan_dalig = false" size="mini">取消</el-button>
        <el-button @click="tuikuan_Submit" size="mini" type="primary">提交</el-button>
      </span>
        </el-dialog>
        <!--收款-->
        <el-dialog :close-on-click-modal="false" :visible.sync="shoukuan_dalig" @close="closeDialog" title="付款明细"
                   width="45%">
            <div class="shoukuan_dialogBox">
                <div class="tuikuan_culomn3">
                    <div class="shoukuanBox">
                        <div class="shoukuan_culomn1ddbh">
                            <p class="orderClass">
                                <span class="orderClassTitle">订单编号</span>:
                                <span> {{ rowTable.orderId }}</span>
                            </p>
                            <p class="orderClass">
                                <span class="orderClassTitle">企业名称</span>:
                                <span> {{ rowTable.companyName === null ? "--" : rowTable.companyName }}</span>
                            </p>
                        </div>
                        <div class="shoukuan_culomn1ddbh">
                            <p class="orderClass">
                                <span class="orderClassTitle">合同金额</span>:
                                <span> {{ rowTable.contractPrice/100}}元</span>
                            </p>
                            <p class="orderClass">
                                <span class="orderClassTitle">已付款情</span>:
                                <span> {{ rowTable.accountPaid/100}}元</span>
                            </p>
                        </div>
                        <div class="shoukuan_culomn1ddbh">
                            <p class="orderClass">
                                <span class="orderClassTitle">剩余欠款</span>:
                                <span> {{(rowTable.contractPrice - rowTable.accountPaid)/100}}元</span>
                            </p>
                            <p class="orderClass">
                                <span class="orderClassTitle">付款批次</span>:
                                <span>{{ rowTable.batch }}</span>
                            </p>
                        </div>
                    </div>
                    <div>
                        <el-table :cell-style="cellStyle" :data="shouKtableData" :header-cell-style="table_heard_style"
                                  :row-key="row_key" border highlight-current-row stripe>
                            <el-table-column label="批次" prop="batch" width="50">
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row.disableds ?'#9a9a9a':'red'}">{{scope.row.batch}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="阶段" prop="nodeName" width="90">
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row.disableds ?'#9a9a9a':'red'}">{{scope.row.nodeName===null?'--':scope.row.nodeName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="应付" prop="payable" width="100">
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row.disableds ?'#9a9a9a':'red'}">{{scope.row.payable/100}}元</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="方式" prop="payType" width="115">
                                <template slot-scope="scope">
                                    <el-select :disabled="scope.row.disableds ? true : false"
                                               @change="columnChange($event,scope.row)"
                                               size="mini" v-model="scope.row.payType">
                                        <el-option :key="index" :label="val.label" :value="val.id"
                                                   v-for="(val, index) in fangshiData"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="实付" prop="payActual" width="100">
                                <template slot-scope="scope">
                                    <el-input :disabled="scope.row.disableds ? true : false"
                                              @input="scope.row.payActual=scope.row.payActual.replace(/^(0+)|[^\d]+/g, '')"
                                              size="mini"
                                              v-model="scope.row.payActual"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="银行名称" prop="bankCard">
                                <template slot-scope="scope">
                                    <!--<el-select size="mini" v-if="scope.row.payType===1" v-model="scope.row.bankCard">-->
                                    <!--<el-option :key="index" :label="textbankName(val.bankInfo,val.bankcard)"-->
                                    <!--:value="val.bankcard"-->
                                    <!--v-for="(val,index) in bankData"></el-option>-->
                                    <!--</el-select>-->
                                    <!--<el-input size="mini" v-else v-model="scope.row.bankCard"></el-input>-->
                                    <el-select :disabled="scope.row.payType !== 1 || scope.row.disableds ? true : false"
                                               @change="bankCardChange($event,scope.row)"
                                               size="mini" v-model="scope.row.bankCard">
                                        <el-option :key="index" :label="textbankName(val.bankInfo, val.bankcard)"
                                                   :value="val.bankcard" v-for="(val, index) in bankData"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column label="付款时间" prop="payTime" width="100">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.disableds">
                                        {{ scope.row.payTime === "0" || scope.row.payTime==="1970-01-01 08:00:00"? "--" : scope.row.payTime }}
                                    </span>
                                    <span v-if="!scope.row.disableds">
                                        {{ scope.row.payTime === "0" || scope.row.payActual===0 ? "--" : scope.row.payTime }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="备注" prop="remark">
                                <template slot-scope="scope">
                                    <el-input :autosize="{ minRows: 1, maxRows: 4 }"
                                              :disabled="scope.row.disableds ? true : false" maxlength="100"
                                              placeholder="备注" resize="none" size="mini" type="textarea"
                                              v-model="scope.row.remark"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <span class="dialog-footer" slot="footer">
                <el-button @click="shoukuan_dalig = false" size="mini">取消</el-button>
                <el-button :disabled="(rowTable.contractPrice - rowTable.accountPaid)===0?true:false"
                           @click="shoukuan_Submit" size="mini"
                           type="primary">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import myMixin from "../../../assets/js/minx/minx";
    import axios from "axios";

    export default {
        components: {},
        mixins: [myMixin],
        name: "index",
        data() {
            return {
                input3: "",
                select: "",
                listPropsckfw: {
                    value: "depId",
                    label: "name",
                    children: "children",
                    checkStrictly: true,
                },
                bankData: [],
                select_box: [],
                ckfwtaData: [],
                tuikuanForm: {
                    refundReason: "",
                    refundAmount: null,
                },
                form_caiwu_: {
                    belongId: "",
                    callBackStatus: "",
                    companyName: "",
                    deptOrUser: 1,
                    deptOrUserId: '',
                    deptOrUserName: ''
                },
                shztData: [
                    {id: 0, label: "未收回"},
                    {id: 1, label: "已收回"},
                ],
                ckfwSelectData: [
                    {id: 1, label: "部门"},
                    {id: 0, label: "人员"},
                ],
                htssData: [],
                tuiKtableData: [],
                shouKtableData: [],
                arrSave: [],
                searchSelect: null,
                searchSelectData: [
                    {id: 1, label: "房产"},
                    {id: 2, label: "中介"},
                ],
                tableData: [],
                fangshiData: [
                    {id: 1, label: "银行卡"},
                    {id: 2, label: "支付宝"},
                    {id: 3, label: "微信"},
                    {id: 4, label: "现金"},
                ],
                currentPage4: 1 /*分页*/,
                pageNum: 0,
                pageSize: 10,
                total: 0,
                tuikuan_dalig: false,
                shoukuan_dalig: false,
                rowTable: {},
                tableEmpty: "",
                userList: [],
                statusUser: false,
                listLoading: false,
                skuIdList: [],
                tableDatasList: [],
            };
        },
        watch: {
            tuiKtableData(val) {
                val.forEach((va) => {
                    Object.assign(va, skuguo);
                    va.skuguo = false;
                });
            },
            tableData(val) {
                if (!this.isobjEmpty(val)) {
                    val.forEach((va) => {
                        let skudata = [],
                            skuSplit = [];
                        if (!this.isobjEmpty(va.skuName)) {
                            skudata = va.skuName.split("@");
                        }
                        if (!this.isobjEmpty(va.payMessage)) {
                            skuSplit = va.payMessage.split("@");
                        }
                        Object.assign(va, {skuSplit1: skudata, skuSplit2: skuSplit});
                    });
                }
            },
            // statusUser(val){
            //     if (val){
            //         this.form_caiwu_.deptOrUserId = ''
            //         console.log(this.form_caiwu_.deptOrUserId);
            //     }
            //
            // }
        },
        mounted() {
            this.functionHtssData();
            this.getOrgList();
            this.get_tableData();
            this.getUserList(201019000015749);
            setInterval(function () {
                document.querySelectorAll(".el-cascader-node .el-radio").forEach((el) => {
                    el.style.display = "none";
                });
                document.querySelectorAll(".el-cascader-node__label").forEach((el) => {
                    el.onclick = function () {
                        if (this.previousElementSibling) this.previousElementSibling.click();
                    };
                });
            }, 0);
        },
        methods: {
            columnChange(val, row) {
                if (row.payType !== 1) {
                    row.bankCard = ''
                    console.log(row);
                }
            },
            bankCardChange(val, row) {
                console.log(row, val);
            },
            //打印
            dayin(row) {
            },
            stopSku(val, row) {
                val && this.skuIdList.push(row.skuId);
            },
            // 退款
            tuikuan(row) {
                this.tuikuan_dalig = true;
                this.rowTable = row;
                this.functionTKfuwu(parseInt(row.orderId));
            },
            //退款提交
            tuikuan_Submit() {
                if (this.skuIdList.length > 0) {
                    let data = {
                        orderId: parseInt(this.rowTable.orderId),
                        contractId: parseInt(this.rowTable.contractId),
                        refundAmount: parseInt(this.tuikuanForm.refundAmount),
                        refundReason: this.tuikuanForm.refundReason,
                        skuIds: [...this.skuIdList],
                    };
                    this.functionAddTK(data);
                } else {
                    this.showMessage("info", "退款服务不能为空");
                }
            },
            //退款服务接口
            async functionTKfuwu(orderId) {
                let res = await this.Axios.get(`workflow-api/servicelist/list?orderId=${orderId}`);
                this.tuiKtableData = res.data.result;
            },
            //退款提交接口
            async functionAddTK(data) {
                let res = await this.Axios.post("order-api/refundlist/add", data, "postJson");
                if (res.data.code === 0) {
                    this.showMessage("success", "更退款信息成功");
                }
                this.tuikuan_dalig = false;
                this.getListTable(this.tableDatasList);
            },
            //合同收回
            hetongshouhui(row) {
                this.$confirm("该合同是否收回?", "提示", {
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    type: "warning",
                })
                    .then(() => {
                        this.functionShouHui(row.contractId);
                    })
                    .catch(() => {
                        this.showMessage("info", "已取消此操作");
                    });
            },
            //收回接口
            async functionShouHui(contractId) {
                let res = await this.Axios.get(`order-api/refundlist/takeBack?contractId=${contractId}`);
                if (res.data.code === 0) {
                    this.showMessage("success", "收回成功");
                    this.getListTable(this.tableDatasList);
                }
            },
            //收款
            shoukuan(row) {
                this.shoukuan_dalig = true;
                this.rowTable = row;
                this.functionShouKuan(row.contractId);
                this.functionshoukuan2();
            },
            //收款接口
            async functionShouKuan(contractId) {
                let res = await this.Axios.get(`order-api/paymentlist/getByContractId?contractId=${contractId}`);
                this.shouKtableData = res.data.result;
                let disid = []
                this.shouKtableData.forEach((val) => {
                    if (val.payType !== 0) {
                        Object.assign(val, {disableds: true});
                    } else {
                        val.payType = "";
                        val.bankCard = "";
                        Object.assign(val, {disableds: false});
                        disid.push(val.batch)
                    }
                    if (val.bankCard === "0") {
                        val.bankCard = ""
                    }
                    if (!this.isobjEmpty(val.payActual)) {
                        val.payActual = val.payActual / 100
                    }
                });
                this.shouKtableData.forEach((val) => {
                    // disid.forEach((vals) => {
                    //     if (val.batch !== disid[0]) {
                    //         Object.assign(val, {disableds: true});
                    //     }
                    // })
                    if (val.batch !== disid[0]) {
                        Object.assign(val, {disableds: true});
                    }
                })
            },
            // 收款接口
            async functionshoukuan2() {
                let res = await this.Axios.get(`order-api/secondparty/query/echo`);
                this.bankData = res.data.result;
            },
            //收款提交
            shoukuan_Submit() {
                let data = {
                    contractId: this.rowTable.contractId,
                    paymentMsgS: {
                        bankCard: 0,
                        batch: 0,
                        nodeName: "",
                        payActual: 0,
                        payTime: "",
                        payType: 0,
                        payable: 0,
                        remark: ""
                    }
                };
                if (!this.isobjEmpty(this.shouKtableData)) {
                    this.arrSave = JSON.parse(JSON.stringify(this.shouKtableData));
                    this.arrSave.forEach((val, i) => {
                        val.disableds && this.arrSave.splice(i, 1);
                    });
                    delete this.arrSave[0].disableds;
                    data.paymentMsgS = {...this.arrSave[0]};
                    let price = this.shouKtableData.reduce((prev, next) => {
                        return prev + next.payActual
                    }, 0)
                    data.paymentMsgS.payable = (data.paymentMsgS.payable) * 100
                    data.paymentMsgS.payActual = (data.paymentMsgS.payActual) * 100
                    if (this.isobjEmpty(data.paymentMsgS.payType)) {
                        this.showMessage("info", "请选择收款方式");
                    } else if (data.paymentMsgS.payType === 1 && data.paymentMsgS.bankCard === "") {
                        this.showMessage("info", "请选择银行名称");
                    } else if (this.isobjEmpty(data.paymentMsgS.payActual)) {
                        this.showMessage("info", "请填写实付款");
                    } else {
                        //如果是最后一个批次提交,判断总金额是否小于合同金额
                        if (data.paymentMsgS.batch === this.rowTable.batch) {
                            if ((price * 100) < this.rowTable.contractPrice) {
                                this.showMessage("info", "所有收款金额不能小于合同金额,请重新输入")
                            } else {
                                this.addShouKuan(data);
                            }
                        } else {
                            this.addShouKuan(data);
                        }
                    }
                } else {
                    this.showMessage("info", "暂无数据");
                }
            },
            //收款提交接口
            async addShouKuan(data) {
                let res = await this.Axios.post("order-api/paymentlist/addPaymentMsg", data, "postJson");
                if (res.data.code === 0) {
                    this.showMessage("success", "更新收款信息成功");
                }
                this.shoukuan_dalig = false;
                this.getListTable(this.tableDatasList);
            },
            //导出
            downLoad() {
                if (!this.isobjEmpty(this.select_box)) {
                    let idArr = this.select_box.map((item) => parseInt(item.contractId));
                    var a = document.createElement("a");
                    a.href = `${axios.defaults.baseURL}order-api/paymentlist/exportExcel?contractIds=${idArr}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    this.select_box = [];
                } else {
                    this.showMessage("info", "请选择要操作的数据");
                }
            },
            //筛选
            async getListTable(data) {
                this.listLoading = true
                let url = `order-api/paymentlist/query?pageSize=${this.pageSize}&pageNum=${this.pageNum}&companyName=${data.companyName}&deptOrUserId=${data.deptOrUserId}&deptOrUser=${data.deptOrUser}&callBackStatus=${data.callBackStatus}&belongId=${data.belongId}`;
                let res = await this.Axios.get(url);
                if (res.data.code === 0) {
                    this.tableData = res.data.result;
                    this.total = res.data.total;
                    this.listLoading = false
                }
            },
            //获取列表数据
            async get_tableData() {
                let datas = {
                    companyName: this.form_caiwu_.companyName,
                    deptOrUserId: "",
                    deptOrUser: this.form_caiwu_.deptOrUser,
                    callBackStatus: this.form_caiwu_.callBackStatus,
                    belongId: this.form_caiwu_.belongId
                }
                if (datas.deptOrUser === 1) {
                    //部门
                    if (!this.isobjEmpty(this.form_caiwu_.deptOrUserId)) {
                        datas.deptOrUserId = parseInt(this.form_caiwu_.deptOrUserId.slice(-1).toString());
                    }
                }
                if (datas.deptOrUser === 0) {
                    //人员
                    if (!this.isobjEmpty(this.form_caiwu_.deptOrUserName)) {
                        let dataName = parseInt(this.form_caiwu_.deptOrUserName)
                        datas.deptOrUserId = dataName
                    }
                }
                this.pageNum = 0;
                this.pageSize = 10;
                this.currentPage4 = 1;
                this.tableDatasList = datas;
                this.getListTable(datas);
            },
            deptOrUserChange(val) {
                this.form_caiwu_.deptOrUserId = ""
                this.form_caiwu_.deptOrUserName = ""
                if (val === 1) {
                    this.statusUser = false;
                } else {
                    this.statusUser = true;
                }
            },
            //获取所有人员接口
            async getUserList(depId) {
                let res = await this.Axios.get(`ucenter-api/userlist/getUserList?depId=${depId}&pageSize=500&pageNum=0`);
                if (res.data.code === 0) {
                    this.userList = res.data.result;
                }
            },
            //获取组织列表
            async getOrgList() {
                let _resp = await this.Axios.get(`ucenter-api/departmentlist/tree`);
                this.ckfwtaData = [this.dataAssembly(_resp.data.result[0])];
                this.data_(this.ckfwtaData);
            },
            //合同所属列表接口
            async functionHtssData() {
                let res = await this.Axios.get(`order-api/secondparty/query/echo`);
                this.htssData = res.data.result;
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getListTable(this.tableDatasList);
            },
            handleCurrentChange(val) {
                this.currentPage4 = val;
                this.pageNum = val - 1;
                this.getListTable(this.tableDatasList);
            },
            //表格选中项数组
            select_checkBox(val) {
                this.select_box = val;
            },
            //数据处理===银行名称
            textbankName(name, card) {
                if (!this.isobjEmpty(card)) {
                    let car = card.substring(card.length - 4, card.length);
                    return `${name}(${car})`;
                }
            },
            // ==== 数据处理
            dataAssembly(data) {
                let _data = JSON.parse(JSON.stringify(data)); //深拷贝
                function change(data) {
                    Object.keys(data).forEach((val) => {
                        Object.assign(data, {isFirst: false, isEdit: false});
                        if (val == "children") {
                            data[val].forEach((val2) => {
                                change(val2);
                            });
                        }
                    });
                }

                change(_data);
                return _data;
            },
            //关闭回调
            closeDialog() {
                this.tuikuanForm.refundAmount = null;
                this.tuikuanForm.refundReason = "";
            },
        },
    };
</script>
<style scoped lang="less">
    @import "index";

    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        //滚动条的宽度
        width: 6px;
        height: 6px;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
        border-radius: 20px;
        /*background: rgba(34, 45, 50, 0.1);*/
        background-color: #f2f2f2;
        background-clip: padding-box;
        min-height: 28px;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(242, 242, 242, 0.2);
        border-radius: 10px;
        /*background: rgba(240, 240, 240, 0.1);*/
        width: 6px;
        background: rgba(#101F1C, 0.1);
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-track-piece {
        //滚动条凹槽的颜色，还可以设置边框属性
        background-color: #fff;
        border: none;
        outline: none;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
        background-color: #bababa;
        width: 20px !important;
        height: 20px !important;
        background-color: rgba(#101F1C, 1);
    }
</style>