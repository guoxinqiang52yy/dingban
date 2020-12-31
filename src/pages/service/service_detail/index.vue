<template>
  <div class="servicedetail">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>服务系统</el-breadcrumb-item>
      <el-breadcrumb-item>服务详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="baseinfo">
      <div class="baseinfoname">基本信息</div>
      <div class="baseinfobox">
        <div class="baseinfoitem ordernumber">
          <span class="baseinfroitemname">订单单号：</span>
          <span>202009141523001</span>
        </div>
        <div class="baseinfoitem">
          <span class="baseinfroitemname">企业名称：</span>
          <span>天津快办黑龙江分公司</span>
        </div>
        <div class="baseinfoitem">
          <span class="baseinfroitemname">服务单号：</span>
          <span> 200293993003 </span>
        </div>
        <div class="baseinfoitem">
          <span class="baseinfroitemname">联系人：</span>
          <span>王总</span>
        </div>
        <div class="baseinfoitem">
          <span class="baseinfroitemname">业务部门：</span>
          <span> 营商业务二部 </span>
        </div>
        <div class="baseinfoitem">
          <span class="baseinfroitemname">业务人员：</span>
          <span>孙宏达</span>
        </div>
      </div>
      <div class="baseinfobox"></div>
      <div class="baseinfobox"></div>
    </div>
    <div class="companydisk">
      <div class="baseinfoname">企业网盘</div>
      <div class="upfilebox">
        <div class="upfileboxname">企业资料</div>
        <div class="batchup">
          <el-upload
            class="upload-demo batchbtn"
            ref="upload"
            action=""
            multiple
            :http-request="upfilebatch"
            list-type="picture-card"
          >
            <el-button
              slot="trigger"
              size="small"
              type="text"
              class="batchupbtn"
              id="batchadd"
              >批量上传</el-button
            >
          </el-upload>

          <div class="bathleft" @click="downloadbtach">批量下载</div>
        </div>
      </div>

      <!-- 上传文件 -->
      <div class="upfile">
        <el-table
          class="companydisktable"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="文件名称" width="160">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column prop="name" label="上传人" width="200">
          </el-table-column>
          <el-table-column
            prop="address"
            label="上传时间"
            show-overflow-tooltip
            width="200"
          >
          </el-table-column>
          <el-table-column prop="address" label="预览" show-overflow-tooltip width="280">
          </el-table-column>
             <el-table-column prop="address" label="备注" show-overflow-tooltip width="440">
          </el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip width="100">
            <template slot-scope="scope">
              <div class="flexone">
                <div
                  class="download"
                  @click="dwonloadfile(scope.$index, scope.row)"
                >
                  下载
                </div>
                <div
                  class="delete"
                  type="danger"
                  @click="deletefile(scope.$index, scope.row)"
                >
                  删除
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="companydisk">
      <div class="upfilebox">
        <div class="upfileboxname talentdata">人才资料</div>
        <div class="bathleft" @click="downloadbtach">批量下载</div>
      </div>
      <!-- 上传文件 -->
      <div class="upfile">
        <el-table
          class="companydisktable"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column label="文件名称" width="160">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column prop="name" label="上传人" width="200">
          </el-table-column>
          <el-table-column
            prop="address"
            label="上传时间"
            show-overflow-tooltip
              width="200"
          >
          </el-table-column>
          <el-table-column prop="address" label="预览" show-overflow-tooltip   width="280">
          </el-table-column>
          <el-table-column prop="address" label="操作" show-overflow-tooltip  width="540">
            <template slot-scope="scope">
              <div class="flexone">
                <div
                  class="download"
                  @click="dwonloadfile(scope.$index, scope.row)"
                >
                  下载
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 服务详情 -->
    <div class="companydisk">
      <div class="baseinfoname">服务详情</div>
      <div class="inner">
        <div class="servicetab">
          <div class="servicetabitem">建筑智能化系统设计专项资质-甲级-增项</div>
          <div class="servicetabitem">安全生产许可证</div>
          <div class="servicetabitem">照明资质三级-新办</div>
          <div class="servicetabitem">三承资质-新办</div>
          <div class="servicetabitem">照明资质三级-新办</div>
          <div class="servicetabitem">三承资质-新办</div>
          <div class="servicetabitem">照明资质三级-新办</div>
          <div class="servicetabitem">三承资质-新办</div>
          <div class="servicetabitem">三承资质-新办</div>
          <div class="servicetabitem">三承资质-新办</div>
          <div class="servicetabitem">三承资质-新办</div>
        </div>
      </div>
      <div class="servicetablehead">
        <el-table  border style="width: 1440">
          <el-table-column prop="date" label="服务流程" width="180">
          </el-table-column>
          <el-table-column prop="name" label="服务日志" width="1258">
          </el-table-column>
        </el-table>
      </div>
      <div class="servicebody">
        <div class="servicebodyleft">
          <div class="servicebodypage">
            <div class="servicebodyleftitem serviceactiveitem">
              <div class="servicenamekkk">人才需求确认</div>
              <div class="pantime">计划工时</div>
              <div class="line">
                <div class="lineitem">|</div>
                <div class="lineitem">|</div>
                <div><i class="el-icon-bottom lineitem"></i></div>
                <div></div>
              </div>
            </div>
          </div>
          <div class="servicebodypage">
            <div class="servicebodyleftitem">
              <div class="servicenamekkk">人才需求确认</div>
              <div class="pantime">计划工时</div>
              <div class="line">
                <div class="lineitem">|</div>
                <div class="lineitem">|</div>
                <div><i class="el-icon-bottom lineitem"></i></div>
                <div></div>
              </div>
            </div>
          </div>
          <div class="servicebodypage">
            <div class="servicebodyleftitem">
              <div class="servicenamekkk">人才需求确认</div>
              <div class="pantime">计划工时</div>
              <div class="line">
                <div class="lineitem">|</div>
                <div class="lineitem">|</div>
                <div><i class="el-icon-bottom lineitem"></i></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="servicebodyright">
          <el-timeline>
            <el-timeline-item :timestamp="title" placement="top">
              <el-card>
                <el-table :data="tableDatak" stripe style="width: 100%" class="servicerighttable">
                  <el-table-column prop="date" label="处理人" width="220">
                  </el-table-column>
                  <el-table-column prop="name" label="操作" width="380">
                  </el-table-column>
                  <el-table-column prop="address" label="时间" width="160">
                  </el-table-column>
                   <el-table-column prop="address" label="备注" width="380">
                  </el-table-column>
                </el-table>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="添加人才" placement="top">
              <el-card> 
                 <el-table :data="tableDatak" stripe style="width: 100%" class="servicerighttable">
                  <el-table-column prop="date" label="处理人" width="220">
                  </el-table-column>
                  <el-table-column prop="name" label="操作" width="380">
                  </el-table-column>
                  <el-table-column prop="address" label="时间" width="160">
                  </el-table-column>
                   <el-table-column prop="address" label="备注" width="380">
                  </el-table-column>
                </el-table>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="人才需求确认" placement="top">
              <el-card> 
                 <el-table :data="tableDatak" stripe style="width: 100%" class="servicerighttable">
                  <el-table-column prop="date" label="处理人" width="220">
                  </el-table-column>
                  <el-table-column prop="name" label="操作" width="380">
                  </el-table-column>
                  <el-table-column prop="address" label="时间" width="160">
                  </el-table-column>
                   <el-table-column prop="address" label="备注" width="380">
                  </el-table-column>
                </el-table>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      title: "收集企业资料",
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      tableDatak: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
    };
  },
  methods: {
    downloadbtach() {},
    //   全部选择
    handleSelectionChange() {},
    // 下载
    dwonloadfile() {},
    // 删除文件
    deletefile() {},
    // 批量上传文件
    upfilebatch(params) {
      let that = this;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      console.log("上传文件", params);
      if (params.file.type == "image/svg+xml") {
        this.$message({
          title: "警告",
          message: "文件格式不正确",
          type: "warning",
        });
        loading.close();
        return false;
      }
      let size = params.file.size / 1048576;
      size = size.toFixed("2");
      let type = params.file.type;
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
      if (type != "image/svg+xml" && size > 50) {
        this.$message({
          title: "警告",
          message: "文件不能超过50M",
          type: "warning",
        });
        loading.close();
        return false;
      }

      let _file = params.file;
      let param = new FormData(); //创建form对象
      param.append("file", _file); //通过append向form对象添加数据
      param.append("fileType", 5);
      console.log(this.fileListarr, "显示显示");
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
          that.fileimgarr.push(res.data.result[0]);
          that.tableData.push(res.data.result[0]);
          let arr = [];
          let url =
            "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
            res.data.result[0].filePath;
          arr.push(url);
          let obj = JSON.parse(JSON.stringify(res.data.result[0])); //深拷贝 防止修改新的数组影响原来的数组
          obj.images = arr;
          that.showtableData.push(obj);

          console.log(that.showtableData, "显示的上传文件", that.fileimgarr);
          loading.close();
          // that.getfilename();//获取文件的名字
        })
        .catch((err) => {
          loading.close();
          this.showMessage("error", "图片上传错误");
        });
    },
  },
};
</script>

<style scoped>
@import url("./index.css");
</style>