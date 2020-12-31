<!--
 * @Author:  树状图组件2
 * @Date: 2020-08-11 14:40:12
 * @LastEditTime: 2020-09-14 14:43:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\components\treeRender.vue
-->
<!--  -->
<template>
  <span class="tree-expand">
    <span class="tree-label" v-show="DATA.isEdit">
      <el-input class="edit" size="mini" autofocus v-model="DATA.name" :ref="'treeInput' + DATA.id"
                @click.stop.native="nodeEditFocus" @blur.stop="nodeEditPass(STORE, DATA, NODE)"
                @keyup.enter.stop.native="nodeEditPass(STORE, DATA, NODE)"></el-input>
    </span>
    <span v-show="!DATA.isEdit" :class="[DATA.id > maxexpandId ? 'tree-new tree-label' : 'tree-label']">
      <span :title="DATA.name" v-if="processconfig">{{ DATA.name}}  </span>
      <span :title="DATA.name" v-else-if="showlength">{{ DATA.name | guoxinqiang}}  </span>
      <span :title="DATA.name" v-else>{{ DATA.name | dataLength1 }} </span>

    </span>
    <i v-if="descripshow" :title="DATA.description">({{ DATA.description | dataLength }})</i>
    <span class="tree-btn" :class="[!DATA.isEdit ? 'tree-show' : 'tree-hide']">
      <i class="el-icon-plus" v-if="addshow && !!DATA.children"
         @click.stop="nodeAdd(STORE, DATA, NODE)"></i>
      <i v-if="editshow" class="el-icon-edit" @click.stop="nodeEdit(STORE, DATA, NODE)"></i>
      <i class="el-icon-edit" v-if="tdkshow" @click.stop="nodeTdk(STORE, DATA, NODE)"></i>
      <i v-if="delshow" class="el-icon-delete" @click.stop="nodeDel(STORE, DATA, NODE)"></i>
    </span>
  </span>
</template>

<script>
    export default {
        name: "",
        components: {},
        props: ["NODE", "DATA", "STORE", "maxexpandId", "tdkshow", "addshow", "editshow", "delshow", "descripshow","showlength","processconfig"],
        data() {
            return {};
        },
        filters: {
            dataLength(data) {
               
                if (data.length > 11) {
                    return `${data.slice(0, 11)}...`;
                } else {
                    return data;
                }
            },
            dataLength1(data) {
                
                if (data.length > 7) {
                    return `${data.slice(0, 6)}...`;
                } else {
                    return data;
                }
            },
          guoxinqiang(data){
            if (data.length > 12) {
              return `${data.slice(0, 12)}...`;
            } else {
              return data;
            }
          }

        },
        computed: {},
        watch: {},
        created() {
        },
        mounted() {
        },
        beforeCreate() {
        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            nodeAdd(s, d, n) {
                //新增
                this.$emit("nodeAdd", s, d, n);
            },
            nodeEdit(s, d, n) {
                console.log(s,d,n,'安监局哈弗卡积分加大客户发')
                //编辑
                d.isEdit = true;
                this.$nextTick(() => {
                    this.$refs["treeInput" + d.id].$refs.input.focus();
                });
                this.$emit("nodeEdit", s, d, n);
            },
            nodeTdk(s, d, n) {
                this.$emit("nodeTdk", s, d, n);
            },
            nodeDel(s, d, n) {
                //删除
                this.$emit("nodeDel", s, d, n);
            },
            nodeEditPass(s, d, n) {
                //编辑完成
                this.$emit("nodeTxtPass", s, d, n);
                d.isEdit = false;
            },
            nodeEditFocus() {
                //阻止点击节点的事件冒泡
            },
        },
    };
</script>
<style>
    .el-tree-node__content {
        height: 28px;
    }

    .tree-expand {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .tree-expand .tree-show {
        display: inline-block !important;
    }

    .tree-expand .tree-hide {
        display: none !important;
    }

    .tree-expand i {
        flex: 1;
        font-style: normal;
        font-size: 12px;
        display: inline-block;
        color: #aaa;
        margin-left: 5px;
    }
</style>
