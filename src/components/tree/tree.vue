<!--
 * @Author: 树状组件1
 * @Date: 2020-08-11 13:42:31
 * @LastEditTime: 2020-11-02 11:09:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\components\tree.vue
-->
<!--  -->
<template>
  <div class="expand">
    <div style="padding-left:2px;">
      <el-button  type="primary" size="mini" v-if="title && titleshow==true" @click="handleAddTop">{{ title }}</el-button>
      <el-tree @competEditor="competEditor" highlight-current ref="expandMenuList" class="expand-tree" v-if="isLoadingTree" :data="setTree" node-key="id" :props="defaultProps" :default-expand-all='true' :expand-on-click-node="false" :render-content="renderContent" @node-click="handleNodeClick"></el-tree>
    </div>
  </div>
</template>

<script>
import Trees from "./treeRender";
let api = {
  maxexpandId: 100100,
  treelist: [],
};
export default {
  name: "tree",
  components: {},
  props: ["list", "title", "titleshow", "addshow", "editshow", "delshow", "tdkshow", "descripshow","showlength","processconfig"],
  data() {
    return {
      maxexpandId: api.maxexpandId, //新增节点开始id
      non_maxexpandId: api.maxexpandId, //新增节点开始id(不更改)
      isLoadingTree: false, //是否加载节点树
      // setTree: api.treelist, //节点树数据
      setTree: this.list, //节点树数据
      defaultProps: {
        children: "children",
        label: "name",
      },
      defaultExpandKeys: [], //默认展开节点列表
    };
  },
  computed: {},
  watch: {
    list(newVal, oldVal) {
      this.setTree = newVal;
      let _id = this.setTree[0].id;
      this.$nextTick(function() {
        this.$refs.expandMenuList.setCurrentKey(_id);
      });
    },
  },
  created() {

  },
  mounted() {
    console.log(this.showlength);
    this.initExpand();
    let that = this;
    // setTimeout(() => {
    //   that.$refs.expandMenuList.setCurrentKey("3");
    // }, 150);
    //  this.$nextTick(function() {
    //   this.$refs.expandMenuList.setCurrentKey("3");
    // });
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    competEditor() {},

    initExpand() {
      this.setTree.map((a) => {
        this.defaultExpandKeys.push(a.id);
      });
      this.isLoadingTree = true;
    },
    handleNodeClick(d, n, s) {
      //点击节点
      this.$emit("nodeClick", s, d, n);
      d.isEdit = false; //放弃编辑状态
    },
    renderContent(h, { node, data, store }) {
      //加载节点
      let that = this;
      return h(Trees, {
        props: {
          DATA: data,
          NODE: node,
          STORE: store,
          maxexpandId: that.non_maxexpandId,
          tdkshow: this.tdkshow,
          addshow: this.addshow,
          editshow: this.editshow,
          delshow: this.delshow,
          descripshow: this.descripshow,
          showlength:this.showlength,
          processconfig:this.processconfig
        },
        on: {
          nodeAdd: (s, d, n) => that.handleAdd(s, d, n), //添加子节点
          nodeEdit: (s, d, n) => that.handleEdit(s, d, n), //点击编辑
          nodeDel: (s, d, n) => that.handleDelete(s, d, n), //点击删除
          nodeTxtPass: (s, d, n) => that.handleTxtPass(s, d, n), //编辑完成
          nodeTdk: (s, d, n) => that.handlenodeTdk(s, d, n), //编辑tdk
        },
      });
    },
    handleAddTop() {
      this.$emit("addTop");
      return false;
      this.setTree.push({
        id: ++this.maxexpandId,
        name: "新增节点",
        pid: "",
        isEdit: false,
        children: [],
      });
    },
    handleAdd(s, d, n) {
      //增加节点
      // console.log(s, d, n);
      this.$emit("nodeAdd", s, d, n);

      if (n.level >= 4) {
        this.$message.error("最多只支持四级！");
        return false;
      }
      //添加数据
      // d.children.push({
      //   id: ++this.maxexpandId,
      //   name: "新增节点",
      //   pid: d.id,
      //   isEdit: false,
      //   children: [],
      // });
      // //展开节点
      // if (!n.expanded) {
      //   n.expanded = true;
      // }
    },
    handleTxtPass(s, d, n) {
      //编辑完成
      this.$emit("completeEditor", s, d, n);
    },
    handleEdit(s, d, n) {
      //编辑节点
      // console.log(s, d, n);
      this.$emit("startEditor", s, d, n);
    },
    handleDelete(s, d, n) {
      //删除节点
      this.$emit("deleteEditor", s, d, n);

      return false; //使用后台接口删除 (暂不用本地节点删除 只应用于一级节点)
      let that = this;
      //有子级不删除
      if (d.children && d.children.length !== 0) {
        this.$message.error("此节点有子级，不可删除！");
        return false;
      } else {
        //新增节点直接删除，否则要询问是否删除
        let delNode = () => {
          let list = n.parent.data.children || n.parent.data, //节点同级数据
            _index = 99999; //要删除的index
          /*if(!n.parent.data.children){//删除顶级节点，无children
                             list = n.parent.data
                             }*/
          list.map((c, i) => {
            if (d.id == c.id) {
              _index = i;
            }
          });
          let k = list.splice(_index, 1);
          //console.log(_index,k)
          this.$message.success("删除成功！");
        };
        let isDel = () => {
          that
            .$confirm("是否删除此节点？", "提示", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning",
            })
            .then(() => {
              delNode();
            })
            .catch(() => {
              return false;
            });
        };
        //删除
        isDel();
        //判断是否新增
        // d.id > this.non_maxexpandId ? delNode() : isDel();
      }
    },
    handlenodeTdk(s, d, n) {
      this.$emit("startTdk", s, d, n);
    },
  },
};
</script>
<style>
.expand {
  /* width: 100%;
  height: 100%; */
  max-width: 100%;
  overflow: hidden;
}
.expand > div {
  /* height: 85%; */
  /* width: 50%;  */
  max-width: 100%;
  overflow-y: auto;
  padding: 10px;
}

.expand > div::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

.expand > div::-webkit-scrollbar-thumb {
  background-color: rgba(50, 65, 87, 0.5);
  outline: 1px solid slategrey;
  border-radius: 5px;
}

.expand > div::-webkit-scrollbar {
  width: 10px;
}

.expand-tree {
  border: none;
  margin-top: 10px;
}

.expand-tree .el-tree-node.is-current,
.expand-tree .el-tree-node:hover {
  overflow: hidden;
}
.el-tree-node__content {
  /* padding-left: 15px!important; */
}

.expand-tree .is-current > .el-tree-node__content .tree-btn,
.expand-tree .el-tree-node__content:hover .tree-btn {
  display: inline-block;
}

.expand-tree .is-current > .el-tree-node__content .tree-label {
  font-weight: 600;
  white-space: normal;
}

.tree-expand {
  overflow: hidden;
}

.tree-expand .tree-label.tree-new {
  font-weight: 600;
}

.tree-expand .tree-label {
  font-size: 12px;
}

.tree-expand .tree-label .edit {
  width: 80%;
}

.tree-expand .tree-btn {
  display: none;
  float: right;
  /* margin-right: 20px; */
  margin-left: 5px;
}

.tree-expand .tree-btn i {
  color: #8492a6;
  font-size: 0.9em;
  margin-right: 6px;
}
.expand-tree .is-current > .el-tree-node__content {
  background: #ddd !important;
}
.expand-tree .is-current > .el-tree-node__content .tree-label {
  color: #333;
}
</style>
