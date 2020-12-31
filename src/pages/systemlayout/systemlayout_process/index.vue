<template>
  <div class="systemlayoutbox">
    <div class="navbar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>商品流程</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="top_line"></div>
    </div>
    <div class="nodepage">
      <div class="nodepageleftbox">
        <el-tree
          ref="tree"
          node-key="id"
          :data="goodlist"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :default-expand-all="true"
          highlight-current
        ></el-tree>
      </div>
      <div class="examineright">
        <!-- <div class="servicename">流程配置</div> -->
        <div class="addreplay" style="width: 1200px">
          <div class="addreplaybtn" @click="addprocess">绑定流程</div>
        </div>
        <el-table
          :data="processgoodlist"
          style="width: 100%"
          class="processtable"
        >
          <el-table-column prop="flowTemplateName" label="流程" width="300">
          </el-table-column>
          <el-table-column prop="name" label="启用状态" width="600">
            <template slot-scope="scope">
              <div class="switchbtn">
                <el-switch
                  v-model="scope.row.checked"
                  style="display: block"
                  active-color="#409EFF"
                  inactive-color="#C0C0C0"
                  @change="selectstates(scope.$index, scope.row)"
                >
                </el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="280" prop="address" label="操作">
            <template slot-scope="scope">
              <div class="delbtn" @click="deletedata(scope.$index, scope.row)">
                删除
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination
          v-if="totalsize != 0"
          class="pagelist"
          @size-change="changesize"
          @current-change="changecurrent"
          :current-page="currentPage4"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="10"
          layout="total,sizes, prev, pager, next, jumper"
          :total="totalsize"
        >
        </el-pagination> -->
      </div>
    </div>
    <!-- 添加服务弹出层 -->
    <el-dialog
      title="绑定流程"
      width="450px"
      :visible.sync="addnodeVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
      >
        <el-form-item label="选择流程" prop="processname">
          <el-select
            v-model="ruleForm.processname"
            placeholder="请选择流程"
            size="small"
            @change="selectprocess"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in processlist"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <div class="actfooter">
          <el-button type="primary" @click="bindSubmit('ruleForm')" size="small"
            >确定</el-button
          >
          <el-button size="small" @click="cancelnodevisiable">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import tree from "../../../components/tree/tree";
export default {
  components: { tree },
  data() {
    return {
      value:false,
      /* 树状图按钮显示隐藏 */
      titleshow: true,
      tdkshow: true,
      addshow: true,
      editshow: false,
      delshow: true,
      descripshow: true,
      treeList: [],
      page: 0,
      pageSizeTree: 25,
      typeTotle: 0,
      tempData: {},
      isAddOrEditorTree: 1,
      titleTree: "添加角色",
      treeFormVisible: false,
      treeForm: {
        name: "",
      },
      rulesTree: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      },
      treeList: [],
      //角色id
      roleId: "",
      tempPowerId: "",
      tableData: [],
      goodlist: [], //左侧商品列表
      productlist: [], //商品列表
      defaultProps: {
        children: "productGroupVOList",
        label: "name",
      },
      ruleForm: {
        processname: "",
      },
      rules: {
        processname: [
          { required: true, message: "请选择流程", trigger: "change" },
        ],
      },
      addnodeVisible: false,
      processlist: [], //获取的流程列表
      processgoodlist: [], //某一个商品的流程列表
      areaId: "", //当前用户的areaid
      bindproductId: "", //绑定的商品id
      bindskuId: "", //绑定的skuid
      bindattributeIds: "", //绑定的属性id
      flowTemplateId: "", //模板id
      pageNum: 0,
      pageSize: 10,
      currentPage4: 1,
      totalsize: 0,
    };
  },
  created() {
    // 获取商品列表
    this.getshoplist();
    // 获取的流程
    this.getprocess();
    // 获取areaid
    let userMessage = JSON.parse(sessionStorage.getItem("userMessage"));
    this.areaId = userMessage.areaId;
  },
  methods: {
    // 获取左侧商品一级 二级分类
    async getshoplist() {
      let res = await this.Axios.get(
        `product-api/productgroup/getProdGroupListWithLevel`
      );
      console.log(res, "商品列表");
      this.goodlist = res.data.result;
    },
    //根据一级二级分类获取商品列表
    async getgoodlist(id, e) {
      let res = await this.Axios.get(
        `product-api/productlist/list?groupId=${id}`
      );
      let data = res.data.result;
      this.$nextTick(() => {
        this.$refs["tree"].updateKeyChildren(e.id, data);
      });
    },
    // 根据商品列表获取sku列表
    async getskulist(productId, e) {
      console.log("商品 的id", productId);
      let res = await this.Axios.get(
        `product-api/skulist/skuAttrListByParams?productId=${productId}&cityId=${this.areaId}`
      );
      let data = res.data.result;
      if (data != null) {
        data.forEach((valuej) => {
          valuej.name = valuej.attributeNames;
        });
        this.$nextTick(() => {
          this.$refs["tree"].updateKeyChildren(e.id, data);
        });
      } else {
        this.$message({
          message: "没有更多了~",
          type: "warning",
        });
      }
    },

    // 获取某一个商品的流程
    async getproductlist() {
      // let param = {
      //   pageNum: this.pageNum,
      //   pageSize: this.pageSize,
      //   skuId: this.bindskuId,
      // };
      let res = await this.Axios.get(
        `workflow-api/productflow/list?&skuId=${this.bindskuId}`
      );
      let data = res.data.result;
      data.forEach((value) => {
        if (value.status == 1) {
          value.checked = true;
        } else if (value.status == 2) {
          value.checked = false;
        }
      });
      this.processgoodlist = data;
      this.$forceUpdate();
      console.log(this.processgoodlist, "某一个商品流程");
    },
    // 改变启用禁用状态
    async selectstates(index, row) {
      console.log(index, row);
      console.log(row.checked)
      let status=''
      if (row.checked == true) {
        status = 1;
      } else if (row.checked == false) {
        status = 2;
      }
      let param = {
        id: row.id,
        status: status,
      };
      let res = await this.Axios.post(
        `workflow-api/productflow/update`,
        param,
        "postJson"
      );
      console.log(res, "更新状态");
    },
    // 改变页数
    changecurrent(val) {
      this.pageNum = val - 1;
      console.log(this.page);
      this.currentPage4 = val;
      this.getproductlist();
    },
    // 列表显示多少条
    changesize(e) {
      this.pageSize = e;
      this.getproductlist();
    },
    // 获取流程
    async getprocess() {
      let res = await this.Axios.get(`workflow-api/templateflow/list`);
      let data = res.data.result;
      data.forEach((valuek, indexk, arrayk) => {
        let obj = {
          label: valuek.definitionShowName,
          value: valuek.templateId,
        };
        this.processlist.push(obj);
      });
    },
    // 选择流程
    selectprocess(e) {
      this.flowTemplateId = e;
    },

    // 添加流程
    addprocess() {
      if (this.bindskuId == "") {
        this.$message({
          message: "请选择绑定的sku商品",
          type: "warning",
        });
      } else {
        this.addnodeVisible = true;
        this.flowTemplateId = "";
        this.processname = "";
        this.ruleForm.processname = "";
      }
    },
    // 绑定流程
    bindSubmit(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            cityId: +this.areaId,
            productId: +this.bindproductId,
            skuId: +this.bindskuId,
            attributeIds: this.bindattributeIds,
            flowTemplateId: +this.flowTemplateId,
          };
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          }); //显示弹出层
          that.Axios.post(`workflow-api/productflow/add`, param, "postJson")
            .then((res) => {
              console.log(res);
              if (res.data.code == "400000") {
                this.$message(res.data.message);
                loading.close();
              } else if (res.data.code == 0) {
                this.$message({
                  message: "提交成功",
                  type: "success",
                });
                that.addnodeVisible = false;
                loading.close();
                this.getproductlist();
              } else {
                loading.close();
              }
            })
            .catch((err) => {
              console.log(err);
              loading.close();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除流程
    deletedata(index, row) {
      console.log(index, row);
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.finishdelete(index, row.id);
        })
        .catch(() => {});
    },
    async finishdelete(index, id) {
      let res = await this.Axios.post(
        `workflow-api/productflow/delete?id=${id}`
      );
      if (res.data.code == 0) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        let newprocessgoodlist = JSON.parse(
          JSON.stringify(this.processgoodlist)
        );
        newprocessgoodlist.splice(index, 1);
        this.processgoodlist = newprocessgoodlist;
      }
    },
    // 取消弹出层
    cancelnodevisiable() {
      this.addnodeVisible = false;
    },
    // 确定提交
    onSubmit() {},
    // 点击节点时候触发
    handleNodeClick(e, node, arr) {
      console.log(e, node, arr, "节点节点节点");

      if (node.level == 2) {
        this.getgoodlist(e.groupId, e);
      }
      if (node.level == 3) {
        this.bindproductId = e.productId;
        this.getskulist(e.productId, e);
      }
      console.log(this.goodlist, "343443兄3");
      if (node.level == 4) {
        this.bindskuId = e.skuId;
        this.bindattributeIds = e.attributeIds;
        this.getproductlist();
      }
    },
    appendnode(e) {
      console.log(e, "追加节点");
    },
    // 获取节点
    getnode(e) {
      console.log(e, "获取的节点");
    },
  },
};
</script>

<style scoped>
@import url("./index.css");
@import url("../../../assets/css/base.css");
</style>