<!--
 * @Author: 复选框列表组件
 * @Date: 2020-08-13 10:09:35
 * @LastEditTime: 2020-08-19 19:43:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\test\check.vue
-->

<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>分组一
    <checklist :list="list" @select="select"  ref="checklist"></checklist>
  </div>
</template>

<script>
import checklist from "../../components/checkgroup/group2";
export default {
  name: "check",
  components: { checklist },
  props: [],
  data() {
    return {
      tempdata: "",
      checkAll: false,
      isIndeterminate: false,
      list: [
        [
          { id: 111, name: "北京", type: false },
          { id: 112, name: "天津", type: false },
          { id: 113, name: "河北", type: false },
        ],
        [
          { id: 211, name: "上海", type: false },
          { id: 212, name: "杭州", type: false },
          { id: 213, name: "广州", type: false },
        ],
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    handleCheckAllChange(val) {
      this.$refs.checklist.fSeleteAll(val);
      console.log('头部');
      console.log(val);
      this.checkAll = val;
      this.isIndeterminate = false;
    },
    select(data) {
      console.log(data);
      if (data.all == true) {
        this.isIndeterminate = false;
        this.checkAll = true;
      } else {
        if (data.part == true) {
          this.isIndeterminate = true;
          this.checkAll = false;
        } else {
          this.checkAll = false;
          this.isIndeterminate = false;
        }
      }
      console.log("底部");
      console.log(this.checkAll);
      // if (data.all == false) {
      //   if (data.part == false) {
      //     this.isIndeterminate = false;
      //     this.checkAll = false;
      //   } else {
      //     this.isIndeterminate = true;
      //   }
      // } else {
      //   this.isIndeterminate = false;
      //   this.checkAll = true;
      // }
    },
  },
};
</script>
<style scoped></style>
