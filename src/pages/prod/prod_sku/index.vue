<!--
 * @Author:  商品SKU
 * @Date: 2020-08-14 14:53:16
 * @LastEditTime: 2020-12-29 17:18:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\pages\user\uesr_org\index.vue
-->

<template>
  <div class="prod_sku">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>商品库</el-breadcrumb-item>
      <el-breadcrumb-item>SKU列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <section class="prod_sku_content">
      <article class="prod_sku_type">
        <p>商品分类</p>
        <div class="top_line"></div>
        <div class="tree_list">
          <tree :list="treeList" @nodeClick="nodeClick"></tree>
        </div>
      </article>
      <article class="list">
        <div class="prod_sku_button">
          <div style="display:flex;align-items: center;">
            <p style="margin-right:10px;flex:none;">地区选择:</p>
            <el-select v-model="selectCity" placeholder="请选择" @change="changeCity">
              <!-- <el-option  key="" label="全部" value=""> </el-option> -->
              <el-option v-for="item in options" :key="item.values" :label="item.label" :value="item.values"> </el-option>
            </el-select>
          </div>
          <el-button v-has="'/prod/sku-btn-add'" type="primary" size="small" @click="add">生成商品SKU</el-button>
        </div>

        <el-table :data="tableData" stripe max-height="550px" style="width: 100%">
          <!-- <el-table-column prop="id" align="center" label="序号" min-width="50"></el-table-column> -->
          <el-table-column prop="pic" align="center" label="商品图片" min-width="150">
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl" width="90" height="40" />
            </template>
          </el-table-column>
          <el-table-column prop="skuName" align="center" label="商品名称" min-width="200"> </el-table-column>
          <el-table-column prop="price" align="center" label="商品价格(默认-销售)" min-width="150">
            <!-- <template slot-scope="scope">
             <span>销售价：{{scope.row.price.split("-")}}</span>
             <span>默认价：</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="attributeNames" align="center" label="商品属性" min-width="150"></el-table-column>
          <el-table-column :formatter="formatCity" prop="areaId" align="center" label="创建地区" min-width="120"></el-table-column>
          <el-table-column :formatter="formatDate" prop="addTime" align="center" label="创建时间" min-width="120"></el-table-column>
          <el-table-column prop="time1" align="center" label="前台上架" min-width="150">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isUsed" disabled :active-value="1" :inactive-value="2" @click.native="handleShow(scope.row, scope.row.isUsed)"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="time" align="center" label="默认显示" min-width="150">
            <template slot-scope="scope">
              <span @click="handleDefoShow(scope.row)" :class="[scope.row.isDefault == 1 ? 'coin' : 'noDefault']"></span>
              <!-- <span class="coin default"></span> -->
              <!-- <el-radio class="radio" v-model="scope.row.isDefault" label="1" @click.native="handleClick(scope.row, scope.row.isUsed)"> </el-radio> -->
            </template>

            <!-- <template slot-scope="scope">
              <el-switch v-model="scope.row.isDefault" disabled :active-value="2" :inactive-value="1" @click.native="handleDefoShow(scope.row, scope.row.isDefault)"> </el-switch>
            </template> -->
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="80" fixed="right">
            <template slot-scope="scope">
              <el-button v-has="'/prod/sku-btn-edit'" @click="editThis(scope.row)" type="text" size="small">编辑</el-button>
              <!-- <el-button type="text" size="small">编辑</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="pages">
          <p></p>
          <el-pagination :current-page.sync="cur_page" background layout="prev, pager, next" :page-size="6" :total="skuTotle" @next-click="selectSkuPages" @prev-click="selectSkuPages" @current-change="selectSkuPages"> </el-pagination>
        </div>
      </article>
    </section>

    <!-- 编辑sku -->
    <el-dialog class="formSku" :title="titleSku" :visible.sync="isEditFormSku" width="60%" @close="closeDialog">
      <el-form class="from_input" label-position="right" :inline="true" label-width="80px" ref="editFormSku" :model="editFormSku" :rules="rulesSku">
        <div class="from_group_input_box">
          <div class="from_group_input">
            <el-form-item label="商品名称" class="from_group_input_name">
              <el-input class="formSku_input" size="small" :disabled="true" v-model="editFormSku.name" auto-complete="off" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="selectPrice">
              <el-radio-group v-model="editFormSku.selectPrice" @change="changePirice">
                <el-radio label="1"
                  >￥原价<el-input :disabled="editFormSku.selectPrice != 1" class="price_input" size="small" v-model="editFormSku.priceOrgi" auto-complete="off" placeholder="请输入原价"></el-input> ￥折扣<el-input
                    :disabled="editFormSku.selectPrice != 1"
                    class="price_input"
                    size="small"
                    v-model="editFormSku.priceDisc"
                    auto-complete="off"
                    placeholder="请输入折价"
                  ></el-input
                ></el-radio>
                <el-radio label="-1">面议</el-radio>
              </el-radio-group>
              <!-- <el-button style='margin-left:25px' size="small" type="primary" @click="changePrice()">修改价格</el-button> -->
            </el-form-item>
          </div>
          <el-form-item label="展示封面" prop="imageUrl" class="upload_pic">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :http-request="suceessAvataruploadPic">
              <img v-if="editFormSku.imageUrl" :src="editFormSku.imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <i class="upload_info">图片纵横比3:4</i>
          </el-form-item>
        </div>

        <br />
        <el-form-item class="editor_box" label="商品详情" prop="content" style="margin-right:0px;flex:none">
          <div class="editor">
            <editor v-model="editFormSku.content"></editor>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm">发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import tree from "../../../components/tree/tree";
import myMixin from "../../../assets/js/minx/minx";
import editor from "../../../components/editor";
export default {
  name: "",
  components: { tree, editor },
  mixins: [myMixin],
  props: [],
  data() {
    return {
      aaa: "1",
      //地区
      selectCity: 3,
      //列表数据
      tableData: [],

      //树状图数据
      treeList: [],

      /*  表单操作 */
      titleSku: "新建SKU",
      isEditFormSku: false,
      editFormSku: {
        name: "",
        selectPrice: "",
        seleAreaId: "",
        content: "",
        imageUrl: "",
        priceDisc: "",
        priceOrgi: "",
        isDefault: "",
        isUsed: "",
      },
      loading: false,
      rulesSku: {
        // selectPrice: [{ required: true, message: "请选择价格", trigger: "blur" }],
        // seleAreaId: [{ required: true, message: "请选择地区", trigger: "blur" }],
        // imageUrl: [{ required: true, message: "请上传图片", trigger: "blur" }],
        //content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      //新建sku数据
      productId: "",
      productName: "",
      groupId: "",
      skuPage: 0,
      getProdId: "",
      skuTotle: 0,
      cur_page: 0,
      skuId: "",
      tempSkuData: {},
      //临时城市数据
    };
  },
  computed: {
    //获取城市
    options() {
      return this.$store.state.cityList;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.getProdType();
    console.log(this.options);
  },
  beforeCreate() {},
  updated() {},
  beforeDestroy() {},
  methods: {
    /*列表过滤*/
    formatDate(row, column) {
      return row.addTime.split(" ")[0];
    },
    formatCity(row, column) {
      let _Da = this.$store.state.cityList;
      console.log(_Da);
      console.log(row.areaId);
      let _resp = _Da.find((val) => {
        return val.values == row.areaId;
      });
      if (_resp) return _resp.label; //有旧数据残留 数据结构不同
    },
    add() {
      // this.isEditFormSku = true;
      console.log(this.selectCity);
      if (!this.selectCity) {
        this.showMessage("error", "请选择城市");
        return false;
      }
      if (!this.productId) {
        this.showMessage("error", "请选择商品");
        return false;
      }
      this.$confirm("是否生成该地区的SKU？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {};
          data.productId = this.productId;
          data.productName = this.productName;
          data.groupId = this.groupId;
          data.areaId = this.selectCity;
          console.log(data);
          this.newSkuList(data);
        })
        .catch(() => {
          return false;
        });
    },
    editThis(data) {
      console.log(data);
      this.tempSkuData = data;
      this.skuId = data.skuId;
      this.isEditFormSku = true;
      this.editFormSku.name = data.productName;
      if (data.price == "面议") {
        this.editFormSku.selectPrice = "-1";
      } else {
        this.editFormSku.selectPrice = "1";
        this.editFormSku.priceDisc = data.price.split("-")[1];
        this.editFormSku.priceOrgi = data.price.split("-")[0];
      }

      this.editFormSku.imageUrl = data.imgUrl;
      this.editFormSku.content = data.information;
      console.log(this.editFormSku);
    },
    /* 提交 */
    submitForm() {
      this.$refs.editFormSku.validate((val) => {
        //修改价格
        let tempData = this.tempSkuData;
        let _priceType = this.editFormSku.selectPrice;
        console.log(this.editFormSku.content);
        console.log(tempData);
        let data = {};
        data.areaId = tempData.areaId;
        data.skuId = tempData.skuId;
        data.information = this.editFormSku.content;
        if (_priceType == -1) {
          data.sellPrice = -1;
        } else {
          data.defaultPrice = this.editFormSku.priceOrgi;
          data.sellPrice = this.editFormSku.priceDisc;
        }
        console.log(data);
        this.updPriceContent(data);
      });
    },
    changePirice(val) {
      console.log(val);
      if (val == -1) {
        this.editFormSku.priceOrgi = "";
        this.editFormSku.priceDisc = "";
      }
    },
    //选择地区
    changeCity(val) {
      console.log(val);
      this.getSkuList();
    },
    //切换状态(前台显示)
    handleShow(data1, type) {
      if (!this.verification(this.$store.state.selectBtnJurisdiction, "/prod/sku-btn-show")) {
        this.showMessage("error", "无此权限");
        return false;
      }
      let _data = data1;
      this.$confirm("是否修改设置？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(type);
          console.log(_data);
          if (type == 2) {
            _data.isUsed = 1;
          } else {
            _data.isUsed = 2;
          }

          console.log(_data);
          this.updSkuList(_data);
        })
        .catch(() => {
          return false;
        });
    },
    //切换状态(默认显示)
    handleDefoShow(data1, type) {
      //验证权限
      if (!this.verification(this.$store.state.selectBtnJurisdiction, "/prod/sku-btn-show")) {
        this.showMessage("error", "无此权限");
        return false;
      }

      console.log(data1);
      let _data = {};
      _data.areaId = data1.areaId;
      _data.productId = data1.productId;
      _data.skuId = data1.skuId;
      this.$confirm("是否修改设置？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(_data);
          this.changeDefType(_data);
        })
        .catch(() => {
          return false;
        });
    },
    getPicture(data) {
      this.editFormSku.imageUrl = `http://applet-second.oss-cn-qingdao.aliyuncs.com/` + data;
      this.changePic(this.editFormSku.imageUrl, this.skuId);
    },
    nodeClick(s, d, n) {
      //二级分类添加子集
      this.tableData = [];
      this.skuTotle = 0;
      if (d.parentId == 0) {
        return false;
      }
      console.log(d);
      //获取商品列表
      this.getProdList(d.groupId).then((_resp) => {
        d.children = _resp;
        n.expanded = true;
      });
      //判断是否为商品列表
      if (d.hasOwnProperty("attrCateIds")) {
        this.skuPage = 0;
        this.cur_page = 0;
        this.productId = d.productId;
        this.productName = d.name;
        this.groupId = d.groupId;
        this.getProdId = d.productId; //点击获取
        this.getSkuList();
      }
    },
    closeDialog() {
      this.isEditFormSku = false;
      this.$refs.editFormSku.resetFields();
      this.editFormSku.selectPrice = "";
      this.editFormSku.priceDisc = "";
      this.editFormSku.priceOrgi = "";
      this.editFormSku.imageUrl = "";
      this.editFormSku.content = "";
    },

    /* 分页 */
    selectSkuPages(val) {
      this.skuPage = parseInt(val - 1);
      this.getSkuList();
    },
    /* 接口 */

    //修改默认显示
    async changeDefType(data) {
      let _resp = await this.Axios.post(`product-api/skulist/updateIsDefault`, data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getSkuList();
      } else {
        this.showMessage("error", "操作失败");
      }
    },

    //更新图片
    async changePic(img, skuId) {
      let data = {};
      data.imageUrl = img;
      data.skuId = skuId;
      let _resp = await this.Axios.post(`product-api/skuimage/update`, data);
      console.log(_resp.data);
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getSkuList();
      } else {
        this.showMessage("error", "操作失败");
      }
    },

    //获取商品分类
    async getProdType() {
      let _resp = await this.Axios.post(`product-api/productgroup/getProdGroupListWithLevel`);
      let _array = this.dataTypeAssemble(_resp.data.result);
      console.log("分类");
      console.log(_array);
      this.treeList = _array;
    },
    //根据分类获取商品列表
    async getProdList(groupId) {
      let _resp = await this.Axios.get(`product-api/productlist/list?pageNum=0&pageSize=1000&groupId=${groupId}`);
      return _resp.data.result;
    },
    //获取sku集合
    async getSkuList() {
      let _resp = await this.Axios.post(`product-api/skulist/list?areaId=${this.selectCity}&productId=${this.getProdId}&pageNum=${this.skuPage}&pageSize=6`);
      console.log(_resp.data.result);
      this.tableData = _resp.data.result;
      this.skuTotle = _resp.data.total;
    },
    //生成sku列表
    async newSkuList(data) {
      let _resp = await this.Axios.post(`product-api/skulist/add`, data, "postJson");
      console.log(_resp.data);
      if (_resp.data.code == 0) {
        this.getSkuList();
      } else {
        this.showMessage("error", _resp.data.message);
      }
    },
    //更新sku
    async updSkuList(data) {
      let _resp = await this.Axios.post(`product-api/skulist/update`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getSkuList();
      } else {
        this.showMessage("error", "操作失败");
      }
      this.isEditFormSku = false;
    },
    //更新sku价格&详情
    async updPriceContent(data) {
      let _resp = await this.Axios.post(`product-api/skuprice/update`, data, "postJson");
      if (_resp.data.code == 0) {
        this.showMessage("success", "操作成功");
        this.getSkuList();
      } else {
        this.showMessage("error", "操作失败");
      }
      this.isEditFormSku = false;
    },
    /* 数据组装 */
    dataTypeAssemble(data) {
      let _data = [];
      data.forEach((element) => {
        let _dat = element;
        let _array = [];
        for (let _arr of element.productGroupVOList) {
          let _tempArr = _arr;
          Object.assign(_tempArr, { isFirst: false, isEdit: false, children: [] });
          _array.push(_tempArr);
        }
        Object.assign(_dat, { isFirst: false, isEdit: false, children: _array });
        _data.push(_dat);
        // delete _dat.attributeListVOList; //删除 子对象列表 添加 children
      });
      return _data;
    },
  },
};
</script>
<style scoped>
@import url("./index.css");
.price_input {
  width: 100px;
}
.select_city {
  height: 32px;
}

.select_city /deep/ .el-input__inner {
  height: 32px;
}

.formSku .avatar-uploader {
  margin-right: 5px;
}
.formSku .avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.formSku .avatar-uploader /deep/ .el-upload:hover {
  border-color: #409eff;
}
.formSku /deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.skuTypeList {
  /* height: 32px; */
  margin-right: 20px;
}

.skuTypeList /deep/ .el-input__inner {
  height: 32px !important;
}
.skuTypeList /deep/ .el-input--suffix {
  /* height: 32px !important; */
}
.formSku /deep/ .el-dialog__body {
  overflow-y: auto;
  height: 65vh;
}
.list /deep/ .el-switch.is-disabled {
  opacity: 1;
}
.list /deep/ .el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}
.pages {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.coin {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #409eff;
  cursor: pointer;
}
.noDefault {
  cursor: pointer;
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid #409eff;
}
.from_group_input_box {
  display: flex;
}
.from_group_input {
  flex: none;
  width: 30vw;
  margin-right: 25px;
}
.upload_pic /deep/ .el-form-item__content {
  display: flex;
  align-items: flex-end;
  width: 100%;
}
.upload_info {
  font-size: 12px;
  font-style: normal;
  margin-left: 15px;
}
.tree_list {
  max-height: 700px;
  overflow-y: auto;
}
.formSku /deep/ .el-dialog {
  margin-top: 10vh !important;
}
.formSku /deep/ .el-form-item__label {
  flex: none;
}
.from_input /deep/ .el-form-item {
  width: 100%;
}
.from_input /deep/ .el-form-item__content {
  width: 100%;
}
.from_input /deep/ .el-form--inline .el-form-item {
  width: 100%;
}
</style>
