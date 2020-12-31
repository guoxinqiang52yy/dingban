<template>
    <!--显示列项-->
    <el-dialog title="自定义显示和排序 （灰色选项不可设置）" :visible.sync="liexiang_dialog" width="30%">
        <div class="liexiang_dialog">
            <el-table border ref="singleTable" :row-key="row_key" :cell-style="cellStyle"
                      :header-cell-style="{'background-color': '#F3F6FD','color': '#606266','padding': '10px 0','text-align':'center'}"
                      :data="table_liexiang" style="width: 100%">
                <el-table-column prop="status,sort" label="显示">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.status" :disabled="scope.row.showStatus">
                                <span style="display: none">
                                    {{scope.row.sort=scope.$index + 1}}
                                </span>
                        </el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="fieldName" label="列名"></el-table-column>
                <el-table-column label="拖动排序">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-sort" type="success" circle size="mini"
                                   style="height: 32px"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <span slot="footer" class="dialog-footer"
              style="display: flex;justify-content: flex-end;align-items: center">
                <!--<el-link class="cacle" type="primary" @click="huifumoren()" :underline="false">恢复默认-->
            <!--<span>(恢复调整前的显示状态)</span>-->
            <!--</el-link>-->
                <div>
                    <el-button @click="liexiang_dialog = false">取 消</el-button>
                    <el-button type="primary" @click="sort_Submit">保存</el-button>
                </div>
              </span>
    </el-dialog>
</template>

<script>
    import Sortable from "sortablejs";/*表格拖动排序*/
    export default {
        name: "dialogLiexiang",
        data(){
            return{
                // liexiang_dialog: false,
                table_liexiang: []
            }
        },
        props:{
            liexiang_dialog:{type:Boolean,default:false}
        },
        methods:{
            //自定义列表格排序保存
            async sort_Submit() {
                this.liexiang_dialog = false
                let objColumn = {}, objArr = [], field = '', fieldName = ''
                let data = this.$refs.singleTable.tableData
                let obj = {
                    customDisplayList: [...data]
                }
                obj.customDisplayList.forEach(val => {
                    if (val.status === true) {
                        if (val.showStatus2 === 2) {
                            val.status = 2
                        } else {
                            val.status = 1
                        }
                    } else {
                        val.status = 0
                    }
                    if (typeof val.showStatus === "boolean" || val.showStatus2 === 'number') {
                        delete val.showStatus
                        delete val.showStatus2
                    }

                })
                let res = await this.Axios.post("leads-api/customdisplay/updateCustomDisplayList", obj,'postJson')
                if (res.data.code === 0) {
                    this.showMessage("success", "保存成功")
                } else {
                    this.showMessage("error", res.data.message)
                }
                this.get_column()
                this.get_tableData()
            },
            //显示列项
            async liexiang_button() {
                this.get_column()
                this.liexiang_dialog = true
                this.$nextTick(() => {
                    this.dragSort()
                })
            },
            //获取筛选表格列
            async get_column() {
                let res = await this.Axios.get('leads-api/customdisplay/queryByUserId')
                if (res.data.code === 0) {
                    this.table_liexiang = res.data.result
                    let objColumn = {}, objArr = [], field = '', fieldName = '', statusSope = {}, statusTable = null,
                        sortTable = null
                    this.table_liexiang.forEach(val => {
                        if (val.status === 1 || val.status === 2) {
                            field = val.field
                            fieldName = val.fieldName
                            statusTable = val.status
                            sortTable = val.sort
                            objColumn = {
                                sort: sortTable,
                                status: statusTable,
                                field: field,
                                fieldName: fieldName
                            }

                            objArr.push(objColumn)
                            this.tableHead = [...objArr];
                        }

                        //列项列表处理
                        statusSope = {
                            showStatus: false,
                            showStatus2: 1,
                        }
                        if (val.status === 1) {
                            val.status = true
                            Object.assign(val, statusSope)
                        } else if (val.status === 2) {
                            val.status = true
                            statusSope.showStatus = true
                            statusSope.showStatus2 = 2
                            Object.assign(val, statusSope)
                        } else {
                            val.status = false
                            Object.assign(val, statusSope)
                        }
                    })
                    this.$nextTick(()=>{
                        this.dragSort()
                    })
                }
            },
            //表格拖动排序
            async dragSort() {
                const el = this.$refs.singleTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
                this.sortable = Sortable.create(el, {
                    ghostClass: 'sortable-ghost',
                    setData: function (dataTransfer) {
                        dataTransfer.setData('Text', '')
                    },
                    onEnd: e => {
                        //e.oldIndex为拖动一行原来的位置，e.newIndex为拖动后新的位置
                        const targetRow = this.table_liexiang.splice(e.oldIndex, 1)[0];
                        this.table_liexiang.splice(e.newIndex, 0, targetRow);
                        // let dragId = this.table_liexiang[e.newIndex].sort;//拖动行的id
                        // let oneId, twoId
                        // //拖动行的前一行
                        // if (this.table_liexiang[e.newIndex - 1]) {
                        //     oneId = this.table_liexiang[e.newIndex - 1].sort;
                        //     console.log(this.table_liexiang[e.newIndex].sort);
                        // } else {
                        //     oneId = ""
                        // }
                        // //拖动行的后一行
                        // if (this.table_liexiang[e.newIndex + 1]) {
                        //     twoId = this.table_liexiang[e.newIndex + 1].sort;
                        //     console.log(this.table_liexiang[e.newIndex].sort);
                        // } else {
                        //     twoId = ""
                        // }
                    }
                })

            },
            row_key(row) {
                return row.id;
            },
            cellStyle({row, column, rowIndex, columnIndex}) {
                return "text-align:center"
            },
        },
        mounted() {

        },
        created() {
            this.get_column()

        },
    }
</script>

<style scoped lang="less">

</style>