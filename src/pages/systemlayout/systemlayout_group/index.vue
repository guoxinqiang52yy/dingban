<template>
  <div class="systemlayoutbox">
    <div class="navbar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>系统配置</el-breadcrumb-item>
        <el-breadcrumb-item>分组配置</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="top_line"></div>
    </div>
    <div class="nodepage">
      <div class="nodepageleftbox">
        <tree
          title="添加分组"
          :titleshow="titleshow"
          :tdkshow="tdkshow"
          :addshow="addshow"
          :editshow="editshow"
          :delshow="delshow"
          @startTdk="startTdk"
          :list="treeList"
          @nodeClick="nodeClick"
          @addTop="addTop"
          @completeEditor="completeEditor"
          @startEditor="startEditor"
          @deleteEditor="deleteEditor"
        ></tree>
        <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
      </div>
      <div class="examineright">
        <!-- <div class="servicename">分组配置</div> -->
        <div class="addreplay" style="width: 1200px">
          <div class="addreplaybtn" @click="addgood">添加商品</div>
        </div>
        <el-table
          :data="replaygoodlist"
          style="width: 100%"
          class="operategroup grouptable"
        >
          <el-table-column label="序号" width="280">
            <template slot-scope="scope">
              <div class="number">
                {{ scope.$index + 1 }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="skuName" label="商品名称" width="500">
          </el-table-column>
          <el-table-column width="420" prop="address" label="操作">
            <template slot-scope="scope">
              <div class="operatebtn">
                <div class="editbtn" @click="editgood(scope.$index, scope.row)">
                  编辑
                </div>
                <div
                  class="delbtn"
                  @click="deletegood(scope.$index, scope.row)"
                >
                  删除
                </div>
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
    <!-- 添加审批流程 -->
    <el-dialog
      :title="titletext"
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
        <el-form-item label="分组名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <div class="actfooter">
          <el-button
            type="primary"
            @click="onSubmitprocess('ruleForm')"
            size="small"
            v-if="isedit == 1"
            >确定</el-button
          >
          <el-button
            type="primary"
            @click="onEdittprocess('ruleForm')"
            size="small"
            v-if="isedit == 2"
            >确定</el-button
          >
          <el-button size="small" @click="cancelnodevisiable">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 添加商品 -->
    <el-dialog
      title="添加商品"
      width="450px"
      :visible.sync="examineVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="examineruleForm"
        :rules="examinerules"
        ref="examineruleForm"
        label-width="130px"
      >
        <el-form-item label="商品名称" prop="productId">
          <el-tree
            ref="tree"
            node-key="id"
            :data="goodlist"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :default-expand-all="true"
            highlight-current
          ></el-tree>
        </el-form-item>

        <div class="actfooter">
          <el-button
            type="primary"
            @click="onSubmitexamine('examineruleForm')"
            size="small"
            >确定</el-button
          >
          <el-button size="small" @click="cancelexaminevisiable"
            >取消</el-button
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import tree from "../../../components/tree/tree";
export default {
  components: { tree },
  data() {
    return {
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
      titleTree: "添加分组",
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
      // 请输入审批流程的名字
      ruleForm: {
        name: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入审批流程名称", trigger: "blur" },
        ],
      },
      addnodeVisible: false,
      examineVisible: false,
      examineruleForm: {
        productId: "",
      },
      examinerules: {
        productId: [
          { required: true, message: "请输入分组名称", trigger: "change" },
        ],
      },
      goodlist: [], //商品列表
      defaultProps: {
        children: "productGroupVOList",
        label: "name",
      },
      isedit: 1, //1 添加  2 编辑
      isediggood: 1, //1 添加  2 编辑
      titletext: "添加分组",
      editId: "",
      groupId: "", //获取的分组id
      replaygoodlist: [], //获取依赖的数组
      attributeIds: "", //属性id
      skuId: "", //skuid
      editgoodid: "",
      totalsize: 0,
      pageNum: 0,
      pageSize: 10,
      currentPage4: 1,
    };
  },
  created() {
    // 获取商品一级二级
    this.getshoplist();
    // 获取分组列表
    this.getgrouplist();
  },
  methods: {
    // 获取商品一级 二级分类
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
    // 点击商品树节点时候触发
    handleNodeClick(e, node, arr) {
      console.log(e, node, arr, "节点节点节点");

      if (node.level == 2) {
        this.getgoodlist(e.groupId, e);
      }
      if (node.level == 3) {
        this.bindproductId = e.productId;
        this.getskulist(e.productId, e);
      }
      if (node.level == 4) {
        this.examineruleForm.productId = e.productId;
        this.skuId = e.skuId;
        this.attributeIds = e.attributeIds;
      }
    },
    //确定添加流程
    onSubmitprocess(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          }); //显示弹出层
          let param = {
            groupName: that.ruleForm.name,
          };
          that.Axios.post(`workflow-api/grouplist/add`, param, "postJson")
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
                this.getgrouplist();
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

    // 编辑流程
    onEdittprocess(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          }); //显示弹出层
          let param = {
            groupName: that.ruleForm.name,
            id: this.editId,
          };
          that.Axios.post(`workflow-api/grouplist/update`, param, "postJson")
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
                this.treeList.forEach((value, index, array) => {
                  if (value.id == this.editId) {
                    value.approvalTemplateName = this.ruleForm.name;
                    value.name = this.ruleForm.name;
                  }
                });
                this.treeList = this.treeList;
                this.$forceUpdate();
                // this.getgrouplist();
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
    // 获取分组列表
    async getgrouplist() {
      let res = await this.Axios.get(`workflow-api/grouplist/list`);
      console.log(res, "获取的分组列表");
      this.treeList = this.dataAssembly(res.data.result);
      if (res.data.result != null) {
        this.groupId = res.data.result[0].groupId;
        this.getreplaygoodlist();
      }
    },
    //给分组添加商品
    onSubmitexamine(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          }); //显示弹出层
          let param = "";
          let url = "";
          if (this.isediggood == 1) {
            param = {
              groupId: that.groupId,
              productId: that.examineruleForm.productId,
              skuId: that.skuId,
              attributeIds: that.attributeIds,
            };
            url = `workflow-api/dependencygroup/add`;
          } else if (this.isediggood == 2) {
            param = {
              groupId: that.groupId,
              productId: that.examineruleForm.productId,
              skuId: that.skuId,
              attributeIds: that.attributeIds,
              id: that.editgoodid,
            };
            url = `workflow-api/dependencygroup/update`;
          }

          that.Axios.post(url, param, "postJson")
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
                that.examineVisible = false;
                loading.close();
                this.getreplaygoodlist(this.groupId);
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
    //根据分组获取列表
    async getreplaygoodlist() {
      let res = await this.Axios.get(
        `workflow-api/dependencygroup/list?&groupId=${this.groupId}`,
      
      );
      console.log(res, "获取的依赖商品列表");
      this.replaygoodlist = res.data.result;
    },
    // 改变页数
    changecurrent(val) {
      this.pageNum = val - 1;
      console.log(this.page);
      this.currentPage4 = val;
      this.getreplaygoodlist();
    },
    // 列表显示多少条
    changesize(e) {
      this.pageSize = e;
      this.getreplaygoodlist();
    },
    // 编辑商品
    editgood(index, row) {
      this.examineVisible = true;
      this.isediggood = 2;
      this.editgoodid = row.id;
    },

    // 删除商品
    deletegood(index, row) {
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.suredeletegood(row.id, index);
        })
        .catch(() => {});
    },
    async suredeletegood(id, index) {
      let res = await this.Axios.get(
        `workflow-api/dependencygroup/delete?id=${id}`
      );
      if (res.data.code == 0) {
        this.replaygoodlist.forEach((value, index, array) => {
          if (id == value.id) {
            this.replaygoodlist.splice(index, 1);
          }
        });
        this.replaygoodlist = this.replaygoodlist;
        if(this.replaygoodlist.length==0){
          this.totalsize=0
        }
        this.$forceUpdate();
      }
    },
    //添加商品
    addgood() {
      this.examineVisible = true;
      this.isediggood = 1;
    },
    // 确定添加审批流程
    onSubmit() {},
    // 取消添加审批流程
    cancelnodevisiable() {
      this.addnodeVisible = false;
    },

    // 取消添加审批人
    cancelexaminevisiable() {
      this.examineVisible = false;
    },
    // ==== 数据处理
    dataAssembly(data) {
      let _data = Object.assign([], data);
      _data.forEach((data) => {
        Object.assign(data, {
          name: data.groupName,
          isFirst: false,
          isEdit: false,
        });
        delete data.groupName;
      });
      return _data;
    },

    nodeClick(s, d, n) {
      console.log(d.name);
      this.groupId = d.groupId;
      this.pageNum=0;
      this.getreplaygoodlist();
    },
    startTdk(s, d, n) {
      console.log("编辑");
      this.isedit = 2;
      this.titletext = "编辑分组";
      this.addnodeVisible = true;
      this.ruleForm.name = d.name;
      this.editId = d.id;
    },
    addTop() {
      console.log("添加");
      this.addnodeVisible = true;
      this.isedit = 1;
      this.titletext = "添加分组";
      this.ruleForm.name = "";
    },
    completeEditor() {},
    startEditor() {},
    deleteEditor(s, d, n) {
      console.log("当前页");
      console.log(this.page);
      this.$confirm("是否删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deletegroup(d.id);
        })
        .catch(() => {});
    },
    async deletegroup(id) {
      let res = await this.Axios.get(`workflow-api/grouplist/delete?id=${id}`);
      let newtreeList = this.treeList;
      newtreeList.forEach((value, index, array) => {
        if (value.id == id) {
          newtreeList.splice(index, 1);
        }
      });
      this.treeList = newtreeList;
    },
    selectPages(val) {
      console.log(val);
      this.page = parseInt(val - 1);
      this.pageInit();
    },
  },
};
</script>

<style scoped>
@import url("./index.css");
@import url("../../../assets/css/base.css");
</style>