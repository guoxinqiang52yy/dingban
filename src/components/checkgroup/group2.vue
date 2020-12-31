<!--
 * @Author:  一级分组 
 * @Date: 2020-08-13 10:46:12
 * @LastEditTime: 2020-10-19 08:59:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\components\checkgroup\group.vue
-->
<template>
  <div class="" v-if="ischeckl">
    <!-- <div class="check_top"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>大分组</div> -->
    <checkl ref="child" v-for="(item, index) in rightList" :key="index" :datas="item.list" :title='item.title' :index="index" :selectAll="selectAll" @select="select"></checkl>
  </div>
</template>

<script>
import checkl from "./grouplist";

export default {
  name: "check",
  components: { checkl },
  props: ["tempdata", "list"],
  data() {
    return {
      ischeckl: true,
      checkAll: false,
      isIndeterminate: false,
      selectAll: true,
      checkList: [],
      length2: 2,
      //总列表数量
      rightList: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.rightList = this.list;
  },
  mounted() {},
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    //全选 & 取消全选
    fSeleteAll(val) {
      this.$EventBus.$emit("selectAl", val);
    },
    select(data) {
      let num = this.checkList.findIndex((v) => {
        return v.index == data.index;
      });
      if (num < 0) {
        this.checkList.push(data);
      } else {
        this.checkList[num] = data;
      }
      this.checkList = this.checkList.filter((item) => {
        if ((item.all == true && item.part != true) || (item.all != true && item.part == true)) {
          return item;
        }
      });
      console.log("小数据");
      console.log(this.checkList);
      //   console.log(this.checkList);
      this.isPart(this.checkList);
    },
    /* 判断选中状态 */
    isPart(item) {
      let _partLength = item.findIndex((item) => {
        return item.part == true;
      });
      let _allLength = item.findIndex((item) => {
        return item.all == true;
      });
      let _length = item.length;
      if (_length > 0 && _length < this.rightList.length) {
        this.isIndeterminate = true; //半选
        this.selectAll = false;
      } else {
        if (_partLength >= 0) {
          this.isIndeterminate = true; //半选
          this.selectAll = false;
        } else if (_partLength < 0 && _allLength >= 0) {
          this.isIndeterminate = false; //半选
          this.selectAll = true;
        } else {
          this.isIndeterminate = false; //半选
          this.selectAll = false;
        }
      }
      /*返回给父组件*/
      this.$emit("select", { part: this.isIndeterminate, all: this.selectAll });
    },
  },
};
</script>
<style scoped>
.check_top {
  font-size: 16px;
  margin-bottom: 25px;
}
</style>
