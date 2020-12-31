<template>
  <div class="personlsit">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>人才系统</el-breadcrumb-item>
      <el-breadcrumb-item>人才列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="top_line"></div>
    <!-- <iframe src="https://www.baidu.com" loading="lazy" width="100%" height="500px" >
    <p>34094390</p>
    </iframe> -->
    <!-- <div v-deniro-directive.a.b="datatext"></div> -->
    <!-- 人才列表筛选 -->
    <div class="select firstselect">
      <div class="selectoption flexone">
        <div class="selectname lettername">岗&nbsp;&nbsp;位：</div>
        <div class="selectitem">
          <el-select
            v-model="selectRuleform.postId"
            placeholder="请选择"
            clearable
            @change="selectstation"
            @clear="clearselectstation"
            size="small"
          >
            <el-option
              v-for="(item, index) in station"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="selectoption flexone">
        <div class="selectname lettername">等级：</div>
        <div class="selectitem">
          <el-select
            v-model="selectRuleform.levelId"
            placeholder="请选择"
            :disabled="isshowone"
            @change="selectrank"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, index) in rankarr"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="selectoption flexone">
        <div class="selectname lettername">专业：</div>
        <div class="selectitem">
          <el-select
            v-model="majorname"
            placeholder="请选择"
            :disabled="isshowtwo"
            @change="selectmajor"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, index) in majorarr"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="selectoption flexone" v-if="architect">
        <div class="selectname">证书状态：</div>
        <div class="selectitem">
          <el-select
            v-model="selectRuleform.registerStatus"
            placeholder="请选择"
            :disabled="certificatestatus"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, index) in registerstatusarr"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- B本情况 -->
      <div class="selectoption flexone" v-if="architect">
        <div class="selectname">B本情况：</div>
        <div class="selectitem">
          <el-select
            v-model="selectRuleform.hasB"
            placeholder="请选择"
            :disabled="certificatestatus"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, index) in selectBarr"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="selectoption flexone">
        <div class="selectname">社保状态：</div>
        <div class="selectitem">
          <el-select
            v-model="selectRuleform.socialStatus"
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, index) in selectsocialarr"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="selectoption flexone">
        <div class="selectname">发证年限：</div>
        <div class="selectitem selectregister">
          <!-- <el-date-picker
            v-model="selectregisterSignDate"
            type="date"
            placeholder="选择日期"
            size="small"
            @change="slectregisterdate"
          >
          </el-date-picker>
           -->

          <el-select
            v-model="selectregisterSignDate"
            placeholder="请选择"
            clearable
            size="small"
            @change="selectcertifate"
           
          >
           <el-option
              v-for="(item,index) in certificatearr"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="selectoption flexone">
        <div class="selectname">即将闲置：</div>
        <div class="selectitem">
          <el-select
            v-model="selectRuleform.unused"
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, index) in selectunsearr"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="selectoption flexone">
        <div class="selectname">即将到期：</div>
        <div class="selectitem">
          <el-select
            v-model="selectRuleform.due"
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option
              v-for="(item, index) in selectsuearr"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="selectoption flexone selectoptionk">
        <div class="selectname">创建人：</div>
        <div class="selectitem">
          <el-select
            v-model="selectRuleform.creatorId"
            placeholder="请选择"
            clearable
            size="small"
            @change="selectcreator"
          >
            <el-option
              v-for="(item, index) in createpeoplelist"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="selectoption flexone createtime">
        <div class="selectname">创建时间：</div>
        <div class="selectitem">
          <el-date-picker
            v-model="createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectcresteTime"
            size="small"
          >
          </el-date-picker>
        </div>
      </div>
      <el-button
        type="primary"
        class="btnperson"
        style="margin-right: 8px; width: 70px"
        @click="searchperson"
        size="small"
        >筛选</el-button
      >

      <div class="selectoption flexone selectoptionk">
        <el-input
          placeholder="请输入姓名或中介"
          v-model="selectRuleform.nameOrTel"
          class="input-with-select"
          size="small"
        >
          <el-select
            v-model="select"
            slot="prepend"
            placeholder="姓名"
            class="selectagent"
           
            @change="selectagent"
            size="small"
          >
            <el-option label="姓名" value="1"></el-option>
            <el-option label="中介" value="2"></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchagentornot"
            size="small"
          ></el-button>
        </el-input>
      </div>
      <!-- <el-button type="primary" class="btnperson" @click="importint"
        >导入</el-button
      > -->
      <div class="personmenu">
        <el-button
          type="primary"
          class="btnperson"
          @click="requireone"
          size="small"
          >服务需求单1</el-button
        >
        <el-button
          type="primary"
          class="btnperson"
          @click="requiretwo(123)"
          size="small"
          >服务需求单(安许)</el-button
        >
         <el-button
          type="primary"
          class="btnperson"
          @click="requiretwo(234)"
          size="small"
          >服务需求单(资质)</el-button
        >
        <el-button
          type="primary"
          class="btnperson"
          @click="requirethree(123)"
          size="small"
          >人才需求单(安许)</el-button
        >
         <el-button
          type="primary"
          class="btnperson"
          @click="requirethree(234)"
          size="small"
          >人才需求单(资质)</el-button
        >
        <el-button
          type="primary"
          class="btnperson"
          @click="requirefour"
          size="small"
          >考办证列表</el-button
        >
        <el-button
          type="primary"
          class="btnperson"
          @click="requirefive(123)"
          size="small"
          >人才清退列表(安许)</el-button
        >
         <el-button
          type="primary"
          class="btnperson"
          @click="requirefive(234)"
          size="small"
          >人才清退列表(资质)</el-button
        >
        <el-button
          type="primary"
          class="btnperson"
          @click="requiresix"
          size="small"
          >消息列表</el-button
        >
        <!-- v-if="manageDepId!=null" -->
        <el-checkbox
        v-if="manageDepId!=null"
          v-model="seemyself"
          @change="seeme"
          style="margin: 0 10px 20px 10px"
          >只看自己</el-checkbox
        >
        <el-button
          v-has="'/person/person-btn-typeAdd'"
          type="primary"
          class="btnperson"
          @click="addpeople"
          size="small"
          >添加人才</el-button
        >
      </div>
    </div>
    <!-- 人才列表 -->
    <div class="personbox">
      <el-table :data="tableList" stripe style="width: 100%">
        <!-- <el-table-column prop="id" align="center" label="序号" min-width="50"></el-table-column> -->
        <el-table-column
          prop="realName"
          align="center"
          label="姓名"
          min-width="90"
        ></el-table-column>
        <el-table-column align="center" label="身份证号" min-width="180">
          <template slot-scope="scope">
            {{ scope.row.cardId == "" ? "--" : scope.row.cardId }}
          </template>
        </el-table-column>
        <el-table-column
          prop="telephone"
          align="center"
          label="手机号"
          min-width="120"
        >
        </el-table-column>

        <el-table-column
          prop="postName"
          align="center"
          label="岗位"
          min-width="100"
        ></el-table-column>
        <el-table-column
          prop="levelName"
          align="center"
          label="等级"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          prop="majorName"
          align="center"
          label="专业"
          min-width="100"
        >
        </el-table-column>
        <el-table-column align="center" label="证书状态" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.registerStatus == 1">初始注册</div>
            <div v-if="scope.row.registerStatus == 2">变更注册</div>
            <div v-if="scope.row.registerStatus == 3">重新注册</div>
            <div v-if="scope.row.registerStatus == 4">延续注册</div>
            <div v-if="scope.row.registerStatus == -1">--</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="Bstatus"
          align="center"
          label="B本情况"
          min-width="80"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.hasB == 0">无</div>
            <div v-if="scope.row.hasB == 1">有</div>
            <div v-if="scope.row.hasB == -1">--</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="签发日期 " min-width="140">
          <template slot-scope="scope">
            {{ scope.row.signDate == 0 ? "--" : scope.row.signDate }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="人才聘用时间 " min-width="140">
          <template slot-scope="scope">
            {{ scope.row.signTime == 0 ? "--" : scope.row.signTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="人才结束时间 " min-width="140">
          <template slot-scope="scope">
            {{ scope.row.overTime == 0 ? "--" : scope.row.overTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="社保状态" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.socialStatus == 1">临时社保</div>
            <div v-if="scope.row.socialStatus == 2">唯一社保</div>
            <div v-if="scope.row.socialStatus == 3">不上社保</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="库存状态" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">闲置</div>
            <div v-if="scope.row.status == 1">在用</div>
            <div v-if="scope.row.status == 2">终止</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          align="center"
          label="人才费（元）"
          min-width="120"
        >
        </el-table-column>
        <el-table-column
          prop="creatorName"
          align="center"
          label="创建人"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          prop="addTime"
          align="center"
          label="创建时间"
          min-width="100"
        >
        </el-table-column>
        <el-table-column align="center" label="证书来源" min-width="150">
          <template slot-scope="scope">
            <div>
              {{ scope.row.sourceAndName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="外销状态" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.sellStatus == 0">未加入</div>
            <div v-if="scope.row.sellStatus == 1">已加入</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          min-width="230"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="flexone btnlist">
              <div
                @click="editList(scope.row)"
                type="text"
                size="small"
                class="searchname"
              >
                查看
              </div>
              <!-- <div
                v-has="'/user/org-btn-editNum'"
                type="text"
                size="small"
                class="remind"
              >
                提醒
              </div> -->
              <div v-has="'/person/person-btn-typeAdd'">
                <div v-if="scope.row.sellStatus == 0">
                  <div
                    type="text"
                    size="small"
                    class="withdrawkuse"
                    v-if="scope.row.status == 1 || scope.row.status == 2"
                  >
                    加入外销
                  </div>
                  <div
                    @click="join(scope.row)"
                    type="text"
                    size="small"
                    class="withdrawk"
                    v-else
                  >
                    加入外销
                  </div>
                </div>

                <div
                  @click="withdraw(scope.row)"
                  type="text"
                  size="small"
                  class="withdraw"
                  v-if="scope.row.sellStatus == 1"
                >
                  撤回外销
                </div>
              </div>

              <div
                v-has="'/person/person-btn-typeAdd'"
                @click="seeperson(scope.row)"
                type="text"
                size="small"
                class="editword"
              >
                签约
              </div>
              <div v-has="'/person/person-btn-typeAdd'">
                <div
                  type="text"
                  size="small"
                  class="withdrawkuse"
                  v-if="scope.row.status == 2"
                >
                  已终止
                </div>
                <div
                  type="text"
                  size="small"
                  class="remind"
                  v-else
                  @click="enduse(scope.$index, scope.row)"
                >
                  终止
                </div>
              </div>
            </div>

            <!-- <el-button @click="deleteList(scope.row)" type="text" size="small">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="totalsize != 0"
        class="pagelist"
        @size-change="changesize"
        @current-change="changecurrent"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40,50]"
         :page-size="10"
        layout="total,sizes, prev, pager, next, jumper"
        :total="totalsize"
      >
      </el-pagination>
    </div>
    <!-- 添加 人才 -->
    <div class="addperson">
      <el-dialog
        :title="titleinfo"
        :center="false"
        :close-on-click-modal="false"
        :visible.sync="centerDialogVisible"
        width="1100px"
      >
        <!-- 中间内容部分 -->
        <div class="addpersoncontent">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="证书来源" prop="source">
              <div class="flexone">
                <el-select
                  v-model="sourcename"
                  placeholder=" 证书来源"
                  @change="selectrecourse"
                  style="width: 120px"
                  size="small"
                >
                  <el-option label="个人" value="1"></el-option>
                  <el-option label="中介" value="2"></el-option>
                </el-select>

                <div class="recourselist">
                  <el-select
                    v-model="agentname"
                    placeholder="请选择"
                    :disabled="isagent"
                    @change="selectagentname"
                    @clear="clearselectagentname"
                    clearable
                    size="small"
                  >
                    <el-option
                      v-for="(item, index) in recoursearr"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
            <div class="basinfo">基本信息</div>
            <div class="flexone">
              <el-form-item label="姓名:" prop="realName">
                <el-input
                  v-model="ruleForm.realName"
                  style="width: 150px"
                  size="small"
                  
                  @blur="entername($event)"
                ></el-input>
              </el-form-item>
              <el-form-item label="性别:" class="sextext">
                <el-radio-group v-model="sexname">
                  <el-radio label="男" @change="selectsex"></el-radio>
                  <el-radio label="女" @change="selectsex"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="身份证:" class="cardtext">
                <el-input
                  v-model="ruleForm.cardId"
                  style="width: 300px"
                  @blur="testidcard"
                  size="small"
                ></el-input>
              </el-form-item>
            </div>
            <div class="flexone">
              <el-form-item label="手机号:" prop="telephone">
                <el-input
                  v-model="ruleForm.telephone"
                  style="width: 150px"
                  @blur="testphone"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="社保状态:" prop="socialStatus">
                <el-select
                  v-model="socialStatus"
                  placeholder="选择社保"
                  @change="selectsocity"
                  style="width: 140px"
                  size="small"
                >
                  <el-option label="临时社保" value="1"></el-option>
                  <el-option label="唯一社保" value="2"></el-option>
                  <el-option label="不上社保" value="3"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="basinfo">证书信息</div>
            <div class="flexone">
              <el-form-item label="岗位:" prop="postId">
                <el-select
                  v-model="post"
                  placeholder="选择岗位"
                  @change="selectpostname"
                  style="width: 150px"
                  size="small"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(item, index) in station"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="等级:" prop="levelId" class="ranktext">
                <el-select
                  v-model="rank"
                  placeholder="选择等级"
                  @change="selectrankname"
                  style="width: 140px"
                  :disabled="ranknamestatus"
                  size="small"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(item, index) in rankarr"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="专业:" prop="majorId" class="majortext">
                <el-select
                  v-model="major"
                  placeholder="选择专业"
                  @change="selectmajorname"
                  style="width: 200px"
                  :disabled="majornamestatus"
                  size="small"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="(item, index) in majorarr"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="签发时间:" prop="region" class="issutext">
                <el-date-picker
                  style="width: 160px"
                  v-model="signDate"
                  type="date"
                  placeholder="选择日期"
                  @change="signdate"
                  size="small"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="flexone">
              <el-form-item label="证书状态:" prop="registerStatus">
                <el-select
                  v-model="registerStatus"
                  placeholder="选择证书状态"
                  @change="selectregister"
                  @clear="clearselectregister"
                  clearable=""
                  style="width: 150px"
                  :disabled="addstatus"
                  size="small"
                >
                  <el-option label="初始注册" value="1"></el-option>
                  <el-option label="变更注册" value="2"></el-option>
                  <el-option label="重新注册" value="3"></el-option>
                  <el-option label="延续注册" value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="注册证签发时间:"
                prop="region"
                class="registertext"
              >
                <el-date-picker
                  style="width: 200px"
                  v-model="registerSignDate"
                  type="date"
                  placeholder="选择日期"
                  @change="registerdate"
                  size="small"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item class="containuetext">
                <el-checkbox v-model="checked" @change="registeredu"
                  >注册证继续教育</el-checkbox
                >
              </el-form-item>
            </div>
            <!-- 是否有B本情况 -->
            <div class="flexone">
              <el-form-item label="B本情况:" prop="region" class="isbook">
                <el-radio
                  v-model="radio"
                  label="1"
                  @change="selectb"
                  :disabled="addstatus"
                  >有</el-radio
                >
                <el-radio
                  v-model="radio"
                  label="2"
                  @change="selectb"
                  :disabled="addstatus"
                  >无</el-radio
                >
              </el-form-item>
              <div class="condation">
                <div class="haveB flexone">
                  <el-form-item
                    label="签发日期:"
                    prop="region"
                    class="haveBtext"
                  >
                    <el-date-picker
                      style="width: 200px"
                      v-model="bSignTime"
                      type="date"
                      placeholder="选择日期"
                      :disabled="isB"
                      @change="bsigntime"
                      size="small"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item
                    label="到期:"
                    prop="region"
                    class="haveBtext expire"
                  >
                    <el-date-picker
                      style="width: 200px"
                      v-model="bOverTime"
                      type="date"
                      placeholder="选择日期"
                      :disabled="isB"
                      @change="overtime"
                      size="small"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="" class="haveBtext containuestudy">
                    <el-checkbox
                      v-model="checkededuction"
                      @change="selecteduction"
                      :disabled="isB"
                      >B本继续教育</el-checkbox
                    >
                    <!-- <el-select
                      v-model="bEducation"
                      placeholder="有"
                      @change="selecteduction"
                      style="width: 80px"
                      :disabled="isB"
                       size="small"
                    >
                      <el-option label="有" value="1"></el-option>
                      <el-option label="无" value="0"></el-option>
                    </el-select> -->
                  </el-form-item>
                </div>
                <div class="noB">
                  <el-form-item label="是否考试:">
                    <el-select
                      v-model="bExam"
                      placeholder="是否考试"
                      @change="selectexame"
                      @clear="clearselectexame"
                      clearable
                      style="width: 150px"
                      :disabled="haveB"
                      size="small"
                    >
                      <el-option label="考" value="1"></el-option>
                      <el-option label="不考" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </div>
            <!--证书原件  -->
            <div class="origina">
              <el-form-item label="证书原件:">
                <el-checkbox
                  v-model="item.checked"
                  @change="selectswitch(item, index)"
                  v-for="(item, index) in switcharr"
                  :key="index"
                  >{{ item.name }}</el-checkbox
                >
                <!-- <el-checkbox-gitem.nameroup v-model="checkList">
                  <el-checkbox
                    :label="item.name"
                    @change="selectswitch(item, index)"
                    v-for="(item, index) in switcharr"
                    :key="index"
                    :checked="item.checked"
                  ></el-checkbox>
                </el-checkbox-group> -->
              </el-form-item>
            </div>
            <!-- 账密码 -->
            <div class="flexone">
              <el-form-item label="账号:">
                <el-input
                  v-model="ruleForm.account"
                  style="width: 180px"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码:" class="password">
                <el-input
                  v-model="ruleForm.password"
                  style="width: 180px"
                  size="small"
                ></el-input>
              </el-form-item>
            </div>
            <!-- 上传照片 -->
            <div class="uppic flexone">
              <el-form-item label="人才照片:">
                <div class="flexone">
                  <el-upload
                    class="avatar-uploader talentimg"
                    action=""
                    :show-file-list="false"
                    :http-request="suceessAvataruploadPicone"
                  >
                    <img
                      v-if="talentimg1 != ''"
                      :src="talentimg1"
                      class="avatar"
                    />
                    <i
                      class="el-icon-error closeimg"
                      v-if="talentimg1 != ''"
                      @click.stop="deltalentimg1"
                    ></i>
                    <i
                      v-if="talentimg1 == ''"
                      class="el-icon-plus avatar-uploader-icon"
                    ></i>
                  </el-upload>
                  <el-upload
                    class="avatar-uploader talentimg talentimgone"
                    action=""
                    :show-file-list="false"
                    :http-request="suceessAvataruploadPicone1"
                  >
                    <img
                      v-if="talentimg2 != ''"
                      :src="talentimg2"
                      class="avatar"
                    />
                    <i
                      class="el-icon-error closeimg"
                      v-if="talentimg2 != ''"
                      @click.stop="deltalentimg2"
                    ></i>
                    <i
                      v-if="talentimg2 == ''"
                      class="el-icon-plus avatar-uploader-icon"
                    ></i>
                  </el-upload>
                </div>
              </el-form-item>
              <el-form-item label="身份证:">
                <div class="flexone">
                  <el-upload
                    class="avatar-uploader talentimg"
                    action=""
                    :show-file-list="false"
                    :http-request="suceessAvataruploadPitwo"
                  >
                    <img
                      v-if="idcardimg1 != ''"
                      :src="idcardimg1"
                      class="avatar"
                    />
                    <i
                      class="el-icon-error closeimg"
                      v-if="idcardimg1 != ''"
                      @click.stop="delidcardimg1"
                    ></i>
                    <i
                      v-if="idcardimg1 == ''"
                      class="el-icon-plus avatar-uploader-icon"
                    ></i>
                  </el-upload>
                  <el-upload
                    class="avatar-uploader talentimg talentimgone"
                    action=""
                    :show-file-list="false"
                    :http-request="suceessAvataruploadPitwo1"
                  >
                    <img
                      v-if="idcardimg2 != ''"
                      :src="idcardimg2"
                      class="avatar"
                    />
                    <i
                      class="el-icon-error closeimg"
                      v-if="idcardimg2 != ''"
                      @click.stop="delidcardimg2"
                    ></i>
                    <i
                      v-if="idcardimg2 == ''"
                      class="el-icon-plus avatar-uploader-icon"
                    ></i>
                  </el-upload>
                </div>
              </el-form-item>
            </div>
            <div class="basinfo">签约信息</div>
            <div class="flexone">
              <el-form-item label="协议编号:">
                <el-input
                  v-model="ruleForm.contractCode"
                  style="width: 135px"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item label="交证时间:" prop="region" class="signtime">
                <el-date-picker
                  style="width: 200px"
                  v-model="certInTime"
                  type="date"
                  placeholder="选择日期"
                  @change="certintime"
                  size="small"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="人才费用:" class="costprice">
                <el-input
                  v-model="ruleForm.price"
                  style="width: 200px"
                  size="small"
                ></el-input>
              </el-form-item>
            </div>
            <!-- 聘用周期 -->
            <div class="flexone">
              <!-- prop="signType" -->
              <el-form-item label="聘用周期:">
                <el-radio
                  v-model="hireradio"
                  label="1"
                  @click="clickhiredate"
                  @change="selecthiredate"
                  size="small"
                  >次数</el-radio
                >
                <el-radio v-model="hireradio" label="2" @change="selecthiredate"
                  >时间</el-radio
                >
              </el-form-item>
              <!--  prop="signTime" -->
              <el-form-item label="签约开始时间:" class="signtime">
                <el-date-picker
                  style="width: 200px"
                  v-model="signTime"
                  type="date"
                  placeholder="选择日期"
                  @change="signtime"
                  size="small"
                >
                </el-date-picker>
              </el-form-item>
              <!-- prop="overTime" -->
              <el-form-item label="签约结束时间:" class="costprice">
                <el-date-picker
                  style="width: 200px"
                  v-model="overTime"
                  type="date"
                  placeholder="选择日期"
                  @change="endtime"
                  size="small"
                >
                </el-date-picker>
              </el-form-item>
            </div>
            <!-- 是否付款 -->
            <!-- prop="isPay" -->
            <div class="flexone">
              <el-form-item label="是否付款:">
                <div clss="paystatus">
                  <el-radio v-model="radio1" label="1" @change="selectstage"
                    >全部</el-radio
                  >
                  <el-radio v-model="radio1" label="0" @change="selectstage"
                    >未付款</el-radio
                  >
                  <el-radio v-model="radio1" label="2" @change="selectstage"
                    >分期付款</el-radio
                  >
                </div>
                <div class="paytable" v-if="stagemoney">
                  <ul class="flex paytabletitle">
                    <li>付款批次</li>
                    <li>付款金额</li>
                    <li>付款时间</li>
                    <li>是否付款</li>
                  </ul>
                  <ul class="flex paytabletitle paytablebody">
                    <li>
                      <input
                        type="text"
                        v-model="firstpaymentarr[0].batch"
                        @input="enterbatch($event)"
                      />
                    </li>
                    <li>
                      <input
                        type="text"
                        v-model="firstpaymentarr[0].price"
                        @input="paymoney($event)"
                      />
                    </li>
                    <li>
                      <input
                        type="date"
                        v-model="firstpaymentarr[0].payTime"
                        @input="selectday($event)"
                      />
                    </li>
                    <li>
                      <el-radio
                        v-model="firstpaymentarr[0].status"
                        label="1"
                        @change="ispayselect"
                        >是</el-radio
                      >
                      <el-radio
                        v-model="firstpaymentarr[0].status"
                        label="0"
                        @change="ispayselect"
                        >否</el-radio
                      >
                    </li>
                    <li>
                      <i
                        class="el-icon-circle-plus-outline addpaybtn"
                        @click="addpayment"
                      ></i>
                    </li>
                  </ul>
                  <div class="addbox">
                    <ul
                      class="flex paytabletitle paytablebody"
                      v-for="(item, index) in paymentarr"
                      :key="index"
                    >
                      <li>
                        <input
                          v-model="item.batch"
                          type="text"
                          @input="enterbatchk($event, index)"
                          size="small"
                        />
                      </li>
                      <li>
                        <input
                          type="text"
                          v-model="item.price"
                          @input="paymoneyk($event, index)"
                          size="small"
                        />
                      </li>
                      <li>
                        <input
                          type="date"
                          v-model="item.payTime"
                          @input="selectdayk($event, index)"
                          size="small"
                        />
                      </li>
                      <li>
                        <el-radio
                          v-model="item.status"
                          label="1"
                          @change="ispayselectk($event, index)"
                          >是</el-radio
                        >
                        <el-radio
                          v-model="item.status"
                          label="0"
                          @change="ispayselectk($event, index)"
                          >否</el-radio
                        >
                      </li>
                      <li>
                        <i
                          class="el-icon-remove-outline reducepaybtn"
                          @click="reducepayment(item, index)"
                        ></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-form-item>
            </div>
            <div class="flextwo upfileboxtop">
              <div class="basinfo">上传文件</div>
              <div class="flexone batchup">
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
                <div class="bathleft batchleftk" @click="downloadbtach">
                  批量下载
                </div>
              </div>
            </div>

            <!-- 上传文件 -->
            <div class="upfileboxpage">
              <el-form-item class="upbatchtable">
                <el-table
                  ref="multipleTable"
                  :data="showtableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column
                    label="文件名称"
                    show-overflow-tooltip
                    width="300"
                  >
                    <template slot-scope="scope">{{
                      scope.row.fileName
                    }}</template>
                  </el-table-column>
                  <el-table-column prop="name" label="文件类型" width="250">
                    <template slot-scope="scope">
                      {{ scope.row.fileSuffix }}</template
                    >
                  </el-table-column>
                  <el-table-column prop="address" label="预览" width="280">
                    <template slot-scope="scope">
                      <viewer :images="scope.row.images">
                        <div
                          v-if="
                            scope.row.fileSuffix == '.png' ||
                            scope.row.fileSuffix == '.jpg'||
                            scope.row.fileSuffix=='.bmp'||
                            scope.row.fileSuffix=='.jpeg'
                          "
                        >
                          <img
                            class="fileimg"
                            v-for="(src, index) in scope.row.images"
                            :src="src"
                            :key="index"
                          />
                        </div>
                        <i
                          class="el-icon-document-remove"
                          style="font-size: 40px"
                          v-else
                        ></i>
                      </viewer>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="operate"
                    label="操作"
                    show-overflow-tooltip
                  >
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
              </el-form-item>
            </div>
            <!-- 备注 -->
            <div class="remark">
              <el-form-item label="备注:">
                <textarea
                  v-model="ruleForm.remark"
                  name=""
                  id=""
                  cols="30"
                  rows="10"
                  class="remarktext"
                ></textarea>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
          v-has="'/person/person-btn-typeAdd'"
        >
          <el-button @click="centerDialogVisible = false" size="small"
            >取 消</el-button
          >
          <el-button type="primary" size="small" @click="suresubmit('ruleForm')"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!--签约信息 -->
    <div class="addperson">
      <!-- 人才 签约信息 -->
      <div class="agencylialog">
        <el-dialog
          title="人才证书快速签约"
          width="550px"
          :visible.sync="seepersondialog"
          :close-on-click-modal="false"
        >
          <el-form
            :model="signRuleform"
            :rules="signrules"
            ref="signRuleform"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="协议编号："
              prop="contractCode"
              class="hiretime"
            >
              <el-input v-model="signRuleform.contractCode"></el-input>
            </el-form-item>
            <el-form-item label="人才费用：" prop="price" class="hiretime">
              <el-input v-model="signRuleform.price"></el-input>
            </el-form-item>
            <el-form-item
              label="聘用周期："
              prop="signType"
              class="hiretime hirecycle"
            >
              <el-select v-model="signRuleform.signType" placeholder="请选择">
                <el-option
                  v-for="(item, index) in hirecycledate"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="人才聘用时间："
              prop="signTime"
              class="hiretime hirecycle"
            >
              <el-date-picker
                v-model="hirecycletime"
                unlink-panels="false"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changehiretime"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelsign" size="small">取 消</el-button>
            <el-button
              type="primary"
              @click="suesign('signRuleform')"
              size="small"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </div>
    </div>
    <!-- 是否加入外销 -->
    <div class="joinwrap">
      <el-dialog
        :title="titleword"
        :visible.sync="titledialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <span>{{ titletext }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="suretitle">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 是否终止合作 -->
    <div class="joinwrap">
      <el-dialog
        title="提示"
        :visible.sync="endialogVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <span>是否终止与人才的合作</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="endialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sureend">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 提醒弹出层 -->
    <div class="remindpop">
      <el-dialog
        title="提醒操作确认"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="form">
          <el-form-item label="提醒人员：" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="消息内容：" :label-width="formLabelWidth">
            <el-input
              class="remindtextbox"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入提醒消息内容"
              v-model="remindtext"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" size="small"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="dialogFormVisible = false"
            size="small"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
    <!--服务部需求单 专员操作后流转到人才 状态是1 的时候-->
    <serviceformone
      :peopledialogshow="peopledialogshow"
      :peopleData="peopleData"
      :companypeople="companypeople"
      :requiretext="statestutas"
      :issave="issave"
      @issave="changeissave"
      @ishowwrap="closewrap"
      :companyname="companyname"
      :servicelist="servicelist"
    ></serviceformone>
    <!--服务部需求单 服务部专员操作后流转到人才 状态是4 的时候 选择人才是否符合要求-->
    <serviceformtwo
      :requiretableData="requiretableData"
      :requiredialogshow="requiredialogshow"
      :companyname="companyname1"
      @ishowwrap="closewrap"
    ></serviceformtwo>
    <!-- 人才和需求匹配 人才一直看的列表 -->
    <talentform
      :requiretableData="requiretableData"
      :rtalentdialogshow="rtalentdialogshow"
      :companyname="companyname2"
      :station="station"
      :selectpersonsub="selectpersonsub"
      @changeselectpersonsub="changeperonsub"
      @ishowwrap="closewrap"
    ></talentform>
    <!-- 考办证服务列表 -->
    <testregist
      :testtableData="testtableData"
      :testregistdialogshow="testregistdialogshow"
      @ishowwrap="closewrap"
      :istest="istest"
      @istestshow="changeistest"
    ></testregist>
    <!-- 人才清退列表 -->
    <quitpeople
      :quittableData="quittableData"
      :quitdialogshow="quitdialogshow"
      @ishowwrap="closewrap"
    ></quitpeople>
    <!-- 消息弹出层 -->
    <chat :drawer="drawer" @ishowwrap="closewrap"></chat>
  </div>
</template>
<script>
import myMixin from "../../../assets/js/minx/minx";
import { time } from "../../../../src/assets/js/minx/common";
import { checkTel } from "../../../../src/assets/js/minx/common"; //手机号和区号的判断
import { subtr } from "../../../../src/assets/js/minx/common"; //截取时间
import { changetime, changetime1 } from "../../../../src/assets/js/minx/common"; //截取时间
import axios from "axios";
import serviceformone from "@/components/requireform/serviceformone.vue"; //引入服务需求单 状态为1的时候
import serviceformtwo from "@/components/requireform/serviceformtwo.vue"; //引入服务需求单 状态为1的时候
import talentform from "@/components/requireform/talentform.vue"; //引入人才需求单
import testregist from "@/components/requireform/testregist.vue"; //引入考办证服务列表
import quitpeople from "@/components/requireform/quitpeople.vue"; //引入人才清退列表
import chat from "@/components/chat/chatting.vue"; //引入消息弹出层
export default {
  components: {
    serviceformone,
    serviceformtwo,
    talentform,
    testregist,
    quitpeople,
    chat,
  },
  name: "person",

  // mixins: [myMixin],
  data() {
    return {
      drawer: false, //消息弹出层
      datatext: "养生吃枸杞，选对的别选贵的！",
      titleinfo: "添加人才信息", //中介信息
      personid: "",
      // 签约信息
      signsignTime: "",
      signoverTime: "",
      signRuleform: {
        id: "",
        talentsId: "",
        contractCode: "",
        price: "",
        signType: "",
        signTime: "",
        overTime: "",
      }, //签约信息

      hirecycletime: "", //签约周期
      hirecycledate: [
        {
          value: 1,
          label: "次数",
        },
        {
          value: 2,
          label: "时间",
        },
      ],
      signrules: {
        contractCode: [
          { required: true, message: "请输入证书编号", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入人才费用", trigger: "blur" }],
        signType: [
          { required: true, message: "请选择聘用周期", trigger: "change" },
        ],
        signTime: [
          { required: true, message: "请选择人才聘用时间", trigger: "change" },
        ],
      },
      tableList: [], //人才列表数据
      createTime: "", //创建时间
      selectregisterSignDate: "", //签发日期
      registerSignDate: "",
      certificatearr: [
        { value: 1, label: "1年" },
        { value: 2, label: "2年" },
        { value: 3, label: "3年" },
        { value: 4, label: "4年" },
        { value: 5, label: "5年" },
        { value: 6, label: "6年" },
        { value: 7, label: "7年" },
        { value: 8, label: "8年" },
        { value: 9, label: "9年" },
        { value: 10, label: "10年及以上" },
      ], //发证年限
      selectRuleform: {
        postId: "", //岗位id
        levelId: "", //等级id
        majorId: "", //专业id
        registerStatus: "", //证书 状态
        hasB: "", //B本情况，
        unused: "", //即将闲置
        due: "", //即将到期
        creatorId: "", //创建人
        createTime: "", //创建时间
        registerSignDate: "", //签发时间
        socialStatus: "", //社保状态
        source: "", //证书来源
        nameOrTel: "", //
        pageNum: 0,
        pageSize: 10,
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
      isshowone: true, //等级是否选择
      isshowtwo: true, //专业是否显示
      ranknamestatus: true, //
      majornamestatus: true, //
      station: [], //岗位
      certificatestatus: true, //选择建筑师的状态
      addstatus: true, //选择建筑师的状态
      stationname: "", //岗位名称
      rankarr: [], //等级
      rankname: "", //等级名字
      majorarr: [],
      majorname: "", //专业名字
      createpeoplelist: [], //创建人
      registerstatusarr: [
        { value: 1, label: "初始注册" },
        { value: 2, label: "变更注册" },
        { value: 3, label: "重新注册" },
        { value: 4, label: "延续注册" },
      ], //证书状态
      selectBarr: [
        { value: 0, label: "无" },
        { value: 1, label: "有" },
      ], //B本情况
      selectunsearr: [
        { value: 0, label: "已闲置" },
        { value: 1, label: "剩余1个月" },
        { value: 2, label: "剩余2个月" },
        { value: 3, label: "剩余3个月" },
        { value: 4, label: "剩余4个月" },
        { value: 5, label: "剩余5个月及以上" },
      ], //即将闲置
      selectsuearr: [
        { value: 0, label: "已到期" },
        { value: 1, label: "剩余1个月" },
        { value: 2, label: "剩余2个月" },
        { value: 3, label: "剩余3个月" },
        { value: 4, label: "剩余4个月" },
        { value: 5, label: "剩余5个月及以上" },
      ],
      selectsocialarr: [
        { value: 1, label: "临时社保" },
        { value: 2, label: "唯一社保" },
        { value: 3, label: "不上社保" },
      ],

      centerDialogVisible: false, //添加人才的弹出层
      seepersondialog: false, //查看人才信息
      // 添加人才信息
      sexname: "", //性别
      switcharr: [
        {
          id: 1,
          name: "身份证",
          sel: false,
          checked: false,
        },
        {
          id: 2,
          name: "资格证",
          sel: false,
          checked: false,
        },
        {
          id: 4,
          name: "注册证",
          checked: false,
        },
        {
          id: 8,
          name: "B本",
          checked: false,
        },
        {
          id: 16,
          name: "安全员",
          checked: false,
        },
        {
          id: 32,
          name: "职称证书",
          checked: false,
        },
        {
          id: 64,
          name: "离职证明",
          checked: false,
        },
        {
          id: 128,
          name: "毕业证书",
          checked: false,
        },
        {
          id: 256,
          name: "继续教育",
          checked: false,
        },
        {
          id: 512,
          name: "养老手册",
          checked: false,
        },
        {
          id: 1024,
          name: "就失业证书",
          sel: false,
          checked: false,
        },
        {
          id: 2048,
          name: "评审表",
          checked: false,
        },
        {
          id: 4096,
          name: "退休证",
          checked: false,
        },
      ], //证书数组
      checked: false, //注册证是否继续教育
      checkededuction: false, //B本是否继续教育
      radio: "", //是否有B本
      stagepay: false, //协议编号是否比必填
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false, //证件照
      imagearr: [],
      ispaymoney: "", //是否付款
      batcharr: [{}], //分批付款数组
      num: 0,
      signDate: "", //签发时间
      registerSignDate: "", //注册签发时间
      bOverTime: "", //B本到期时间
      bSignTime: "", //B本签发时间
      certInTime: "", //交证时间
      signTime: "", //开始时间
      overTime: "", //结束时间
      hireradio: "", //聘用周期
      post: "", //岗位
      rank: "", //等级
      major: "", //专业
      fullscreenLoading: false,
      sourcename: "", //证书来源
      socialStatus: "", //社保状态
      registerStatus: "", //证书状态
      bEducation: "", //B本是否继续教育
      bExam: "", //是否考试
      ruleForm: {
        source: "", //证书 来源 1姓名 2 中介
        providerId: 1, //中介 id
        realName: "", //姓名
        sex: "",
        cardId: "", //身份证号
        telephone: "", //手机号
        socialStatus: "", //社保 状态
        postId: 1, //岗位
        levelId: 1, //等级
        majorId: 1, //专业
        bExam: 2, //是否有B 本
        signDate: "", //签发时间
        registerStatus: "", //证书状态
        registerSignDate: "", //注册证签发时间,
        registerEducation: 0, //是否继续教育
        hasB: 2, //b本情况
        bSignTime: "", //签发日期
        bOverTime: "", //结束日期
        bEducation: "", //b本是否教育
        certSwitch: "", //选择的证书
        account: "", //账号
        password: "", //密码
        contractCode: "", //协议编号
        certInTime: "", //交证时间
        price: "", //人才费
        signType: "", //聘用周期
        signTime: "", //聘用时间
        overTime: "", //结束时间
        isPay: "", //是否付款
        remark: "", //备注
      },
      //正则验证
      rules: {
        source: [
          { required: true, message: "请选择证书来源", trigger: "change" },
        ],

        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        telephone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],

        socialStatus: [
          { required: true, message: "请选择社保状态", trigger: "change" },
        ],
        postId: [{ required: true, message: "请选择岗位", trigger: "change" }],
        levelId: [{ required: true, message: "请选择等级", trigger: "change" }],
        majorId: [{ required: true, message: "请选择专业", trigger: "change" }],
        contractCode: [
          { required: true, message: "请输入协议编号", trigger: "blur" },
        ],
        signType: [
          { required: true, message: "请选择聘用周期", trigger: "change" },
        ],
        isPay: [
          { required: true, message: "请选择付款方式", trigger: "change" },
        ],
        signTime: [
          { required: true, message: "请选择聘用时间", trigger: "change" },
        ],
        overTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
      },
      recoursearr: [], //中介列表数组
      agentname: "", //中介名字
      isagent: true, //是否是中介
      isB: true,
      haveB: true, //是否有B本
      checkList: [], //证书原件
      radio1: "", //是否付款
      firstpaymentarr: [
        {
          batch: "",
          price: "",
          payTime: "",
          status: "",
        },
      ],
      paymentarr: [],
      dialogVisible: false,
      dialogImageUrl: "",
      tableData: [], //批量上传
      showtableData: [],
      multipleSelection: [],
      stagemoney: false, //是否显示分期付款
      valid: "", //是否有效
      textarea: "", //备注
      input3: "", //输入的 内容
      select: "姓名", //全部 个人中介
      dialogFormVisible: false, //提醒弹出层
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
      remindtext: "", //消息提醒内容
      page: 0, //页数,
      totalsize: 0, //总页数
      architect: true, //建筑师是否显示,
      isedit: "", //1 查看 2 编辑 3添加
      talentsId: "", //人才id
      titletext: "是否加入外销",
      titleword: "加入外销操作确认",
      titledialogVisible: false,
      isjoin: "", //0  撤回外销  1 加入外销
      joindata: "", //加入外销和撤回外销要传的字段
      idcardimg: [], //身份证照片
      idcardimg1: "",
      idcardimg2: "",
      talentimg1: "", //人才照片
      talentimg2: "",
      talentimg: [],
      fileimgarr: [], //批量上传
      talentfileList: [], //显示的人才照片
      cardfileList: [], //显示的身份证照片
      fileListarr: [], //批量上传显示
      imageUrl: "",
      previewphoto: [], //预览图片
      downloadpaths: [], //下载图片
      allselect: [], //全部选中
      //人才需求确认单
      requiretableData: [], //服务人员需求确认单 状态是4 的时候
      requiretableindex: 0,
      peoplerequiretableData: [],
      peopledialogshow: false, //从服务过来的处理弹出 状态为1
      requiredialogshow: false, //人才需求单 状态为4
      rtalentdialogshow: false, //人才 列表一直显示
      outtablistwrapshow: false, //人才选择外聘人员的列表
      testregistdialogshow: false, //考办证服务列表
      quitdialogshow: false, //人才清退列表
      peopleData: [], //企业自有人员
      companypeople: [], //企业外聘人员
      statestutas: "", //获取require
      companyname: "",
      companyname1: "",
      companyname2: "",
      issave: false, //是否显示保存和提交按钮
      endialogVisible: false, //是否终止
      endindex: "",
      endtalentId: "",
      testtableData: [], //考办证服务数据
      istest: false, //考办证服务是否显示提交和保存
      quittableData: [], //人才清退数据
      currentPage4: 1,
      servicelist: [], //关联服务
      selectpersonsub: false, //人才需求单是否选择人才
      seemyself: false, //只看自己,
      manageDepId: "", //部门管理员id
      managerid: "", //当前用户的id
      cteatorid: "", //创建人id
      
    };
  },
  mounted() {
    this.getUserInfo()//获取用户信息 
  },
  created() {
    // 获取人才列表
    this.getpersonlist();
    // 获取中介列表
    this.getanentlist();
    // 获取服务人员外聘和自由人才的列表
    this.getoperatelist();
    // 人才 获取外聘人员的列表 人才列表一直显示
    // this.getoutpeoplelist();
    // this.gettablentlist();
    // 获取岗位等级专业列表
    this.getstation();
    // 获取创建人
    this.getcreatepeople();
    // 获取关联服务
    this.getservice();
    
  
  },
  methods: {
    // 调取接口的方法
    changeissave(e) {
      this.issave = e;  //是否显示保存 
    },
     //获取用户信息
    async getUserInfo() {
      let typeList = await this.Axios.get(`ucenter-api/userlist/getUserInfo`);
      sessionStorage.setItem("userMessage",JSON.stringify(typeList.data.result))
      //获取当前管理员的id
      let userMessage = sessionStorage.getItem("userMessage");
      userMessage = JSON.parse(userMessage);
      this.manageDepId = userMessage.manageDepId;
      this.managerid = userMessage.userId;
    },
    // 关闭需求单弹出层
    closewrap(e) {
      this.rtalentdialogshow = e;
      this.peopledialogshow = e; //从服务过来的处理弹出 状态为1
      this.requiredialogshow = e; //人才需求单 状态为4
      this.testregistdialogshow = e; //考办证服务弹出层
      this.quitdialogshow = e; //人才清退列表
      this.drawer = e; //消息弹出层
      this.tableList = [];
      this.getpersonlist(); //获取人才列表
    },
    // 获取关联服务
    async getservice() {
      let orderId = "1331153702055321600";
      let res = await this.Axios.get(
        `talents-api/requirelist/queryFlowList?orderId=${orderId}`
      );
      let data = res.data.result;
      data.forEach((value) => {
        let obj = {};
        obj.label = value.flowName;
        obj.value = +value.flowId;
        this.servicelist.push(obj);
      });
    },
    // 企业操作自有人员 外聘人员
    async getoperatelist() {
      let orderId = "1331153702055321600";
      let res = await this.Axios.get(
        `talents-api/requirelist/queryList?orderId=${orderId}`
      );
      this.companyname = res.data.result.firstPartyName + "人才需求确认单";
      this.statestutas = res.data.result.require; //获取require
      this.peopleData = res.data.result.requireStaffList;
      this.companypeople = res.data.result.requireTalentList;
      let newpeopleData = this.peopleData;

      newpeopleData.forEach((value, index, array) => {
        value.statusname = "";
      });
      let newnewpeopleData = JSON.parse(JSON.stringify(newpeopleData));

      newnewpeopleData.forEach((value, index, array) => {
        value.hasinvalid = ""; //判断是否有无效的
        //计算总价
        value.totalprice =
          Number(value.staffOrgPrice) * Number(value.staffCount);
        value.totalprice = value.totalprice.toFixed("2");
        if (value.status == 10) {
          value.statusname = "待确定";
          this.issave = true; //判断提交按钮是否可以点击
        } else if (value.status == 11) {
          value.statusname = "有效";
        } else if (value.status == 12) {
          value.statusname = "无效";
        }
      });

      this.peopleData = newnewpeopleData;
      let newcompanypeople = this.companypeople;
      newcompanypeople.forEach((value, index, array) => {
        value.statusname = "";
      });
      let newnewcompanypeople = JSON.parse(JSON.stringify(newcompanypeople));
      newnewcompanypeople.forEach((value, index, array) => {
        value.hasinvalid = ""; //判断是否有无效的
        if (value.status == 10) {
          value.statusname = "待确定";
          this.issave = true; //判断提交按钮是否可以点击
        } else if (value.status == 11) {
          value.statusname = "有效";
        } else if (value.status == 12) {
          value.statusname = "无效";
        }
      });
      // 给每一个元素 加一个flowName
      newnewcompanypeople.forEach((value, index, array) => {
        this.servicelist.forEach((valuek, indexk, arrayk) => {
          if (value.flowId == valuek.value) {
            value.flowName = valuek.label;
          }
        });
      });
      this.companypeople = newnewcompanypeople;
      console.log(this.companypeople, "获取的列表列表列表");
      this.$forceUpdate();
    },
    // 获取外聘人员需求列表  人才一直显示这个列表
    async getoutpeoplelist(id) {
      let orderId = "1331153702055321600";
      let obj = {
        orderId: "1331153702055321600",
        flowId: id,
      };
      let res = await this.Axios.post(
        `talents-api/requirelist/queryTalentDemandList?`,
        obj
      );
      console.log(res, "外聘人员的列表");
      this.requiretableData = res.data.result;
      if (this.requiretableData.length != 0) {
        this.requiretableData.forEach((value) => {
          value.surename = "";
        });
      }
      let isSome = this.requiretableData.some(
        (item) => item.talentsName == null
      ); //判断列表里是否选择人才
      if (isSome == true) {
        this.selectpersonsub = true; //人才列表没有选择人不能提交
      } else {
        let ischeck = this.requiretableData.some((item) => item.status == 20); //判断列表里是否有待审核的
        let issub = this.requiretableData.every((item) => item.status == 30); //判断列表里是否全部是已绑定
        if (ischeck == true || issub == true) {
          this.selectpersonsub = false;
        } else {
          this.selectpersonsub = true;
        }
      }
      this.requiretableData = this.requiretableData;
      this.companyname1 =
        this.requiretableData[0].firstPartyName + "外聘人才确认单";
      this.companyname2 =
        this.requiretableData[0].firstPartyName + "人才需求单";
    },
    // 选择完人才之后让按钮可以点击
    changeperonsub(e) {
      console.log("清空出人才", e);
      this.selectpersonsub = e;
      this.rtalentdialogshow = true;
    },
    // 获取考办证列表
    async gettestregistlist() {
      let orderId = "1331153702055321600";
      let res = await this.Axios.post(
        `talents-api/requirelist/queryExamCertList?orderId=${orderId}`
      );
      console.log(res, "考办证列表");
      this.testtableData = res.data.result; //考办证服务列表
      let newtesttableData = this.testtableData;

      newtesttableData.forEach((value, index, array) => {
        value.statusname = "";
      });
      let newnewtesttableData = JSON.parse(JSON.stringify(newtesttableData));

      newnewtesttableData.forEach((value, index, array) => {
        value.totalprice =
          Number(value.staffOrgPrice) * Number(value.staffCount);
        value.totalprice = value.totalprice.toFixed("2");
        if (value.status == 11 || value.status == 12 || value.status == 22) {
          value.statusname = "未完成";
          this.istest = true; //判断提交按钮是否可以点击
        } else if (value.status == 21) {
          value.statusname = "已完成";
        }
      });
      this.testtableData = newnewtesttableData;
    },
    // 考办证列表提交按钮是否显示
    changeistest(e) {
      this.istest = e;
    },
    // 获取人才清退单
    async getquitpeoplelist(id) {
      let orderId = "1331153702055321600";
      let param = {
        orderId: "1331153702055321600",
        flowId: id,
      };
      let res = await this.Axios.post(
        `talents-api/requirelist/queryTalentClearList`,
        param
      );
      console.log(res, "人才清退单");
      this.quittableData = res.data.result; //人才清退 列表
      let newquittableData = this.quittableData;
      newquittableData.forEach((value, index, array) => {
         this.$set(value, 'checked', false)
        if (value.status == 40) {
          value.disabled = true;
        }
      });
      this.quittableData = newquittableData;
      console.log(this.quittableData,'人才清退列表')
      
    },
    // 弹出需求单
    requireone() {
      this.peopledialogshow = true;
      this.requiredialogshow = false;
      this.rtalentdialogshow = false;
      this.testregistdialogshow = false;
      this.quitdialogshow = false;
      this.drawer = false;

      console.log(this.peopledialogshow);
      this.getoperatelist(); //获取状态为1 的服务需求单
    },
    requiretwo(id) {
      this.peopledialogshow = false;
      this.requiredialogshow = true;
      this.rtalentdialogshow = false;
      this.testregistdialogshow = false;
      this.quitdialogshow = false;
      this.drawer = false;
      

      this.getoutpeoplelist(id); //获取状态为4 的服务需求单
    },
    requirethree(id) {
      this.peopledialogshow = false;
      this.requiredialogshow = false;
      this.rtalentdialogshow = true;
      this.testregistdialogshow = false;
      this.quitdialogshow = false;
      this.drawer = false;

      this.getoutpeoplelist(id); //获取状态为4 的服务需求单
    },
    // 考办证列表
    requirefour() {
      this.testregistdialogshow = true;
      this.peopledialogshow = false;
      this.requiredialogshow = false;
      this.rtalentdialogshow = false;
      this.quitdialogshow = false;
      this.drawer = false;

      this.gettestregistlist();
    },
    // 人才清退列表
    requirefive(id) {
      this.testregistdialogshow = false;
      this.peopledialogshow = false;
      this.requiredialogshow = false;
      this.rtalentdialogshow = false;
      this.quitdialogshow = true;
      this.drawer = false;
      this.getquitpeoplelist(id); //获取人才清退
      // this.quittableData.forEach((value)=>{
      //   value.checked=false
      // })
      this.quittableData=this.quittableData;
      this.$forceUpdate()
      console.log(this.quittableData,'人才清退列表列表列表')
    },
    // 消息列表
    requiresix() {
      this.testregistdialogshow = false;
      this.peopledialogshow = false;
      this.requiredialogshow = false;
      this.rtalentdialogshow = false;
      this.quitdialogshow = false;
      this.drawer = true;
     
    },

    // 获取 人才信息
    async getpersoninfo() {
      let that = this;
      let res = await this.Axios.get(
        `talents-api/talentslist/get?id=${this.personid}`
      );
      console.log("人才信息", res);
      //获取图片类型
      let newfileList = res.data.result.fileList;
      newfileList.forEach(function (value, index, array) {
        if (value.fileType == 5) {
          that.tableData.push(value);
          that.showtableData.push(value);
          that.fileimgarr.push(value);
          that.showtableData.forEach(function (value, index, array) {
            let arr = [];
            let url =
              "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
              value.filePath;
            arr.push(url);
            value.images = arr;
          });

          that.showtableData = that.showtableData;
        } else if (value.fileType == 1) {
          that.talentimg.push(value);
          console.log(
            that.talentimg.length,
            that.talentimg,
            "人才照片人才照片"
          );
          if (that.talentimg.length == 1) {
            console.log("人才照片1");
            that.talentimg1 =
              "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
              that.talentimg[0].filePath;
          } else if (that.talentimg.length == 2) {
            console.log("人才照片2");
            that.talentimg2 =
              "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
              that.talentimg[1].filePath;
          }
        } else if (value.fileType == 2) {
          that.idcardimg.push(value);
          if (that.idcardimg.length == 1) {
            that.idcardimg1 =
              "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
              that.idcardimg[0].filePath;
          } else if (that.idcardimg.length == 2) {
            that.idcardimg2 =
              "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
              that.idcardimg[1].filePath;
          }
        }
      });
      that.tableData = that.tableData;
      // 分批付款
      if (res.data.result.paymentList.length != 0) {
        this.firstpaymentarr = res.data.result.paymentList.slice(0, 1);
        this.firstpaymentarr[0].payTime = subtr(
          this.firstpaymentarr[0].payTime + ""
        );
        this.paymentarr = res.data.result.paymentList.slice(1);
        this.paymentarr.forEach(function (value, index, array) {
          value.payTime = subtr(value.payTime + "");
        });
        this.paymentarr = this.paymentarr;
      }

      this.ruleForm = res.data.result;
      //查看人才信息
      if (this.ruleForm.sex == 0) {
        this.sexname = "男";
      } else if (this.ruleForm.sex == 1) {
        this.sexname = "女";
      }

      // 聘用周期
      this.hireradio = this.ruleForm.signType + "";
      this.radio1 = this.ruleForm.isPay + "";
      if (this.radio1 == "2") {
        this.stagemoney = true;
        this.stagepay = true;
      }

      // 编辑人才信息
      // 证书来源
      let ruleForm = res.data.result;
      this.talentsId = res.data.result.talentsId;
      let editobj = {
        source: ruleForm.source, //证书 来源
        creatorId: ruleForm.creatorId, //创建人id
        providerId: ruleForm.providerId, //中介 id
        realName: ruleForm.realName, //姓名
        sex: ruleForm.sex,
        cardId: ruleForm.cardId, //身份证号
        telephone: ruleForm.telephone, //手机号
        socialStatus: ruleForm.socialStatus, //社保 状态
        postId: ruleForm.postId, //岗位
        levelId: ruleForm.levelId, //等级
        majorId: ruleForm.majorId, //专业
        signDate: ruleForm.signDate, //签发时间
        registerStatus: ruleForm.registerStatus, //证书状态
        registerSignDate: ruleForm.registerSignDate, //注册证签发时间,
        registerEducation: ruleForm.registerEducation, //是否继续教育
        hasB: ruleForm.hasB, //b本情况
        bSignTime: ruleForm.bsignTime, //签发日期
        bOverTime: ruleForm.boverTime, //结束日期
        bEducation: ruleForm.beducation, //b本是否教育
        certSwitch: ruleForm.certSwitch == null ? "" : ruleForm.certSwitch, //选择的证书
        account: ruleForm.account, //账号
        password: ruleForm.password, //密码
        contractCode: ruleForm.contractCode, //协议编号
        certInTime: ruleForm.certInTime, //交证时间
        price: ruleForm.price, //人才费
        signType: ruleForm.signType, //聘用周期
        signTime: ruleForm.signTime, //聘用时间
        overTime: ruleForm.overTime, //结束时间
        isPay: ruleForm.isPay, //是否付款
        remark: ruleForm.remark, //备注
        bExam: ruleForm.bexam,
      };
      this.ruleForm = editobj;
      if (this.ruleForm.source == 1) {
        this.sourcename = "个人";
        this.isagent = true;
      } else {
        this.sourcename = "中介";
        this.isagent = false;
        this.agentname = res.data.result.providerName;
      }
      // 社保状态
      if (this.ruleForm.socialStatus == 1) {
        this.socialStatus = "临时社保";
      } else if (this.ruleForm.socialStatus == 2) {
        this.socialStatus = "唯一社保";
      } else if (this.ruleForm.socialStatus == 3) {
        this.socialStatus = "不上社保";
      }
      //岗位 等级   专业
      this.station.forEach((value) => {
        if (value.value == this.ruleForm.postId) {
          this.post = value.label;
          this.ranknamestatus = false;
          if (this.post == "建造师") {
            this.addstatus = false;
          }
          this.getrank(value.value);
        }
      });

      // 证书状态
      if (this.ruleForm.registerStatus == 1) {
        this.registerStatus = "初始注册";
      } else if (this.ruleForm.registerStatus == 2) {
        this.registerStatus = "变更注册";
      } else if (this.ruleForm.registerStatus == 3) {
        this.registerStatus = "重新注册";
      } else if (this.ruleForm.registerStatus == 3) {
        this.registerStatus = "延续注册";
      }

      // 注册证是否 继续教育
      if (this.ruleForm.registerEducation == 1) {
        this.checked = true;
      } else {
        this.checked = false;
      }
      // B本情况 是否有B本
      if (this.ruleForm.hasB == 0) {
        console.log("B本情况0");
        this.radio = "2";
        this.isB = true;
        this.haveB = false;
        this.bSignTime = "";
        this.bOverTime = "";
        this.bEducation = "";

        //是否考试
        if (this.ruleForm.bExam == 0) {
          this.bExam = "不考";
        } else if (this.ruleForm.bExam == 1) {
          this.bExam = "考";
        }
      } else if (this.ruleForm.hasB == 1) {
        this.radio = "1";
        this.isB = false;
        this.haveB = true;
        this.bExam = "";
        //b本签发时间
        this.bSignTime = subtr(this.ruleForm.bSignTime + "");
        this.bOverTime = subtr(this.ruleForm.bOverTime + "");

        // B本是否继续教育

        if (this.ruleForm.bEducation == 0) {
          this.bEducation = "无";
          this.checkededuction = false;
        } else {
          this.bEducation = "有";
          this.checkededuction = true;
        }
      }
      // 聘用周期时间
      if (this.ruleForm.signTime != 0) {
        this.signTime = subtr(this.ruleForm.signTime + "");
      }
      if (this.ruleForm.overTime != 0) {
        this.overTime = subtr(this.ruleForm.overTime + "");
      }
      if (this.ruleForm.signDate != 0) {
        // 签发时间
        this.signDate = subtr(this.ruleForm.signDate + "");
      }

      // 注册证签发时间
      if (this.ruleForm.registerSignDate != 0) {
        this.registerSignDate = subtr(this.ruleForm.registerSignDate + "");
      }

      // 交证时间
      if (this.ruleForm.certInTime != 0) {
        this.certInTime = subtr(this.ruleForm.certInTime + "");
      }

      // 返回 的证书源件
      console.log(this.ruleForm.certSwitch, "998877665");
      let newswitcharr = JSON.parse(JSON.stringify(this.switcharr));
      if (this.ruleForm.certSwitch != "") {
        console.log(348384);
        let newceswitch = JSON.parse(this.ruleForm.certSwitch);
        newswitcharr.forEach(function (value, index, array) {
          newceswitch.forEach(function (valuek, indexk, arrayk) {
            if (Number(value.id) == Number(valuek)) {
              value.checked = true;
              that.$set(value, "checked", true);
              return value;
            }
          });
        });
        let num = 0;
        for (var obj of newceswitch) {
          num = num + Number(obj);
        }
        this.ruleForm.certSwitch = num;
      } else {
        console.log("没有数据");
        newswitcharr.forEach(function (value, index, array) {
          that.$set(value, "checked", false);
          return value;
        });
      }
      that.switcharr = newswitcharr;
      console.log(this.switcharr, "9999999", this.ruleForm.certSwitch);

      // 返回的分批 付款
      if (res.data.result.paymentList.length != 0) {
        let newarr = res.data.result.paymentList;
        let arr = [];
        for (var obj of newarr) {
          let objarr = {};
          objarr.batch = obj.batch;
          objarr.payTime = obj.payTime;
          objarr.price = obj.price;
          objarr.status = Number(obj.status);
          objarr.contractCode = Number(obj.contractCode);
          arr.push(objarr);
        }
        this.batcharr = arr;
      }
      this.$forceUpdate();
    },
    // 获取岗位等级专业
    getstation() {
      let config = {
        //  headers: { "Content-Type": "application/json" }
      }; //添加请求头
      let obj = {
        parentId: 0,
      };

      axios
        .get("http://172.16.1.16:3003/api/standardattribute/list?parentId=0")
        .then((res) => {
          console.log(res, "获取岗位等级");
          let result = res.data.result;
          result.forEach((value, index, array) => {
            let obj = {};
            obj.value = value.attributeId;
            obj.label = value.attributeName;
            this.station.push(obj);
          });
          console.log(this.station);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取等级
    getrank(parebtId) {
      axios
        .post(
          "http://172.16.1.16:3003/api/standardattribute/list?parentId=" +
            parebtId
        )
        .then((res) => {
          console.log(res, "获取等级");
          let result = res.data.result;
          result.forEach((value, index, array) => {
            let obj = {};
            obj.value = value.attributeId;
            obj.label = value.attributeName;
            this.rankarr.push(obj);
            console.log(this.ruleForm.levelId, "等级id");

            this.rankarr.forEach((value) => {
              if (value.value == this.ruleForm.levelId) {
                this.rank = value.label;
                this.majornamestatus = false;
                this.getmajor(value.value);
              }
            });
          });
          console.log(this.station);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getmajor(parebtId) {
      axios
        .post(
          "http://172.16.1.16:3003/api/standardattribute/list?parentId=" +
            parebtId
        )
        .then((res) => {
          console.log(res, "获取等级");
          let result = res.data.result;
          result.forEach((value, index, array) => {
            let obj = {};
            obj.value = value.attributeId;
            obj.label = value.attributeName;
            this.majorarr.push(obj);
            this.majorarr.forEach((value) => {
              if (value.value == this.ruleForm.majorId) {
                this.major = value.label;
              }
            });
          });
          console.log(this.station);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 获取创建人列表
    async getcreatepeople() {
      let res = await this.Axios.post(`talents-api/talentslist/getCreatorList`);
      console.log(res, "获取创建人");
      let data = res.data.result;
      if (data.length != 0) {
        data.forEach((value) => {
          let obj = {};
          obj.value = value.creatorId;
          obj.label = value.creatorName;
          this.createpeoplelist.push(obj);
        });
      }
    },
    // 选择创建人
    selectcreator(e) {
      console.log(e, "选择创建人");
      this.cteatorid = e;
    },
    // 只看自己
    seeme(e) {
      if (e == true) {
        this.selectRuleform.self = 1;
      } else {
        this.selectRuleform.self =0;
        // if(this.cteatorid!=''){
        //   this.selectRuleform.creatorId=this.cteatorid
        // }else{
        //   this.selectRuleform.creatorId=''
        // }
      }
      this.selectRuleform.pageNum=0;
      this.currentPage4=1;
      this.getpersonlist();
    },
    // 获取人才列表
    async getpersonlist() {
      let res = await this.Axios.post(
        `talents-api/talentslist/queryList`,
        this.selectRuleform
      );
      console.log(res);
      this.tableList = res.data.result;
      if (res.data.total != 0) {
        this.totalsize = res.data.total;
      }
      this.tableList.forEach((value) => {
        if (value.signDate != 0) {
          value.signDate = subtr(value.signDate + "");
        }
        if (value.signTime != 0) {
          value.signTime = subtr(value.signTime + "");
        }
        if (value.overTime != 0) {
          value.overTime = subtr(value.overTime + "");
        }
      });
      this.tableList = this.tableList;
    },
    // 终止人才合作
    enduse(index, row) {
      this.endialogVisible = true;
      this.endindex = index;
      this.endid = row.id;
      this.endtalentId = row.talentsId;
    },
    async sureend() {
      let param = {
        id: this.endid,
        talentsId: this.endtalentId,
        sellStatus: this.tableList[this.endindex].sellStatus,
        // status:this.tableList[this.endindex].status
      };
      let res = await this.Axios.post(`talents-api/talentslist/stop`, param);
      if (res.data.code == 0) {
        this.$message({
          message: "终止成功",
          type: "success",
        });
        this.tableList[this.endindex].status = 2;
        this.tableList = this.tableList;
        this.$forceUpdate();
        this.endialogVisible = false;
      }
    },
    // 加入外销
    join(row) {
      let that = this;
      that.titledialogVisible = true;
      this.isjoin = 1;
      this.titleword = "加入外销操作确认";
      this.titletext = "是否将该人员添加到外销列表？";
      this.joindata = {
        id: Number(row.id),
        talentsId: Number(row.talentsId),
        sellStatus: 1,
      };
    },
    // 撤回外销
    withdraw(row) {
      let that = this;
      that.titledialogVisible = true;
      this.isjoin = 0;
      this.titletext = "是否将该人员撤回到人员列表？";
      this.titleword = "撤回外销操作确认";
      this.joindata = {
        id: Number(row.id),
        talentsId: Number(row.talentsId),
        sellStatus: this.isjoin,
      };
    },
    // 外销操作
    async suretitle() {
      let that = this;
      let joindata = this.joindata;
      let res = await this.Axios.post(
        `talents-api/talentslist/joinOrRevoke`,
        joindata
      );
      let newtableList = this.tableList;
      newtableList.forEach(function (value, index, array) {
        if (value.id == that.joindata.id) {
          console.log(value.id);
          value.sellStatus = that.isjoin;
        }
        that.titledialogVisible = false;
      });
      this.tableList = newtableList;
      this.$forceUpdate();
    },

    // 获取中介 列表
    async getanentlist() {
      let res = await this.Axios.get(`talents-api/providerlist/queryAll`);
      console.log(res, "中介列表");
      let agentlist = res.data.result;
      if (agentlist.length == 0) {
        console.log(agentlist.length, "中介列表的数组 数组");
        let obj = {
          value: -1,
          label: "添加中介",
        };
        this.recoursearr.push(obj);
      } else {
        agentlist.forEach((value, index, array) => {
          let obj = {};
          obj.value = value.providerId;
          obj.label = value.providerName;
          this.recoursearr.push(obj);
        });
      }
    },
    // 选择中介名称
    selectagentname(e) {
      if (e == -1) {
        this.$router.push("/person/agency");
      } else {
        this.ruleForm.providerId = e;
      }
    },
    // 清除中介
    clearselectagentname() {
      this.ruleForm.providerId = "";
    },
    // 上传人才照片
    suceessAvataruploadPicone(params) {
      let that = this;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      console.log(params);
      // 判断 图片格式和大小
      if (
        params.file.type != "image/bmp" &&
        params.file.type != "image/jpeg" &&
        params.file.type != "image/png"
      ) {
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
      console.log(size, type, "9999");
      if (
        (type == "image/png" && size > 10) ||
        (type == "image/jpeg" && size > 10) ||
        (type == "image/bmp" && size > 10) ||
        (type == "image/jpg" && size > 10)
      ) {
        this.$message({
          title: "警告",
          message: "图片不能超过10M",
          type: "warning",
        });
        loading.close();
        return false;
      }
      console.log("上传文件", params);
      let obj = {};
      obj.uid = params.file.uid;
      let _file = params.file;
      let param = new FormData(); //创建form对象
      param.append("file", _file); //通过append向form对象添加数据
      param.append("fileType", 1);
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
          that.talentimg[0] = res.data.result[0];
          // that.talentimg.push(res.data.result[0]);
          that.talentimg1 =
            "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
            res.data.result[0].filePath;
          console.log(that.talentimg, "人才照片");
          loading.close();
        })
        .catch((err) => {
          console.log(err, "图片上传错误");
          loading.close();
        });
    },
    suceessAvataruploadPicone1(params) {
      let that = this;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 判断图片 格式和大小
      if (
        params.file.type != "image/bmp" &&
        params.file.type != "image/jpeg" &&
        params.file.type != "image/png"
      ) {
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
        (type == "image/bmp" && size > 10) ||
        (type == "image/jpg" && size > 10)
      ) {
        this.$message({
          title: "警告",
          message: "图片不能超过10M",
          type: "warning",
        });
        loading.close();
        return false;
      }
      console.log("上传文件", params);
      let obj = {};
      obj.uid = params.file.uid;
      let _file = params.file;
      let param = new FormData(); //创建form对象
      param.append("file", _file); //通过append向form对象添加数据
      param.append("fileType", 1);
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

          that.talentimg[1] = res.data.result[0];
          // that.talentimg.push(res.data.result[0]);
          that.talentimg2 =
            "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
            res.data.result[0].filePath;

          loading.close();
        })
        .catch((err) => {
          loading.close();
          console.log(err, "图片上传错误");
        });
    },
    // 删除人才照片
    handleRemove(file, fileList) {
      let that = this;
      console.log(file);
      that.talentimg.forEach(function (value, index, array) {
        if (value.fileId == file.fileId) {
          that.talentimg.splice(index, 1);
        }
      });
      that.talentimg = that.talentimg;
      that.$forceUpdate();
    },
    // 删除人才照片
    deltalentimg1() {
      this.talentimg1 = "";
      this.talentimg.splice(0, 1);
      this.talentimg = this.talentimg;
    },
    deltalentimg2() {
      this.talentimg2 = "";
      this.talentimg.splice(1, 1);
      this.talentimg = this.talentimg;
    },
    // 身份证上传
    suceessAvataruploadPitwo(params) {
      let that = this;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 判断图片 格式和大小
      if (
        params.file.type != "image/bmp" &&
        params.file.type != "image/jpeg" &&
        params.file.type != "image/png"
      ) {
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
        (type == "image/bmp" && size > 10) ||
        (type == "image/jpg" && size > 10)
      ) {
        this.$message({
          title: "警告",
          message: "图片不能超过10M",
          type: "warning",
        });
        loading.close();
        return false;
      }
      let _file = params.file;
      let param = new FormData(); //创建form对象
      param.append("file", _file); //通过append向form对象添加数据
      param.append("fileType", 2);
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
          console.log(res.data.result[0]);
          that.idcardimg[0] = res.data.result[0];
          that.idcardimg1 =
            "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
            res.data.result[0].filePath;
          // that.idcardimg.push(res.data.result[0]);
          console.log(this.idcardimg, "身份证");
          loading.close();
        })
        .catch((err) => {
          loading.close();
          this.showMessage("error", "图片上传错误");
        });
    },
    suceessAvataruploadPitwo1(params) {
      let that = this;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 判断图片格式和大小
      if (
        params.file.type != "image/bmp" &&
        params.file.type != "image/jpeg" &&
        params.file.type != "image/png"
      ) {
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
        (type == "image/bmp" && size > 10) ||
        (type == "image/jpg" && size > 10)
      ) {
        this.$message({
          title: "警告",
          message: "图片不能超过10M",
          type: "warning",
        });
        loading.close();
        return false;
      }
      let _file = params.file;
      let param = new FormData(); //创建form对象
      param.append("file", _file); //通过append向form对象添加数据
      param.append("fileType", 2);
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
          console.log(res.data.result[0]);
          that.idcardimg[1] = res.data.result[0];
          that.idcardimg2 =
            "http://applet-second.oss-cn-qingdao.aliyuncs.com/" +
            res.data.result[0].filePath;
          // that.idcardimg.push(res.data.result[0]);
          console.log(this.idcardimg, "身份证");
          loading.close();
        })
        .catch((err) => {
          loading.close();
          this.showMessage("error", "图片上传错误");
        });
    },
    // 删除身份证
    handleRemovecard(file) {
      console.log(file);
      let that = this;
      that.idcardimg.forEach(function (value, index, array) {
        if (value.fileId == file.fileId) {
          that.idcardimg.splice(index, 1);
        }
      });
      that.idcardimg = that.idcardimg;
      that.$forceUpdate();
    },
    // 删除身份证照片
    delidcardimg1() {
      this.idcardimg1 = "";
      this.idcardimg.splice(0, 1);
      this.idcardimg = this.idcardimg;
    },
    delidcardimg2() {
      this.idcardimg2 = "";
      this.idcardimg.splice(1, 1);
      this.idcardimg = this.idcardimg;
    },
    //身份证失去焦点时候验证
    testidcard() {
      if (this.ruleForm.cardId != "") {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!reg.test(this.ruleForm.cardId)) {
          this.$message({
            message: "请输入正确的身份证号",
            type: "warning",
          });
          return false;
        }
      }
    },
    // 手机号验证
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
    // 验证 姓名
    entername(e){
      console.log(e,'姓名姓名')
      let len=e.currentTarget.value.length
      if(len<2){
        this.$message({
            message: "姓名请输入2-20字符",
            type: "warning",
          });
            return false
      }
      if(len>20){
        this.$message({
             message: "姓名请输入2-20字符",
            type: "warning",
          });
            return false
      }

    

    },
    // 添加人才时候验证签约信息
    testsigncontract() {
      if (
        this.ruleForm.contractCode != "" ||
        this.ruleForm.price != "" ||
        this.ruleForm.signTime != "" ||
        this.ruleForm.overTime != ""
      ) {
          if (this.ruleForm.contractCode == "") {
            this.$message({
            message: '请补全签约信息人才协议编号',
            type: 'warning'
            
          });
            return false;
          }else if (this.ruleForm.price == "") {
          this.$message({
            message: "请补全签约信息人才费用",
            type: "warning",
          });
          return false;
        }else if (this.ruleForm.signType == "") {
          this.$message({
            message: "请补全签约信息聘用周期",
            type: "warning",
          });
          return false;
        }else if (this.ruleForm.signTime == "") {
          this.$message({
            message: "请补全签约信息签约开始时间",
            type: "warning",
          });
          return false;
        }else if (this.ruleForm.overTime == "") {
          this.$message({
            message: "请补全签约信息签约结束时间",
            type: "warning",
          });
          return false;
        }
      }
    },

    // 确定提交
    suresubmit(formName) {
      let that = this;
      if (that.ruleForm.source == 2) {
        console.log('中介名称',this.ruleForm.providerId)
        if (this.ruleForm.providerId == "" ||this.ruleForm.providerId==0) {
          this.$message({
            message: "请选择中介名称",
            type: "warning",
          });
          return false;
        }
      }
      if(this.ruleForm.realName.length<2){
        this.$message({
            message: "姓名请输入2-20字符",
            type: "warning",
          });
          return false
      }
      if(this.ruleForm.realName.length>20){
        this.$message({
             message: "姓名请输入2-20字符",
            type: "warning",
          });
          return false
      }
      // 验证必填字段是否都填
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("验证通过");
          //验证通过
          if (this.ruleForm.cardId != "") {
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (!reg.test(this.ruleForm.cardId)) {
              this.$message({
                message: "请输入正确的身份证号",
                type: "warning",
              });
              return false;
            }
          }
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
          //点击时间叉号去除的时候默认显示1970
          if (this.ruleForm.certInTime == "19700101") {
            this.ruleForm.certInTime = "";
          }
          if (this.ruleForm.signTime == "19700101") {
            this.ruleForm.certInTime = "";
          }
          if (this.ruleForm.overTime == "19700101") {
            this.ruleForm.certInTime = "";
          }

          if (this.ruleForm.bSignTime != "" && this.ruleForm.bOverTime != "") {
            if (this.ruleForm.bOverTime < this.ruleForm.bSignTime) {
              this.$message({
                message: "签发日期开始时间要小于结束时间",
                type: "warning",
              });
              return false
            }
          }

          // 判断是否填写签约信息
          if (this.testsigncontract() == false) {
            return false;
          }
          if (this.ruleForm.overTime != "" && this.ruleForm.signTime) {
            if (this.ruleForm.overTime < this.ruleForm.signTime) {
              this.$message({
                message: "签约开始时间要小于结束时间",
                type: "warning",
              });
              return false
            }
          }
          if (
            this.ruleForm.contractCode == "" &&
            this.ruleForm.price == "" &&
            this.ruleForm.signTime == "" &&
            this.ruleForm.overTime == ""
          ) {
            this.ruleForm.signType = "";
            this.ruleForm.isPay = "";
            this.ruleForm.certInTime = "";
          }
          if (this.isedit == 2) {
            this.ruleForm.id = this.personid;
            this.ruleForm.talentsId = this.talentsId;
          }
          // 处理分期付款的日期
          var newbatcharr = this.batcharr;
          console.log(newbatcharr);
          if (that.stagemoney == true) {
            if (newbatcharr[0].payTime != undefined) {
              newbatcharr.forEach(function (value, index, array) {
                console.log(value);
                let date = value.payTime.split("-");
                date = date[0] + date[1] + date[2];
                value.payTime = Number(date);
                if (value.price == "") {
                  console.log(111);
                  that.$message({
                    message: "分期付款信息不完整",
                    type: "warning",
                  });
                  return false;
                }
                if (value.payTime == "") {
                  that.$message({
                    message: "分期付款信息不完整",
                    type: "warning",
                  });
                  return false;
                }
                if (value.price == "") {
                  that.$message({
                    message: "分期付款信息不完整",
                    type: "warning",
                  });
                  return false;
                }
                if (value.status === "") {
                  that.$message({
                    message: "分期付款信息不完整",
                    type: "warning",
                  });
                  return false;
                }
              });
            }
            this.batcharr = newbatcharr;
          } else {
            this.batcharr = [];
          }

          // 上传的图片和文件
          let imgarr = [];
          if (this.talentimg.length != 0) {
            this.talentimg.forEach(function (value, index, array) {
              imgarr.push(value);
            });
          }

          if (this.idcardimg.length != 0) {
            this.idcardimg.forEach(function (value, index, array) {
              imgarr.push(value);
            });
          }
          if (this.fileimgarr.length != 0) {
            this.fileimgarr.forEach(function (value, index, array) {
              console.log(value);
              if (value.images) {
                delete value["images"]; //删除显示的images
              }
              imgarr.push(value);
            });
          }
          this.imagearr = imgarr;
          let param = {
            fileList: this.imagearr,
            paymentList: this.batcharr,
            talents: this.ruleForm,
          };
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          }); //显示弹出层
          // 编辑人才信息  isedit  2编辑 3添加
          if (this.ruleForm.price == "") {
            this.ruleForm.price = 0;
          }
          if (this.isedit == 2) {
            //编辑人才 信息
            that.Axios.postEdit(
              `talents-api/talentslist/update`,
              param,
              "postJson"
            )
              .then((res) => {
                console.log(res);
                if (res.data.code == "400000") {
                  this.$message(res.data.message);
                  loading.close();
                } else if (res.data.code == 0) {
                  this.$message({
                    message: "提交成功",
                    type: "success",
                  });
                  that.centerDialogVisible = false;
                  loading.close();
                  this.getpersonlist();
                  this.page = 1;
                } else {
                  loading.close();
                }
              })
              .catch((err) => {
                loading.close();
              });
          } else if (this.isedit == 3) {
            // 添加人才信息
            that.Axios.post(`talents-api/talentslist/update`, param, "postJson")
              .then((res) => {
                console.log(res);
                if (res.data.code == "400000") {
                  this.$message(res.data.message);
                  loading.close();
                } else if (res.data.code == 0) {
                  this.$message({
                    message: "提交成功",
                    type: "success",
                  });
                  that.centerDialogVisible = false;
                  loading.close();
                  this.getpersonlist();
                  this.page = 1;
                } else {
                  loading.close();
                }
              })
              .catch((err) => {
                loading.close();
              });
          }
        } else {
          console.log("error submit!!");
          this.$message({
            message: "请补全重要信息",
            type: "warning",
          });
          return false;
          console.log(9999);
        }
      });
    },
    // 修改 签约时间
    changehiretime(e) {
      console.log("修改签约时间", e);
      let date1 = time(e[0]);
      let date2 = time(e[1]);
      this.signRuleform.signTime = date1;
      this.signRuleform.overTime = date2;
    },
    // 确定签约
    suesign(formName) {
      let that = this;
      
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          }); //显示弹
          that.Axios.post(
            `talents-api/talentslist/quickSign`,
            that.signRuleform
          )
            .then((res) => {
              console.log(res);
              if (res.data.code == 0) {
                this.$message({
                  message: "提交成功",
                  type: "success",
                });
                loading.close();
                this.seepersondialog = false;
                this.tableList = [];
                this.getpersonlist();
              } else {
                loading.close();
                this.$message.error("提交失败");
              }
            })
            .catch((err) => {
              loading.close();
            });
        } else {
          // loading.close();
          // this.$message({
          //   message: "请补全签约信息",
          //   type: "warning",
          // });
        }
      });
    },

    // 页面操作方法没有调接口的
    // 签约
    signbegintime(event) {
      let date = new Date(event.currentTarget.value);
      this.signRuleform.signTime = time(date);
      if (this.signRuleform.overTime != "") {
        if (this.signRuleform.overTime < this.signRuleform.signTime) {
          this.$message({
            message: "开始时间要小于结束时间",
            type: "warning",
          });
        }
      }
    },
    signendtime(event) {
      let date = new Date(event.currentTarget.value);
      this.signRuleform.overTime = time(date);
      if (this.signRuleform.signTime != "") {
        if (this.signRuleform.overTime < this.signRuleform.signTime) {
          this.$message({
            message: "开始时间要小于结束时间",
            type: "warning",
          });
        }
      }
    },
    cancelsign() {
      this.seepersondialog = false;
    },
    // 添加人才信息
    // 搜索人才
    searchperson() {
      this.selectRuleform.pageNum = 0;
      this.currentPage4=1;
      this.selectRuleform.source = "";
      this.getpersonlist();
    },
    // 只搜索中介和个人
    searchagentornot() {
    this.selectRuleform.pageNum = 0;
    this.currentPage4=1;
      if (this.selectRuleform.source == undefined)
        this.selectRuleform.source = 1;
      this.getpersonlist();
    },
    // 添加人才
    addpeople() {
      this.centerDialogVisible = true;
      this.isedit = 3;
      this.titleinfo = "添加人才信息";
      let obj = {
        source: "", //证书 来源
        providerId: "", //中介 id
        realName: "", //姓名
        sex: "",
        cardId: "", //身份证号
        telephone: "", //手机号
        socialStatus: "", //社保 状态
        postId: "", //岗位
        levelId: "", //等级
        majorId: "", //专业
        signDate: "", //签发时间
        registerStatus: "", //证书状态
        registerSignDate: "", //注册证签发时间,
        registerEducation: 0, //是否继续教育
        hasB: "", //b本情况
        bSignTime: "", //签发日期
        bOverTime: "", //结束日期
        bEducation: "", //b本是否教育
        certSwitch: "", //选择的证书
        account: "", //账号
        password: "", //密码
        contractCode: "", //协议编号
        certInTime: "", //交证时间
        price: "", //人才费
        signType: "", //聘用周期
        signTime: "", //聘用时间
        overTime: "", //结束时间
        isPay: "", //是否付款
        remark: "", //备注
      };
      this.ruleForm = obj;
      this.agentname = "";
      this.sexname = "";
      this.checked = false;
      this.stagemoney = false;
      this.sourcename = "";
      this.socialStatus = "";
      this.post = "";
      this.rank = "";
      this.major = "";
      this.signDate = "";
      this.registerStatus = "";
      this.registerSignDate = "";
      this.hireradio = "";
      this.radio1 = "";
      this.radio = "";
      this.isB = true;
      this.firstpaymentarr = [
        {
          batch: "",
          price: "",
          payTime: "",
          status: "",
        },
      ];
      this.showtableData=[];
      this.paymentarr = [];
      this.isjoin = ""; //0  撤回外销  1 加入外销
      this.joindata = ""; //加入外销和撤回外销要传的字段
      this.idcardimg = []; //身份证照片
      this.talentimg = []; //人才照片
      this.fileimgarr = []; //批量上传
      this.talentfileList = []; //显示的人才照片
      this.cardfileList = []; //显示的身份证照片
      this.fileListarr = []; //批量上传显示
      this.imagearr = [];
      this.ispaymoney = ""; //是否付款
      this.batcharr = [{}]; //分批付款数组
      this.num = 0;
      this.signTime = "";
      this.overTime = "";
      this.certInTime="";
      this.tableData = [];
      this.talentimg1 = "";
      this.talentimg2 = "";
      this.idcardimg1 = "";
      this.idcardimg2 = "";
      this.switcharr = [
        {
          id: 1,
          name: "身份证",
          checked: false,
        },
        {
          id: 2,
          name: "资格证",
          checked: false,
        },
        {
          id: 4,
          name: "注册证",
          checked: false,
        },
        {
          id: 8,
          name: "B本",
          checked: false,
        },
        {
          id: 16,
          name: "安全员",
          checked: false,
        },
        {
          id: 32,
          name: "职称证书",
          checked: false,
        },
        {
          id: 64,
          name: "离职证明",
          checked: false,
        },
        {
          id: 128,
          name: "毕业证书",
          checked: false,
        },
        {
          id: 256,
          name: "继续教育",
          checked: false,
        },
        {
          id: 512,
          name: "养老手册",
          checked: false,
        },
        {
          id: 1024,
          name: "就失业证书",
          checked: false,
        },
        {
          id: 2048,
          name: "评审表",
          checked: false,
        },
        {
          id: 4096,
          name: "退休证",
          checked: false,
        },
      ];
    },
    // 人才签约
    seeperson(row) {
      let signobj = {
        id: "",
        talentsId: "",
        contractCode: "",
        price: "",
        signType: "",
        signTime: "",
        overTime: "",
      };
      this.signRuleform = signobj;
      this.personid = row.id;
      this.seepersondialog = true;
      this.quitdialogshow = false;
      this.signRuleform.id = row.id;
      this.signRuleform.talentsId = row.talentsId;
      // this.getpersoninfo();

      this.hirecycletime = "";
      this.isedit = 1;
    },
    // 图片预览
    previewimg(url) {
      this.previewphoto.push(url);
    },
    // 编辑人才信息
    editList(row) {
      this.personid = row.id;
      this.centerDialogVisible = true;
      this.titleinfo = "查看人才信息";
      this.idcardimg = [];
      this.talentimg = [];
      this.idcardimg1 = "";
      this.idcardimg2 = "";
      this.talentimg1 = "";
      this.talentimg2 = "";
      this.fileimgarr = [];
      this.talentfileList = [];
      this.cardfileList = [];
      this.tableData = [];
       this.showtableData=[];
      this.isedit = 2;
      this.centerDialogVisible = true;

      let obj = {
        source: "", //证书 来源
        providerId: "", //中介 id
        realName: "", //姓名
        sex: "",
        cardId: "", //身份证号
        telephone: "", //手机号
        socialStatus: "", //社保 状态
        postId: "", //岗位
        levelId: "", //等级
        majorId: "", //专业
        signDate: "", //签发时间
        registerStatus: "", //证书状态
        registerSignDate: "", //注册证签发时间,
        registerEducation: 0, //是否继续教育
        hasB: "", //b本情况
        bSignTime: "", //签发日期
        bOverTime: "", //结束日期
        bEducation: "", //b本是否教育
        certSwitch: "", //选择的证书
        account: "", //账号
        password: "", //密码
        contractCode: "", //协议编号
        certInTime: "", //交证时间
        price: "", //人才费
        signType: "", //聘用周期
        signTime: "", //聘用时间
        overTime: "", //结束时间
        isPay: "", //是否付款
        remark: "", //备注
        hasB: "", //是否有B本
      };
      this.ruleForm = obj;
      (this.agentname = ""), (this.sexname = "");
      this.checked = false;
      this.stagemoney = false;
      this.sourcename = "";
      this.socialStatus = "";
      this.post = "";
      this.rank = "";
      this.major = "";
      this.signDate = "";
      this.registerStatus = "";
      this.registerSignDate = "";
      this.hireradio = "";
      this.radio1 = "";
      (this.radio = ""), //是否有B 本
        (this.isB = true);
      this.firstpaymentarr = [
        {
          batch: "",
          price: "",
          payTime: "",
          status: "",
        },
      ];
      this.paymentarr = [];
      this.isjoin = ""; //0  撤回外销  1 加入外销
      this.joindata = ""; //加入外销和撤回外销要传的字段
      this.idcardimg = []; //身份证照片
      this.talentimg = []; //人才照片
      this.fileimgarr = []; //批量上传
      this.talentfileList = []; //显示的人才照片
      this.cardfileList = []; //显示的身份证照片
      this.fileListarr = []; //批量上传显示
      this.imagearr = [];
      this.ispaymoney = ""; //是否付款
      this.batcharr = [{}]; //分批付款数组
      this.num = 0;
      this.signTime = "";
      this.overTime = "";
      this.certInTime="";
      this.tableData = [];
      this.showtableData = [];

      this.switcharr = [
        {
          id: 1,
          name: "身份证",
          sel: false,
          checked: false,
        },
        {
          id: 2,
          name: "资格证",
          sel: false,
          checked: false,
        },
        {
          id: 4,
          name: "注册证",
          checked: false,
        },
        {
          id: 8,
          name: "B本",
          checked: false,
        },
        {
          id: 16,
          name: "安全员",
          checked: false,
        },
        {
          id: 32,
          name: "职称证书",
          checked: false,
        },
        {
          id: 64,
          name: "离职证明",
          checked: false,
        },
        {
          id: 128,
          name: "毕业证书",
          checked: false,
        },
        {
          id: 256,
          name: "继续教育",
          checked: false,
        },
        {
          id: 512,
          name: "养老手册",
          checked: false,
        },
        {
          id: 1024,
          name: "就失业证书",
          sel: false,
          checked: false,
        },
        {
          id: 2048,
          name: "评审表",
          checked: false,
        },
        {
          id: 4096,
          name: "退休证",
          checked: false,
        },
      ];
      this.getpersoninfo();
    },

    // 选择证书来源
    selectrecourse(e) {
      this.ruleForm.source = e;
      if (e == 2) {
        this.isagent = false;
      } else {
        this.isagent = true;
      }
    },
    // 选择性别
    selectsex(e) {
      console.log(e, "性别");
      if (e == "男") {
        this.ruleForm.sex = 0;
      } else {
        this.ruleForm.sex = 1;
      }
    },
    // 社保状态
    selectsocity(e) {
      console.log(e, "社保状态");
      this.ruleForm.socialStatus = e;
    },
    // 选择中介和人才
    selectagent(e) {
      console.log(e, "选择中介和人才");
      this.selectRuleform.source = e;
    },
    // 选择岗位（添加人才）
    selectpostname(e) {
      this.ruleForm.postId = e;
      this.ranknamestatus = false;
      this.rankarr = [];
      this.ruleForm.levelId = "";
      this.rank = "";
      this.majorarr = [];
      this.major = "";
      this.ruleForm.majorId = "";
      this.getrank(e);
      this.station.forEach((value, index, array) => {
        if (value.value == e) {
          if (value.label == "建造师") {
            this.addstatus = false;
          } else {
            this.addstatus = true;
          }
        }
      });
    },
    // 清除岗位
    clearselectpostname(e) {
      console.log("清除岗位", e);
      this.ruleForm.postId = "";
      this.ranknamestatus = true;
      this.majornamestatus = true;
    },
    // 选择等级（添加人才）
    selectrankname(e) {
      this.ruleForm.levelId = e;
      this.majornamestatus = false;
      this.majorarr = [];
      this.major = "";
      this.ruleForm.majorId = "";
      this.getmajor(e);
    },
    // 清除等级
    clearselectrankname() {
      this.ruleForm.levelId = "";
      this.majornamestatus = true;
    },
    // 选择专业（添加人才）
    selectmajorname(e) {
      this.major = e;
      this.ruleForm.majorId = e;
    },
    // 清除专业
    clearselectmajorname() {
      this.ruleForm.majorId = "";
    },
    // 选择证书状态
    selectregister(e) {
      this.ruleForm.registerStatus = e;
      console.log(this.registerStatus, "证书状态");
    },
    // 清除选择证书
    clearselectregister(e) {
      if (e == undefined) {
        this.ruleForm.registerStatus = -1;
      }
    },
    // 注册证 是否继续 教育
    registeredu(e) {
      console.log(e, "是否继续教育");
      if (e == true) {
        this.ruleForm.registerEducation = 1;
      } else {
        this.ruleForm.registerEducation = 0;
      }
    },
    // 选择B本
    selectb(e) {
      console.log(e);
      if (e == 1) {
        this.isB = false;
        this.haveB = true;
        this.ruleForm.hasB = 1;
        this.bExam = "";
      } else if (e == 2) {
        this.isB = true;
        this.haveB = false;
        this.ruleForm.hasB = 0;
        this.bSignTime = "";
        this.bOverTime = "";
        this.bEducation = "";
      }
    },
    // 签发时间
    signdate(e) {
      if (e == null) {
        this.ruleForm.signDate = 0;
      } else {
        let date = new Date(e);
        date = time(date);
        console.log(date);
        this.ruleForm.signDate = Number(date);
      }
    },
    // 注册签发日期
    registerdate(e) {
      if (e == null) {
        this.ruleForm.registerSignDate = 0;
      } else {
        let date = new Date(e);
        date = time(date);
        this.ruleForm.registerSignDate = Number(date);
      }
    },
    // B本签发日期
    bsigntime(e) {
      if (e == null) {
        this.ruleForm.bSignTime = 0;
      } else {
        let date = new Date(e);
        date = time(date);
        this.ruleForm.bSignTime = Number(date);
        if (this.ruleForm.bOverTime != "") {
          if (this.ruleForm.bOverTime < this.ruleForm.bSignTime) {
            this.$message({
              message: "开始时间要小于结束时间",
              type: "warning",
            });
          }
        }
      }
    },
    //  b本到期
    overtime(e) {
      if (e == null) {
        this.ruleForm.bOverTime = 0;
      } else {
        let date = new Date(e);
        date = time(date);
        this.ruleForm.bOverTime = Number(date);
        if (this.ruleForm.bSignTime != "") {
          if (this.ruleForm.bOverTime < this.ruleForm.bSignTime) {
            this.$message({
              message: "开始时间要小于结束时间",
              type: "warning",
            });
          }
        }
      }
    },
    // 交证时间
    certintime(e) {
      if (e == null) {
        this.ruleForm.certInTime = 0;
      } else {
        let date = new Date(e);
        date = time(date);
        this.ruleForm.certInTime = Number(date);
      }
    },

    // 聘用开始时间
    signtime(e) {
      if (e == null) {
        this.ruleForm.signTime = 0;
      } else {
        let date = new Date(e);
        date = time(date);
        this.ruleForm.signTime = Number(date);
        if (this.ruleForm.overTime != "") {
          if (this.ruleForm.overTime < this.ruleForm.signTime) {
            this.$message({
              message: "开始时间要小于结束时间",
              type: "warning",
            });
          }
        }
      }
    },
    // 聘用结束时间
    endtime(e) {
      if (e == null) {
        this.ruleForm.overTime = 0;
      } else {
        let date = new Date(e);
        date = time(date);
        this.ruleForm.overTime = Number(date);
        if (this.ruleForm.signTime != "") {
          if (this.ruleForm.overTime < this.ruleForm.signTime) {
            this.$message({
              message: "开始时间要小于结束时间",
              type: "warning",
            });
          }
        }
      }
    },
    // B本继续教育
    selecteduction(e) {
      if (e == true) {
        this.ruleForm.bEducation = 1;
      } else {
        this.ruleForm.bEducation = 0;
      }
    },
    // 是否考试
    selectexame(e) {
      console.log(e);
      this.ruleForm.bExam = e;
    },
    // 清除是否考试
    clearselectexame(e) {
      if (e == undefined) {
        this.ruleForm.bExam = -1;
      }
    },
    // 选择证书
    selectswitch(item) {
      console.log(item, "选择证书");
      // item.checked = !item.checked;
      // console.log(item.sel)
      if (item.checked == true) {
        this.ruleForm.certSwitch =
          Number(this.ruleForm.certSwitch) + Number(item.id);
      } else {
        this.ruleForm.certSwitch =
          Number(this.ruleForm.certSwitch) - Number(item.id);
      }
      if (this.ruleForm.certSwitch == 0) {
        this.ruleForm.certSwitch = "";
      }
      console.log(this.ruleForm.certSwitch);
    },
    // 输入批次
    enterbatch(event) {
      this.batcharr[0].batch = event.currentTarget.value;
      this.batcharr = this.batcharr;
    },
    enterbatchk(event, index) {
      this.batcharr[index + 1].batch = event.currentTarget.value;
      this.batcharr = this.batcharr;
    },
    // 付款金额
    paymoney(event) {
      this.batcharr[0].price = event.currentTarget.value;
      this.batcharr = this.batcharr;
    },
    paymoneyk(event, index) {
      this.batcharr[index + 1].price = event.currentTarget.value;
      this.batcharr = this.batcharr;
    },
    //付款日期
    selectday(enent) {
      this.batcharr[0].payTime = event.currentTarget.value;
      this.batcharr = this.batcharr;
      this.batcharr[0].contractCode = this.ruleForm.contractCode;
    },
    selectdayk(enent, index) {
      this.batcharr[index + 1].payTime = event.currentTarget.value;
      this.batcharr = this.batcharr;
      this.batcharr[index + 1].contractCode = this.ruleForm.contractCode;
      console.log(this.paymentarr, "付款付款");
    },
    // 是否付款
    ispayselect(e) {
      console.log(this.batcharr, "数组数组");
      this.batcharr[0].status = e;
      this.batcharr = this.batcharr;
      console.log(this.batcharr);
    },
    ispayselectk(e, index) {
      this.batcharr[index + 1].status = e;
      this.batcharr = this.batcharr;
      console.log(this.batcharr);
    },

    // 单个下载文件
    dwonloadfile(index, row) {
      window.location.href =
        "http://gateway.kuaiban.cn/talents-api/filelist/download?ids=" + row.id;
    },
    // 删除单个文件
    deletefile(index, row) {
      console.log(index, row);
      let that = this;
      this.tableData.splice(index, 1);

      that.fileimgarr.forEach(function (value, index, array) {
        console.log(value, "删除的文件");
        if (value.fileId == row.fileId) {
          console.log("shanshan");
          that.fileimgarr.splice(index, 1);
          that.showtableData.splice(index, 1);
        }
      });
      that.fileimgarr = that.fileimgarr;

      that.$forceUpdate();
      // let data = {
      //   filePath: row.filePath,
      //   fileId: row.fileId,
      // };
      let data = {
        id: row.id,
      };
      this.deleteinfo(data);
    },
    async deleteinfo(data) {
      let res = await this.Axios.post(`talents-api/filelist/delete`, data);
    },
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
      if (
        (type != "image/svg+xml" && size > 50)) {
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
    // 获取文件名字
    async getfilename() {
      let res = await this.Axios.get(
        `talents-api/filelist/queryFileListInFileId?fileIds=${this.imagearr}`
      );
      console.log(res, "获取文件名字");
      this.tableData = res.data.result;
    },
    // 批量下载文件
    async downloadbtach() {
      let that = this;
      let newallselect = this.allselect;
      console.log(newallselect, "我呢见");
      let arr = [];
      newallselect.forEach(function (value, index, array) {
        arr.push(value.id);
      });
      if (arr.length == 0) {
        this.$message({
          message: "请选择下载的文件",
          type: "warning",
        });
        return false;
      }
      console.log(arr, "数组数组");
      // let url="http://gateway.kuaiban.cn/talents-api/filelist/download?ids="+arr
      // console.log(url)
      window.location.href =
        "http://gateway.kuaiban.cn/talents-api/filelist/download?ids=" + arr;

      // console.log(this.downloadpaths,'下载的文件路径')
      // let res = await this.Axios.post(
      //   `talents-api/filelist/download?ids=${arr}`
      // );
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
    // 撤回外销
    widthdrawsales() {
      this.dialogFormVisible = true;
    },
    importint() {},
    // 人才列表改变页码
    changecurrent(val) {
      this.selectRuleform.pageNum = val - 1;
      console.log(this.page);
      this.currentPage4 = val;
      this.getpersonlist();
    },
    // 人才列表每页显示多少条
    changesize(e){
      this.selectRuleform.pageSize=e;
      this.getpersonlist()
    },
    //  选择岗位(筛选你条件)
    selectstation(e) {
      console.log(e);
      this.stationname = e;
      this.selectRuleform.postId = e;
      if (this.stationname != "") {
        this.isshowone = false;
        this.rankarr = [];
        this.selectRuleform.levelId = "";
        this.majorarr = [];
        this.selectRuleform.majorId = "";
        this.majorname = "";
        this.getrank(e);
        this.station.forEach((value) => {
          if (value.value == e) {
            if (value.label == "建造师") {
              this.certificatestatus = false;
            } else {
              this.certificatestatus = true;
            }
          }
        });
      } else {
        this.isshowone = true;
      }
    },
    clearselectstation(e) {
      this.certificatestatus = true;
      this.isshowone = true;
      this.isshowtwo = true;
    },
    // 选择等级（筛选条件）
    selectrank(e) {
      this.rankname = e;
      this.selectRuleform.levelId = e;
      if (this.rankname != "") {
        this.isshowtwo = false;
        this.majorarr = [];
        this.selectRuleform.majorId = "";
        this.majorname = "";
        this.getmajor(e);
      } else {
        this.isshowtwo = true;
      }
    },
    // 选择专业（筛选条件）
    selectmajor(e) {
      // this.majorname = e;
      this.selectRuleform.majorId = e;
    },

    // 选择发证年限
    selectcertifate(e){
       this.selectRuleform.ageLimit=e
    },
    // 选择创建时间
    selectcresteTime(e) {
      console.log(e);
      let arr = [];
      //  this.selectRuleform.createTime=time(e);
      let date1 = changetime(e[0]);
      console.log(date1);
      arr.push(date1);
      let date2 = changetime1(e[1]);
      arr.push(date2);
      this.selectRuleform.createTime = arr.join(",");

      console.log(this.selectRuleform.createTime, "创建时间");
    },
    //选择签发日期
    slectregisterdate(e) {
      this.selectRuleform.registerSignDate = time(e);
    },
    // 聘用周期
    selecthiredate(e) {
      this.ruleForm.signType = e;
      console.log(this.hireradio);
      // if(this.hireradio==1){
      //   this.hireradio=3
      // }
    },
    clickhiredate(e) {},

    // 添加付款批次
    addpayment() {
      console.log(3899348);
      let num = this.num;
      num++;
      this.num = num;
      let obj = {
        batch: "",
        price: "",
        payTime: "",
        status: "",
      };
      console.log(obj);
      this.paymentarr.push(obj);
      this.batcharr.push({});
      this.paymentarr = this.paymentarr;
      this.batcharr = this.batcharr;
      this.$forceUpdate();
    },
    // 减少付款批次
    reducepayment(item, index) {
      this.paymentarr.splice(index, 1);
      this.batcharr.splice(index + 1, 1);
    },
    // 删除付款批次
    async deleteitem(id) {
      let res = await this.Axios.get(`talents-api/paymentlist/delete?id=${id}`);
      console.log(47874478378);
    },
    // 单选和多选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      console.log(val, "全部选中");
      this.allselect = val;
    },
    selectstage(e) {
      this.ruleForm.isPay = e;
      if (e == 2) {
        this.stagemoney = true;
        this.stagepay = true;
      } else {
        this.stagemoney = false;
        this.stagepay = false;
      }
    },
  },
};
</script>

<style scoped>
@import url("./index.css");
</style>>

