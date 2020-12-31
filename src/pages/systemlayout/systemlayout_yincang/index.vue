<template>
    <div class="uesr_org">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>线索系统</el-breadcrumb-item>
            <el-breadcrumb-item>隐藏配置</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="top_line"></div>
        <div class="uesr_org_content">
            <article class="uesr_org_content_right">
                <div class="org_table">
                    <el-table :data="tableList" stripe style="width: 100%" :row-key="row_key" :cell-style="cellStyle"
                              border
                              :header-cell-style="table_heard_style">
                        <el-table-column prop="guiZeDuiXiang" align="center" label="隐藏规则对象"
                                         min-width="100"></el-table-column>
                        <el-table-column prop="guiZeSheZhi" align="center" label="隐藏规则设置" min-width="100">
                            <template slot-scope="scope">
                                公海库已拨打电话，如果未领取，该线索将会在公海隐藏
                                <el-input :disabled="!addshow" class="require_des" style="width: 10%;" @change="table_input"
                                          @input="scope.row.guiZeSheZhi=scope.row.guiZeSheZhi.replace(/^(0+)|[^\d]+/g, '')"
                                          v-model="scope.row.guiZeSheZhi"></el-input>
                                天
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
    import tree from "../../../components/tree/tree";
    import myMixin from "../../../assets/js/minx/xiansuo";

    export default {
        name: "",
        components: {tree},
        mixins: [myMixin],
        props: [],
        data() {
            return {
                switch_status: true,
                //筛选
                valueType: 0,
                searchUInput: null,
                /* 树状图按钮显示隐藏 */
                listshow: false,
                addshow: false,
                editshow: false,
                delshow: true,
                /* 页面 */
                pageTitle: "",
                /* 列表 */
                listProps: {
                    value: "depId",
                    label: "name",
                    children: "children",
                },
                tempListData: {},
                pageList: 0, //当前页
                pageListSize: 10, //单页数量
                totleList: 0, //总数量
                isListAddOrEdit: 1,
                tableList: [
                    {guiZeDuiXiang: '公海库', guiZeSheZhi: ''}
                ],
                depList: [],
                depId: "",
                //角色列表
                roleList: [],
                //已选角色
                roles: [],
                //弹框内容
                loading: false, //是显示加载
                title: "编辑成员信息",
                editFormVisible: false, //控制编辑页面显示与隐藏
                // 编辑与添加
                editForm: {
                    userName: "",
                    userMobile: "",
                    userNumber: "",
                    userMail: "",
                    department: "", //部门
                    status: "", //在职状态
                    roles: "", //角色
                    city: "",
                },
                // rules表单验证
                rules: {
                    userName: [{required: true, message: "请输入姓名", trigger: "blur"}],
                    userNumber: [
                        {required: true, message: "请输入工号", trigger: "blur"},
                        {
                            pattern: /^[0-9]*$/,
                            message: "只能输入数字",
                        },
                    ],
                    userMail: [{required: true, message: "请输入邮箱", trigger: "blur"}],
                    depList: [{required: true, message: "请选择部门.", trigger: "blur"}],
                    city: [{required: true, message: "请选择城市", trigger: "blur"}],
                    status: [{required: true, message: "请选择在职状态", trigger: "blur"}],
                    roles: [{required: true, message: "请选择角色", trigger: "blur"}],
                    userMobile: [
                        {required: true, message: "请输入手机号", trigger: "blur"},
                        {
                            pattern: /^1(3\d|47|5((?!4)\d)|7(0|1|[6-8])|8\d)\d{8,8}$/,
                            // required: true,
                            message: "请输入正确的手机号",
                            // trigger: "blur",
                        },
                    ],
                },

                /*树状图*/
                list: [],
                tempData: {},
                isAddOrEditorTree: 1,
                titleTree: "添加组织名称",
                treeFormVisible: false,
                treeForm: {
                    compName: "",
                },
                rulesTree: {
                    compName: [{required: true, message: "请输入单位名称", trigger: "blur"}],
                },
            };
        },
        mounted() {
            this.get_list()
            this.getPower();
        },
        methods: {
            getPower() {
                this.listshow = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-yincang/get-list-look");
                this.addshow =this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-yincnag/get-add-look");

                // this.addshow = this.verification(this.$store.state.selectBtnJurisdiction, "/user/org-btn-add");
                // this.editshow = false;
                // this.delshow = this.verification(this.$store.state.selectBtnJurisdiction, "/user/org-btn-delete");
            },
            //获取列表
            async get_list() {
                let res = await this.Axios.get(`leads-api/recoverystrategy/queryHidden`)
                if (res.data.code === 0) {
                    this.tableList[0].guiZeSheZhi = res.data.result
                }
            },
            //失焦保存
            async table_input(val) {
                let res = await this.Axios.get(`leads-api/recoverystrategy/updateHidden?day=${val}`)
                if (res.data.code === 0) {
                    this.showMessage("success", "保存成功")
                    this.get_list()
                } else {
                    this.showMessage("error", res.data.message)
                }
            },

            row_key(row) {
                return row.id;
            },
            cellStyle({row, column, rowIndex, columnIndex}) {
                return "text-align:center"
            },
        },
    };
</script>
<style scoped>
    @import url("./index.css");
    /deep/ .el-table td {
        padding: 5px !important;
        font-size: 12px;
    }

    /deep/ .el-table .cell {
        line-height: 15px !important;
        padding: 0 5px !important;
    }
    .org_table {
        flex: 1;
        height: auto;
        overflow-x: auto;
    }
</style>
