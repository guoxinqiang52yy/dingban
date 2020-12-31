<template>
    <div class="xiansuo_chengjiao">
        <div class="box_siyou">
            <div class="formClass">
                <el-form :inline="true" :model="form_list_" class="report_demo_form" label-width="96px">
                    <!--权限 只有领导可以查看部门下所有人-->
                    <el-form-item label="查看范围" size="small" style="width:19%" v-show="!mapShow_status">
                        <el-select :disabled="!userMangageType"
                                   @change="form_fanwei(form_list_.leadsQueryInfo.rangeType)" v-model="form_list_.leadsQueryInfo.rangeType">
                            <el-option :key="index"
                                       :label="val.label"
                                       :value="val.id"
                                       @click.native="click_ckfw_change(val.id)"
                                       v-for="(val, index) in ckfwData"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="查看范围" size="small" style="width:19%" v-show="!mapShow_status">
                        <el-button>更换皮肤</el-button>
                        <theme></theme>
                    </el-form-item>

                </el-form>
            </div>
            <!--表格-->
            <div class="table_pagination" v-show="!mapShow_status">
                <div class="tableClass">
                    <el-table
                            :cell-style="cellStyle"
                            :data="tableData"
                            :header-cell-style="table_heard_style"
                            :row-key="row_key"
                            border
                            class="form1"
                            highlight-current-row
                            ref="table"
                            stripe
                    >
                        <el-table-column :resizable="false" label="订单编号" prop="orderId">
                            <template slot-scope="scope">
                                <el-link @click="routerLink(scope.row)" type="primary">{{scope.row.orderId}}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column :resizable="false" label="企业名称" prop="companyName"></el-table-column>
                        <el-table-column :resizable="false" label="联系人" prop="contactName" width="80"></el-table-column>
                        <el-table-column label="联系方式" prop="companyCheck" width="130px">
                            <template slot-scope="scope">
                                <div style="display: flex;justify-content: flex-start">
                  <span v-if="scope.row.contactType === 1">
                    <span @click="phone_tel(scope.row, scope.row.contactValue)" class="table_span"
                          style="cursor: pointer;" v-has="'/xiansuo-chengjiao/get-bohao-look'">
                      <img alt="" src="../../../assets/qst/pnone_.png"/>
                    </span>
                    <span>{{ scope.row.contactValue !== "" ? scope.row.contactValue : "" }}</span>
                  </span>
                                    <span v-if="scope.row.contactType === 3">
                    <span @click="phone_tel(scope.row, scope.row.contactValue)" class="table_span"
                          style="cursor: pointer;" v-has="'/xiansuo-chengjiao/get-bohao-look'">
                      <img alt="" src="../../../assets/qst/pnone_.png"/>
                    </span>
                    <el-link style="color: #409EFF;">
                      {{ scope.row.contactValue !== "" ? scope.row.contactValue : "" }}
                    </el-link>
                  </span>
                                    <span v-if="scope.row.contactType === 2">
                    <span class="table_span" v-has="'/xiansuo-chengjiao/get-bohao-look'">
                      <img alt="" src="../../../assets/qst/wx_1.png"/>
                    </span>
                    <el-link style="color: #409EFF;">
                      {{ scope.row.contactValue }}
                    </el-link>
                  </span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :resizable="false" label="所在地区" prop="areaName"></el-table-column>
                        <el-table-column :resizable="false" label="成交服务" prop="skuNameList">
                            <template slot-scope="scope">
                                <div v-if="scope.row.skuNameList.length===0">--</div>
                                <div v-if="scope.row.skuNameList.length!==0">
                                    <div :key="index" v-for="(val,index) in scope.row.skuNameList">
                                        {{val}}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :resizable="false" label="订单成立时间" prop="orderTime"
                                         width="110"></el-table-column>
                        <el-table-column :resizable="false" label="订单金额" prop="totalPrice" width="110">
                            <template slot-scope="scope">
                                <span>{{scope.row.totalPrice!==0?scope.row.totalPrice:'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :resizable="false" label="业务人员" prop="userName" width="80"></el-table-column>
                        <el-table-column :resizable="false" label="部门" prop="deptName"></el-table-column>
                        <el-table-column :resizable="false" fixed="right" label="操作" width="110">
                            <template slot-scope="scope">
                                <el-button @click="xiadan(scope.row)" style="color:#E6A23C;marginLeft:6px;"
                                           type="text" v-has="'/xiansuo-siyou/get_xiadan_look'">下单
                                </el-button>
                                <el-button @click="genjin(scope.row)" style="color:#67C23A;marginLeft:6px;"
                                           type="text" v-has="'/xiansuo-chengjiao/get-genjin-look'">跟进
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--分页器-->
                <div class="pagination_clumun">
                    <el-pagination
                            :current-page="currentPage4"
                            :page-size="pageSize"
                            :page-sizes="[10, 20, 30]"
                            :total="total"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        <!--查看范围 部门-->
        <el-dialog :close-on-click-modal="false" :visible.sync="fanwei_dialog" @close="closeDialog" title="查看部门"
                   width="30%">
            <div class="table_domo">
                <div class="tree_demo">
                    <tree :list="lists" @nodeClick="nodeClick" showlength="true"></tree>
                </div>
                <div class="table_list">
                    <!-- <div class="name_check_box">
                      <div style="margin: 10px 0;"></div>
                      <el-checkbox-group v-model="formFW.checkedName">
                        <div :key="index" class="check_box_" v-for="(val, index) in userList">
                          <el-checkbox :label="val.userId">{{ val.realName }}</el-checkbox>
                        </div>
                      </el-checkbox-group>
                    </div> -->
                    <el-form :model="formFW">
                        <el-form-item label="" label-width="68px" size="medium">
                            <el-select
                                    :multiple-limit="6"
                                    filterable
                                    multiple
                                    no-data-text
                                    placeholder="请输入姓名关键字搜索"
                                    style="width: 100%;"
                                    v-model="formFW.name"
                            >
                                <el-option :key="index" :label="item.realName" :value="item.userId"
                                           v-for="(item, index) in userList"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span class="dialog-footer" slot="footer">
        <el-button @click="cacle_fanwei">取 消</el-button>
        <el-button @click="y_fanwei" type="primary">确 定</el-button>
      </span>
        </el-dialog>
        <!--下单-->
        <xia-dan :companyNamePush="companyNamePush" :leadsId="leadsId" :xiadan_dalig="xiadan_dalig"
                 :yxGenJinData="yxGenJinData" @xiadanNo="xiadanNo"></xia-dan>
        <!--添加跟进记录-->
        <xiansuo-addgenjin :change_show_radio="change_show_radio" :genjin_dialog="genjin_dialog" :leadsId="leadsId"
                           :yixData="yixData" :yxGenJinData="yxGenJinData" @genJinFunc="genJinFunc"
                           @gjClose="gjClose" @radio_change="radio_change"></xiansuo-addgenjin>
        <!--钉办拨号系统-->
        <xiansuo-bohao
                :bohao_dialog="bohao_dialog" :change_show_radio="change_show_radio"
                :change_show_radio2="change_show_radio2"
                :phoneTelData="phoneTelData" :rowData="rowData"
                :siyouBohao="siyouBohao" :userCheckJIludata="userCheckJIludata" :yixData="yixData" :yxGenJinData="yxGenJinData"
                @radio_change="radio_change" @statusRadio="statusRadio"
                @updateUserData="updateUserData"></xiansuo-bohao>
    </div>
</template>

<script>
    import myMixin from "../../../assets/js/minx/xiansuo";
    import tree from "../../../components/tree/tree";
    import xiaDan from "../../../components/xiansuoxiadan"
    import xiansuoAddgenjin from "../../../components/xiansuoAddgenjin"
    import xiansuoBohao from "../../../components/xiansuobohao"
    import theme from "../../../components/ThemePicker"
    //百度地图
    import {
        BaiduMap,
        BmAutoComplete,
        BmCircle,
        BmControl,
        BmInfoWindow,
        BmLabel,
        BmLocalSearch,
        BmMarker,
        BmMarkerClusterer,
        BmNavigation,
        BmScale,
        BmView,
    } from "vue-baidu-map";

    export default {
        name: "index",
        mixins: [myMixin],
        props: [],
        options: [],
        components: {
            BaiduMap,
            BmScale,
            BmNavigation,
            BmMarkerClusterer,
            BmMarker,
            BmInfoWindow,
            BmLabel,
            BmCircle,
            BmLocalSearch,
            BmAutoComplete,
            BmControl,
            BmView,
            tree, xiaDan, xiansuoAddgenjin, xiansuoBohao,theme
        },
        data() {
            return {
                rowData: {},
                userID: '',
                leadsId: "",
                currentPage4: 1 /*分页*/,
                pageNum: 0,
                pageSize: 10,
                total: 0,
                companyNamePush: '',
                siyouBohao: false,
                userMangageType: false,
                mapShow_status: false /*地图*/,
                genjin_dialog: false,
                bohao_dialog: false,
                change_show_radio: true,
                change_show_radio2: true,
                xiadan_dalig: false,
                fanwei_dialog: false,
                get_table_list: false,
                options_mblx: [] /*模板类型*/,
                options_xiadan: [] /*服务列表*/,
                select_box: [],
                tableData: [],
                userList: [],
                lists: [] /*用户下部门树列表*/,
                yxGenJinData: [],
                tableDatasList: {},
            };
        },
        methods: {
            //权限
            getPower() {
                this.get_table_list = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo_chengjiao/get-table-list");/*列表查看*/
                this.userMangageType = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-chengjiao/get-ckbm-look");/*查看部门*/
            },
            //下单
            xiadan(row) {
                this.companyNamePush = row.companyName
                this.leadsId = row.leadsId;
                this.xiadan_dalig = true;
            },
            //点击拨打手机
            phone_tel(row, val) {
                this.$confirm("确定拨打此电话吗", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.rowData = row;
                        if (this.rowData.companyName.length >= 11) {
                            let spliceStr = this.rowData.companyName.substr(0, 10);
                            this.rowData.companyName = `${spliceStr}...`;
                        }
                        this.leadsId = row.leadsId;
                        this.telIng(this.leadsId);
                    })
                    .catch(() => {
                        this.showMessage("info", "已取消此操作");
                    });
            },
            //跟进
            genjin(row) {
                this.leadsId = row.leadsId;
                this.genjin_dialog = true;
            },
            //表格选中项数组
            select_checkBox(val) {
                this.select_box = val;
            },
            //筛选
            async getListTable(data) {
                data.pageNum = this.pageNum
                data.pageSize = this.pageSize
                let res = await this.Axios.post(`leads-api/leadssale/querySale`, data, "postJson");
                if (res.data.code === 0) {
                    this.tableData = res.data.result;
                    if (!this.isEmptyObj(this.tableData)) {
                        this.tableData.forEach((val) => {
                            if (val.orderTime.length === 8) {
                                val.orderTime = this.setDate(val.orderTime);
                            } else {
                                val.orderTime = "--";
                            }
                        });
                    }
                    this.total = res.data.total;
                }
            },
            //获取列表数据
            async get_tableData() {
                let data = {};
                let datas = JSON.parse(JSON.stringify(this.form_list_));
                data = datas.leadsQueryInfo;
                this.pageNum = 0
                this.pageSize = 10
                this.currentPage4 = 1
                this.tableDatasList = data
                this.removeNullItem(data); /*为空处理*/
                this.getListTable(data)
            },
            async genJinFunc(data) {
                let res = await this.Axios.post("leads-api/followlist/insertFollow", data, "postJson");
                if (res.data.code === 0) {
                    this.showMessage("success", "提交成功");
                    this.genjin_dialog = false;
                    this.bohao_dialog = false;
                    this.getListTable(this.tableDatasList);
                }
            },
            async getUserList(depId) {
                let res = await this.Axios.get(`ucenter-api/userlist/getUserList?depId=${depId}&pageSize=500&pageNum=0`);
                if (res.data.code === 0) {
                    this.userList = res.data.result;
                }
            },
            routerLink(row) {
                this.pushParams({id: row.orderId, type: "order"});
                this.$router.push({path: "/order/show"});
            },
            //点击节点
            nodeClick(s, d, n) {
                this.formFW.name = [];
                this.userList = []
                this.depId = d.depId;
                this.getUserList(this.depId);
            },
            closeDialog() {
                this.$refs.BoHaoform && this.$refs.BoHaoform.resetFields();
                this.formFW.name = [];
            },
            handleChange(value) {
                console.log(value);
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getListTable(this.tableDatasList);
            },
            handleCurrentChange(val) {
                this.currentPage4 = val
                this.pageNum = val - 1;
                this.getListTable(this.tableDatasList);
            },
        },
        mounted() {
            this.getPower()
            let userMangage = this.getDataStorge("userMessage");
            // if (userMangage.manageDepId === null) {
            //   this.userMangageType = true
            // }
            this.userID = userMangage.userId
            // this.userID = 201119000001872
            this.get_tableData();
            this.getYixiang();
        },
    };
</script>

<style scoped lang="less">
    @import "index.less";
</style>
