<!--
 * @Author: 左侧导航
 * @Date: 2020-08-12 11:11:17
 * @LastEditTime: 2020-11-02 14:35:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\components\leftnav.vue
-->
<!--  -->
<template>
    <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path"
             unique-opened class="el-menu-vertical-demo" background-color="#222d32" text-color="#fff"
             active-text-color="#ffd04b">
        <template v-for="menu in allmenu">
            <!-- <el-submenu :key="menu.menuid" :index="menu.menuname" v-if="menu.menuShow"> -->
            <el-submenu :key="menu.menuid" :index="menu.menuname">
                <template slot="title">
                    <i class="iconfont" :class="menu.icon"></i>
                    <span>{{ menu.menuname }}</span>
                </template>
                <el-menu-item-group class="nav_list">
                    <template v-for="chmenu in menu.menus">
                        <!-- <el-menu-item :index="'/' + chmenu.url" :key="chmenu.menuid" v-if="chmenu.menuShow"> -->
                        <el-menu-item :index="'/' + chmenu.url" :key="chmenu.menuid">
                            <i class="iconfont" :class="chmenu.icon"></i>
                            <span>{{ chmenu.menuname }}</span>
                        </el-menu-item>
                    </template>
                </el-menu-item-group>
            </el-submenu>
        </template>
    </el-menu>
</template>

<script>
    export default {
        name: "leftnav",
        components: {},
        props: ["data1"],
        data() {
            return {
                collapsed: false,
                allmenu: [],
            };
        },
        computed: {},
        watch: {
            data1(val) {
                //console.log(val);
                let res = {
                    success: true,
                    data: [],
                    msg: "success",
                };
                res.data = val;
                this.allmenu = res.data;
                console.log(this.allmenu);
            },
        },
        created() {

            // let arrType = ["用户中心", "组织架构", "部门管理", "角色管理", "地区管理", "商品库", "商品属性"];
            // this.allmenu = this.dataAssemble(res.data, arrType);
        },
        mounted() {
            // this.$store.state.selectRouterJurisdiction.url_parent = this.click_path
            // this.$store.state.selectRouterJurisdiction.url_node = this.click_path2
        },
        beforeCreate() {
        },
        updated() {
        },
        beforeDestroy() {
        },
        methods: {
            dataAssemble(data, arr = []) {
                let _data = JSON.parse(JSON.stringify(data));

                //console.log(_data);
                function assemle(data2) {
                    data2.forEach((ele) => {
                        if (arr.includes(ele.menuname)) {
                            ele.menuShow = true;
                        } else {
                            ele.menuShow = false;
                        }
                        if (!!ele.menus) {
                            assemle(ele.menus);
                        }
                    });
                }

                assemle(_data);
                return _data;
            },
        },
    };
</script>
<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 100%;
        min-height: 400px;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        border: none;
        text-align: left;
    }

    .nav_list /deep/ .el-menu-item-group__title {
        padding: 0px;
    }

    .el-menu-bg {
        background-color: #1f2d3d !important;
    }

    .el-menu {
        border: none;
    }

    .iconfont {
        margin-right: 5px;
    }
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  min-height: 400px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}
.nav_list /deep/ .el-menu-item-group__title {
  padding: 0px;
}
.nav_list /deep/ ul .el-menu-item{
  
  min-width: 160px;
}
.el-menu-bg {
  background-color: #1f2d3d !important;
}
.el-menu {
  border: none;
}
.iconfont {
  margin-right: 5px;
}
</style>
