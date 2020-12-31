<template>
    <div class="siyou_genjin">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>线索系统</el-breadcrumb-item>
            <el-breadcrumb-item @click.native="routersPaths(routerTitle)">
                <el-link :underline="false" type="primary">{{ routerTitle }}</el-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>线索详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="top_line"></div>
        <div class="genjin_box">
            <div class="genjin_header">
                <div class="genjin_header_left">
                    <div @click="phone_telimg()" class="img" v-if="bohaoLook">
                        <img alt="" src="../../../assets/qst/pnone_.png"/>
                    </div>
                    <div class="img_right">
                        <div class="top">
                            <div><span>{{ leads_details.contactName === "" ? "暂无" : leads_details.contactName }}</span>&nbsp;
                            </div>
                            <el-button @click="xiadan(rows)" size="mini" type="warning"
                                       v-if="xiadanLook && !showGonghai">下单
                            </el-button>
                        </div>
                        <div class="img_right_s" style=""><span>{{ company_details.companyName === "" ? "暂无" : company_details.companyName }}</span>
                        </div>
                        <div class="bottom">
                            <span>跟进人: {{ genjinName === "" ? "暂无" : genjinName }}</span>
                            <span>
                最后跟进时间:
                {{ follow_details.addTime }}</span
                            >
                        </div>
                    </div>
                </div>
                <div class="genjin_header_right">
                    <div class="right_top">
                        <p>标签 <span>(标签最多10个)</span></p>
                    </div>
                    <div class="right_content">
                        <el-tag
                                :closable="!showGonghai"
                                :disable-transitions="false"
                                :key="index"
                                :style="
                            tag.colour === ''
                              ? `color:#409EFF;border:#409EFF 1px solid;background: #fff;`
                              : `color:${tag.colour};border:${tag.colour} 0.1px solid;background: #fff;`
                          "
                                @close="handleClose(tag.labelId, !showGonghai)"
                                size="small"
                                v-for="(tag, index) in dynamicTags"
                        >
                            {{ tag.labelName }}
                        </el-tag>
                        <el-button @click="showInput" class="button-new-tag" size="mini" type="success"
                                   v-if="!showGonghai">添加
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="genjin_content">
                <el-button @click="lingqu" class="lingquDetails" size="mini" type="primary"
                           v-if="lingqulook && showGonghai">领取
                </el-button>
                <el-button @click.stop="add_genjin" class="genjin_button" size="mini" type="success" v-if="genjinLook">
                    添加跟进
                </el-button>
                <el-tabs @tab-click="handleClick" v-model="activeName1">
                    <el-tab-pane label="基本信息" name="基本信息">
                        <el-card class="box-card">
                            <div class="clearfix" slot="header">
                                <div>
                                    <span>线索信息</span>
                                    <span class="title_right">带 <span class="title_vio"> * </span>为必填项</span>
                                </div>
                                <el-button @click="submit_xiansuoEdit('ruleFormXiansuo')" size="mini" type="primary"
                                           v-if="!showGonghai"
                                >保存
                                </el-button>
                            </div>
                            <div class="card_content">
                                <div class="add_dialog">
                                    <div class="content_add">
                                        <el-form
                                                :disabled="showGonghai"
                                                :inline="true"
                                                :model="formAddXianSuo"
                                                :rules="ruleFormXiansuo"
                                                class="demo-form-inline"
                                                label-position="right"
                                                ref="ruleFormXiansuo"
                                        >
                                            <p>
                                                <span></span>线索来源
                                                <el-form-item label="" label-width="59px" size="small"
                                                              style="margin:0 0 0 26px ;">
                                                    <el-cascader :disabled="!get_select_add"
                                                                 :options="laiyuan_options"
                                                                 :props="listPropsLy"
                                                                 @change="laiyuanChange"
                                                                 clearable
                                                                 v-model="formAddXianSuo.leads.sourceId"
                                                    ></el-cascader>
                                                </el-form-item>
                                            </p>
                                            <div class="form_label_g" style="width: 50%;"></div>
                                            <p><span></span>基本信息</p>
                                            <div class="form_label_g" style="margin-left: 12px;">
                                                <div
                                                        :key="index"
                                                        class="form_label_s"
                                                        style="margin-bottom: 10px;"
                                                        v-for="(domain, index) in formAddXianSuo.contactList"
                                                >
                                                    <el-form-item label="联系方式" label-width="69px" size="small">
                                                        <el-select
                                                                @change="phone_rules(domain.contactValue)"
                                                                style="width: 88px;"
                                                                v-model="domain.contactType"
                                                        >
                                                            <el-option label="手机号" value="1"></el-option>
                                                            <el-option label="微信号" value="2"></el-option>
                                                            <el-option label="座机号" value="3"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item
                                                            :prop="'contactList.' + index + '.contactValue'"
                                                            :rules="[
                              {
                                required: true,
                                message: '请输入手机号码',
                                trigger: 'blur',
                              },
                              {validator: isMobileNumber, trigger: 'blur'},
                            ]"
                                                            size="small"
                                                            v-if="domain.contactType === '1'"
                                                    >
                                                        <el-input
                                                                @change="phone_rules(domain.contactValue)"
                                                                style="width: 116px;"
                                                                v-model="domain.contactValue"
                                                        ></el-input>
                                                    </el-form-item>
                                                    <el-form-item
                                                            :prop="'contactList.' + index + '.contactValue'"
                                                            :rules="[
                              {
                                required: true,
                                message: '请输入微信号',
                                trigger: 'blur',
                              },
                            ]"
                                                            size="small"
                                                            v-if="domain.contactType === '2'"
                                                    >
                                                        <el-input
                                                                @change="phone_rules(domain.contactValue)"
                                                                style="width: 116px;"
                                                                v-model="domain.contactValue"
                                                        ></el-input>
                                                    </el-form-item>
                                                    <el-form-item
                                                            :prop="'contactList.' + index + '.contactValue'"
                                                            :rules="[
                              {
                                required: true,
                                message: '请输入座机号码',
                                trigger: 'blur',
                              },
                              {validator: isTelOrFax, trigger: 'blur'},
                            ]"
                                                            size="small"
                                                            v-if="domain.contactType === '3'"
                                                    >
                                                        <el-input
                                                                @change="phone_rules(domain.contactValue)"
                                                                style="width: 116px;"
                                                                v-model="domain.contactValue"
                                                        ></el-input>
                                                    </el-form-item>
                                                    <el-form-item class="lianXiRenClass" label="联系人" label-width="46px"
                                                                  size="small" style="">
                                                        <el-input maxlength="20"
                                                                  v-model="domain.contactName"></el-input>
                                                    </el-form-item>
                                                    <el-form-item label="性别" label-width="39px" size="small">
                                                        <el-select style="width: 88px;" v-model="domain.sex">
                                                            <el-option label="男" value="0"></el-option>
                                                            <el-option label="女" value="1"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item label="公司职位" label-width="59px" size="small"
                                                                  style="margin-right:0;">
                                                        <el-select style="width: 116px;" v-model="domain.position">
                                                            <el-option
                                                                    :key="index"
                                                                    :label="val.label"
                                                                    :value="val.label"
                                                                    v-for="(val, index) in zwData"
                                                            ></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                            <p><span></span>企业信息</p>
                                            <div class="form_label_g ">
                                                <div class="form_label_s">
                                                    <el-form-item class="qiyexinxi_from"
                                                                  label="企业名称"
                                                                  label-width="69px"
                                                                  prop="company.companyName"
                                                                  size="small"
                                                                  style="margin-left: -10px;"
                                                    >
                                                        <el-autocomplete
                                                                :fetch-suggestions="querySearchAsync"
                                                                @change="changecom($event, 2)"
                                                                @input="inputChange($event,'ruleFormXiansuo')"
                                                                @select="handleSelect($event,2)"
                                                                clearable
                                                                placeholder="请输入企业名称"
                                                                ref="inputVal"
                                                                v-model.trim="formAddXianSuo.company.companyName"
                                                        ></el-autocomplete>
                                                    </el-form-item>
                                                    <el-form-item class="faren_from" label="法人" label-width="39px"
                                                                  size="small">
                                                        <el-input maxlength="20" show-word-limit
                                                                  v-model="formAddXianSuo.company.legalPerson"></el-input>
                                                    </el-form-item>
                                                </div>
                                                <div class="form_label_s">
                                                    <el-form-item class="suoshudiqu_form" label="登记状态"
                                                                  label-width="59px" size="small">
                                                        <el-select class="input_se"
                                                                   v-model="formAddXianSuo.company.registeredStatus">
                                                            <el-option
                                                                    :key="index"
                                                                    :label="val.label"
                                                                    :value="val.id"
                                                                    v-for="(val, index) in dengji_options"
                                                            ></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item class="suoshudiqu_form" label="企业类型"
                                                                  label-width="59px" size="small">
                                                        <el-select v-model="formAddXianSuo.company.companyType">
                                                            <el-option
                                                                    :key="index"
                                                                    :label="val.leixing_label"
                                                                    :value="val.leixing_val"
                                                                    v-for="(val, index) in leixing_options"
                                                            ></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item class="suoshudiqu_form" label="所属地区"
                                                                  label-width="59px" size="small">
                                                        <el-cascader
                                                                :props="listPropsSHDQ"
                                                                @change="handleChange1($event, 2)"
                                                                v-model="formAddXianSuo.leads.areaIdList"
                                                        ></el-cascader>
                                                    </el-form-item>
                                                </div>
                                                <div class="form_label_s">
                                                    <el-form-item class="suoshudiqu_form" label="人员规模"
                                                                  label-width="59px" size="small">
                                                        <el-select v-model="formAddXianSuo.company.staffSize">
                                                            <el-option
                                                                    :key="index"
                                                                    :label="val.label"
                                                                    :value="val.id"
                                                                    v-for="(val, index) in rygmoptions"
                                                            ></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item class="suoshudiqu_form" label="参保人数"
                                                                  label-width="59px" size="small">
                                                        <el-select v-model="formAddXianSuo.company.insuredNumber">
                                                            <el-option
                                                                    :key="index"
                                                                    :label="val.label"
                                                                    :value="val.id"
                                                                    v-for="(val, index) in rygmoptions"
                                                            ></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                    <el-form-item class="suoshudiqu_form" label="地图标点"
                                                                  label-width="59px" size="small">
                                                        <el-input :disabled="true" class="input-with-select"
                                                                  placeholder="点击按钮获取"
                                                                  style="width: 156px;"
                                                                  v-model="lng_lat.address"
                                                        >
                                                        </el-input>
                                                        <el-button @click="map_add_show" icon="el-icon-place"
                                                                   size="mini" type="primary"></el-button>
                                                    </el-form-item>
                                                </div>
                                                <div class="form_label_s">
                                                    <el-form-item label="注册资本" label-width="59px" size="small">
                                                        <el-input
                                                                @input="formAddXianSuo.company.registeredCapital=formAddXianSuo.company.registeredCapital.replace(/^(0+)|[^\d]+/g, '')"
                                                                class="zczbClass"
                                                                v-model="formAddXianSuo.company.registeredCapital"></el-input>
                                                        万元
                                                    </el-form-item>
                                                    <el-form-item class="zczbClassItem" label="实缴资本" label-width="59px"
                                                                  size="small">
                                                        <el-input
                                                                @input="formAddXianSuo.company.contributedCapital=formAddXianSuo.company.contributedCapital.replace(/^(0+)|[^\d]+/g, '')"
                                                                class="zczbClass"
                                                                v-model="formAddXianSuo.company.contributedCapital"></el-input>
                                                        万元
                                                    </el-form-item>
                                                    <el-form-item class="suoshuhangye_form" label="所属行业"
                                                                  label-width="59px" size="small">
                                                        <el-cascader
                                                                :options="hangYeData"
                                                                :props="listPropsHY"
                                                                @change="handleChanges"
                                                                v-model="formAddXianSuo.company.industryId"
                                                        ></el-cascader>
                                                    </el-form-item>
                                                </div>
                                                <div class="form_label_s">
                                                    <el-form-item class="suoshuhangye_form" label="成立日期"
                                                                  label-width="59px" size="small">
                                                        <el-date-picker
                                                                placeholder="选择日期"
                                                                type="date" v-model="formAddXianSuo.company.foundDate"
                                                                value-format="yyyy-MM-dd"
                                                        ></el-date-picker>
                                                    </el-form-item>
                                                    <el-form-item class="suoshuhangye_form" label="核准日期"
                                                                  label-width="59px" size="small">
                                                        <el-date-picker
                                                                placeholder="选择日期"
                                                                type="date"
                                                                v-model="formAddXianSuo.company.approvedDate"
                                                                value-format="yyyy-MM-dd"
                                                        ></el-date-picker>
                                                    </el-form-item>
                                                    <el-form-item class="suoshuhangye_form" label="营业期限"
                                                                  label-width="59px" size="small">
                                                        <el-select v-model="formAddXianSuo.company.businessTerm">
                                                            <el-option
                                                                    :key="index"
                                                                    :label="val.label"
                                                                    :value="val.id"
                                                                    v-for="(val, index) in yq_options"
                                                            ></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </div>
                                                <div class="form_label_s">
                                                    <el-form-item class="qiyexinxi_from" label="登记机关" label-width="59px"
                                                                  size="small">
                                                        <el-input
                                                                v-model="formAddXianSuo.company.registerOffice"></el-input>
                                                    </el-form-item>
                                                    <el-form-item class="qiyexinxi_from" label="注册地址" label-width="59px"
                                                                  size="small">
                                                        <el-input
                                                                v-model="formAddXianSuo.company.registeredAddress"></el-input>
                                                    </el-form-item>
                                                    <div class="zhankai_shouqi" v-show="!showGonghai">
                                                        <el-button @click="clickshowbut(1)" style="color:#32AFF0;"
                                                                   type="text" v-if="showbut == 0">
                                                            收起 <i class="el-icon-arrow-up"></i>
                                                        </el-button>
                                                        <el-button @click="clickshowbut(0)" style="color:#32AFF0;"
                                                                   type="text" v-if="showbut != 0">
                                                            展开 <i class="el-icon-arrow-down"></i>
                                                        </el-button>
                                                    </div>
                                                </div>
                                                <el-collapse-transition>
                                                    <div class="zhankai_shouqi_hid" v-show="show">
                                                        <el-row class="texareaNone">
                                                            <el-form-item label="经营范围" label-width="59px" size="small">
                                                                <el-input :autosize="{ minRows: 1, maxRows: 4}"
                                                                          maxlength="100"
                                                                          placeholder="经营范围"
                                                                          resize="none"
                                                                          show-word-limit
                                                                          type="textarea"
                                                                          v-model="formAddXianSuo.company.businessScope"
                                                                ></el-input>
                                                            </el-form-item>
                                                        </el-row>
                                                        <el-row class="texareaNone">
                                                            <el-form-item label="项目信息" label-width="59px" size="small">
                                                                <el-input :autosize="{ minRows: 1, maxRows: 4}"
                                                                          maxlength="100"
                                                                          placeholder="项目信息"
                                                                          resize="none"
                                                                          show-word-limit
                                                                          type="textarea"
                                                                          v-model="formAddXianSuo.company.projectInfo"
                                                                ></el-input>
                                                            </el-form-item>
                                                        </el-row>
                                                        <el-row class="texareaNone">
                                                            <el-form-item label="财务状况" label-width="59px" size="small">
                                                                <el-input :autosize="{ minRows: 1, maxRows: 4}"
                                                                          maxlength="100"
                                                                          placeholder="财务状况"
                                                                          resize="none"
                                                                          show-word-limit
                                                                          type="textarea"
                                                                          v-model="formAddXianSuo.company.financialCondition"
                                                                ></el-input>
                                                            </el-form-item>
                                                        </el-row>
                                                        <el-row>
                                                            <el-form-item class="foem_table_button" label="资质资格"
                                                                          label-width="59px" size="small">
                                                                <el-button
                                                                        @click="add_table_1"
                                                                        class="button_s"
                                                                        icon="el-icon-circle-plus-outline"
                                                                        size="mini"
                                                                        type="primary"
                                                                ></el-button>
                                                                <div style="width: 100%;">
                                                                    <el-table
                                                                            :cell-style="cellStyle"
                                                                            :data="formAddXianSuo.qualificationList"
                                                                            :header-cell-style="{
                                      'background-color': '#F3F6FD',
                                      color: '#606266',
                                      padding: '1px 0',
                                      'text-align': 'center',
                                    }"
                                                                            :row-key="row_key"
                                                                            border
                                                                            class="form1"
                                                                            highlight-current-row
                                                                            ref="tablesZiZzhi"
                                                                            size="mini"
                                                                            stripe
                                                                            tooltip-effect="dark"
                                                                    >
                                                                        <el-table-column :resizable="false"
                                                                                         align="center" label="序号"
                                                                                         width="50">
                                                                            <template slot-scope="scope">
                                                                                <span>{{ scope.$index + 1 }} </span>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false" label="资质类型"
                                                                                         prop="qualificationType">
                                                                            <template slot-scope="scope">
                                                                                <el-input class="require_des"
                                                                                          v-model="scope.row.qualificationType"></el-input>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false"
                                                                                         label="资质证书号"
                                                                                         prop="qualificationNumber">
                                                                            <template slot-scope="scope">
                                                                                <el-input class="require_des"
                                                                                          v-model="scope.row.qualificationNumber"></el-input>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false" label="资质名称"
                                                                                         prop="qualificationNames">
                                                                            <template slot-scope="scope">
                                                                                <el-input class="require_des"
                                                                                          v-model="scope.row.qualificationNames"></el-input>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column label="发证日期" prop="openDate">
                                                                            <template slot-scope="scope">
                                                                                <el-date-picker
                                                                                        clearable
                                                                                        style="width: 100%;"
                                                                                        type="date"
                                                                                        v-model="scope.row.openDate"
                                                                                        value-format="yyyy-MM-dd"
                                                                                ></el-date-picker>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false"
                                                                                         label="证书有效期" prop="validity">
                                                                            <template slot-scope="scope">
                                                                                <el-date-picker
                                                                                        clearable
                                                                                        style="width: 100%;"
                                                                                        type="date"
                                                                                        v-model="scope.row.validity"
                                                                                        value-format="yyyy-MM-dd"
                                                                                ></el-date-picker>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false" label="发证机关"
                                                                                         prop="issueUnit">
                                                                            <template slot-scope="scope">
                                                                                <el-input class="require_des" clear-icon
                                                                                          v-model="scope.row.issueUnit"></el-input>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false" label="操作"
                                                                                         width="89">
                                                                            <template slot-scope="scope">
                                                                                <el-button
                                                                                        @click="delete_table_1(scope.row, scope.$index)"
                                                                                        style="color:red;marginLeft:6px;"
                                                                                        type="text"
                                                                                >
                                                                                    删除
                                                                                </el-button>
                                                                            </template>
                                                                        </el-table-column>
                                                                    </el-table>
                                                                </div>
                                                            </el-form-item>
                                                        </el-row>
                                                        <el-row>
                                                            <el-form-item class="foem_table_button" label="注册人员"
                                                                          label-width="59px" size="small">
                                                                <el-button
                                                                        @click="add_table_2"
                                                                        class="button_s"
                                                                        icon="el-icon-circle-plus-outline"
                                                                        size="mini"
                                                                        type="primary"
                                                                ></el-button>
                                                                <div style="width: 100%;">
                                                                    <el-table
                                                                            :cell-style="cellStyle"
                                                                            :data="formAddXianSuo.certList"
                                                                            :header-cell-style="{
                                      'background-color': '#F3F6FD',
                                      color: '#606266',
                                      padding: '1px 0',
                                      'text-align': 'center',
                                    }"
                                                                            :row-key="row_key"
                                                                            border
                                                                            class="form1"
                                                                            highlight-current-row
                                                                            ref="tablezhuce"
                                                                            size="mini"
                                                                            stripe
                                                                            tooltip-effect="dark"
                                                                    >
                                                                        <el-table-column :resizable="false"
                                                                                         align="center" label="序号"
                                                                                         width="50">
                                                                            <template slot-scope="scope">
                                                                                <span>{{ scope.$index + 1 }} </span>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false" label="姓名"
                                                                                         prop="name">
                                                                            <template slot-scope="scope">
                                                                                <el-input class="require_des"
                                                                                          v-model="scope.row.name"></el-input>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false" label="注册类别"
                                                                                         prop="certType">
                                                                            <template slot-scope="scope">
                                                                                <el-input class="require_des"
                                                                                          v-model="scope.row.certType"></el-input>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column label="身份证"
                                                                                         prop="identityCard">
                                                                            <template slot-scope="scope">
                                                                                <el-input class="require_des"
                                                                                          v-model="scope.row.identityCard"></el-input>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false" label="注册号"
                                                                                         prop="registryNumber">
                                                                            <template slot-scope="scope">
                                                                                <el-input class="require_des"
                                                                                          v-model="scope.row.registryNumber"></el-input>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false" label="注册专业"
                                                                                         prop="major">
                                                                            <template slot-scope="scope">
                                                                                <el-input class="require_des"
                                                                                          v-model="scope.row.major"></el-input>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false" label="内容"
                                                                                         prop="content">
                                                                            <template slot-scope="scope">
                                                                                <el-input style="height: 100%;"
                                                                                          type="textarea"
                                                                                          v-model="scope.row.content"></el-input>
                                                                            </template>
                                                                        </el-table-column>
                                                                        <el-table-column :resizable="false"
                                                                                         fixed="right" label="操作"
                                                                                         width="89">
                                                                            <template slot-scope="scope">
                                                                                <el-button
                                                                                        @click="delete_table_2(scope.row, scope.$index)"
                                                                                        style="color:red;marginLeft:6px;"
                                                                                        type="text"
                                                                                >
                                                                                    删除
                                                                                </el-button>
                                                                            </template>
                                                                        </el-table-column>
                                                                    </el-table>
                                                                </div>
                                                            </el-form-item>
                                                        </el-row>
                                                        <el-row>
                                                            <el-form-item class="form_forms_item texareaNone"
                                                                          label="知识产权" label-width="59px" size="small">
                                                                <div class="form_items_display">
                                                                    <el-form-item class="item_form" label="商标"
                                                                                  label-width="31px" size="mini">
                                                                        <el-input placeholder="商标"
                                                                                  v-model="formAddXianSuo.company.propertyBrand"></el-input>
                                                                    </el-form-item>
                                                                    <el-form-item class="item_form" label="发明专利"
                                                                                  label-width="55px" size="mini">
                                                                        <el-input placeholder="发明专利"
                                                                                  v-model="formAddXianSuo.company.propertyInvent"></el-input>
                                                                    </el-form-item>
                                                                    <el-form-item class="item_form" label="外观专利"
                                                                                  label-width="55px" size="mini">
                                                                        <el-input placeholder="外观专利"
                                                                                  v-model="formAddXianSuo.company.propertyDesign"></el-input>
                                                                    </el-form-item>
                                                                    <el-form-item class="item_form" label="新型专利"
                                                                                  label-width="55px" size="mini">
                                                                        <el-input placeholder="新型专利"
                                                                                  v-model="formAddXianSuo.company.propertyPattern"></el-input>
                                                                    </el-form-item>
                                                                    <el-form-item class="item_form" label="软件著作"
                                                                                  label-width="55px" size="mini">
                                                                        <el-input placeholder="软件著作"
                                                                                  v-model="formAddXianSuo.company.propertySoftware"></el-input>
                                                                    </el-form-item>
                                                                </div>
                                                            </el-form-item>
                                                        </el-row>
                                                        <el-row>
                                                            <el-form-item label="资质认定" label-width="59px" size="small">
                                                                <el-checkbox-group
                                                                        v-model="formAddXianSuo.company.qualifications">
                                                                    <el-checkbox :key="index" :label="city"
                                                                                 :value="city"
                                                                                 v-for="(city, index) in cities">
                                                                        {{ city }}
                                                                    </el-checkbox>
                                                                </el-checkbox-group>
                                                            </el-form-item>
                                                        </el-row>
                                                        <el-row>
                                                            <el-form-item class="form_forms_item" label="项目申报"
                                                                          label-width="59px" size="small">
                                                                <el-checkbox-group
                                                                        v-model="formAddXianSuo.company.projectApplications">
                                                                    <el-checkbox :key="index" :label="city"
                                                                                 :value="city"
                                                                                 v-for="(city, index) in cities_shenbao">
                                                                        {{ city }}
                                                                    </el-checkbox>
                                                                </el-checkbox-group>
                                                            </el-form-item>
                                                            <div class="check-boxs_right texareaNone">
                                                                <el-form-item label="项目备注" label-width="59px"
                                                                              size="small">
                                                                    <el-input :autosize="{ minRows: 1, maxRows: 4}"
                                                                              maxlength="100"
                                                                              placeholder="项目备注"
                                                                              resize="none"
                                                                              show-word-limit
                                                                              type="textarea"
                                                                              v-model="formAddXianSuo.company.remark"
                                                                    ></el-input>
                                                                </el-form-item>
                                                            </div>
                                                        </el-row>
                                                    </div>
                                                </el-collapse-transition>
                                            </div>
                                        </el-form>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane class="czrzBox" label="跟进日志" name="跟进日志">
                        <el-card class="box-card">
                            <!--<div class="clearfix" slot="header">-->
                            <!--<span>备注明细</span>-->
                            <!--<span class="title_right">请准确添加您的客户备注,点击听取录音</span>-->
                            <!--</div>-->
                            <div class="card_content">
                                <el-timeline>
                                    <div class="infinite-list-wrapper">
                                        <div infinite-scroll-disabled="disabled" v-infinite-scroll="load">
                                            <el-timeline-item
                                                    :color="val.color"
                                                    :key="index"
                                                    :timestamp="val.addTime"
                                                    icon="el-icon-more"
                                                    placement="top"
                                                    size="large"
                                                    type="primary"
                                                    v-for="(val, index) in activities"
                                            >
                                                <el-card class="card_time">
                                                    <!--<el-link :underline="false" class="time_lineBbianji" type="success">{{ val.updateTime }} 被编辑</el-link>-->
                                                    <!--<el-link type="primary" class="time_lineBianji">编辑</el-link>-->
                                                    <!--<el-link @click="chakangengduo_time(val.userId)" class="time_linekangengduo" type="primary">查看更多</el-link>-->
                                                    <!--电话记录-->
                                                    <div v-if="val.followType === 0">
                                                        <div class="title"><span>{{ val.userName }}</span> 更新了 电话记录
                                                        </div>
                                                        <p>
                                                            通话时长:
                                                            <span v-text="s_to_hs(val.callTime)"></span>
                                                            <span class="spanWav">
                                                                <audio ref="audio" :src="audioUrl"></audio>
                                                                <el-button @click="clickWav(audioUrl)" size="mini" type="success" circle :icon="eliconoff"></el-button>
                                                            </span>
                                                        </p>
                                                        <p>
                                                            意向度:{{
                                                            val.intentionLevel === 0 ? "无意向" : val.intentionLevel === 1
                                                            ? "一般意向" : "高度意向"
                                                            }}
                                                        </p>
                                                        <p>意向服务:{{ val.intentionName === "" ? "无" : val.intentionName
                                                            }}</p>
                                                        <p>
                                                            电话状态:
                                                            <span v-if="val.callStatus === 1">空号</span>
                                                            <span v-else-if="val.callStatus === 2">错号</span>
                                                            <span v-else-if="val.callStatus === 3">未接通</span>
                                                            <span v-else-if="val.callStatus === 4">可接通</span>
                                                            <span v-else>未拨打</span>
                                                        </p>
                                                        <div class="title">备注:</div>
                                                        {{ val.followRecords === "" ? "无" : val.followRecords }}
                                                    </div>
                                                    <!--备注-->
                                                    <div v-if="val.followType === 1">
                                                        <div class="title">
                                                            <span>{{ val.userName }}</span> 更新了 跟进记录
                                                        </div>
                                                        <p>
                                                            意向度:
                                                            {{ val.intentionLevel === 0 ? "无意向" : val.intentionLevel ===
                                                            1 ? "一般意向" : "高度意向" }}
                                                        </p>
                                                        <p>意向服务:{{ val.intentionName === "" ? "无" : val.intentionName
                                                            }}</p>
                                                        <div class="title">备注:</div>
                                                        {{ val.followRecords === "" ? "无" : val.followRecords }}
                                                    </div>
                                                    <!--拜访记录-->
                                                    <div v-if="val.followType === 2">
                                                        <div class="title">
                                                            { <span>{{ val.userName }}</span> 更新了 拜访记录
                                                        </div>
                                                        <p>
                                                            意 向 度:
                                                            {{ val.intentionLevel === 0 ? "无意向" : val.intentionLevel ===
                                                            1 ? "一般意向" : "高度意向" }}
                                                        </p>
                                                        <p>意向服务:{{ val.intentionName === "" ? "无" : val.intentionName
                                                            }}</p>
                                                        <div class="title">备注:</div>
                                                        {{ val.followRecords === "" ? "无" : val.followRecords }}
                                                    </div>
                                                    <!--补充记录-->
                                                    <div v-if="val.followType === 3">
                                                        <div class="title">
                                                            <span>{{ val.userName }}</span> 更新了 补充记录
                                                        </div>
                                                        {{ val.followRecords === "" ? "无" : val.followRecords }}
                                                    </div>
                                                </el-card>
                                            </el-timeline-item>
                                        </div>
                                        <p style="text-align: center" v-if="loading">加载中...</p>
                                        <p style="text-align: center" v-if="noMore">没有更多了</p>
                                    </div>
                                </el-timeline>
                            </div>
                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane class="czrzBox" label="操作日志" name="操作日志">
                        <el-card class="box-card">
                            <!--<div class="clearfix" slot="header">-->
                            <!--<span class="title_right">请准确添加您的客户备注,点击听取录音</span>-->
                            <!--</div>-->
                            <div class="card_content">
                                <el-timeline>
                                    <div class="infinite-list-wrapper">
                                        <div :infinite-scroll-disabled="disabled2" infinite-scroll-immediate="true"
                                             v-infinite-scroll="load2">
                                            <el-timeline-item
                                                    :color="val.color"
                                                    :key="index"
                                                    :timestamp="val.addTime"
                                                    icon="el-icon-more"
                                                    placement="top"
                                                    size="large"
                                                    type="primary"
                                                    v-for="(val, index) in activities2"
                                            >
                                                <el-card class="card_time">
                                                    <!--<el-link :underline="false" class="time_lineBbianji" type="success">{{ val.updateTime }} 更新</el-link>-->
                                                    <!--添加线索-->
                                                    <div v-if="val.operationType===1">
                                                        <div class="title">
                                                            <span>{{ val.userName }}</span> 添加 <span>{{val.operationDescription}}</span>
                                                        </div>
                                                    </div>
                                                    <!--修改线索-->
                                                    <div v-if="val.operationType===2">
                                                        <div class="title">
                                                            <span style="font-weight: 600">{{ val.userName }}</span> 修改
                                                            <span>{{val.operationDescription}}</span>
                                                            {{val.valueFieldShow}} <span style="color: #303133;"> {{val.valueBeginShow}}</span>
                                                            改为 <span> {{val.valueAfterShow}}</span>

                                                        </div>
                                                    </div>
                                                    <!--删除线索-->
                                                    <div v-if="val.operationType===3">
                                                        <div class="title">
                                                            <span>{{ val.userName }}</span> 删除 <span>{{val.operationDescription}}</span>
                                                        </div>
                                                    </div>
                                                    <!--指派线索-->
                                                    <div v-if="val.operationType===4">
                                                        <div class="title">
                                                            <span>{{ val.userName }}</span> 指派 <span>{{val.operationDescription}}</span>
                                                            跟进人 <span>{{val.valueBeginShow}}</span>改为 <span>{{val.valueAfterShow}}</span>
                                                        </div>
                                                    </div>
                                                    <!--添加标签-->
                                                    <div v-if="val.operationType===11">
                                                        <div class="title">
                                                            <span>{{ val.userName }}</span> 添加 <span>{{val.operationDescription}} </span>
                                                            <span>{{val.valueAfterShow}} </span>
                                                        </div>
                                                    </div>
                                                    <div v-if="val.operationType===12">
                                                        <div class="title">
                                                            <span>{{ val.userName }}</span> 删除 <span>{{val.operationDescription}} </span>
                                                            <span>{{val.valueAfterShow}} </span>
                                                        </div>
                                                    </div>
                                                </el-card>
                                            </el-timeline-item>
                                        </div>
                                        <p style="text-align: center;margin-bottom: 20px" v-if="loading2">加载中...</p>
                                        <p style="text-align: center" v-if="noMore2">没有更多了</p>
                                    </div>
                                </el-timeline>
                            </div>
                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane class="czrzBox" label="关联线索" name="关联线索">
                        <div class="table_el">
                            <el-table
                                    :cell-style="cellStyle"
                                    :data="tableDataGl"
                                    :header-cell-style="table_heard_style"
                                    :row-key="row_key"
                                    border
                                    class="form1"
                                    highlight-current-row
                                    ref="table"
                                    size="mini"
                                    stripe
                                    style="width: 100%"
                            >
                                <!--<el-table-column :resizable="false" align="center" label="序号" width="50">-->
                                <!--<template slot-scope="scope"-->
                                <!--&gt;<span>{{ scope.$index + 1 }} </span></template-->
                                <!--&gt;-->
                                <!--</el-table-column>-->
                                <!--循环表头-->
                                <el-table-column
                                        :key="index"
                                        :label="item.fieldName"
                                        :property="item.field"
                                        :width="item.fieldName === '联系方式' ? '130px' : item.fieldName === '联系人' ?'70px':item.fieldName === '有无资质' ?'70px':item.fieldName === '意向度' ?'70px':item.fieldName === '跟进人' ?'70px':item.fieldName === '电话状态' ?'70px':item.fieldName === '创建人' ?'70px':item.fieldName === '最近沟通' ?'132px':item.fieldName === '创建日期' ?'132px':''"
                                        v-for="(item, index) in tableHead"
                                >
                                    <template slot-scope="scope">
                                        <!--联系人-->
                                        <span v-if="item.fieldName === '联系人'">
                                 {{ scope.row.contactName === "" ? "--" : scope.row.contactName }}
                              </span>
                                        <!--联系方式-->
                                        <span v-else-if="item.fieldName === '联系方式'">
                      <div style="cursor: pointer;display: flex;justify-content: flex-start">
                           <span v-if="scope.row.contactType === 1">
                          <span @click="phone_tel(scope.row, scope.row.contactValue)" class="table_span"
                                v-if="bohaoLook">
                            <img alt="" src="../../../assets/qst/pnone_.png"/>
                          </span>
                              <el-tooltip class="item" content="线索详情" effect="dark" placement="right-start">
                          <el-link @click="router_to(scope.row)" class="styleClassLink1">
                            {{ scope.row.contactValue !== "" ? scope.row.contactValue : "" }}
                          </el-link>
                              </el-tooltip>
                        </span>
                           <span v-if="scope.row.contactType === 3">
                             <span @click="phone_tel(scope.row, scope.row.contactValue)" class="table_span"
                                   v-if="bohaoLook">
                               <img alt="" src="../../../assets/qst/pnone_.png"/>
                             </span>
                              <el-tooltip class="item" content="线索详情" effect="dark" placement="right-start">
                             <el-link @click="router_to(scope.row)" class="styleClassLink1">
                               {{ scope.row.contactValue !== "" ? scope.row.contactValue : "" }}
                             </el-link>
                              </el-tooltip>
                           </span>
                           <span v-if="scope.row.contactType === 2">
                             <span class="table_span" v-if="bohaoLook">
                               <img alt="" src="../../../assets/qst/wx_1.png"/>
                             </span>
                              <el-tooltip class="item" content="线索详情" effect="dark" placement="right-start">
                             <el-link @click="router_to(scope.row)" class="styleClassLink1">
                               {{ scope.row.contactValue }}
                             </el-link>
                              </el-tooltip>
                           </span>
                      </div>
                    </span>
                                        <!--最近沟通-->
                                        <span v-else-if="item.fieldName === '最近沟通'">
                      <span class="cursorLink" v-if="scope.row.followType === 0">{{ scope.row.followTime }}</span>
                      <el-link :underline="false" class="cursorLink" type="success"
                               v-else-if="scope.row.followType === 1">{{ scope.row.followTime }} </el-link>
                      <span v-if="scope.row.followTime === ''">{{ `--` }}</span>
                    </span>
                                        <!--资质情况-->
                                        <span v-else-if="item.fieldName === '有无资质'">
                      <div v-if="scope.row.qualificationStatus === 1">
                        <span>有</span>
                      </div>
                      <div v-else><span>无</span></div>
                    </span>
                                        <!--意向度-->
                                        <span v-else-if="item.fieldName === '意向度'">
                      <span>{{
                        scope.row.intentionLevel === 1
                          ? "一般意向"
                          : scope.row.intentionLevel === 0
                          ? "无意向"
                          : scope.row.intentionLevel === 2
                          ? "高度意向"
                          : "未知"
                      }}</span>
                    </span>
                                        <!--电话状态-->
                                        <span v-else-if="item.fieldName === '电话状态'">
                      <span v-if="scope.row.callStatus === 1">空号</span>
                      <span v-else-if="scope.row.callStatus === 2">错号</span>
                      <span v-else-if="scope.row.callStatus === 3">未接通</span>
                      <span v-else-if="scope.row.callStatus === 4">可接通</span>
                      <span v-else>未拨打</span>
                    </span>
                                        <!--否则-->
                                        <span v-else>{{ scope.row[scope.column.property] === "" ? "--" : scope.row[scope.column.property] }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!--拜访记录-->
        <el-dialog :close-on-click-modal="false" :visible.sync="addBaiFang_dialog" title="添加拜访记录">
            <el-form :model="addBaifang_form" label-position="left" label-width="114px" ref="form">
                <div class="baifang_dialog">
                    <div class="baifang_dialog_header">
                        <div class="baifang_header_left">
                            <el-form-item label="企业名称">
                                <span>企业名称</span>
                            </el-form-item>
                            <el-form-item label="所在地区">
                                <span>所在地区</span>
                            </el-form-item>
                        </div>
                        <div class="baifang_header_right">
                            <el-form-item label="联系人">
                                <span>联系人</span>
                            </el-form-item>
                            <el-form-item label="拜访时间">
                                <span>拜访时间</span>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="baifang_dialog_content">
                        <div class="baifang_content_">
                            <div class="baifang_content_left">
                                <el-form-item label="签到时间">
                                    <span>签到时间</span>
                                </el-form-item>
                                <el-form-item label="签到照片">
                                    <!--<el-upload-->
                                    <!--:on-preview="handlePictureCardPreview"-->
                                    <!--:on-remove="handleRemove"-->
                                    <!--action="https://jsonplaceholder.typicode.com/posts/"-->
                                    <!--limit="1"-->
                                    <!--list-type="picture-card">-->
                                    <!--<i class="el-icon-plus"></i>-->
                                    <!--</el-upload>-->
                                    <div class="img_baifang">
                                        <img alt="" src=""/>
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="baifang_content_right">
                                <el-form-item label="签退时间">
                                    <span>签退时间</span>
                                </el-form-item>
                                <el-form-item label="签退照片">
                                    <!--<el-upload-->
                                    <!--:on-preview="handlePictureCardPreview"-->
                                    <!--:on-remove="handleRemove"-->
                                    <!--action="https://jsonplaceholder.typicode.com/posts/"-->
                                    <!--limit="1"-->
                                    <!--list-type="picture-card">-->
                                    <!--<i class="el-icon-plus"></i>-->
                                    <!--</el-upload>-->
                                    <!--<el-dialog :visible.sync="dialogVisible">-->
                                    <!--<img :src="dialogImageUrl" alt="" width="100%">-->
                                    <!--</el-dialog>-->
                                    <div class="img_baifang">
                                        <img alt="" src=""/>
                                    </div>
                                </el-form-item>
                            </div>
                        </div>
                        <el-form-item label="跟进内容">
                            <el-input :disabled="disables" placeholder="请填写跟进内容" type="textarea"
                                      v-model="addBaifang_form.jilu">
                            </el-input>
                        </el-form-item>
                    </div>
                    <!--<div class="baifang_footer">-->
                    <!--<el-form-item class="info_button">-->
                    <!--<el-button @click="baifanfSubmit" type="primary" v-if="!disables">提 交</el-button>-->
                    <!--</el-form-item>-->
                    <!--</div>-->
                </div>
            </el-form>
            <span class="dialog-footer" slot="footer">
        <el-button @click="baifanfSubmit" type="primary" v-if="!disables">提 交</el-button>
      </span>
        </el-dialog>
        <!--下单-->
        <xia-dan :companyNamePush="companyNamePush" :leadsId="leadId" :xiadan_dalig="xiadan_dalig"
                 :yxGenJinData="yxGenJinData" @xiadanNo="xiadanNo"></xia-dan>
        <!--钉办拨号系统-->
        <xiansuo-bohao
                :bohao_dialog="bohao_dialog" :change_show_radio="change_show_radio"
                :change_show_radio2="change_show_radio2"
                :phoneTelData="phoneTelData" :rowData="rowData"
                :siyouBohao="siyouBohao" :userCheckJIludata="userCheckJIludata" :yixData="yixData"
                :yxGenJinData="yxGenJinData"
                @radio_change="radio_change" @statusRadio="statusRadio"
                @updateUserData="updateUserData"></xiansuo-bohao>
        <!--添加备注-->
        <xiansuo-addgenjin :change_show_radio="change_show_radio" :genjin_dialog="genjin_dialog" :leadsId="leadId"
                           :yixData="yixData" :yxGenJinData="yxGenJinData" @genJinFunc="genJinFunc" @gjClose="gjClose"
                           @radio_change="radio_change">
        </xiansuo-addgenjin>
        <!--添加标签-->
        <el-dialog :close-on-click-modal="false" :visible.sync="addBiaoQian_dialig" title="添加标签" width="25%">
            <div class="zidingyi_dialog">
                <el-form :inline="true" :model="form_data_zidingyi" size="small">
                    <el-form-item label="标签">
                        <el-cascader
                                :options="options_biaoqian"
                                :props="listPropss"
                                :show-all-levels="false"
                                @change="change_biaoqian(form_data_zidingyi.value)"
                                v-model="form_data_zidingyi.value"
                        ></el-cascader>
                    </el-form-item>
                </el-form>
            </div>
            <span class="dialog-footer" slot="footer">
        <el-button @click="addBiaoQian_dialig = false" size="mini">取 消</el-button>
        <el-button @click="biaoqian_Submit" size="mini" type="primary">确 认</el-button>
      </span>
        </el-dialog>
        <!--地图选点-->
        <xiansuo-mapselect :addMap_dialog="addMap_dialog" :jd="lng_lat.longitude" :wd="lng_lat.latitude"
                           @mapClose="mapClose" @toMapVal="toMapVal">
        </xiansuo-mapselect>
        <!--提示-->
        <el-dialog :close-on-click-modal="false" :show-close="false" :visible.sync="tips_dalig" title="提示" width="25%">
            <p style="line-height: 20px">当前输入企业名称不存在，请选择 修改 企业名称或 创建 新企业信息并关联!</p>
            <span class="dialog-footer" slot="footer">
               <el-tooltip class="item" content="修改当前线索关联的企业名称" effect="dark" placement="top">
                  <el-button @click="tips_dalig=false" size="mini">修改</el-button>
               </el-tooltip>
              <el-tooltip class="item" content="即创建新企业信息并关联当前线索" effect="dark" placement="top">
                  <el-button @click="companyChunagJian" size="mini" type="primary">创建</el-button>
               </el-tooltip>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import myMixin from "../../../assets/js/minx/xiansuo";
    import tree from "../../../components/tree/tree";
    import xiaDan from "../../../components/xiansuoxiadan"
    import xiansuoAddgenjin from "../../../components/xiansuoAddgenjin"
    import xiansuoMapselect from "../../../components/xiansuomapselect"
    import xiansuoBohao from "../../../components/xiansuobohao"
    //百度地图
    import {
        BaiduMap,
        BmAutoComplete,
        BmCircle,
        BmControl,
        BmInfoWindow,
        BmLabel,
        BmLocalSearch,
        BmMarker,
        BmMarkerClusterer,
        BmNavigation,
        BmScale,
        BmView,
    } from "vue-baidu-map";

    export default {
        name: "siyou_genjin",
        mixins: [myMixin],
        props: [],
        options: [],
        components: {
            BaiduMap,
            BmScale,
            BmNavigation,
            BmMarkerClusterer,
            BmMarker,
            BmInfoWindow,
            BmLabel,
            BmCircle,
            BmLocalSearch,
            BmAutoComplete,
            BmControl,
            BmView,
            tree, xiaDan, xiansuoAddgenjin, xiansuoMapselect, xiansuoBohao
        },
        data() {
            return {
                audioUrl: 'static/audio/notify.wav', // 声音源
                eliconoff:'el-icon-turn-off-microphone',/*el-icon-microphone*/
                companyNamePush: '',
                itemsData: null,
                siyouBohao: true,
                tips_dalig: false,
                routerTitle: "",
                yxGenJinData: [],
                listHover: [],
                tableDataGl: [],
                rowData: {},
                pageNum: 0,
                pageNum2: 0,
                pageSize: 4,
                totalPages: "" /*总页数*/,
                totalPages2: "" /*总页数*/,
                status_tree: "GJ",
                rows: {},
                leadId: "" /*路由参数*/,
                xiansuo_Id: "" /*路由参数*/,
                MapKeyword: "",
                location: "",
                rowNum: 1 /*表格index*/,
                rowNum2: 1 /*表格index*/,
                districtType: 0, //行政区域
                searchParams: {
                    regions: 0, //区域编号
                    proType: 0, //项目类型
                    proCode: "", //项目编号
                },
                markers: [],
                infoWindow: {
                    show: false,
                    info: {}
                },
                oewrID: '',
                activeName: "",
                leftHeight: "540px",
                containerHeight: "700px",
                map: {
                    width: "100%",
                    height: "100%",
                    padding: "0 20px 20px 0",
                    center: {lng: 117.2157, lat: 39.080326},
                    zoom: 12,
                },
                laiyuan_options: [],
                options_mblx: [] /*模板类型*/,
                value: "",
                list: [] /*树形控件列表*/,
                dynamicTags: [],
                inputVisible: false,
                inputValue: "",
                activeName1: "基本信息",
                addBaifang_form: {
                    jilu: "",
                },
                listPropss: {
                    value: "labelId",
                    label: "name",
                    children: "children",
                    expandTrigger: "hover",
                },
                form_data_zidingyi: {
                    value: "",
                },
                data: [],
                options_biaoqian: [],
                activities: [],
                activities2: [],
                tableData: [] /*表格数据*/,
                tableData3: [] /*表格数据*/,
                tag_lists: [],
                checked1: true,
                checked2: true,
                checked: true,
                loading: false,
                loading2: false,
                showGonghai: false,
                disables: false,
                change_show_radio2: true,
                change_show_radio: true,
                genjin_dialog: false,
                addBaiFang_dialog: false,
                dialogImageUrl: "",
                xiadan_dalig: false,
                dialogVisible: false,
                bohao_dialog: false,
                addBiaoQian_dialig: false,
                addMap_dialog: false /*地图选点*/,
                show: false /*展开收起*/,
                showbut: 1 /*展开收起*/,
                button_status_add: true,
                button_status_del: false,
                rules: {},
                rulesXiansuo: {},
                cities: ["知识产权贯标", "高新技术企业认定", "两化融合贯标", "雏鹰", "瞪羚", "国家科小", "股改", "新三板", "OTC"],
                cities_shenbao: ["科委项目", "工信局项目", "商委项目", "区级项目"],
                company_details: {
                    companyName: "",
                } /*企业信息*/,
                follow_details: {
                    addTime: "暂无",
                } /*跟进信息*/,
                leads_details: {
                    contactName: "",
                } /*线索信息*/,
                genjinName: "暂无" /*跟进人*/,
                companyId: "" /*公司id*/,
                userId: "" /*用户id*/,
                get_select_add: false,
                get_details_look: false,
                xiadanLook: false,
                genjinLook: false,
                lingqulook: false,
                bohaoLook: false
            };
        },
        computed: {
            noMore() {
                return this.pageNum >= this.totalPages;
            },
            noMore2() {
                return this.pageNum2 >= this.totalPages2;
            },
            disabled() {
                return this.loading || this.noMore;
            },
            disabled2() {
                return this.loading2 || this.noMore2;
            },
        },
        watch: {
            'formAddXianSuo.company.companyName': {
                handler(newVal, oldVal) {
                    // 当输入框的值的长度大于1才进行调用接口
                    if (newVal.length > 2) {
                        this.getNameList(newVal)
                        // 当返回的数组没有数据的时候，给远程下拉框添加新的样式
                        // this.className = this.qympArrObject.length > 0 ? '' : 'popperClassName'
                    }
                    // else {
                    //   // 当输入框的长度小于或等于1的时候，给远程下拉框添加新的样式
                    //   this.className = 'popperClassName'
                    // }
                },
                deep: true
            },
            'formAddXianSuo.qualificationList': {
                handler(newVal, oldVal) {
                    if (newVal.length === 0) {
                        this.tableEmpty = '1'
                    }
                }
            },
            'formAddXianSuo.certList': {
                handler(newVal, oldVal) {
                    if (newVal.length === 0) {
                        this.tableEmpty = '1'
                    }
                }
            }
        },
        created() {
            this.get_column(-1);
            //获取路由参数
            // let url = location.search
            // let theRequest = new Object()
            // if (url.indexOf('?') != -1) {
            //   let str = url.substr(1)
            //   let strs = str.split('&')
            //   for(var i = 0; i < strs.length; i++) {
            //     theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
            //   }
            //   console.log(theRequest);
            // }
        },
        mounted() {
            this.formAddXianSuo.leads.areaIdList =[4,115]
            this.getPower()
            //公海库详情不可编辑
            let ds = this.getParams();
            this.userId = sessionStorage.getItem("userInfo");
            if (!this.isobjEmpty(ds)) {
                this.leadId = ds.row_id;
                this.xiansuo_Id = ds.row_id_z;
                this.companyId = ds.row_id_company;
                this.showGonghai = ds.bool;
                this.show = ds.bool;
                this.xiadanLook = ds.xiadanLook
                this.genjinLook = ds.genjinLook
                this.bohaoLook = ds.bohaoLook
                this.lingqulook = ds.lingqulook
            }
            Object.assign(this.rows, {leadsId: this.leadId});
            this.get_xiansuo_details();
            this.tag_list_(this.leadId);
            this.get_laiyuan_list();
            this.getHangye();
            this.getYixiang();
            this.userCheckJIlu();
            this.showGonghai ? (this.routerTitle = "公海库") : (this.routerTitle = "私有库");
            setInterval(function () {
                document.querySelectorAll(".el-cascader-node .el-radio").forEach(el => {
                    el.style.display = "none"
                });
                document.querySelectorAll(".el-cascader-node__label").forEach(el => {
                    el.onclick = function () {
                        if (this.previousElementSibling) this.previousElementSibling.click();
                    };
                });
            }, 10);
        },
        methods: {
            //权限
            getPower() {
                this.get_select_add = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-details/xiansuolaiyuan-select");/*线索来源*/
                this.get_details_look = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-details/get-details-look");/*线索详情查看*/
            },
            //听录音
            clickWav(url){
                this.eliconoff = "el-icon-microphone";

            },
            //下单
            xiadan(row) {
                this.companyNamePush = row.companyName
                this.leadId = row.leadsId;
                this.xiadan_dalig = true;
            },
            routersPaths(routerTitle) {
                routerTitle === "私有库" ? this.$router.push({path: "/xiansuo/siyou"}) : this.$router.push({path: "/xiansuo/gonghai"});
            },
            //跳关联线索详情
            async router_to(row) {
                //私有库 ----- //公海库
                if (row.ownerId === this.userId || row.ownerId === "-1") {
                    this.activeName1 = "基本信息";
                    this.xiansuo_Id = await row.id;
                    this.leadId = row.leadsId;
                    this.companyId = row.companyId;
                    if (row.leadsType === 0) {
                        this.show = true
                        this.showGonghai = true
                        this.routerTitle = "公海库"
                    } else {
                        this.show = false
                        this.showGonghai = false
                        this.routerTitle = "私有库"
                    }
                    this.get_xiansuo_details();
                    this.tag_list_(this.leadId);
                    this.userCheckJIlu();
                } else {
                    this.showMessage("info", '当前线索已有跟进人,无法查看')
                }
            },
            //领取
            lingqu() {
                this.$confirm("确认领取吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        let ids = [];
                        ids.push(parseInt(this.leadId));
                        let data = {
                            updateType: 0,
                            leadsId: ids,
                        };
                        this.lingqu_func(data, "details");
                    })
                    .catch(() => {
                        this.showMessage("info", "已取消操作");
                    });
            },
            load() {
                this.loading = true;
                setTimeout(() => {
                    this.getJiluList();
                    this.pageNum += 1;
                    this.loading = false;
                }, 30);
            },
            load2() {
                this.loading2 = true;
                setTimeout(() => {
                    this.getCaoZuoRiZhi();
                    this.pageNum2 += 1;
                    this.loading2 = false;
                }, 30);
            },
            //保存编辑线索
            async submit_xiansuoEdit(formData) {
                this.$refs[formData].validate((valid) => {
                    if (valid) {
                        let data = JSON.parse(JSON.stringify(this.formAddXianSuo));
                        delete data.leads.areaIdList;
                        delete data.company.lng_lat
                        let dataaa = data.contactList[0]
                        Object.assign(data.leads, dataaa);
                        delete data.contactList;
                        delete data.leads.sourceId
                        data.company.address = this.lng_lat.address
                        data.company.companyId = this.companyId
                        if (!this.isobjEmpty(data.company.approvedDate)) data.company.approvedDate = this.set_date(data.company.approvedDate);
                        if (!this.isobjEmpty(data.company.foundDate)) data.company.foundDate = this.set_date(data.company.foundDate);
                        if (!this.isobjEmpty(data.company.industryId))
                            data.company.industryId = parseInt(data.company.industryId[data.company.industryId.length - 1]);
                        if (!this.isobjEmpty(data.qualificationList)) {
                            let arrs = [],
                                objs = {};
                            for (let a = 0; a <= data.qualificationList.length; a++) {
                                objs = data.qualificationList[a];
                                if (!this.isobjEmpty(objs)) {
                                    arrs = Object.keys(objs).filter((v) => !objs[v]);
                                    if (arrs.length > 0) {
                                        this.tableEmpty = "2";
                                        break;
                                    } else {
                                        this.tableEmpty = "1";
                                        if (!this.isobjEmpty(objs.openDate)) {
                                            objs.openDate = this.set_date(objs.openDate);
                                        }
                                        if (!this.isobjEmpty(objs.validity)) {
                                            objs.validity = this.set_date(objs.validity);
                                        }
                                    }
                                }
                            }
                        }
                        if (!this.isobjEmpty(data.certList)) {
                            let arrs = [],
                                objs = {};
                            for (let a = 0; a <= data.certList.length; a++) {
                                objs = data.certList[a];
                                if (!this.isobjEmpty(objs)) {
                                    arrs = Object.keys(objs).filter((v) => !objs[v]);
                                    if (arrs.length > 0) {
                                        this.tableEmpty = "2";
                                        break;
                                    } else {
                                        this.tableEmpty = "1";
                                        if (!this.isobjEmpty(objs.openDate)) {
                                            objs.openDate = this.set_date(objs.openDate);
                                        }
                                        if (!this.isobjEmpty(objs.validity)) {
                                            objs.validity = this.set_date(objs.validity);
                                        }
                                    }
                                }
                            }
                        }
                        if (this.tableEmpty !== "2") {
                            this.add_edit(data);
                        }
                        if (this.tableEmpty === "2") {
                            this.showMessage("info", "请完善表格信息在进行提交");
                        }
                    } else {
                        this.showMessage("error", "添加失败");
                        return false;
                    }
                });
            },
            //编辑保存接口
            async add_edit(data) {
                let res = await this.Axios.postEdit(`leads-api/leadslist/updateById`, data, "postJson");
                if (res.data.code === 0) {
                    this.showMessage("success", "编辑成功");
                    this.get_xiansuo_details();
                } else {
                    this.showMessage("error", res.data.message);
                }
            },
            //获取线索详情
            async get_xiansuo_details() {
                await this.get_laiyuanData();
                let res = await this.Axios.get(`leads-api/leadslist/getById?id=${this.xiansuo_Id}`);
                if (res.data.code === 0) {
                    if (!this.isobjEmpty(res.data.result.ownerName)) {
                        this.genjinName = res.data.result.ownerName;
                    }
                    if (!this.isobjEmpty(res.data.result.company)) {
                        this.company_details = res.data.result.company;
                        this.setObj_(this.company_details)
                        this.lng_lat = {
                            longitude: this.company_details.longitude,
                            latitude: this.company_details.latitude,
                            address: '',
                        };
                        this.formAddXianSuo.company = {
                            projectApplications: this.company_details.projectApplications,
                            qualifications: this.company_details.qualifications,
                            financialCondition: this.company_details.financialCondition,
                            latitude: this.company_details.latitude,
                            longitude: this.company_details.longitude,
                            address: this.company_details.address,
                            businessScope: this.company_details.businessScope,
                            projectInfo: this.company_details.projectInfo,
                            registeredAddress: this.company_details.registeredAddress,
                            insuredNumber: this.company_details.insuredNumber,
                            registerOffice: this.company_details.registerOffice,
                            staffSize: this.company_details.staffSize,
                            companyType: this.company_details.companyType,
                            businessTerm: this.company_details.businessTerm,
                            approvedDate: this.setDate(this.company_details.approvedDate),
                            industryId: parseInt(this.company_details.industryId),
                            registeredCapital: this.company_details.registeredCapital,
                            contributedCapital: this.company_details.contributedCapital,
                            registeredStatus: this.company_details.registeredStatus,
                            foundDate: this.setDate(this.company_details.foundDate),
                            legalPerson: this.company_details.legalPerson,
                            companyName: this.company_details.companyName,
                            companyId: this.company_details.companyId,
                            id: this.company_details.id,
                            propertyBrand: this.company_details.propertyBrand,
                            propertyInvent: this.company_details.propertyInvent,
                            propertyDesign: this.company_details.propertyDesign,
                            propertyPattern: this.company_details.propertyPattern,
                            propertySoftware: this.company_details.propertySoftware,
                            remark: this.company_details.remark,
                        };
                        this.lng_lat.address = this.company_details.address
                    }
                    if (!this.isobjEmpty(res.data.result.follow)) {
                        this.follow_details = res.data.result.follow;
                        this.setObj_(this.follow_details)
                    }
                    if (!this.isobjEmpty(res.data.result.leads)) {
                        this.leads_details = res.data.result.leads;
                        this.oewrID = this.leads_details.ownerId
                        this.setObj_(this.leads_details)
                        this.formAddXianSuo.contactList = [
                            {
                                contactName: this.leads_details.contactName,
                                contactType: this.leads_details.contactType.toString(),
                                contactValue: this.leads_details.contactValue,
                                position: this.leads_details.position,
                                sex: this.leads_details.sex !== null ? this.leads_details.sex.toString() : "",
                            },
                        ];
                        let arrs = [];
                        arrs = this.changeDetSelect(this.leads_details.sourceId, this.laiyuan_options);
                        let after = [this.leads_details.province, this.leads_details.city, this.leads_details.area]
                        after = after.filter(val => {
                            return val !== ""
                        })
                        after.forEach((val, index) => {
                            after[index] = parseInt(val)
                        })
                        this.formAddXianSuo.leads.areaIdList = after
                        console.log(this.formAddXianSuo.leads.areaIdList);
                        this.formAddXianSuo.leads.sourceId = arrs
                        this.formAddXianSuo.leads.id = this.leads_details.id
                    }
                    this.getTableQyZz();
                    this.getTableZcRy();
                }
            },
            //地图选点
            map_add_show() {
                this.addMap_dialog = true;
            },
            //级联下拉回显(多级)
            changeDetSelect(key, treeData) {
                let arr = []; // 在递归时操作的数组
                let returnArr = []; // 存放结果的数组
                let depth = 0; // 定义全局层级
                // 定义递归函数
                function childrenEach(childrenData, depthN) {
                    for (var j = 0; j < childrenData.length; j++) {
                        depth = depthN; // 将执行的层级赋值 到 全局层级
                        arr[depthN] = childrenData[j].sourceId;
                        if (childrenData[j].sourceId == key) {
                            returnArr = arr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
                            break;
                        } else {
                            if (childrenData[j].children) {
                                depth++;
                                childrenEach(childrenData[j].children, depth);
                            }
                        }
                    }
                    console.log(returnArr);
                    return returnArr;
                }

                return childrenEach(treeData, depth);
            },
            // 提交记录接口
            async genJinFunc(data) {
                let res = await this.Axios.post("leads-api/followlist/insertFollow", data, "postJson");
                if (res.data.code === 0) {
                    this.showMessage("success", "提交成功");
                    this.pageNum = 0;
                    this.activities = [];
                    this.load();
                    this.genjin_dialog = false;
                    this.bohao_dialog = false;
                }
            },
            //占位函数
            getListTable(data) {
                console.log(data);
            },
            //处理经纬度
            input_lng_lat(lng, lat) {
                this.formAddXianSuo.company.lng_lat = `${lng},${lat}`;
            },

            //查询
            search() {
                this.searchParams.regions = this.districtType;
            },
            infoWindowClose(e) {
                this.infoWindow.show = false;
            },
            infoWindowOpen(e) {
                this.infoWindow.show = true;
            },
            //添加跟进
            add_genjin() {
                this.genjin_dialog = true;
            },

            //提交拜访记录
            async baifanfSubmit() {
                let data = {
                    followRecords: this.addBaifang_form.jilu,
                };
                let res = await this.Axios.post("leads-api/followlist/updateRecords", data);
                if (res.data.code === 0) {
                    this.showMessage("success", "提交成功");
                } else {
                    this.showMessage("error", res.data.message);
                }
            },

            //查看更多
            chakangengduo_time(userid) {
                this.addBaiFang_dialog = true;
                if (userid === this.userId) {
                    this.disables = false;
                } else {
                    this.disables = true;
                }
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleClick(tab, event) {
                if (tab.name === "跟进日志") {
                    this.activities = [];
                    this.pageNum = 0;
                    // this.getJiluList()
                    this.load();
                }
                if (tab.name === "操作日志") {
                    this.activities2 = [];
                    this.pageNum2 = 0;
                    this.load2();
                }
                if (tab.name === "关联线索") {
                    this.getTableGl();
                }
            },
            //获取关联线索记录
            async getTableGl() {
                let res = await this.Axios.get(`leads-api/leadslist/queryRelevanceByLeadsId?leadsId=${this.leadId}`);
                this.tableDataGl = res.data.result;
            },
            //获取跟进日志
            async getJiluList() {
                let res = await this.Axios.get(
                    `leads-api/followlist/selectByLeadsId?leadsId=${this.leadId}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`
                );
                if (res.data.code === 0) {
                    this.activities = this.activities.concat(res.data.result);
                    this.totalPages = Math.ceil(res.data.total / this.pageSize);
                }
                if (!this.isobjEmpty(this.activities)) {
                    this.activities.forEach((val, index) => {
                        Object.assign(val, {color: "#909399"});
                        if (index === 0) {
                            val.color = "#67C23A";
                        }
                    });
                }
            },
            //获取操作日志
            async getCaoZuoRiZhi() {
                let res = await this.Axios.get(
                    `leads-api/operationlog/queryByKeyId?keyId=${this.leadId}&pageNum=${this.pageNum2}&pageSize=${this.pageSize}`
                );
                if (res.data.code === 0) {
                    this.activities2 = this.activities2.concat(res.data.result);
                    this.totalPages2 = Math.ceil(res.data.total / this.pageSize);
                }
                if (!this.isobjEmpty(this.activities2)) {
                    this.activities2.forEach((val, index) => {
                        let Obj = {
                            color: "#909399",
                        };
                        Object.assign(val, Obj);
                        if (index === 0) {
                            val.color = "#67C23A";
                        }
                    });
                }
            },
            //点击拨打手机
            phone_tel(row, val) {
                console.log(row);
                console.log(this.userId);
                if (row.ownerId === this.userId || row.ownerId === "-1") {
                    this.$confirm("确定拨打此电话吗", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(() => {
                            this.rowData = row;
                            this.leadId = row.leadsId;
                            this.telIng(this.leadId);
                        })
                        .catch(() => {
                            this.showMessage("info", "已取消此操作");
                        });
                } else {
                    this.showMessage("info", '当前线索已有跟进人,无法拨打')
                }

            },
            //点击顶部图片拨打
            phone_telimg() {
                let rows = {
                    leadsId: this.leadId,
                    companyName: this.company_details.companyName,
                    contactValue: this.leads_details.contactValue,
                    contactName: this.leads_details.contactName,
                    ownerId: this.oewrID,
                };
                this.phone_tel(rows);
            },
            //添加标签
            async handleClose(tag, num) {
                if (num) {
                    let res = await this.Axios.get(`/leads-api/leadslabel/deleteByLeadsLabel?leadsId=${this.leadId}&labelId=${tag}`);
                    if (res.data.code === 0) {
                        // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                        this.tag_list_(this.leadId);
                    }
                }
            },
            //点击添加标签
            showInput() {
                if (this.dynamicTags.length >= 10) {
                    this.showMessage("info", "最多添加10个标签");
                } else {
                    this.tag_list();
                    this.form_data_zidingyi.value = "";
                    this.addBiaoQian_dialig = true;
                }
            },
            change_biaoqian(val) {
                console.log(val);
            },
            //标签确认添加
            async biaoqian_Submit() {
                if (this.form_data_zidingyi.value !== "") {
                    let res = await this.Axios.post(
                        `/leads-api/leadslabel/addLeadsLabel?leadsId=${this.leadId}&labelId=${this.form_data_zidingyi.value[1]}`
                    );
                    if (res.data.code === 0) {
                        this.dynamicTags.push(this.form_data_zidingyi.value);
                        this.showMessage("success", "添加成功");
                        this.addBiaoQian_dialig = false;
                        this.tag_list_(this.leadId);
                        this.activities2 = [];
                        this.pageNum2 = 0;
                        this.load2();
                    } else {
                        this.showMessage("error", res.data.message);
                    }
                } else {
                    this.showMessage("info", "请选择标签");
                }
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
            },
            //获取所有标签列表
            async tag_list() {
                let res = await this.Axios.get(`/leads-api/labellist/tree`);
                if (res.data.code === 0) {
                    this.options_biaoqian = res.data.result;
                    this.options_biaoqian.forEach((val) => {
                        if (val.children === null) {
                            val.disabled = true;
                        }
                    });
                }
            },

            //获取表格企业资质信息
            async getTableQyZz() {
                let res = await this.Axios.get(`leads-api/companyqualification/queryByCompanyId?companyId=${this.companyId}`);
                let arr = JSON.parse(JSON.stringify(res.data.result));
                arr.forEach((value) => {
                    let valDate1 = value.validity;
                    let valDate2 = value.openDate;
                    value.validity = this.setDate(valDate1.toString());
                    value.openDate = this.setDate(valDate2.toString());
                    delete value.addTime;
                    delete value.updateTime;
                    delete value.status;
                });
                this.$nextTick(() => {
                    this.formAddXianSuo.qualificationList = arr;
                });
            },
            //获取表格注册人员信息
            async getTableZcRy() {
                let res = await this.Axios.get(`leads-api/companycert/queryByCompanyId?companyId=${this.companyId}`);
                let arr = JSON.parse(JSON.stringify(res.data.result));
                arr.forEach((value) => {
                    delete value.addTime;
                    delete value.updateTime;
                    delete value.status;
                });
                this.$nextTick(() => {
                    this.formAddXianSuo.certList = arr;
                });
            },
            //线索来源change事件
            async laiyuanChange(val) {
                console.log(val);
                val.length === 0 ? val = -1 : val = parseInt(val[val.length - 1]);
                let res = await this.Axios.get(`leads-api/leadslist/updateSourceIdByLeadsId?leadsId=${this.leadId}&sourceId=${val}`);
                if (res.data.code === 0) {
                    this.showMessage("success", "来源保存成功");
                } else {
                    this.showMessage("error", res.data.message);
                }
            },

            closeDialog() {
                this.change_show_radio = true
                this.change_show_radio2 = true
                this.baoHao_form.intentionId = null
                this.baoHao_form.intentionLevel = null
                this.baoHao_form.callStatus = null
                this.baoHao_form.followRecords = ""
                // if (this.$refs.GenJinform) this.$refs.GenJinform.resetFields();
                // if (this.$refs.XiaDanform) this.$refs.XiaDanform.resetFields();
                if (this.$refs.BoHaoform) this.$refs.BoHaoform.resetFields();
            },
        },
    };
</script>
<style scope>
    @import "../xiansuo_common.css";
</style>
<style scoped lang="less">
    @import "index";

</style>
