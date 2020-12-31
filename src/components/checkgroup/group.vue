<!--
 * @Author:  一级分组 
 * @Date: 2020-08-13 10:46:12
 * @LastEditTime: 2020-08-17 20:13:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\components\checkgroup\group.vue
-->
<template>
  <div class="">
    <div class="check_top"><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>大分组</div>
    <checkl ref="child" v-for="(item, index) in checkL" :key="index" :datas="item" :index="index" :selectAll="selectAll" @select="select"></checkl>
  </div>
</template>

<script>
import checkl from "./grouplist";

export default {
  name: "check",
  components: { checkl },
  props: [],
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      checkList: [],
      length2:2,
      //总列表数量
      checkL: [
        ["北京", "上海", "天津", "广州"],
        ["江苏", "海南", "浙江", "四川"],
      ],
      selectAll: "",
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
      console.log('大分组');
      console.log(this.isIndeterminate); 
      this.selectAll = val;
      this.isIndeterminate = false;
      this.$EventBus.$emit("selectAll", val);
     
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
      this.isPart(this.checkList);
    },
    /* 判断是否为全部选中 */
    isPart(item) {
      console.log('返回数据');
       console.log(item);
      let resp = item.filter((v) => {
        return v.all == false;
      });
      let respNo = item.filter((v) => {
        return v.part == false && v.all == false;
      });
      console.log(respNo);
      //存在<非全部选中>列表
      if (resp.length > 0) {
        this.isIndeterminate = true;
        this.checkAll = false; //二级存在非全部选中的列表  默认为不选状态 点击后为选中状态
      } else {
        console.log('非全部选中');
        //不存在<非全部选中>列表
        this.isIndeterminate = false;
        this.checkAll = true; //二级所有选中后  默认为选中状态 点击后为不选状态
        console.log(resp.length);
        if (item.length < this.checkL.length) {
          this.isIndeterminate = true;
          this.checkAll = false; //二级所有选中且不是所有列表选中后  默认为不选状态 点击后为选中状态
        }
      }
      if (respNo.length == this.checkL.length) {
        this.isIndeterminate = false;
        this.checkAll = false; //二级所有选中且不是所有列表选中后  默认为不选状态 点击后为选中状态
      }
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
