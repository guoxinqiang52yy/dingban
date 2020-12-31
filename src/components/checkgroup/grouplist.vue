<!--
 * @Author: 二级分组
 * @Date: 2020-08-13 10:46:40
 * @LastEditTime: 2020-10-19 08:59:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\components\checkgroup\grouplist.vue
-->
<!--  -->
<template>
  <div class="box">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{title}}</el-checkbox>
    <el-checkbox-group class="box_content" v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox v-for="(city, index) in cities" :label="city" :key="index">{{ city.name }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: "checklist",
  components: {},
  props: ["index", "selectAll", "datas",'title'],
  data() {
    return {
      checkAll: false,
      checkedCities: [],
      cities: [],
      isIndeterminate: false,
    };
  },
  computed: {},
  watch: {
    checkedCities(data) {
      // this.isSelect(data, this.cities);
      this.$store.commit("selectA", { index: this.index, list: data});
     
    },
  },
  created() {
    this.cities = this.datas; 
    this.initList(this.cities);
  },
  mounted() {
    this.$EventBus.$on("selectAl", (val) => {
      if (val) {
        this.checkedCities = this.cities;
        this.checkAll = true;
        this.isIndeterminate = false;
      } else {
        this.checkedCities = [];
        this.checkAll = false;
        this.isIndeterminate = false;
      }
    });
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : [];
      this.isIndeterminate = false;
      this.$emit("select", { index: this.index, all:val , part: this.isIndeterminate });
    },
    handleCheckedCitiesChange(value) { 
      let _arrList = value;
      let _arrSelect = _arrList.map((item) => {
        item.type = true;
        return item;
      });
         

      //判断框的样式 全选 半选 不选
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      this.$emit("select", { index: this.index, all: this.checkAll, part: this.isIndeterminate });
      //   console.log(this.$store.state.checkList);
    },
    //初始化 将已选择的放到checkedCities 中
    initList(data) {
      let _arrSelect = data.filter((item) => {
        if (item.type == true) {
          return item;
        }
      });
      this.checkedCities = _arrSelect;
      this.checkAll = this.checkedCities.length == this.cities.length;
      this.isIndeterminate = this.checkedCities.length > 0 && this.checkedCities.length < this.cities.length;
      
    },
  },
};
</script>
<style scoped>
.box {
  display: flex;
  margin-bottom: 15px;
}
.box_content {
  width: 400px;
  margin-left: 20px;
  display: flex;

  flex-wrap: wrap;
}
</style>
