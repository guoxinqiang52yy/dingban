<template>
  <div class="agencylist">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>人才系统</el-breadcrumb-item>
      <el-breadcrumb-item>中介管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <!-- 中介管理筛选 -->
    <div class="select agencyselect">
      <el-button
        type="primary"
        @click="addagent"
        v-has="'/agency/agent-btn-typeAdd'"
        size="small"
        >添加中介</el-button
      >
    </div>
    <!-- 中介管理列表 -->
    <div class="personbox">
      <el-table :data="tableList" stripe style="width: 100%">
        <!-- <el-table-column prop="id" align="center" label="序号" min-width="50"></el-table-column> -->
        <el-table-column
          prop="providerName"
          align="center"
          label="中介名称"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="telephone"
          align="center"
          label="手机号"
          min-width="120"
        ></el-table-column>
        <el-table-column align="center" label="所在地区" min-width="180">
          <template slot-scope="scope">
            {{ scope.row.province }}--{{ scope.row.city }}--{{ scope.row.area }}
          </template>
        </el-table-column>
        <el-table-column
          prop="certRange"
          align="center"
          label="证书范围"
          min-width="120"
          class="rangecard"
        >
          <template slot-scope="scope">
            {{ scope.row.certRange == "" ? "--" : scope.row.certRange }}
          </template>
        </el-table-column>
        <el-table-column
          prop="cardreverse"
          align="center"
          label="身份证正反面"
          min-width="155"
        >
          <template slot-scope="scope">
            <viewer :images="scope.row.arr">
              <div class="flexthree">
                <img
                  class="idimg"
                  v-for="(src, index) in scope.row.arr"
                  :src="src.filePath"
                  :key="index"
                  style="margin-right: 20px"
                />
              </div>
            </viewer>
          </template>
        </el-table-column>
        <el-table-column align="center" label="营业执照" min-width="155">
          <template slot-scope="scope">
            <div v-if="scope.row.arr1.length != 0">
              <viewer :images="scope.row.arr1">
                <div class="flexthree">
                  <img
                    class="idimg"
                    v-for="(src, index) in scope.row.arr1"
                    :src="src.filePath"
                    :key="index"
                  />
                </div>
              </viewer>
            </div>
            <div v-else>---</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合作协议" min-width="155">
          <template slot-scope="scope">
            <!-- <viewer :images="scope.row.arr2"> -->
            <div class="flexthree">
              <div
                class="idimg"
                v-for="(src, index) in scope.row.arr2"
                :key="index"
              >
                <!-- v-if="src.fileSuffix == '.png' || src.fileSuffix == '.jpg'" -->
                <img class="idimgagree" :src="src.filetext" />
                <!-- <div v-else @click="downloadfile(index,src)">
                  <i class="el-icon-document-remove" ></i>

                  </div> -->
              </div>
            </div>
            <!-- </viewer> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="creatorName"
          align="center"
          label="创建人"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="addTime"
          align="center"
          label="创建时间"
          min-width="100"
        >
        </el-table-column>

        <el-table-column align="center" label="操作" width="85">
          <template slot-scope="scope">
            <div class="flexthree btnlist">
              <div
                v-has="'/person/person-btn-typeAdd'"
                @click="editList(scope.row)"
                type="text"
                size="small"
                class="editbtn"
                style="margin-right: 2px"
              >
                编辑
              </div>
              <div
                v-has="'/person/person-btn-typeAdd'"
                @click="delList(scope.row)"
                type="text"
                size="small"
                class="deletebtn"
                style="margin-right: 0"
              >
                删除
              </div>
            </div>
            <!-- <el-button @click="deleteList(scope.row)" type="text" size="small">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-pagination
        v-if="totalsize != 0"
        class="pagelist"
        background
        layout="prev, pager, next"
        :total="totalsize"
        @current-change="changecurrent"
      >
      </el-pagination> -->
      <el-pagination
        v-if="totalsize != 0"
        class="pagelist"
        @size-change="changesize"
        @current-change="changecurrent"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="10"
        layout="total,sizes, prev, pager, next, jumper"
        :total="totalsize"
      >
      </el-pagination>
    </div>
    <!-- 添加中介信息 -->
    <div class="agencylialog">
      <el-dialog
        :title="text"
        width="750px"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="中介名称：" prop="providerName" class="itemname">
            <el-input v-model="ruleForm.providerName"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="telephone" class="itemname">
            <el-input v-model="ruleForm.telephone" @blur="testphone"></el-input>
          </el-form-item>
          <el-form-item label="所在地区：" class="arealist livearea">
            <el-col :span="7">
              <el-form-item class="agencyprovince">
                <el-select
                  class="agencyprovince"
                  v-model="provincevalue"
                  placeholder="请选择省"
                  @change="selectprovince"
                >
                  <el-option
                    v-for="item in provinceoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item class="agencyprovince">
                <el-select
                  v-model="cityvalue"
                  placeholder="请选择市"
                  @change="selectcity"
                  :disabled="showcity"
                >
                  <el-option
                    v-for="item in cityoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="7">
              <el-form-item style="margin-right: 0" class="agencyprovince">
                <el-select
                  v-model="countyvalue"
                  placeholder="请选择区"
                  @change="selectcounty"
                  :disabled="showcounty"
                >
                  <el-option
                    v-for="item in countyoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="证书范围：" class="itemname certrange">
            <el-select
              v-model="certifinatevalue"
              multiple
              placeholder="请选择"
              @change="selectcertificate"
            >
              <el-option
                v-for="item in certifination"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份证正反面：" prop="idcard" class="itemname">
            <!-- <el-upload
              class="upload-demo"
              action=""
              multiple
              :before-upload="beforeAvatarUpload"
              :on-change="successfile"
              :http-request="suceessAvataruploadPicone"
              :file-list="fileListidcard"
              :on-remove="handleRemoveidcard"
            >
              <el-button slot="trigger" size="small" type="primary"
                >上传</el-button
              >
            </el-upload> -->
            <div class="uploadbtn">
              上传
              <input type="file" class="upfilebtn" @change="upcardfileimg" />
            </div>
            <div class="uploadlist">
              <div
                class="uploadlistitem"
                v-for="(item, index) in idcartdimg"
                :key="index"
              >
                <i class="el-icon-document filetype"></i>
                <div class="upfilename">{{ item.fileName }}</div>
                <i
                  class="el-icon-circle-close fileclose"
                  @click="delcardimg(item, index)"
                ></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="营业执照：" class="itemname">
            <!-- <el-upload
              class="upload-demo"
              ref="upload"
              action=""
              multiple
              :http-request="suceesslinceimg"
              :on-remove="handleRemovelicense"
              :file-list="fileListcompany"
            >
              <el-button slot="trigger" size="small" type="primary"
                >上传</el-button
              >
            </el-upload> -->
            <div class="uploadbtn">
              上传
              <input type="file" class="upfilebtn" @change="uplincefileimg" />
            </div>
            <div class="uploadlist">
              <div
                class="uploadlistitem"
                v-for="(item, index) in linceimg"
                :key="index"
              >
                <i class="el-icon-document filetype"></i>
                <div class="upfilename">{{ item.fileName }}</div>
                <i
                  class="el-icon-circle-close fileclose"
                  @click="dellinceimg(item, index)"
                ></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="合作协议：" prop="cooperate" class="itemname">
            <!-- <el-upload
              class="upload-demo"
              ref="upload"
              action=""
              :http-request="successcooperate"
              :on-remove="handleRemoveoperate"
              :file-list="fileListcooperation"
            >
              <el-button slot="trigger" size="small" type="primary"
                >上传</el-button
              >
            </el-upload> -->
            <div class="uploadbtn">
              上传
              <input type="file" class="upfilebtn" @change="upcooperateimg" />
            </div>
            <div class="uploadlist">
              <div
                class="uploadlistitem"
                v-for="(item, index) in cooperateimg"
                :key="index"
              >
                <i class="el-icon-document filetype"></i>
                <div class="upfilename">{{ item.fileName }}</div>
                <i
                  class="el-icon-circle-close fileclose"
                  @click="decoopreateimg(item, index)"
                ></i>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="suresubmit('ruleForm')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!-- 是否删除中介 -->
    <div class="joinwrap">
      <el-dialog
        title="删除中介"
        :visible.sync="titledialogVisible"
        :close-on-click-modal="false"
        width="30%"
      >
        <span>是否删除中介</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="titledialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="suredelete">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { checkTel,geticon,deteleObject} from "../../../../src/assets/js/minx/common"; //手机号和区号的判断
import t from "../../../components/t.vue";

export default {
  components: { t },
  data() {
    return {
      titledialogVisible: false, //删除中介信息显示
      addtype: "",
      text: "添加中介信息",
      agencyid: "", //中介id
      station: [],
      stationname: "",
      tableList: [], //中介管理列表
      totalsize: 0, //中介的条数
      page: 0,
      dialogFormVisible: false, //中介信息弹层
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",
      ruleForm: {
        providerName: "",
        telephone: "",
        province: "",
        city: "",
        area: "",
        certRange: "",
        idcard: [],
        cooperate: [],
      },
      idcartdimg: [], //身份证照片
      linceimg: [], //营业执照
      cooperateimg: [], //合作协议
      imagearr: [],
      rules: {
        providerName: [
          { required: true, message: "请输入中介名称", trigger: "blur" },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
        ],
        idcard: [
          {
            type: "array",
            required: true,
            message: "请上传身份证正反面",
            trigger: "change",
          },
        ],
        cooperate: [
          {
            type: "array",
            required: true,
            message: "请上传合作协议",
            trigger: "change",
          },
        ],
      },
      provinceoptions: [], //省
      provincevalue: "", //省名字
      cityoptions: [],
      cityvalue: "",
      countyoptions: [], //区
      countyvalue: "",
      showcity: true,
      showcounty: true,
      certifination: [], //证书范围../../../assets/icon/file/weizhi.png
      certifinatevalue: "",
      // 身份证正反面
      fileListidcard: [],
      fileListcompany: [],
      fileListcooperation: [],
      iconshow: require("../../../assets/icon/file/weizhi.png"), //显示的图片
      currentPage4: 1,
      pagesize: 0,
    };
  },
  created() {
    // 获取列表
    this.getanentlist();
    // 获取 省
    this.getprovince();
    // 获取证书范围
    this.getcertificate();
  },
  methods: {
    // 获取 中介信息
    async getagency() {
      let res = await this.Axios.get(
        `talents-api/providerlist/get?id=${this.agencyid}`
      );
      console.log(res, "中介信息");
      this.ruleForm.providerName = res.data.result.providerName;
      this.ruleForm.telephone = res.data.result.telephone;
      // 省市区
      this.provincevalue = res.data.result.province;
      this.cityvalue = res.data.result.city;
      this.countyvalue = res.data.result.area;
      this.ruleForm.province = res.data.result.province;
      this.ruleForm.creatorId = res.data.result.creatorId;
      this.ruleForm.city = res.data.result.city;
      this.ruleForm.area = res.data.result.area;
      this.ruleForm.certRange = res.data.result.certRange;
      if (res.data.result.certRange.length != 0) {
        this.certifinatevalue = res.data.result.certRange.split(",");
        this.ruleForm.creatorId = res.data.result.creatorId;
      }

      let fileList = res.data.result.fileList;
      if (res.data.result.province != "") {
        this.showcity = false;
        this.showcounty = false;
      }
      this.provinceoptions.forEach((value, index, array) => {
        if (value.label == res.data.result.province) {
          // this.getcity(value.value)
        }
      });
      if (fileList != null) {
        fileList.forEach((value, index, array) => {
          if (value.fileType == 2) {
            this.idcartdimg.push(value);
            this.ruleForm.idcard.push(value);
            let obj = {};
            obj.name = value.fileName;
            obj.url =
              "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
              value.filePath;
            this.fileListidcard.push(obj);

            console.log(this.fileListidcard, "身份证照片");
          } else if (value.fileType == 3) {
            this.linceimg.push(value);
            let obj = {};
            obj.name = value.fileName;
            obj.url =
              "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
              value.filePath;
            this.fileListcompany.push(obj);
            console.log(this.fileListidcard, "营业执照");
          } else if (value.fileType == 4) {
            this.cooperateimg.push(value);
            this.ruleForm.cooperate.push(value);
            let obj = {};
            obj.name = value.fileName;
            obj.url =
              "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
              value.filePath;
            this.fileListcooperation.push(obj);
            console.log(this.fileListidcard, "合作协议");
          }
        });
      }
    },
    // 改变页码
    changecurrent(val) {
      this.page = val - 1;
      console.log(this.page);
      this.currentPage4 = val;
      this.getanentlist();
    },
    // 改变每页的条数
    changesize(e) {
      this.pagesize = e;
      this.getanentlist();
    },
    // 获取中介 列表
    async getanentlist() {
      let res = await this.Axios.get(
        `talents-api/providerlist/queryList?pageNum=${this.page}&pageSize=${this.pagesize}`
      );
      console.log(res, "中介列表");
      this.tableList = res.data.result;

      this.tableList.forEach((value, index, array) => {
        value.arr = [];
        value.arr1 = [];
        value.arr2 = [];
        console.log(value, "列表列表");
        if (value.fileList) {
          value.fileList.forEach((valuek, indexk, arrayk) => {
            if (valuek.fileType == 2 && valuek.relationId == value.providerId) {
              valuek.filePath =
                "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
                valuek.filePath;
              value.arr.push(valuek);
            } else if (
              valuek.fileType == 3 &&
              valuek.relationId == value.providerId
            ) {
              valuek.filePath =
                "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
                valuek.filePath;
              value.arr1.push(valuek);
            } else if (
              valuek.fileType == 4 &&
              valuek.relationId == value.providerId
            ) {
              let fileSuffix = valuek.fileSuffix.split(".")[1];
              console.log(fileSuffix, "后缀后缀");

              if (geticon(fileSuffix)) {
                let imgfile = fileSuffix + ".png";
                console.log(imgfile, "图片 的名字");
                valuek.filetext = require("../../../assets/icon/file/" +
                  imgfile);
              } else {
                valuek.filetext = require("../../../assets/icon/file/weizhi.png");
              }

              // valuek.filePath =
              //   "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
              //   valuek.filePath;
              value.arr2.push(valuek);
            }
          });
        }
      });
      this.tableList = this.tableList;
      console.log(this.tableList, "获取的列表");
      this.totalsize = res.data.total;
    },
    // 获取省市区
    async getprovince() {
      let that = this;
      let res = await this.Axios.get(`common-api/address/query`);
      console.log(res, "获取省");
      let proarr = res.data.result;
      proarr.forEach(function (value, index, array) {
        let obj = {};
        obj.label = value.addressName;
        obj.value = value.addressId;
        that.provinceoptions.push(obj);
      });
    },
    //获取 市
    async getcity(id) {
      let that = this;
      that.cityoptions = [];
      that.cityvalue = "";
      that.countyoptions = [];
      that.countyvalue = "";
      let res = await this.Axios.get(`common-api/address/query?parentId=${id}`);
      let proarr = res.data.result;
      proarr.forEach(function (value, index, array) {
        let obj = {};
        obj.label = value.addressName;
        obj.value = value.addressId;
        that.cityoptions.push(obj);
      });
    },
    //获取 区
    async region(id) {
      let that = this;
      that.countyoptions = [];
      that.countyvalue = "";
      let res = await this.Axios.get(`common-api/address/query?parentId=${id}`);
      let proarr = res.data.result;
      proarr.forEach(function (value, index, array) {
        let obj = {};
        obj.label = value.addressName;
        obj.value = value.addressId;
        that.countyoptions.push(obj);
      });
    },
    // 获取证书范围
    getcertificate() {
      axios
        .get("http://172.16.1.16:3003/api/standardattribute/list?parentId=0")
        .then((res) => {
          console.log(res, "获取岗位等级");
          let result = res.data.result;
          result.forEach((value, index, array) => {
            let obj = {};
            obj.value = value.attributeId;
            obj.label = value.attributeName;
            this.certifination.push(obj);
          });
          console.log(this.station);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 选择证书
    selectcertificate(e) {
      console.log(e, "证书范围");
      this.ruleForm.certRange = e.join(",");
    },
    // 验证手机号
    testphone() {
      var reg = /^[1][3,4,5,6,,7,8,9][0-9]{9}$/;
      if (this.ruleForm.telephone != "") {
        if (
          checkTel(this.ruleForm.telephone) == false &&
          !reg.test(this.ruleForm.telephone)
        ) {
          this.$message({
            message: "请输入正确的电话号",
            type: "warning",
          });
          return false;
        }
      }
    },
    deteleObject(obj) {
    // console.log(obj)
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        var str = '';
        for (var j = 0; j < keys.length; j++) {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
            uniques.push(obj[i]);
            stringify[str] = true;
        }
    }
    return uniques
},

    //确定添加
    suresubmit(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 判断手机号
          var reg = /^[1][3,4,5,6,,7,8,9][0-9]{9}$/;
          if (this.ruleForm.telephone != "") {
            if (
              checkTel(this.ruleForm.telephone) == false &&
              !reg.test(this.ruleForm.telephone)
            ) {
              this.$message({
                message: "请输入正确的电话号",
                type: "warning",
              });
              return false;
            }
          }
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          }); //显示弹出层
        // 去除数组对象中重复的元素
         this.idcartdimg=deteleObject(this.idcartdimg)
         this.linceimg=deteleObject(this.linceimg);
         this.cooperateimg=deteleObject(this.cooperateimg)
          this.idcartdimg.forEach((value) => {
            this.imagearr.push(value);
          });
          this.linceimg.forEach((value) => {
            this.imagearr.push(value);
          });
          this.cooperateimg.forEach((value) => {
            this.imagearr.push(value);
          });

          delete this.ruleForm["idcard"];
          delete this.ruleForm["cooperate"];
          let param = {
            fileList: this.imagearr,
            provider: this.ruleForm,
          };
          that.Axios.post(
            `talents-api/providerlist/update`,
            param,
            "postJson"
          ).then((res) => {
            console.log(res);
            if (res.data.code == "400000") {
              this.$message(res.data.message);
              loading.close();
            } else if (res.data.code == 0) {
              this.$message({
                message: "提交成功",
                type: "success",
              });
              that.dialogFormVisible = false;
              loading.close();
              this.getanentlist();
              // this.page = 1;
            } else {
              loading.close();
            }
          }).catch((err)=>{
            console.log(err)
            loading.close()
          });
        } else {
          this.$message({
            message: "请补全重要信息",
            type: "warning",
          });
          return false;
        }
      });
    },
    beforeAvatarUpload(file) {
      // console.log(this.fileListidcard,'返回的身份证列表')
      console.log(file, "上传之前");
      // let obj = {};
      //       obj.name = res.data.result[0].fileName;
      //       obj.url =
      //         "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
      //         res.data.result[0].filePath;
      //       this.fileListidcard.push(obj);
    },
    // 上传完成之后
    successfile(e) {
      console.log("上传完成之后");
    },
    handleAvatarSuccess(file) {
      console.log(file, "成功");
    },
    // 上传身份证照片
    upcardfileimg(e) {
      let that = this;
      let params = e.target.files[0];
      if(params!=undefined){
        var param = new FormData();
      param.append("file", params);
      param.append("fileType", 2);
     
      if (
        params.type != "image/bmp" &&
        params.type != "image/jpeg" &&
        params.type != "image/png"
      ) {
        this.$message({
          title: "警告",
          message: "文件格式不正确",
          type: "warning",
        });
        loading.close();
        return false;
      }

      let size = params.size / 1048576;
      size = size.toFixed("2");
      let type = params.type;
      console.log(size, type, "9999");
      if (
        (type == "image/png" && size > 10) ||
        (type == "image/jpeg" && size > 10) ||
        (type == "image/bmp" && size > 10)
      ) {
        this.$message({
          title: "警告",
          message: "图片不能超过10M",
          type: "warning",
        });
        loading.close();
        return false;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      }; //添加请求头
      axios
        .post(
          "http://gateway.kuaiban.cn/talents-api/filelist/upload",
          param,
          config
        )
        .then((res) => {
          console.log(res, "上传成功之后");
          console.log(res.data.result[0]);
          that.idcartdimg.push(res.data.result[0]);
          that.ruleForm.idcard.push(res.data.result[0]);
          loading.close();
        })
        .catch((err) => {
          loading.close();
          this.showMessage("error", "图片上传错误");
        });
      }
      
    },
    // 删除 身份证
    delcardimg(item, index) {
      this.idcartdimg.forEach((value, index, array) => {
        if (item.filePath == value.filePath) {
          this.idcartdimg.splice(index, 1);
          this.ruleForm.idcard.splice(index, 1);
        }
      });
      this.idcartdimg = this.idcartdimg;
      this.ruleForm.idcard = this.ruleForm.idcard;
    },

    // 上传营业执照
    uplincefileimg(e) {
      let that = this;
      let params = e.target.files[0];
      if(params!=undefined){
        var param = new FormData();
        param.append("file", params);
        param.append("fileType", 3);

      if (
        params.type != "image/bmp" &&
        params.type != "image/jpeg" &&
        params.type != "image/png"
      ) {
        this.$message({
          title: "警告",
          message: "文件格式不正确",
          type: "warning",
        });
        loading.close();
        return false;
      }
      let size = params.size / 1048576;
      size = size.toFixed("2");
      let type = params.type;
      console.log(size, type, "9999");
      if (
        (type == "image/png" && size > 10) ||
        (type == "image/jpeg" && size > 10) ||
        (type == "image/bmp" && size > 10)
      ) {
        this.$message({
          title: "警告",
          message: "图片不能超过10M",
          type: "warning",
        });
        loading.close();
        return false;
      }
       const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      }; //添加请求头
      axios
        .post(
          "http://gateway.kuaiban.cn/talents-api/filelist/upload",
          param,
          config
        )
        .then((res) => {
          console.log(res);
          console.log(res.data.result[0]);
          that.linceimg.push(res.data.result[0]);
          console.log(that.linceimg, "营业执照");
          loading.close();
        })
        .catch((err) => {
          loading.close();
          this.showMessage("error", "图片上传错误");
        });
      }
     
    },
    // 删除营业执照
    dellinceimg(item, index) {
      this.linceimg.forEach((value, index, array) => {
        if (item.filePath == value.filePath) {
          this.linceimg.splice(index, 1);
        }
      });
      this.linceimg = this.linceimg;
    },
    // 上传合作协议
    upcooperateimg(e) {
      let that = this;
      let params = e.target.files[0];
      console.log(params,'上传的合作协议上传的合作协议')
      if(params!=undefined){
             var param = new FormData();
      param.append("file", params);
      param.append("fileType", 4);
     
      if (params.type == "image/svg+xml") {
        this.$message({
          title: "警告",
          message: "文件格式不正确",
          type: "warning",
        });
        loading.close();
        return false;
      }
      let size = params.size /1048576;
      size = size.toFixed("2");
      console.log(size,'文件的大小')
      let type = params.type;
      if (
        (type == "image/png" && size > 10) ||
        (type == "image/jpeg" && size > 10) ||
        (type == "image/bmp" && size > 10)
      ) {
        this.$message({
          title: "警告",
          message: "图片不能超过10M",
          type: "warning",
        });
        loading.close();
        return false;
      }
      if (
        (type!="image/svg+xml" && size > 50) ) {
        this.$message({
          title: "警告",
          message: "文件不能超过50M",
          type: "warning",
        });
        loading.close();
        return false;
      }

       const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      }; //添加请求头
      axios
        .post(
          "http://gateway.kuaiban.cn/talents-api/filelist/upload",
          param,
          config
        )
        .then((res) => {
          console.log(res);
          console.log(res.data.result[0]);
          that.cooperateimg.push(res.data.result[0]);
          that.ruleForm.cooperate.push(res.data.result[0]);
          console.log(that.cooperateimg, "合作协议");
          loading.close();
        })
        .catch((err) => {
          loading.close();
          this.showMessage("error", "图片上传错误");
        });
      }
   
    },
    // 删除合作协议
    decoopreateimg(item, index) {
      this.cooperateimg.forEach((value, index, array) => {
        if (item.filePath == value.filePath) {
          this.cooperateimg.splice(index, 1);
          this.ruleForm.cooperate.splice(index, 1);
        }
      });
      this.cooperateimg = this.cooperateimg;
      this.ruleForm.cooperate = this.ruleForm.cooperate;
    },
    // 下载合作协议
    downloadfile(index, src) {
      window.location.href =
        "http://gateway.kuaiban.cn/talents-api/filelist/download?ids=" + src.id;
    },
    // 删除中介
    delList(row) {
      this.agencyid = row.id;
      this.titledialogVisible = true;
    },
    async suredelete() {
      let res = await this.Axios.get(
        `talents-api/providerlist/delete?id=${this.agencyid}`
      );
      this.titledialogVisible = false;
      if (res.data.code == "400000") {
        this.$message({
          title: "警告",
          message: res.data.message,
          type: "warning",
        });
      } else if (res.data.code == "0") {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.tableList.forEach((value, index, array) => {
          if (value.id == this.agencyid) {
            this.tableList.splice(index, 1);
          }
        });
        this.tableList = this.tableList;
      }
    },
    // 编辑中介信息
    editList(row) {
      console.log(row);
      this.dialogFormVisible = true;
      this.text = "编辑中介信息";
      this.agencyid = row.id;
      this.addtype = 2; //编辑
      this.ruleForm.id = this.agencyid;
      this.ruleForm.providerId = row.providerId;
      let obj = {
        providerName: "",
        telephone: "",
        province: "",
        city: "",
        area: "",
        idcard: [],
        cooperate: [],
      };
      this.ruleForm = obj;
      this.ruleForm.id = row.id;
      this.ruleForm.providerId = row.providerId;
      this.fileListidcard = [];
      this.fileListcompany = [];
      this.fileListcooperation = [];
      this.provincevalue = "";
      this.cityvalue = "";
      this.countyvalue = "";
      this.idcartdimg = [];
      this.linceimg = [];
      this.cooperateimg = [];
      this.imagearr = [];
      this.getagency();
    },

    selectstation() {},
    // 添加中介
    addagent() {
      this.dialogFormVisible = true;
      let obj = {
        providerName: "",
        telephone: "",
        province: "",
        city: "",
        area: "",
        idcard: [],
        cooperate: [],
      };
      this.ruleForm = obj;
      this.provincevalue = "";
      this.cityvalue = "";
      this.countyvalue = "";
      this.fileListidcard = [];
      this.fileListcompany = [];
      this.fileListcooperation = [];
      this.idcartdimg = [];
      this.linceimg = [];
      this.cooperateimg = [];
      this.imagearr = [];
      this.certifinatevalue = "";
      this.text = "添加中介信息";
      this.addtype = 1; //添加
    },
    // 选择省市区
    selectprovince(e) {
      console.log(e, "shengsheng");
      if (this.provincevalue != "") {
        this.showcity = false;
        this.getcity(e);
      } else {
        this.showcity = true;
      }
      this.provinceoptions.forEach((value) => {
        if (value.value == e) {
          this.ruleForm.province = value.label;
        }
      });
    },
    selectcity(e) {
      if (this.cityvalue != "") {
        this.showcounty = false;
        this.region(e);
        this.cityoptions.forEach((value) => {
          if (value.value == e) {
            this.ruleForm.city = value.label;
          }
        });
      } else {
        this.showcounty = true;
      }
    },
    // 选择地区
    selectcounty(e) {
      this.countyoptions.forEach((value) => {
        if (value.value == e) {
          this.ruleForm.area = value.label;
        }
      });
    },
  },
};
</script>

<style scoped>
@import url("./index.css");
</style>>