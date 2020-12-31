<!--
 * @Author: APP
 * @Date: 2020-08-07 14:04:40
 * @LastEditTime: 2020-12-04 14:39:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\App.vue
-->
<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        created() {
        },
        mounted() {
            this.getCitys();
        },
        methods: {
            //获取城市信息
            async getCitys() {
                let _resp = await this.Axios.get(`common-api/citysite/list`);
                let _data = _resp.data.result;
                let _dataArr = [];
                for (let item of _data) {
                    let a = parseInt(item.addressId);
                    let x = {label: item.cityName, values: a};
                    _dataArr.push(x);
                }
                // console.log(_dataArr);
                this.$store.commit("getCity", _dataArr);
            },
        }
    };
</script>

<style>
    /*------------------------修改type=number的样式------------------------------------------------*/
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }

    @import url("./assets/css/comm.css");
    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        width: 100%;
        height: 100%;
    }

    html,
    body {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0px;
        margin: 0px;
    }

</style>
