<!--
 * @Author: your name
 * @Date: 2020-08-14 11:52:35
 * @LastEditTime: 2020-08-14 11:58:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\components\tree\treeTesList.vue
-->
<!--  -->
<template>
  <span style="flex: 1; display: flex; align-items: center; font-size: 14px; padding-right: 8px;">
    <span @click="WatchInfo(STORE, DATA, NODE)" style="width: 80%">
      <span>{{ DATA.label }}</span>
    </span>
    <span class="span_icon">
      <el-button style="font-size: 12px;" type="text" v-if="DATA.addAble" @click="Append(STORE, DATA, NODE)">
        <i class="el-icon-plus"></i>
      </el-button>
      <el-button style="font-size: 12px;" type="text" v-if="DATA.delAble" @click="Delete(STORE, DATA, NODE)">
        <i class="el-icon-delete"></i>
      </el-button>
    </span>
  </span>
</template>

<script>
export default {
  name: "",
  components: {},
  props: ["NODE", "DATA", "STORE"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    Append(s, d, n) {
      //添加节点事件
      this.$emit("Append", s, d, n);
    },
    Delete(s, d, n) {
      this.$emit("Delete", s, d, n);
    },
    WatchInfo(s, d, n) {
      this.$emit("WatchInfo", s, d, n);
    },
  },
};
</script>
<style  scoped>

</style>
