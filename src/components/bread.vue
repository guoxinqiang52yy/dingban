<template>
    <div class="bread">
        <el-breadcrumb separator="/">
            <!--<el-breadcrumb-item :to="{ path:'/index' }">首页</el-breadcrumb-item>-->
            <el-breadcrumb-item v-for="v in $route.matched" :to="{ path:v.path}">{{v.menuname}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        data(){
            return{

            }
        },
        created() {}
    }
</script>

<style scoped>

</style>