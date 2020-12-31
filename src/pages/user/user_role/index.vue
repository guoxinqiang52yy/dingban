<!--
 * @Author:  角色管理
 * @Date: 2020-08-14 14:53:16
 * @LastEditTime: 2020-12-21 17:19:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\user\uesr_org\index.vue
-->

<template>
  <div class="uesr_role">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>用户中心</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <section class="uesr_role_content">
      <article class="list">
        <div class="top">
          <!-- <p>属性分类</p> -->
          <!-- <el-button type="primary" size="small" @click="addType"><i class="el-icon-plus"></i> 添加角色</el-button> -->
        </div>
        <article class="trees">
          <tree
            title="添加角色"
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
        </article>
        <!-- <div class="pages">
          <p></p>
          <el-pagination background layout="prev, pager, next" :page-size="pageSizeTree" :total="typeTotle" @next-click="selectPages" @prev-click="selectPages" @current-change="selectPages"> </el-pagination>
        </div> -->
      </article>
      <article class="content">
        <!-- <p class="title">职位名称 <span>针对不同角色自定义操作权限</span></p> -->
        <p class="title">{{ titleName }} <span>针对不同角色自定义操作权限</span></p>
        <div class="top_line"></div>
        <p class="name">系统权限</p>
        <div class="uesr_role_list">
          <div class="uesr_role_list_top">
            <div :class="{ select: isActive == index }" @click="selectTab(index, item)" v-for="(item, index) in titleList" :key="index">{{ item.name }}</div>
            <!-- <div class="select">商品库</div>
            <div>政策库</div>
            <div>官网配置</div>
            <div>用户中心</div> -->
          </div>
          <div class="uesr_role_list_line"></div>
          <div class="uesr_role_list_content">
            <checkbox @getChecked="getChecked" v-for="(item, index) in checkboxList" :key="index" :list="item" :checkList="checkList"></checkbox>
          </div>
        </div>
      </article>
    </section>
    <!-- 树状图 添加&编辑 -->
    <el-dialog :title="titleTree" :visible.sync="treeFormVisible" width="50%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="treeForm" :model="treeForm" :rules="rulesTree">
        <el-form-item label="角色名称" prop="name">
          <el-input size="small" v-model="treeForm.name" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" class="title" @click="submitFormTree">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import myMixin from "../../../assets/js/minx/minx";
import tree from "../../../components/tree/tree";
import checkbox from "../../../components/checkgroup/groupLists";
export default {
  name: "role",
  mixins: [myMixin],
  components: { tree, checkbox },
  props: [],
  data() {
    return {
      /* 树状图按钮显示隐藏 */
      titleshow: true,
      tdkshow: true,
      addshow: true,
      editshow: false,
      delshow: true,

      isActive: 0,
      titleList: [],
      titleFirst: {},
      roleFirst: {},
      titleName: "",
      //当前全部可选权限列表
      checkboxList: [],
      //当前所有已选权限列表
      checkList: [],
      //树状图
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
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.pageInit();
    // this.$EventBus.$on("getChecked", (msg) => {
    //   console.log(msg);
    // });
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 验证树状图权限 */
    //  /user/role-btn-add  /user/role-btn-edit  /user/role-btn-delete
    //验证权限
    //  if(!this.verification(store.state.selectBtnJurisdiction,'/offcial/link-btn-show')){
    //    this.showMessage('error','无此权限')
    //   return false
    //  }
    getPower() {
      this.titleshow = this.verification(this.$store.state.selectBtnJurisdiction, "/user/role-btn-add");
      this.tdkshow = this.verification(this.$store.state.selectBtnJurisdiction, "/user/role-btn-edit");
      this.addshow = false;
      this.editshow = false;
      this.delshow = this.verification(this.$store.state.selectBtnJurisdiction, "/user/role-btn-delete");
    },
    //页面初始化
    pageInit() {
      this.getRoleList().then((res) => {
        this.getRoleSys(this.roleFirst.roleId);
        this.getSysList();
      });
      //  this.getRoleSys(this.roleFirst.powerId);
      // this.getRoleSys(this.roleFirst.powerId);
      //  this.getPageList(data.powerId);
    },

    //点击单个权限
    test() {
      console.log(1111);
    },
    getChecked(data) {
      if (!this.verification(this.$store.state.selectBtnJurisdiction, "/user/role-btn-change")) {
        this.showMessage("error", "无此权限");
        this.getPageList(this.tempPowerId, this.uPowerId);
        this.getRoleSys(this.roleId);
        return false;
      }

      console.log(data);
      let _data = "";
      if (Array.isArray(data.id)) {
        _data = data.id.join(",");
      } else {
        _data = data.id;
      }
      console.log(_data);

      if (data.type) {
        //添加
        this.addPower(this.roleId, _data);
      } else {
        //移除
        this.delPower(this.roleId, _data);
      }
      this.getRoleSys(this.roleId);
    },
    //tab切换
    selectTab(val, data) {
      this.isActive = val;
      console.log(data);
      this.tempPowerId = data.powerId;
      this.getPageList(data.powerId, this.uPowerId);
      this.getRoleSys(this.roleId);
      // console.log(this.checkList);
    },
    //清除关闭弹窗
    closeDialog() {
      this.treeFormVisible = false;
      if (this.$refs.treeForm) this.$refs.treeForm.resetFields();
      this.treeForm.name = "";
    },
    openDialog() {
      this.treeFormVisible = true;
      if (this.$refs.treeForm) this.$refs.treeForm.resetFields();
      this.treeForm.name = "";
    },
    /*树状图*/
    nodeClick(s, d, n) {
      console.log(d.name);
      this.titleName = d.name;
      this.isActive = 0;
      this.getPageList(this.titleFirst.powerId);
      this.tempPowerId = this.titleFirst.powerId;
      this.roleId = d.roleId;
      this.getRoleSys(d.roleId);
    },
    startTdk(s, d, n) {
      console.log("编辑");
      this.isAddOrEditorTree = 2;
      this.titleTree = "编辑角色";
      this.openDialog();
      this.tempData = Object.assign({}, d);
      this.treeForm = Object.assign({}, d);
    },
    addTop() {
      console.log("添加");
      this.isAddOrEditorTree = 1;
      this.openDialog();
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
          this.delRoleList(d.id);
        })
        .catch(() => {});
    },
    selectPages(val) {
      console.log(val);
      this.page = parseInt(val - 1);
      this.pageInit();
    },
    submitFormTree() {
      console.log(this.isAddOrEditorTree);
      this.$refs.treeForm.validate((val) => {
        if (val) {
          if (this.isAddOrEditorTree == 1) {
            let data = {
              roleName: this.treeForm.name,
            };
            this.addRoleList(data);
          } else {
            let data = {
              roleName: this.treeForm.name,
              id: this.tempData.id,
            };
            this.udpRoleList(data);
          }
          this.getRoleList();
        } else {
          this.showMessage("error", "输入内容不能为空");
        }
      });
    },
    /* 接口 */
    // ===树状图
    async getRoleList() {
      //  let resp = await this.Axios.get(`ucenter-api/rolelist/query?pageNum=${this.page}&pageSize=${this.pageSizeTree}`);
      let resp = await this.Axios.get(`ucenter-api/rolelist/query`);
      this.roleFirst = resp.data.result[0];
      console.log(this.roleFirst);
      if (this.roleFirst) {
        this.roleId = this.roleFirst.roleId;
      }
      this.treeList = this.dataAssembly(resp.data.result);
      this.typeTotle = resp.data.total;
      this.titleName = this.roleFirst.name;
    },
    async addRoleList(data) {
      let _resp = await this.Axios.post(`ucenter-api/rolelist/add`, data);
      console.log(_resp.data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "创建成功");
        this.getRoleList();
      } else {
        this.showMessage("error", _resp.data.message);
      }
      this.closeDialog();
    },
    async udpRoleList(data) {
      let _resp = await this.Axios.post(`ucenter-api/rolelist/update`, data);
      console.log(_resp.data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "更新成功");
        this.getRoleList();
      } else {
        this.showMessage("error", _resp.data.message);
      }
      this.closeDialog();
    },
    async delRoleList(id) {
      let _resp = await this.Axios.get(`ucenter-api/rolelist/delete?id=${id}`);
      console.log(_resp.data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "删除成功");
        console.log("分页");
        console.log(this.typeTotle);
        let number = (this.typeTotle - 1) % this.pageSizeTree;
        if (number == 0) {
          this.page = this.page - 1 < 0 ? 0 : this.page - 1;
        }
        console.log(number);
        this.getRoleList();
      } else {
        this.showMessage("error", _resp.data.message);
      }
      this.closeDialog();
    },
    // ==== 权限相关
    //获取角色已绑定权限
    async getRoleSys(roleId) {
      let _resp = await this.Axios.get(`ucenter-api/rolelist/powerTree?roleId=${roleId}`);
      // console.log(_resp.data.result);
      let _arr = this.dataAssembly2(_resp.data.result);
      this.checkList = _arr;
    },
    //获取系统权限
    async getSysList() {
      let _resp = await this.Axios.get(`ucenter-api/powerlist/queryAll?parentId=0&pageNum=0&pageSize=9999`);
      console.log(_resp.data.result);
      this.titleList = _resp.data.result;
      this.titleFirst = _resp.data.result[0];
      this.tempPowerId = this.titleFirst.powerId;
      this.uPowerId = _resp.data.result.filter((item) => {
        return item.path == "/user";
      })[0].powerId;
      console.log(this.uPowerId);
      this.getPageList(this.titleFirst.powerId);
    },
    //获取页面权限 & 按钮权限 列表
    async getPageList(id, uPowerId = "") {
      this.checkboxList = [];
      let _resp;
      if (uPowerId) {
        _resp = await this.Axios.get(`ucenter-api/powerlist/queryAll?parentId=${id}&uPowerId=${uPowerId}&pageNum=0&pageSize=9999`);
      } else {
        _resp = await this.Axios.get(`ucenter-api/powerlist/queryAll?parentId=${id}&pageNum=0&pageSize=9999`);
      }

      let _arrList = [];
      let _pageList = _resp.data.result;
      for (let item of _pageList) {
        let _tempArr = [item];
        let _resp2 = await this.Axios.get(`ucenter-api/powerlist/queryAll?parentId=${item.powerId}&pageNum=0&pageSize=9999`);

        _tempArr.push(_resp2.data.result);
        _arrList.push(_tempArr);
      }
      // console.log(_arrList);
      this.checkboxList = _arrList;
    },
    //获取按钮权
    async getBtnList(id) {
      let _resp = await this.Axios.get(`ucenter-api/powerlist/queryAllBtnPow?powerId=${id}&pageNum=0&pageSize=9999`);
      // console.log(_resp.data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
      } else {
        this.showMessage("error", _resp.data.message);
      }
    },
    //给角色绑定权限+
    async addPower(roleId, powerId) {
      let _resp = await this.Axios.get(`ucenter-api/rolelist/setPower?powerId=${powerId}&roleId=${roleId}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
      } else {
        this.showMessage("error", _resp.data.message);
      }
    },
    //给角色解绑权限
    async delPower(roleId, powerId) {
      let _resp = await this.Axios.get(`ucenter-api/rolelist/deletePower?powerId=${powerId}&roleId=${roleId}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
      } else {
        this.showMessage("error", _resp.data.message);
      }
    },
    // ==== 数据处理
    dataAssembly(data) {
      let _data = Object.assign([], data);
      _data.forEach((data) => {
        Object.assign(data, { name: data.roleName, isFirst: false, isEdit: false });
        delete data.roleName;
      });
      return _data;
    },
    //单独获取树状图第一层 提取id
    dataAssembly2(data) {
      let _arr = JSON.parse(JSON.stringify(data));
      if (_arr) {
        let _res = _arr.map((item) => {
          delete item.children;
          return item;
        });
        // console.log(_res);
        let _respArr = _res.map((data) => {
          return data.powerId;
        });
        return _respArr;
      } else {
        return [];
      }
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
</style>
