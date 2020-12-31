<!--
 * @Author:合同配置
 * @Date: 2020-11-12 09:36:34
 * @LastEditTime: 2020-12-16 20:02:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \kuaiban-back\src\pages\order\order_orderlist\index.vue
-->

<template>
  <div class="finance_list finance_contract">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>财务系统</el-breadcrumb-item>
      <el-breadcrumb-item>合同配置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <div class="finance_content">
      <div class="finance_content_tree">
        <p>一级服务列表</p>
        <div class="finance_content_tree_list">
          <p class="finance_list_list_box" :class="{ finance_list_list_box_select: isSelect == index }" v-for="(item, index) in firstList" :key="index" @click="clikThis(index, item.groupId)">{{ item.name }}</p>
        </div>
      </div>
      <div class="finance_content_list">
        <div class="finance_content_list_list">
          <div class="title">配置合同模板（制定部门配置不同服务合同）</div>
          <div class="list">
            <el-checkbox-group v-model="checkList">
              <el-checkbox :label="item.templateId" v-for="(item, index) in arrList" :key="index" @change="handleCheckedOneChange(item, $event)">{{ item.templateName }}</el-checkbox>
            </el-checkbox-group>
            <!-- <el-button type="primary" @click="test">点击</el-button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import myMixin from "../../../assets/js/minx/minx";
export default {
  name: "",
  mixins: [myMixin],
  components: {},
  props: [],
  data() {
    return {
      isSelect: 0,
      //选中的一级服务id
      groupId: "",
      //选中的check
      checkId: "",
      //单选框
      checkList: [],
      arrList: [],
      //一级服务列表
      firstList: [],
    };
  },
  computed: {
    //获取城市
  },
  watch: {},
  created() {},
  mounted() {
    this.getListTemplate();
    this.getListFirst();
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /* 页面 */
    init(val) {
      this.groupId = this.firstList[0].groupId;
      this.clikThis(val, this.groupId);
    },
    // test() {
    //   console.log(this.checkList);
    // },
    //复选框点击
    handleCheckedOneChange(data, event) {
      console.log(data);
      console.log(event);
      if (event) {
        this.addCheck(data.templateId);
      } else {
        this.delCheck(data.templateId);
      }
    },
    async clikThis(index, val) {
      this.isSelect = index;
      this.getListTemplate();
      this.groupId = val;
      let _resp = await this.Axios.get(`order-api/contractconfig/query/by/serve?groupId=${val}`);
      console.log(_resp.data.result);
      let _arrList = _resp.data.result;
      let _data = _arrList.map((item) => {
        return item.templateId;
      });
      console.log(_data);
      this.checkList = _data;
    },
    /* 接口 */
    async getListTemplate() {
      let _resp = await this.Axios.get(`order-api/templatelist/query`);
      this.arrList = _resp.data.result;
      console.log(_resp.data.result);
    },
    async getListFirst() {
      let _resp = await this.Axios.get(`product-api/productgroup/list?firstLevel=0`);
      this.firstList = _resp.data.result;
      this.init(0);
      console.log(_resp.data.result);
    },
    async addCheck(id) {
      let _resp = await this.Axios.get(`order-api/contractconfig/add?groupId=${this.groupId}&templateId=${id}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "添加成功");
        this.getListTemplate();
      }
    },
    async delCheck(id) {
      let _resp = await this.Axios.get(`order-api/contractconfig/delete?groupId=${this.groupId}&templateId=${id}`);
      if (_resp.data.code == 0) {
        this.showMessage("success", "删除成功");
        this.getListTemplate();
      }
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
.dialog_link /deep/ .el-form-item__content {
  width: 400px;
}
.official_link /deep/ .el-switch.is-disabled {
  opacity: 1;
}
.official_link /deep/ .el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}
.pages {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
