<template>
    <div class="qujian">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>线索系统</el-breadcrumb-item>
            <el-breadcrumb-item>趣建查查</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="top_line"></div>
        <!--筛选表单-->
        <div class="box_siyou">
            <div class="formClass">
                <el-form :inline="true" :model="form_caiwu_" class="report_demo_form" label-width="96px">
                    <el-form-item label="所属地区" size="small" style="width:19%">
                        <el-cascader
                                :props="listPropsSHDQ" @change="handleChange1(form_list_.leadsQueryInfo.areaIdList, 1)"
                                clearable
                                ref="objArrcasa"
                                v-model="form_list_.leadsQueryInfo.areaIdList"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="经营状态" size="small" style="width:19%">
                        <el-select @change="" clearable v-model="form_caiwu_.belongId">
                            <el-option :key="index" :label="val.label" :value="val.id"
                                       v-for="(val, index) in htssData"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册资本" size="small" style="width:19%">
                        <el-select @change="" clearable v-model="form_caiwu_.callBackStatus">
                            <el-option label="全部状态" value=""></el-option>
                            <el-option :key="index" :label="val.label" :value="val.id"
                                       v-for="(val, index) in shztData"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <!--表格-->
            <div class="table_pagination">
                <div class="tableClass">
                    <ces-table :isPagination="false"
                               :tableCols="tableCols"
                               :tableData="tableData"
                               size="small"
                    >
                    </ces-table>
                </div>
                <!--分页器-->
                <div class="pagination_clumun">
                    <el-pagination :current-page="currentPage4" :page-size="pageSize" :page-sizes="[10, 20, 30]"
                                   :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange"
                                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import myMixin from "../../../assets/js/minx/minx";
    import myMixin2 from "../../../assets/js/minx/xiansuo";
    import cesTable from "../../../components/table";

    export default {
        name: "index",
        mixins: [myMixin, myMixin2],
        components: {cesTable},
        data() {
            return {
                currentPage4: 1 /*分页*/,
                pageNum: 0,
                pageSize: 10,
                total: 0,
                htssData: [
                    {id: 1, label: '存续'}, {id: 2, label: '延期'},
                ],
                shztData: [
                    {id: null, label: "全部"},
                    {id: 1, label: "0-100万"},
                    {id: 2, label: "100-500万"},
                    {id: 3, label: "500-800万"},
                    {id: 4, label: "800-1000万"}
                ],
                tableData: [
                    {name:'张三',age:'12',sex:'男',interst:'女'},
                    {name:'筱华',age:'27',sex:'女',interst:'羽毛球'},
                    {name:'张三',age:'12',sex:'男',interst:'女'},
                    {name:'筱华',age:'27',sex:'女',interst:'羽毛球'},
                    {name:'筱华',age:'27',sex:'女',interst:'羽毛球'},
                    {name:'筱华',age:'27',sex:'女',interst:'羽毛球'},
                    {name:'筱华',age:'27',sex:'女',interst:'羽毛球'}
                ],
                tableCols: [
                    {label: "企业名称", prop: "name"},
                    {label: "法定代表人", prop: "age"},
                    {label: "联系方式", prop: "sex"},
                    {label: "注册资本", prop: "interst"},
                    {label: "所在地区", prop: "interst"},
                    {label: "注册地址", prop: "count_date"},
                    {label: "登记状态", prop: "name"},

                    {label: "经营范围", prop: "age"},
                    {label: "成立日期", prop: "sex"},
                    {label: "登记机关", prop: "interst"},
                    {label: "核准日期", prop: "interst"},
                    {label: "企业类型", prop: "interst"},
                    {
                        label: '操作', type: 'button', btnList: [
                            {style: 'color:#288cf5;padding: 0;border:none', label: '领取到私有库', handle: (that,row) =>{
                                    this.cesTableLingQu(row)
                                } }
                        ]
                    }
                ],
                form_caiwu_: {
                    belongId: "",
                    callBackStatus: "",
                    companyName: "",
                    ckfwSelect: 1,
                    ckfwSelectUser: null,
                    deptOrUser: "",
                    deptOrUserId: "",
                },

            }
        },
        methods: {
            cesTableLingQu(row){
                console.log(row);
            },
            //领取
            lingqu(row) {
                this.$confirm("确认领取吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {

                        this.lingqu_func(data);
                    })
                    .catch(() => {
                        this.showMessage("info", "已取消操作");
                    });
            },
            async lingqu_func(data) {
                let res = this.Axios.get("")
                if (res.data.code === 0) {
                    this.showMessage("领取成功")
                }
            },
            handleSizeChange(val) {
                this.pageSize = val;
                // this.getListTable(this.tableDatasList);
            },
            handleCurrentChange(val) {
                this.currentPage4 = val;
                this.pageNum = val - 1;
                // this.getListTable(this.tableDatasList);
            },
        },
        mounted() {
            setInterval(function () {
                document.querySelectorAll(".el-cascader-node .el-radio").forEach(el => {
                    el.style.display = "none"
                });
                document.querySelectorAll(".el-cascader-node__label").forEach(el => {
                    el.onclick = function () {
                        if (this.previousElementSibling) this.previousElementSibling.click();
                    };
                });
            }, 0);
        }
    }
</script>

<style scoped lang="less">
    @import "index";
</style>