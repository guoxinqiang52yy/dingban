<!--
 * @Author:  一级分组 
 * @Date: 2020-08-13 10:46:12
 * @LastEditTime: 2020-10-30 10:13:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\components\checkgroup\group.vue
-->
<template>
  <div class="group_list" v-if="list[1].length > 0">
    <el-checkbox  class="titles" :indeterminate="isIndeterminate" v-model="checkAll" :label="titleId" :key="titleId" @change="handleCheckAllChange">{{ title }}</el-checkbox>
    <el-checkbox-group class="bodys" v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox  @change="handleCheckedOneChange(city, $event)" v-for="(city, index) in cities" :label="city.powerId" :key="index">{{ city.name }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: "checkbox",
  components: {},
  props: ["list", "checkList"],
  data() {
    return {
      //表头
      title: "头部",
      titleId: "12",
      checkAll: false,
      isIndeterminate: false,
      length2: 2,
      //总列表id集合
      citiesIds: [],
      //总列表
      cities: [],
      //选中的列表
      checkedCities: [],
      selectAll: "",
    };
  },
  computed: {},
  watch: {},
  created() {
    
    this.cities = this.list[1];
    this.citiesIds = this.list[1].map((item) => item.powerId);
    this.title = this.list[0].name;
    this.titleId = this.list[0].powerId; 
    this.checkedCities = this.getAlreadyCheckes(this.checkList,this.citiesIds);
     
  },
  mounted() {
    this.checkAll = this.checkedCities.length === this.citiesIds.length;
    this.isIndeterminate = this.checkedCities.length > 0 && this.checkedCities.length < this.citiesIds.length;
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    handleCheckAllChange(val, e) {
      this.checkedCities = val ? this.citiesIds : [];
      this.isIndeterminate = false;
      console.log(e.target.value);
      this.getChecked(this.citiesIds, e.target.checked);
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.citiesIds.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.citiesIds.length;
    },
    //选中&取消
    handleCheckedOneChange(city, event) {
      console.log(city);
      this.getChecked(city.powerId, event);
    },
    //点击获取
    getChecked(data, val) {
      //  let _data = this.cities.filter((a) => !this.checkedCities.some((b) => b == a));
      //    console.log(this.cities);
      //    console.log(val);
      this.$emit("getChecked", { id: data, type: val });
      // console.log({name:data,type:val});
      //  this.$EventBus.$emit('getChecked',{name:data,type:val})
    },
    //从全部已选的列表提取当前页面权限已选
    getAlreadyCheckes(allSelectArr, thisArr) {
      let _arr = allSelectArr.filter(function(v) {
        return thisArr.indexOf(v) !== -1;
      });
      return _arr;
    },
  },
};
</script>
<style scoped>
.check_top {
  font-size: 16px;
  margin-bottom: 25px;
}
.group_list {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.group_list .titles {
  margin-right: 20px;
  font-weight: 600;
}
.group_list .bodys {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: #efefef;
}
.group_list .bodys .el-checkbox {
  margin: 5px;
  margin-right: 25px;
}

/* .group_list /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
  background-color: #409EFF;
    border-color: #409EFF;
}
.group_list /deep/
 
.group_list /deep/ .el-checkbox.is-disabled {
  opacity: 1;
}
.group_list /deep/ .el-checkbox.is-disabled .el-checkbox__core,
.el-checkbox.is-disabled .el-checkbox__label {
  cursor: pointer;
} */
</style>
