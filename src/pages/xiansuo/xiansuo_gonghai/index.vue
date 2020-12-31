<template>
    <div class="xiansuo_gonghai">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>线索系统</el-breadcrumb-item>
            <el-breadcrumb-item>公海库</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="top_line"></div>
        <!--筛选表单-->
        <div class="box_siyou">
            <div class="formClass">
                <el-form :inline="true" :model="form_list_" class="report_demo_form" label-width="96px">
                    <el-form-item label="意向服务" size="small" style="width:19%" v-if="!mapShow_status">
                        <el-select clearable v-model="form_list_.followQueryInfo.intentionId">
                            <el-option label="全部服务" value=""></el-option>
                            <el-option :key="index" :label="val.name" :value="val.groupId"
                                       v-for="(val, index) in yxGenJinData"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="意向度" size="small" style="width:19%" v-if="!mapShow_status">
                        <el-select clearable v-model="form_list_.followQueryInfo.intentionLevel">
                            <el-option label="全部意向" value=""></el-option>
                            <el-option :key="index" :label="val.label" :value="val.id"
                                       v-for="(val, index) in yixData"></el-option>
                            <el-option label="未知" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电话状态" size="small" style="width:19%" v-if="!mapShow_status">
                        <el-select clearable v-model="form_list_.followQueryInfo.callStatus">
                            <el-option label="全部状态" value=""></el-option>
                            <el-option :key="index" :label="val.label" :value="val.id"
                                       v-for="(val, index) in phoneTelData"></el-option>
                            <el-option label="未拨打" value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属行业" size="small" style="width:19%" v-if="!mapShow_status">
                        <el-cascader
                                :options="hangYeData"
                                :props="listPropsHY"
                                @change="handleChanges"
                                clearable
                                v-model="form_list_.companyInfo.industryId"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="所属地区" size="small" style="width:19%" v-if="!mapShow_status">
                        <el-cascader
                                :props="listPropsSHDQ"
                                @change="handleChange1(form_list_.leadsQueryInfo.areaIdList, 1)"
                                clearable
                                v-model="form_list_.leadsQueryInfo.areaIdList"
                        ></el-cascader>
                    </el-form-item>
                    <div style="margin-top:10px;display:flex;align-items:center;" v-if="!mapShow_status">
                        <el-form-item label="自定义标签" size="small" style="width:19%">
                            <el-cascader :options="treeList" :props="listPropsBq" clearable
                                         v-model="form_list_.labelId"></el-cascader>
                        </el-form-item>
                        <el-form-item label="线索来源" size="small" style="width:19%">
                            <el-cascader
                                    :options="treeListLy"
                                    :props="listPropsLy"
                                    clearable
                                    v-model="form_list_.leadsQueryInfo.sourceId"
                            ></el-cascader>
                        </el-form-item>
                        <!-- <el-form-item label="查看范围" size="small" style="width:19%" v-show="!mapShow_status">
                                <el-select @change="form_fanwei(form_list_.leadsQueryInfo.rangeType)" v-model="form_list_.leadsQueryInfo.rangeType">
                                  <el-option
                                    :disabled="val.type"
                                    :key="index"
                                    :label="val.label"
                                    :value="val.id"
                                    v-for="(val, index) in ckfwData"
                                  ></el-option>
                                </el-select>
                              </el-form-item> -->
                        <div style="padding:0 29px;width:19%;display:flex;justify-content:space-between;">
                            <el-form-item class="form_search" size="medium" style="width: 30%;">
                                <el-button @click="get_tableData" size="small" style="width: 100%;" type="primary">
                                    筛选
                                </el-button>
                            </el-form-item>
                            <el-form-item class="form_search" size="medium" style="width: 63%;">
                                <el-button @click="gengduo_shaixuan" size="small" style="width: 100%;">
                                    更多筛选
                                </el-button>
                            </el-form-item>
                        </div>
                        <el-form-item class="form_search" size="small" style="margin-left: 38px;width: 15.5%;">
                            <el-input
                                    @keyup.enter.native="get_tableData"
                                    clearable
                                    placeholder="请输入联系人或手机号"
                                    v-model="form_list_.leadsQueryInfo.like"
                            >
                                <el-button @click="get_tableData" icon="el-icon-search" slot="append"></el-button>
                            </el-input>
                        </el-form-item>
                    </div>
                    <el-row class="myReportD" v-show="!mapShow_status">
                        <el-col :span="24" class="flex_between" style="border: none;padding:5px 0;">
                            <div class="grid-content bg-purple">
                                <el-button @click="add_xiansuo" size="mini" type="primary"
                                           v-has="'/xiansuo-gonghai/get_add_look'">添加线索
                                </el-button>
                                <el-button @click="piliang_zhipai_button" size="mini" type="primary"
                                           v-has="'/xiansuo-gonghai/get_zhipai_look'" v-if="!userMangageType">
                                    批量指派
                                </el-button>
                                <el-button @click="lingqu_button" size="mini" type="success"
                                           v-has="'/xiansuo-gonghai/get-lingqu-look'">批量领取
                                </el-button>
                            </div>
                            <div class="grid-content_2">
                                <el-form-item label="忽略空号错号" size="small" style="width: 35%;margin:0;">
                                    <el-checkbox @change="get_tableData"
                                                 v-model="form_list_.followQueryInfo.ignoringStatus"></el-checkbox>
                                </el-form-item>
                                <!-- <el-button @click="liexiang_button(0)" icon="el-icon-setting" size="mini" type="primary">
                                          显示列项
                                        </el-button> -->
                                <!--<el-button size="medium" type="primary" icon="el-icon-setting"-->
                                <!--@click="goutongjilu">-->
                                <!--沟通记录-->
                                <!--</el-button>-->
                                <!-- 地图按钮 -->
                                <el-button @click="creatElementMap" class="btnImgBox" size="mini">
                                    <img alt="" src="../../../assets/qst/mapBtn.png">
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <!--获取地图信息-->
                    <div
                            class="hid_button"
                            style="display: flex;justify-content: space-between;align-items:center;margin-bottom:10px;"
                            v-if="mapShow_status"
                    >
                        <!--查看范围-->
                        <div style="display: flex;">
                            <el-form :inline="true" class="demo-form-inline"
                                     style="width: 600px;display: flex;align-items: center">
                                <el-form-item class="selectClassName" label="查看范围" size="small" style="margin: 0;">
                                    <el-select @change="selectMapSpot" clearable v-model="map.chfwSelectData">
                                        <el-option :key="index" :label="val.label" :value="val.id"
                                                   v-for="(val, index) in ckfwDatas"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-button @click="againBiaoDian" size="mini" type="primary">重新标点</el-button>
                            </el-form>
                        </div>
                        <div>
                            <el-button @click="mapShow_status = false" size="mini"
                                       style="float: right;margin-left: 10px;" type="primary">列表模式
                            </el-button>

                        </div>
                    </div>
                </el-form>
            </div>
            <!--表格-->
            <div class="table_pagination" v-show="!mapShow_status">
                <div class="tableClass">
                    <el-table :cell-style="cellStyle"
                              :data="tableData"
                              :header-cell-style="table_heard_style"
                              :row-key="row_key"
                              @selection-change="select_checkBox"
                              border
                              class="form1"
                              highlight-current-row
                              ref="table"
                              size="mini"
                              stripe
                              style="width: 100%"
                              v-loading="listLoading" element-loading-text="拼命加载中"
                    >
                        <el-table-column :resizable="false" type="selection" width="50"></el-table-column>
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
                  <el-popover
                          @hide="hoverHide"
                          @show="hoveRow(scope.row)"
                          placement="right"
                          popper-class="popoverXianSuo"
                          title="跟进记录"
                          transition="fade-in-linear"
                          trigger="click" visible-arrow="true"
                  >
                    <!--鼠标移入展示-->
                    <div class="listsHover">
                      <div class="hoverList" v-if="listHover.length !== 0">
                        <div :key="index" v-for="(val, index) in listHover">
                          <el-card class="card_time">
                            <div class="card_time_left">
                              <div>{{ val.addTime }}</div>
                            </div>
                            <div class="card_time_right">
                              <!--电话记录-->
                              <div class="card_time_right_cont" v-if="val.followType === 0">
                                <div class="card_time_right_top">
                                  <div class="card_time_right_lef">
                                    <div class="title">{{ val.userName }} 更新了 电话记录</div>
                                    <p>
                                      意 向 度:
                                      {{
                                        val.intentionLevel === 0 ? "无意向" : val.intentionLevel === 1 ? "一般意向" : "高度意向"
                                      }}
                                    </p>
                                    <p>意向服务:{{ val.intentionName === "" ? "无" : val.intentionName }}</p>
                                  </div>
                                  <div class="card_time_right_rig">
                                    <p>
                                      通话时长:
                                      <span v-text="s_to_hs(val.callTime)"></span>
                                    </p>
                                    <p>
                                      电话状态:
                                      <span v-if="val.callStatus === 1">空号</span>
                                      <span v-else-if="val.callStatus === 2">错号</span>
                                      <span v-else-if="val.callStatus === 3">未接通</span>
                                      <span v-else-if="val.callStatus === 4">可接通</span>
                                      <span v-else>未拨打</span>
                                    </p>
                                  </div>
                                </div>
                                <div class="title">备注:</div>
                                <span class="genjinJl">{{ val.followRecords===''?'无':val.followRecords }}</span>
                              </div>
                                <!--备注-->
                              <div v-if="val.followType === 1">
                                <div class="title">
                                  <span>{{ val.userName }}</span> 更新了 <span></span>跟进记录
                                </div>
                                <p>
                                  意 向 度:
                                  {{ val.intentionLevel === 0 ? "无意向" : val.intentionLevel === 1 ? "一般意向" : "高度意向" }}
                                </p>
                                <p>意向服务:{{ val.intentionName === "" ? "无" : val.intentionName }}</p>
                                <div class="title">备注:</div>
                                <span class="genjinJl">{{ val.followRecords===''?'无':val.followRecords }}</span>
                              </div>
                                <!--拜访记录-->
                              <div v-if="val.followType === 2">
                                <div class="title">
                                  { <span>{{ val.userName }}</span> 更新了 拜访记录
                                </div>
                                <p>
                                  意 向 度:
                                  {{ val.intentionLevel === 0 ? "无意向" : val.intentionLevel === 1 ? "一般意向" : "高度意向" }}
                                </p>
                                <p>意向服务:{{ val.intentionName === "" ? "无" : val.intentionName }}</p>
                                <div class="title">备注:</div>
                                <span class="genjinJl">{{ val.followRecords===''?'无':val.followRecords }}</span>
                              </div>
                                <!--补充记录-->
                              <div v-if="val.followType === 3">
                                <div class="title">
                                  <span>{{ val.userName }}</span> 更新了 补充记录
                                </div>
                                <span class="genjinJl">{{ val.followRecords===''?'无':val.followRecords }}</span>
                              </div>
                            </div>
                          </el-card>
                        </div>
                      </div>
                      <div class="hover_empty" v-if="listHover.length === 0">
                        <p>暂无数据</p>
                      </div>
                    </div>
                    <div class="el-popover__title">标签</div>
                    <div class="tagContent">
                      <div class="tagContentDiv" v-if="dynamicTags.length !== 0">
                        <el-tag
                                :disable-transitions="false"
                                :key="index"
                                :style="
                            tag.colour === ''
                              ? `color:#409EFF;border:#409EFF 1px solid;background: none;`
                              : `color:${tag.colour};border:${tag.colour} 0.1px solid;background: none;`
                          "
                                class="tagList"
                                size="small"
                                style="margin: 0 5px 5px 0"
                                v-for="(tag, index) in dynamicTags"
                        >
                          {{ tag.labelName }}
                        </el-tag>
                      </div>
                      <div class="hover_empty" v-if="dynamicTags.length === 0">
                        <p>暂无数据</p>
                      </div>
                    </div>
                    <div class="name-wrapper" slot="reference">
                      <el-link class="styleClassLink">
                        {{ scope.row.contactName === "" ? "--" : scope.row.contactName }}
                      </el-link>
                    </div>
                  </el-popover>
                </span>
                                <!--联系方式-->
                                <span v-else-if="item.fieldName === '联系方式'">
                  <div style="cursor: pointer;display: flex;justify-content: flex-start">
                      <span v-if="scope.row.contactType === 1">
                        <span @click="phone_tel(scope.row, scope.row.contactValue)" class="table_span"
                              v-has="'/xiansuo-gonghai/get-bohao-look'">
                          <img alt="" src="../../../assets/qst/pnone_.png"/>
                        </span>
                         <el-tooltip class="item" content="线索详情" effect="dark" placement="right-start">
                         <router-link :to="{ path: '/xiansuo/siyou_genjin'}" @click.native="router_to(scope.row)"
                                      target="_blank">
                            <el-link class="styleClassLink1">{{ scope.row.contactValue !== "" ? scope.row.contactValue : "" }}</el-link>
                         </router-link>
                         </el-tooltip>
                      </span>
                      <span v-if="scope.row.contactType === 3">
                        <span @click="phone_tel(scope.row, scope.row.contactValue)" class="table_span"
                              v-has="'/xiansuo-gonghai/get-bohao-look'">
                          <img alt="" src="../../../assets/qst/pnone_.png"/>
                        </span>
                         <el-tooltip class="item" content="线索详情" effect="dark" placement="right-start">
                        <router-link :to="{ path: '/xiansuo/siyou_genjin'}" @click.native="router_to(scope.row)"
                                     target="_blank">
                            <el-link class="styleClassLink1">{{ scope.row.contactValue !== "" ? scope.row.contactValue : "" }}</el-link>
                         </router-link>
                         </el-tooltip>
                      </span>
                      <span v-if="scope.row.contactType === 2">
                        <span class="table_span" v-has="'/xiansuo-gonghai/get-bohao-look'">
                          <img alt="" src="../../../assets/qst/wx_1.png"/>
                        </span>
                         <el-tooltip class="item" content="线索详情" effect="dark" placement="right-start">
                         <router-link :to="{ path: '/xiansuo/siyou_genjin'}" @click.native="router_to(scope.row)"
                                      target="_blank">
                            <el-link class="styleClassLink1">{{ scope.row.contactValue !== "" ? scope.row.contactValue : "" }}</el-link>
                         </router-link>
                         </el-tooltip>
                      </span>
                  </div>
                </span>
                                <!--最近沟通-->
                                <span v-else-if="item.fieldName === '最近沟通'">
                  <span class="cursorLink" v-if="scope.row.followType === 0">{{ scope.row.followTime }}</span>
                  <el-link :underline="false" class="cursorLink" type="success" v-else-if="scope.row.followType === 1"
                  >{{ scope.row.followTime }}
                  </el-link>
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
                                <!--自定义标签-->
                                <span v-else-if="item.fieldName === '自定义标签'">
                  <span v-if="scope.row.labelList === null">--</span>
                  <span :key="index" v-else v-for="(val, index) in scope.row.labelList">
                    <span
                            :style="
                        val.colour === ''
                          ? `color:#409EFF;border:#409EFF 1px solid;`
                          : `color:${val.colour};border:${val.colour} 0.1px solid`
                      "
                            class="tag_lists"
                    >{{ val.labelName }}
                    </span>
                  </span>
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
                        <!--操作-->
                        <el-table-column :resizable="false" fixed="right" label="操作" width="110">
                            <template slot-scope="scope">
                                <div class="buttonLists">
                                    <el-button @click="genjin(scope.row)"
                                               style="color:#67C23A;marginLeft:6px;padding: 0;" type="text"
                                               v-has="'/xiansuo-gonghai/get-genjin-look'">
                                        跟进
                                    </el-button>
                                    <el-button @click="lingqu(scope.row)"
                                               style="color:#32AFF0;marginLeft:6px;padding: 0;" type="text"
                                               v-has="'/xiansuo-gonghai/get-lingqu-look'"
                                    >领取
                                    </el-button>
                                    <el-button @click="zhipai(scope.row)"
                                               style="color:#409EFF;marginLeft:6px;padding: 0;" type="text"
                                               v-has="'/xiansuo-gonghai/get_zhipai_look'" v-if="!userMangageType"
                                    >指派
                                    </el-button>
                                </div>

                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--分页器-->
                <div class="pagination_clumun">
                    <el-pagination
                            :current-page="currentPage4"
                            :page-size="pageSize"
                            :page-sizes="[10, 20, 30]"
                            :total="total"
                            @current-change="handleCurrentChange"
                            @size-change="handleSizeChange"
                            layout="total, sizes, prev, pager, next, jumper"
                    >
                    </el-pagination>
                </div>
            </div>
            <!--地图-->
            <div class="table_pagination" v-if="mapShow_status">
                <baidu-map
                        :center="{lng: map.center.lng, lat: map.center.lat}"
                        :scroll-wheel-zoom="true"
                        :style="{width: map.width, minHeight: map.height}"
                        :zoom="map.zoom" @click="mapClickEnd"
                        @ready="handlerBMaps"
                        ak="F7yxQs0HeVUoxSRa6TlHpGLtwqp91BrN"
                        class="map"
                >
                    <!--比例尺控件-->
                    <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
                    <!--缩放控件-->
                    <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
                    <div :key="val.companyId" v-for="(val, index) in marpData">
                        <bm-marker :key="val.companyId"
                                   :position="{lng: val.longitude, lat: val.latitude}"
                                   @click="infoWindowOpens(val.companyId, 0, val.longitude, val.latitude)"
                        >
                        </bm-marker>
                        <!--信息窗体-->
                        <bm-info-window
                                :key="val.companyId"
                                :offset="{width: 1, height: -20}"
                                :position="{lng: infoWindow.info.lng, lat: infoWindow.info.lat}"
                                :show="infoWindow.show"
                                :width="700"
                                @close="infoWindowClose"
                        >
                            <div class="infowindowbox">
                                <!--信息-->
                                <div class="infowindowbox_left">
                                    <div class="infowindowbox_left_head">
                                        <div>企业信息</div>
                                        <router-link :to="{ path: '/xiansuo/siyou_genjin'}"
                                                     @click.native="router_to(infoWindow.info)" target="_blank">
                                            <div class="ckxqClass">(查看详情)</div>
                                        </router-link>
                                    </div>
                                    <div class="infowindowbox_left_cont">
                                        <p>
                                            <span class="left">企业名称</span>
                                            <span class="right">{{ infoWindow.info.companyName }}</span>
                                        </p>
                                        <p>
                                            <span class="left">联系人</span>
                                            <span class="right">{{ infoWindow.info.contactName }}</span>
                                        </p>
                                        <p class="imgPhoneTel">
                                            <img @click="phone_tel(infoWindow.info)"
                                                 alt=""
                                                 src="../../../assets/qst/pnone_.png"
                                                 v-has="'/xiansuo-gonghai/get-bohao-look'"
                                                 v-if="infoWindow.info.contactType === 1"
                                            />
                                            <img @click="phone_tel(infoWindow.info)"
                                                 alt=""
                                                 src="../../../assets/qst/pnone_.png"
                                                 v-has="'/xiansuo-gonghai/get-bohao-look'"
                                                 v-if="infoWindow.info.contactType === 3"
                                            />
                                            <img alt="" src="../../../assets/qst/wx_1.png"
                                                 v-has="'/xiansuo-gonghai/get-bohao-look'"
                                                 v-if="infoWindow.info.contactType === 2"/>
                                            <span class="left">联系方式</span>
                                            <span class="right">{{ infoWindow.info.contactValue }}</span>
                                        </p>
                                        <p>
                                            <span class="left">所在地区</span>
                                            <span class="right">{{ infoWindow.info.areaName }}</span>
                                        </p>
                                        <p>
                                            <span class="left">资质情况</span>
                                            <span class="right"
                                                  v-if="infoWindow.info.qualificationStatus === 1">有</span>
                                            <span class="right"
                                                  v-if="infoWindow.info.qualificationStatus === 0">无</span>
                                        </p>
                                        <p>
                                            <span class="left">意向度</span>
                                            <span class="right" v-if="infoWindow.info.intentionLevel === 0">无意向</span>
                                            <span class="right" v-if="infoWindow.info.intentionLevel === 1">一般意向</span>
                                            <span class="right" v-if="infoWindow.info.intentionLevel === 2">高度意向</span>
                                        </p>
                                        <p>
                                            <span class="left">意向服务</span>
                                            <span class="right">{{ infoWindow.info.intentionName }}</span>
                                        </p>
                                        <p>
                                            <span class="left">电话状态</span>
                                            <span class="right" v-if="infoWindow.info.callStatus === 1">空号</span>
                                            <span class="right" v-else-if="infoWindow.info.callStatus === 2">错号</span>
                                            <span class="right" v-else-if="infoWindow.info.callStatus === 3">未接通</span>
                                            <span class="right" v-else-if="infoWindow.info.callStatus === 4">可接通</span>
                                            <span class="right" v-else>未拨打</span>
                                        </p>
                                        <p>
                                            <span class="left">跟进人</span>
                                            <span class="right">{{ infoWindow.info.ownerName }}</span>
                                        </p>
                                        <p>
                                            <span class="left">线索来源</span>
                                            <span class="right">{{infoWindow.info.sourceName}}</span>
                                        </p>
                                    </div>
                                </div>
                                <!--记录-->
                                <div class="infowindowbox_right">
                                    <div class="infowindowbox_right_head">
                                        <div>跟进记录</div>
                                    </div>
                                    <div class="infowindowbox_right_cont">
                                        <div class="right_lists" v-if="listHover.length !== 0">
                                            <div :key="val.id" class="infowindowbox_right_cont_list"
                                                 v-for="(item, index) in listHover">
                                                <div class="card_time_left">
                                                    <div>{{ item.addTime }}</div>
                                                </div>
                                                <div class="card_time_right">
                                                    <!--电话记录-->
                                                    <div class="card_time_right_cont" v-if="item.followType === 0">
                                                        <div class="card_time_right_top">
                                                            <div class="card_time_right_lef">
                                                                <div class="title">{{ item.userName }} 更新了 电话记录</div>
                                                                <p>
                                                                    意 向 度:
                                                                    {{
                                                                    item.intentionLevel === 0 ? "无意向" :
                                                                    item.intentionLevel === 1 ? "一般意向" : "高度意向"
                                                                    }}
                                                                </p>
                                                                <p>意向服务:{{ item.intentionName === "" ? "无" :
                                                                    item.intentionName }}</p>
                                                            </div>
                                                            <div class="card_time_right_rig">
                                                                <p>
                                                                    通话时长:
                                                                    <span v-text="s_to_hs(item.callTime)"></span>
                                                                </p>
                                                                <p>
                                                                    电话状态:
                                                                    <span v-if="item.callStatus === 1">空号</span>
                                                                    <span v-else-if="item.callStatus === 2">错号</span>
                                                                    <span v-else-if="item.callStatus === 3">未接通</span>
                                                                    <span v-else-if="item.callStatus === 4">可接通</span>
                                                                    <span v-else>未拨打</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div class="title">备注:</div>
                                                        <span class="genjinJl">{{ item.followRecords }}</span>
                                                    </div>
                                                    <!--备注-->
                                                    <div v-if="item.followType === 1">
                                                        <div class="title">
                                                            <span>{{ item.userName }}</span> 更新了 <span></span>跟进记录
                                                        </div>
                                                        <p>
                                                            意 向 度:
                                                            {{ item.intentionLevel === 0 ? "无意向" : item.intentionLevel
                                                            === 1 ? "一般意向" : "高度意向" }}
                                                        </p>
                                                        <p>意向服务:{{ item.intentionName === "" ? "无" : item.intentionName
                                                            }}</p>
                                                        <div class="title">备注:</div>
                                                        <span class="genjinJl">
                                {{ item.followRecords }}
                              </span>
                                                    </div>
                                                    <!--拜访记录-->
                                                    <div v-if="item.followType === 2">
                                                        <div class="title">
                                                            { <span>{{ item.userName }}</span> 更新了 拜访记录
                                                        </div>
                                                        <p>
                                                            意 向 度:
                                                            {{ item.intentionLevel === 0 ? "无意向" : item.intentionLevel
                                                            === 1 ? "一般意向" : "高度意向" }}
                                                        </p>
                                                        <p>意向服务:{{ item.intentionName === "" ? "无" : item.intentionName
                                                            }}</p>
                                                        <div class="title">备注:</div>
                                                        <span class="genjinJl">{{ item.followRecords }}</span>
                                                    </div>
                                                    <!--补充记录-->
                                                    <div v-if="item.followType === 3">
                                                        <div class="title">
                                                            <span>{{ item.userName }}</span> 更新了 补充记录
                                                        </div>
                                                        <p>
                                                            意 向 度:
                                                            {{ item.intentionLevel === 0 ? "无意向" : item.intentionLevel
                                                            === 1 ? "一般意向" : "高度意向" }}
                                                        </p>
                                                        <p>意向服务:{{ item.intentionName === "" ? "无" : item.intentionName
                                                            }}</p>
                                                        <div class="title">备注:</div>
                                                        <span class="genjinJl">{{ item.followRecords }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="hover_empty" v-if="listHover.length === 0">
                                            <p>暂无数据</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </bm-info-window>
                    </div>
                </baidu-map>
            </div>
        </div>
        <!--钉办拨号系统-->
        <xiansuo-bohao
                :bohao_dialog="bohao_dialog" :change_show_radio="change_show_radio"
                :change_show_radio2="change_show_radio2"
                :phoneTelData="phoneTelData" :rowData="rowData"
                :siyouBohao="siyouBohao" :userCheckJIludata="userCheckJIludata" :yixData="yixData" :yxGenJinData="yxGenJinData"
                @lingqu_func="lingqu_func" @radio_change="radio_change" @statusRadio="statusRadio"
                @updateUserData="updateUserData"></xiansuo-bohao>
        <!--显示列项-->
        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="liexiang_dialog"
                title="自定义显示和排序 （灰色选项不可设置）"
                width="30%"
        >
            <div class="liexiang_dialog">
                <el-table
                        :cell-style="cellStyle"
                        :data="table_liexiang"
                        :header-cell-style="{
            'background-color': '#F3F6FD',
            color: '#606266',
            padding: '10px 0',
            'text-align': 'center',
          }"
                        :row-key="row_key"
                        border
                        ref="singleTable"
                        style="width: 100%"
                >
                    <el-table-column label="显示" prop="status,sort">
                        <template slot-scope="scope">
                            <el-checkbox :disabled="scope.row.showStatus" v-model="scope.row.status">
                <span style="display: none">
                  {{ (scope.row.sort = scope.$index + 1) }}
                </span>
                            </el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="列名" prop="fieldName"></el-table-column>
                    <el-table-column label="拖动排序">
                        <template slot-scope="scope">
                            <el-button circle icon="el-icon-sort" size="mini" style="height: 32px"
                                       type="success"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span class="dialog-footer" slot="footer"
                  style="display: flex;justify-content: flex-end;align-items: center">
        <!--<el-link class="cacle" type="primary" @click="huifumoren()" :underline="false">恢复默认-->
                <!--<span>(恢复调整前的显示状态)</span>-->
                <!--</el-link>-->
        <div>
          <el-button @click="liexiang_dialog = false">取 消</el-button>
          <el-button @click="sort_Submit(0)" type="primary">保存</el-button>
        </div>
      </span>
        </el-dialog>
        <!--批量导入-->
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogDaoRu" title="批量导入" width="50%">
            <div class="dialog_content">
                <div class="dialog_content_left">
                    <div class="img">
                        <img alt="" src="../../../assets/qst/xiazai.png"/>
                    </div>
                    <el-button @click="filingRate">下载模板</el-button>
                    <p>请按照模板内容填写导入信息，不可修改表单信息和字段</p>
                    <p>否则导入失败</p>
                </div>
                <div class="dialog_content_right">
                    <div class="img">
                        <img alt="" src="../../../assets/qst/shangchuan.png"/>
                    </div>
                    <el-button @click="shangchuan">上传文件</el-button>
                    <p>请上传文件后缀名为"xls"或者"xlsx"(Excel格式),大小不超过20M</p>
                    <p>
                        如发现手机号码一致线索信息,该条信息将会导入失败,其他信息正常导入
                    </p>
                </div>
            </div>
        </el-dialog>
        <!--查看范围 部门-->
        <el-dialog :close-on-click-modal="false" :visible.sync="fanwei_dialog" @close="closeDialog" title="查看部门"
                   width="30%">
            <div class="table_domo">
                <div class="tree_demo">
                    <tree :list="lists" @nodeClick="nodeClick" showlength="true"></tree>
                </div>
                <div class="table_list">
                    <!-- <div class="name_check_box">
                           <div style="margin: 10px 0;"></div>
                           <el-checkbox-group v-model="formFW.checkedName">
                             <div :key="index" class="check_box_" v-for="(val, index) in userList">
                               <el-checkbox :label="val.userId">{{ val.realName }}</el-checkbox>
                             </div>
                           </el-checkbox-group>
                         </div> -->
                    <el-form :model="formFW">
                        <el-form-item label="" label-width="68px" size="medium">
                            <el-select
                                    :multiple-limit="6"
                                    filterable
                                    multiple
                                    no-data-text
                                    placeholder="请输入姓名关键字搜索"
                                    style="width: 100%;"
                                    v-model="formFW.name"
                            >
                                <el-option :key="index" :label="item.realName" :value="item.userId"
                                           v-for="(item, index) in userList">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span class="dialog-footer" slot="footer">
        <el-button @click="cacle_fanwei">取 消</el-button>
        <el-button @click="y_fanwei" type="primary">确 定</el-button>
      </span>
        </el-dialog>
        <!--指派-->
        <el-dialog :close-on-click-modal="false" :visible.sync="zhipai_dialog" @close="closeDialog" title="指派"
                   width="30%">
            <div class="table_domo">
                <div class="tree_demo">
                    <tree :list="lists" @nodeClick="nodeClick" showlength="true"></tree>
                </div>
                <div class="table_list">
                    <el-form :model="formZP">
                        <el-form-item label="" label-width="68px" size="medium">
                            <el-select @change="changeformZP"
                                       filterable
                                       no-data-text
                                       placeholder="请输入姓名关键字搜索"
                                       style="width: 100%;"
                                       v-model="formZP.name"
                            >
                                <el-option :key="index" :label="item.realName" :value="item.userId"
                                           v-for="(item, index) in userList">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span class="dialog-footer" slot="footer">
        <el-button @click="zhipai_dialog = false" size="mini">取 消</el-button>
        <el-button @click="y_zhipai" size="mini" type="primary">确 定</el-button>
      </span>
        </el-dialog>
        <!--添加线索-->
        <el-dialog :close-on-click-modal="false" :visible.sync="add_dialog" @close="closeDialog" title="添加线索"
                   width="56%">
            <div class="add_dialog">
                <div class="content_add">
                    <el-form
                            :inline="true"
                            :model="formAddXianSuo"
                            :rules="ruleFormXiansuo"
                            class="demo-form-inline"
                            label-position="right"
                            ref="ruleFormXiansuo"
                    >
                        <p><span></span>基本信息</p>
                        <div class="form_label_g" style="margin-left: 12px;">
                            <div :key="index" v-for="(domain, index) in formAddXianSuo.contactList">
                                <el-form-item class="" label="联系方式" label-width="69px" required size="small">
                                    <el-select @change="phone_rules(domain.contactValue)" style="width: 88px;"
                                               v-model="domain.contactType">
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
                    {
                      required: true,
                      validator: isMobileNumber,
                      trigger: 'blur',
                    },
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
                                        class=""
                                        size="small"
                                        v-if="domain.contactType === '3'"
                                >
                                    <el-input
                                            @change="phone_rules(domain.contactValue)"
                                            style="width: 116px;"
                                            v-model="domain.contactValue"
                                    ></el-input>
                                </el-form-item>
                                <el-form-item label="联系人" label-width="46px" size="small" style="margin-left: 6px;">
                                    <el-input style="width: 116px;" v-model="domain.contactName"></el-input>
                                </el-form-item>
                                <el-form-item label="性别" label-width="39px" size="small">
                                    <el-select style="width: 88px;" v-model="domain.sex">
                                        <el-option label="男" value="0"></el-option>
                                        <el-option label="女" value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="公司职位" label-width="59px" size="small">
                                    <el-select style="width: 116px;" v-model="domain.position">
                                        <el-option :key="index" :label="val.label" :value="val.label"
                                                   v-for="(val, index) in zwData"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-button
                                        @click="delete_form(index)"
                                        icon="el-icon-remove-outline"
                                        size="mini"
                                        type="danger"
                                        v-show="button_status_del"
                                >
                                </el-button>
                                <el-button
                                        @click="add_form"
                                        icon="el-icon-circle-plus-outline"
                                        size="mini"
                                        style="margin-top: 4px;"
                                        type="primary"
                                        v-show="button_status_add"
                                ></el-button>
                            </div>
                        </div>
                        <p><span></span>意向信息</p>
                        <div class="form_label_g">
                            <el-form-item class="yixiang_form" label="意向度" label-width="59px" size="small">
                                <el-select v-model="formAddXianSuo.follow.intentionLevel">
                                    <el-option :key="index" :label="val.label" :value="val.id"
                                               v-for="(val, index) in yixData"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="yixiang_form" label="意向服务" label-width="59px" size="small">
                                <el-select class="input_se" v-model="formAddXianSuo.follow.intentionId">
                                    <el-option :key="index" :label="val.name" :value="val.groupId"
                                               v-for="(val, index) in yxGenJinData"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="线索来源" label-width="59px" size="small">
                                <el-cascader
                                        :options="laiyuan_options"
                                        :props="listPropsLy"
                                        @change="laiyuanChange"
                                        clearable
                                        v-model="formAddXianSuo.leads.sourceId"
                                ></el-cascader>
                            </el-form-item>
                            <div class="sjbzFrom">
                                <el-row class="texareaNone sjbztexareaNone">
                                    <el-form-item label="商机备注" label-width="59px" style="width: 100%;">
                                        <el-input :autosize="{ minRows: 1, maxRows: 4}" maxlength="100"
                                                  resize="none"
                                                  show-word-limit
                                                  type="textarea"
                                                  v-model="formAddXianSuo.follow.followRecords"
                                        ></el-input>
                                    </el-form-item>
                                </el-row>
                            </div>
                        </div>
                        <p><span></span>企业信息</p>
                        <div class="form_label_g ">
                            <div class="form_label_s">
                                <el-form-item class="qiyexinxi_from" label="企业名称" label-width="69px"
                                              prop="company.companyName" size="small" style="margin-left: -10px;">
                                    <el-autocomplete
                                            :fetch-suggestions="querySearchAsync"
                                            @change="changecom($event, 1)"
                                            @input="inputChange($event,'ruleFormXiansuo')"
                                            @select="handleSelect($event,1)"
                                            clearable
                                            placeholder="请输入企业名称"
                                            ref="inputVal"
                                            v-model="formAddXianSuo.company.companyName"
                                    ></el-autocomplete>
                                </el-form-item>
                                <el-form-item class="faren_from sjbztexareaNone" label="法人" label-width="39px"
                                              size="small">
                                    <el-input maxlength="20" show-word-limit
                                              v-model="formAddXianSuo.company.legalPerson"></el-input>
                                </el-form-item>
                            </div>
                            <div class="form_label_d">
                                <el-form-item class="yixiang_form" label="登记状态" label-width="59px" size="small">
                                    <el-select class="input_se" v-model="formAddXianSuo.company.registeredStatus">
                                        <el-option :key="index" :label="val.label" :value="val.id"
                                                   v-for="(val, index) in dengji_options">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="qiyeleixing_form" label="企业类型" label-width="59px" size="small">
                                    <el-select class="" v-model="formAddXianSuo.company.companyType">
                                        <el-option
                                                :key="index"
                                                :label="val.leixing_label"
                                                :value="val.leixing_val"
                                                v-for="(val, index) in leixing_options"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="" label="所属地区" label-width="59px" size="small">
                                    <el-cascader
                                            :props="listPropsSHDQ"
                                            @change="handleChange1(formAddXianSuo.leads.areaIdList, 2)"
                                            v-model="formAddXianSuo.leads.areaIdList"
                                    ></el-cascader>
                                </el-form-item>
                            </div>
                            <div class="form_label_c">
                                <el-form-item class="yixiang_form" label="人员规模" label-width="59px" size="small">
                                    <el-select v-model="formAddXianSuo.company.staffSize">
                                        <el-option :key="index" :label="val.label" :value="val.id"
                                                   v-for="(val, index) in rygmoptions"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="qiyeleixing_form" label="参保人数" label-width="59px" size="small">
                                    <el-select v-model="formAddXianSuo.company.insuredNumber">
                                        <el-option :key="index" :label="val.label" :value="val.id"
                                                   v-for="(val, index) in rygmoptions"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="suoshudiqu_form" label="地图标点" label-width="59px" size="small">
                                    <el-input :disabled="true" class="input-with-select"
                                              placeholder="点击按钮获取"
                                              style="width: 170px;"
                                              v-model="lng_lat.address"
                                    >
                                    </el-input>
                                    <el-button @click="map_add_show" icon="el-icon-place" size="mini"
                                               type="primary"></el-button>
                                </el-form-item>
                            </div>
                            <div class="form_label_v">
                                <el-form-item label="注册资本" label-width="59px" size="small">
                                    <el-input
                                            @input="formAddXianSuo.company.registeredCapital=formAddXianSuo.company.registeredCapital.replace(/^(0+)|[^\d]+/g, '')"
                                            v-model="formAddXianSuo.company.registeredCapital"></el-input>
                                    万元
                                </el-form-item>
                                <el-form-item label="实缴资本" label-width="59px" prop="company.contributedCapital"
                                              size="small">
                                    <el-input
                                            @input="formAddXianSuo.company.contributedCapital=formAddXianSuo.company.contributedCapital.replace(/^(0+)|[^\d]+/g, '')"
                                            v-model="formAddXianSuo.company.contributedCapital"></el-input>
                                    万元
                                </el-form-item>
                                <el-form-item class="suoshuhangye_form" label="所属行业" label-width="59px" size="small">
                                    <el-cascader
                                            :options="hangYeData"
                                            :props="listPropsHY"
                                            @change="handleChanges"
                                            v-model="formAddXianSuo.company.industryId"
                                    ></el-cascader>
                                </el-form-item>
                            </div>
                            <div class="form_label_h">
                                <el-form-item label="成立日期" label-width="59px" size="small">
                                    <el-date-picker
                                            placeholder="选择日期"
                                            style="width: 100%;"
                                            type="date"
                                            v-model="formAddXianSuo.company.foundDate"
                                            value-format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </el-form-item>
                                <el-form-item label="核准日期" label-width="59px" size="small">
                                    <el-date-picker
                                            placeholder="选择日期"
                                            style="width: 100%;"
                                            type="date"
                                            v-model="formAddXianSuo.company.approvedDate"
                                            value-format="yyyy-MM-dd"
                                    ></el-date-picker>
                                </el-form-item>
                                <el-form-item class="suoshuhangye_form" label="营业期限" label-width="59px" size="small">
                                    <el-select v-model="formAddXianSuo.company.businessTerm">
                                        <el-option :key="index" :label="val.label" :value="val.id"
                                                   v-for="(val, index) in yq_options"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="form_label_k">
                                <el-form-item class="baifen1" label="登记机关" label-width="59px" size="small" style="">
                                    <el-input v-model="formAddXianSuo.company.registerOffice"></el-input>
                                </el-form-item>
                                <el-form-item class="baifen" label="注册地址" label-width="59px" size="small" style="">
                                    <el-input v-model="formAddXianSuo.company.registeredAddress"></el-input>
                                </el-form-item>
                                <div class="zhankai_shouqi">
                                    <el-button @click="clickshowbut(1)" style="color:#32AFF0;" type="text"
                                               v-if="showbut == 0">
                                        收起 <i class="el-icon-arrow-up"></i>
                                    </el-button>
                                    <el-button @click="clickshowbut(0)" style="color:#32AFF0;" type="text"
                                               v-if="showbut != 0">
                                        展开 <i class="el-icon-arrow-down"></i>
                                    </el-button>
                                </div>
                            </div>
                            <el-collapse-transition>
                                <div class="zhankai_shouqi_hid" v-show="show">
                                    <el-row class="texareaNone">
                                        <el-form-item label="经营范围" label-width="59px" size="small">
                                            <el-input :autosize="{ minRows: 1, maxRows: 4}" maxlength="100"
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
                                            <el-input :autosize="{ minRows: 1, maxRows: 4}" maxlength="100"
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
                                            <el-input :autosize="{ minRows: 1, maxRows: 4}" maxlength="100"
                                                      placeholder="财务状况"
                                                      resize="none"
                                                      show-word-limit
                                                      type="textarea"
                                                      v-model="formAddXianSuo.company.financialCondition"
                                            ></el-input>
                                        </el-form-item>
                                    </el-row>
                                    <el-row>
                                        <el-form-item class="foem_table_button" label="资质资格" label-width="59px"
                                                      size="small">
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
                                                    <el-table-column :resizable="false" align="center" label="序号"
                                                                     width="50">
                                                        <template slot-scope="scope">
                                                            <span>{{ scope.$index + 1 }} </span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :resizable="false" label="资质类型">
                                                        <template slot-scope="scope">
                                                            <el-input class="require_des"
                                                                      v-model="scope.row.qualificationType"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :resizable="false" label="资质证书号">
                                                        <template slot-scope="scope">
                                                            <el-input class="require_des"
                                                                      v-model="scope.row.qualificationNumber"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :resizable="false" label="资质名称">
                                                        <template slot-scope="scope">
                                                            <el-input class="require_des"
                                                                      v-model="scope.row.qualificationNames"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="发证日期">
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
                                                    <el-table-column :resizable="false" label="证书有效期">
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
                                                    <el-table-column :resizable="false" label="发证机关">
                                                        <template slot-scope="scope">
                                                            <el-input class="require_des" clear-icon
                                                                      v-model="scope.row.issueUnit"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :resizable="false" label="操作" width="89">
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
                                        <el-form-item class="foem_table_button" label="注册人员" label-width="59px"
                                                      size="small">
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
                                                    <el-table-column :resizable="false" align="center" label="序号"
                                                                     width="50">
                                                        <template slot-scope="scope">
                                                            <span>{{ scope.$index + 1 }} </span>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :resizable="false" label="姓名">
                                                        <template slot-scope="scope">
                                                            <el-input class="require_des"
                                                                      v-model="scope.row.name"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :resizable="false" label="注册类别">
                                                        <template slot-scope="scope">
                                                            <el-input class="require_des"
                                                                      v-model="scope.row.certType"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="身份证">
                                                        <template slot-scope="scope">
                                                            <el-input class="require_des"
                                                                      v-model="scope.row.identityCard"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :resizable="false" label="注册号">
                                                        <template slot-scope="scope">
                                                            <el-input class="require_des"
                                                                      v-model="scope.row.registryNumber"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :resizable="false" label="注册专业">
                                                        <template slot-scope="scope">
                                                            <el-input class="require_des"
                                                                      v-model="scope.row.major"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :resizable="false" label="内容">
                                                        <template slot-scope="scope">
                                                            <el-input style="height: 100%;" type="textarea"
                                                                      v-model="scope.row.content"></el-input>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column :resizable="false" fixed="right" label="操作"
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
                                        <el-form-item class="form_forms_item texareaNone" label="知识产权"
                                                      label-width="59px" size="small">
                                            <div class="form_items_display">
                                                <el-form-item class="item_form" label="商标" label-width="31px"
                                                              size="mini">
                                                    <el-input placeholder="商标"
                                                              v-model="formAddXianSuo.company.propertyBrand"></el-input>
                                                </el-form-item>
                                                <el-form-item class="item_form" label="发明专利" label-width="55px"
                                                              size="mini">
                                                    <el-input placeholder="发明专利"
                                                              v-model="formAddXianSuo.company.propertyInvent"></el-input>
                                                </el-form-item>
                                                <el-form-item class="item_form" label="外观专利" label-width="55px"
                                                              size="mini">
                                                    <el-input placeholder="外观专利"
                                                              v-model="formAddXianSuo.company.propertyDesign"></el-input>
                                                </el-form-item>
                                                <el-form-item class="item_form" label="新型专利" label-width="55px"
                                                              size="mini">
                                                    <el-input placeholder="新型专利"
                                                              v-model="formAddXianSuo.company.propertyPattern"></el-input>
                                                </el-form-item>
                                                <el-form-item class="item_form" label="软件著作" label-width="55px"
                                                              size="mini">
                                                    <el-input placeholder="软件著作"
                                                              v-model="formAddXianSuo.company.propertySoftware"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-form-item>
                                    </el-row>
                                    <el-row>
                                        <el-form-item label="资质认定" label-width="59px" size="small">
                                            <el-checkbox-group v-model="formAddXianSuo.company.qualifications">
                                                <el-checkbox :key="index" :label="city" :value="city"
                                                             v-for="(city, index) in cities">
                                                    {{ city }}
                                                </el-checkbox>
                                            </el-checkbox-group>
                                        </el-form-item>
                                    </el-row>
                                    <el-row>
                                        <div class="check_boxs">
                                            <el-form-item class="form_forms_item" label="项目申报" label-width="59px"
                                                          size="small">
                                                <el-checkbox-group v-model="formAddXianSuo.company.projectApplications">
                                                    <el-checkbox :key="index" :label="city" :value="city"
                                                                 v-for="(city, index) in cities_shenbao">
                                                        {{ city }}
                                                    </el-checkbox>
                                                </el-checkbox-group>
                                            </el-form-item>
                                        </div>
                                        <div class="check-boxs_right texareaNone">
                                            <el-form-item label="项目备注" label-width="59px" size="small">
                                                <el-input :autosize="{ minRows: 1, maxRows: 4}" maxlength="100"
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
            <span class="dialog-footer" slot="footer">
        <span class="title_right"
        ><span>带 <span class="title_vio"> * </span>为必填项</span></span
        >
        <el-button @click="empty_xiansuo" size="mini">取消</el-button>
        <el-button @click="submit_xiansuo('ruleFormXiansuo', 0)" size="mini" type="primary">保存</el-button>
      </span>
        </el-dialog>
        <!--地图选点-->
        <xiansuo-mapselect :addMap_dialog="addMap_dialog" @mapClose="mapClose" @toMapVal="toMapVal"></xiansuo-mapselect>
        <!--添加跟进记录-->
        <xiansuo-addgenjin :change_show_radio="change_show_radio" :genjin_dialog="genjin_dialog" :leadsId="leadsId"
                           :yixData="yixData" :yxGenJinData="yxGenJinData" @genJinFunc="genJinFunc"
                           @gjClose="gjClose" @radio_change="radio_change"></xiansuo-addgenjin>
        <!--提示-->
        <el-dialog :close-on-click-modal="false" :show-close="false" :visible.sync="tips_dalig" title="提示" width="25%">
            <p style="line-height: 20px">当前企业不存在，是否创建企业信息?</p>
            <span class="dialog-footer" slot="footer">
               <el-button @click="()=>{tips_dalig=false;formAddXianSuo.company.companyName = ''}"
                          size="mini">取消</el-button>
               <el-button @click="companyChunagJian" size="mini" type="primary">确定</el-button>
      </span>
        </el-dialog>
        <!--更多筛选抽屉-->
        <gengduo-shaixuan :dengji_options="dengji_options" :shaixuan_drawer="shaixuan_drawer" :yq_options="yq_options"
                          :zzqkdata="zzqkdata"
                          @tableGdSx="get_tableData1" @tableGdSxFalse="tableGdSxFalse">
        </gengduo-shaixuan>
    </div>
</template>

<script>
    import myMixin from "../../../assets/js/minx/xiansuo";
    import tree from "../../../components/tree/tree";
    import gengduoShaixuan from "../../../components/xiansuogedushxu"
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
        name: "index",
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
            tree, gengduoShaixuan, xiansuoAddgenjin, xiansuoMapselect, xiansuoBohao
        },
        mixins: [myMixin],
        props: [],
        data() {
            return {
                listLoading: false,
                siyouBohao: false,
                shaixuan_drawer: false /*更多筛选抽屉*/,
                flagMapLngLat: {lng: null, lat: null},
                flagMap: true,
                yxGenJinData: [],
                marpData: [],
                dynamicTags: [],
                listHover: [],
                userList: [],
                rowData: {},
                fanwei_dialog: false,
                tips_dalig: false,
                change_show_radio2: true,
                status_tree: "GHK",
                value: "" /*页面报错*/,
                MapKeyword: "",
                location: "",
                districtType: 0, //行政区域
                list: [] /*树形控件列表*/,
                markers: [],
                aaaa: false,
                infoWindow: {
                    show: false,
                    info: {},
                },
                activeName: "",
                leftHeight: "540px",
                containerHeight: "700px",
                map: {
                    width: "100%",
                    height: "100%",
                    padding: "0 20px 20px 0",
                    center: {lng: 0, lat: 0},
                    zoom: 10,
                    chfwSelectData: 1,
                } /*地图初始化*/,
                options: [],
                treeList: [],
                tableDatasList: {},
                add_dialog: false,
                zhipai_dialog: false,
                bohao_dialog: false,
                liexiang_dialog: false,
                change_show_radio: true,
                dialogDaoRu: false,
                mapShow_status: false,
                checkAll: false,
                checked: false,
                genjin_dialog: false,
                addMap_dialog: false,
                show: false /*展开收起*/,
                showbut: 1 /*展开收起*/,
                currentPage4: 1 /*分页*/,
                pageNum: 0,
                pageSize: 10,
                total: 0,
                data: [],
                leadsId: "",
                select_box: [],
                options_diqu: [],
                array_XSid: [],
                depId: "",
                laiyuan_options: [],
                tableData: [] /*表格数据*/,
                tableData2: [],
                options_biaoqian: [],
                tag_lists: [],
                lists: [] /*用户下部门树列表*/,
                // rules表单验证
                rules: {
                    name: [{required: true, message: "请输入导航名称", trigger: "blur"}],
                    link: [{required: true, message: "请输入导航地址", trigger: "blur"}],
                    desc: [
                        {required: true, message: "请输入导航描述", trigger: "blur"},
                        {
                            validator: (rule, value, callback) => {
                                if (/^[0-9]\d*$/.test(value) == false) {
                                    callback(new Error("顺序号必须为整数"));
                                } else {
                                    callback();
                                }
                            },
                            trigger: "blur",
                        },
                    ],
                },
                rulesXiansuo: {},
                isIndeterminate: true,
                button_status_add: true,
                button_status_del: false,
                get_table_list: false,
                assignType: null,
                userID: "",
                userMangageType: false,
                get_lingqu_list: false,
                genjinLook: false,
                bohaoLook: false
            };
        },
        watch: {
            'infoWindow.show': {
                handler(newVal, oldVal) {
                    if (!newVal) {
                        this.infoWindow.info = {}
                    }
                }
            },
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
        mounted() {
            this.getPower()
            let userMangage = this.getDataStorge("userMessage");
            if (userMangage.manageDepId === null) {
                this.userMangageType = true
            }
            this.userID = userMangage.userId
            this.get_tableData();
            this.formAddXianSuo.contactList.length === 1 ? (this.button_status_del = false) : (this.button_status_del = true);
            this.getHangye();
            this.getYixiang();
            this.get_laiyuan_list();
            this.get_biaoqian_list();
            this.userCheckJIlu();
            this.get_laiyuanData();
            setInterval(function () {
                document.querySelectorAll(".el-cascader-node .el-radio").forEach(el => {
                    el.style.display = "none"
                });
                document.querySelectorAll(".el-cascader-node__label").forEach(el => {
                    el.onclick = function () {
                        if (this.previousElementSibling) this.previousElementSibling.click();
                    };
                });
            }, 1);
        },
        methods: {
            //权限
            getPower() {
                // 列表查看、线索详情查看、添加、领取/批量领取（列表和详情）、跟进（列表和详情）、拨号（列表和详情）
                this.get_table_list = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-gonghai/get-table-list");/*列表查看*/
                this.get_lingqu_list = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-gonghai/get-lingqu-look");/*详情领取状态*/
                this.genjinLook = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-gonghai/get-genjin-look");/*详情领取状态*/
                this.bohaoLook = this.verification(this.$store.state.selectBtnJurisdiction, "/xiansuo-gonghai/get-bohao-look");/*跟进状态传递*/
            },
            async infoWindowOpens(comId, leaType, lng, lat, e) {
                console.log(comId);
                // this.aaaa = !this.aaaa;
                this.infoWindow.show = !this.infoWindow.show;
                if (this.infoWindow.show) {
                    let res = await this.Axios.get(`leads-api/companylist/getByCompanyId?companyId=${comId}&leadsType=${leaType}`);
                    if (res.data.code === 0) {
                        if (!this.isEmptyObj(res.data.result)) {
                            this.infoWindow.info = res.data.result;
                            Object.assign(this.infoWindow.info, {lng: lng, lat: lat})
                            this.getHoverLIst(res.data.result);
                        }
                    }
                }
            },
            //选择地图查看范围
            selectMapSpot(val) {
                let lng = this.lng_lat.longitude;
                let lat = this.lng_lat.latitude;
                if (!this.isobjEmpty(lng)) {
                    if (!this.isobjEmpty(lat)) {
                        this.mapSelectAxios(lng, lat, val, 0);
                    }
                } else {
                    this.showMessage("info", "点击地图获取经纬度");
                }
            },
            //接口
            async mapSelectAxios(lng, lat, scope, leadsType) {
                let res = await this.Axios.get(
                    `leads-api/companylist/queryByLocation?longitude=${lng}&latitude=${lat}&scope=${scope}&leadsType=${leadsType}`
                );
                if (res.data.code === 0) {
                    this.marpData = res.data.result;
                    if (res.data.result.length === 0) {
                        this.showMessage("info", "当前位置暂无数据");
                    }
                }
            },
            handlerBMaps({BMap, map}) {
                window.BMap = BMap;
                window.map = map;
                this.map.center.lng = 117.2157
                this.map.center.lat = 39.080326
                this.map.zoom = 10;
                // let _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
                // var geolocation = new BMap.Geolocation();
                // geolocation.getCurrentPosition(
                //    function (r) {
                //      _this.center = {lng: r.longitude, lat: r.latitude}; // 设置center属性值
                //      _this.autoLocationPoint = {lng: r.longitude, lat: r.latitude}; // 自定义覆盖物
                //      _this.initLocation = true;
                //    },
                //    {enableHighAccuracy: true}
                // );
                map.addEventListener("click", this.addMapEvent);
            },
            //添加点击图片
            mapClickEnd(e) {
                let Icon_0 = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
                    offset: new BMap.Size(10, 25), // 指定定位位置
                    imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
                });
                var myMarker = new BMap.Marker(new BMap.Point(e.Ag.lng, e.Ag.lat), {
                    icon: Icon_0,
                });
                if (this.flagMap === true) {
                    map.addOverlay(myMarker);
                    this.addMapEvent(e)
                } else {
                    this.flagMapLngLat.lng = null
                    this.flagMapLngLat.lat = null
                }
            },
            addMapEvent(e) {
                if (this.flagMap) {
                    this.flagMapLngLat.lng = e.Ag.lng;
                    this.flagMapLngLat.lat = e.Ag.lat;
                    this.lng_lat.longitude = this.flagMapLngLat.lng
                    this.lng_lat.latitude = this.flagMapLngLat.lat
                    this.$nextTick(() => {
                        this.mapSelectAxios(this.lng_lat.longitude, this.lng_lat.latitude, this.map.chfwSelectData, 0);
                    })
                    map.removeEventListener("click", this.addMapEvent);
                    this.flagMap = false
                }
            },
            //重新选点
            againBiaoDian() {
                this.lng_lat.longitude = null
                this.lng_lat.latitude = null
                this.marpData = []
                map.clearOverlays();
                this.flagMap = true
                this.infoWindow.info = {}
            },
            //点击地图按钮
            creatElementMap(e) {
                this.mapShow_status = true;
            },
            //筛选
            async getListTable(data) {
                this.listLoading = true
                data.leadsQueryInfo.pageNum = this.pageNum;
                data.leadsQueryInfo.pageSize = this.pageSize;
                let res = await this.Axios.post(`leads-api/leadslist/queryByInfo`, data, "postJson");
                if (res.data.code === 0) {
                    this.tableData = res.data.result;
                    this.total = res.data.total;
                    this.listLoading = false
                }
            },
            //获取列表数据
            async get_tableData() {
                let data = JSON.parse(JSON.stringify(this.form_list_)),
                    industryIds = "" || [],
                    sourceIds = "" || [],
                    labelIds = "" || [];
                industryIds = data.companyInfo.industryId;
                sourceIds = data.leadsQueryInfo.sourceId;
                labelIds = data.labelId;
                industryIds.length === 0
                    ? (data.companyInfo.industryId = "")
                    : (data.companyInfo.industryId = industryIds[industryIds.length - 1]);
                sourceIds.length === 0
                    ? (data.leadsQueryInfo.sourceId = "")
                    : (data.leadsQueryInfo.sourceId = sourceIds[sourceIds.length - 1]);
                labelIds.length === 0 ? (data.labelId = "") : (data.labelId = labelIds[labelIds.length - 1]);
                data.followQueryInfo.ignoringStatus ? (data.followQueryInfo.ignoringStatus = 1) : (data.followQueryInfo.ignoringStatus = '');
                if (data.followQueryInfo.intentionLevel) data.followQueryInfo.intentionLevel = parseInt(data.followQueryInfo.intentionLevel)
                delete data.companyInfo.foundDates;
                delete data.companyInfo.registered;
                delete data.companyInfo.contributed;
                delete data.leadsQueryInfo.areaIdList;
                delete data.leadsQueryInfo.province;
                delete data.leadsQueryInfo.city;
                data.leadsQueryInfo.leadsType = 0;
                this.pageNum = 0;
                this.pageSize = 10;
                this.currentPage4 = 1;
                this.removeNullItem(data); /*为空处理*/
                this.tableDatasList = data;
                this.getListTable(data);
            },
            //子组件传值给父组件
            get_tableData1(data) {
                this.shaixuan_drawer = false;
                Object.assign(this.form_list_.companyInfo, {...data.companyInfo})
                this.get_tableData()
            },
            //关闭抽屉
            tableGdSxFalse() {
                this.shaixuan_drawer = false;
            },
            //点击拨打手机
            phone_tel(row, val) {
                this.$confirm("确定拨打此电话吗", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.rowData = row;
                        this.leadsId = row.leadsId;
                        this.telIng(this.leadsId);
                    })
                    .catch(() => {
                        this.showMessage("info", "已取消此操作");
                    });
            },
            async genJinFunc(data) {
                let res = await this.Axios.post("leads-api/followlist/insertFollow", data, "postJson");
                if (res.data.code === 0) {
                    this.showMessage("success", "提交成功");
                    this.genjin_dialog = false;
                    this.bohao_dialog = false;
                    this.getListTable(this.tableDatasList);
                }
            },
            //更多筛选提交按钮
            onSubmit() {
                this.shaixuan_drawer = false;
                this.get_tableData();
                this.cancelForm();
            },
            //更多筛选
            gengduo_shaixuan() {
                this.shaixuan_drawer = true;
            },
            //点击节点
            nodeClick(s, d, n) {
                this.depId = d.depId;
                this.getUserList(this.depId);
            },
            //批量指派
            async piliang_zhipai_button() {
                if (this.select_box.length !== 0) {
                    this.array_XSid = this.select_box.map((item) => parseInt(item.leadsId));
                    await this.check_off_no();
                } else {
                    this.showMessage("info", "请选择要操作的数据");
                }
            },
            //指派
            async zhipai(row) {
                this.array_XSid = [row.leadsId];
                await this.check_off_no();
            },
            //判断当前线索是否存在关联线索
            async check_off_no() {
                let data = {
                    leadsId: [...this.array_XSid],
                    leadsType: 0 /*0:指派公海库线索 1:指派私有库线索*/,
                };
                var res = await this.Axios.post("leads-api/leadslist/ifCorrelation", data);
                if (res.data.result !== "0") {
                    this.$confirm("选择中的线索信息存在关联线索", "提示", {
                        distinguishCancelAndClose: true,
                        confirmButtonText: "指派所有",
                        cancelButtonText: "指派选中线索",
                        type: "warning",
                    })
                        .then(() => {
                            this.getOrgLists();
                            this.zhipai_dialog = true;
                            this.assignType = 1;
                        })
                        .catch((action) => {
                            if (action === "cancel") {
                                this.getOrgLists();
                                this.zhipai_dialog = true;
                                this.assignType = 0;
                            } else {
                                this.showMessage("info", "已取消此操作");
                            }
                        });
                } else {
                    this.getOrgLists();
                    this.zhipai_dialog = true;
                    this.assignType = 0;
                }
            },
            //确定指派
            async y_zhipai() {
                if (this.formZP.name.length !== 0) {
                    let data = {
                        leadsId: this.array_XSid,
                        user: this.formZP.name,
                        leadsType: 0 /*0:指派公海库线索 1:指派私有库线索*/,
                        assignType: this.assignType /*0:指派选中线索 1:指派选中线索和关联线索*/,
                    };
                    var res = await this.Axios.post("/leads-api/leadslist/appointByUserId", data);
                    if (res.data.code === 0) {
                        this.showMessage("success", "指派成功");
                        this.zhipai_dialog = false;
                        this.getListTable(this.tableDatasList);
                    }
                } else {
                    this.showMessage("info", "请选择要指派的人员")
                }
            },
            //获取组织列表
            async getOrgList() {
                let _resp = await this.Axios.get(`ucenter-api/departmentlist/tree`);
                this.depId = await _resp.data.result[0].depId;
                this.list = [this.dataAssemblyss(_resp.data.result[0])];
                this.getUserList(this.depId);
            },
            async getUserList(depId) {
                let res = await this.Axios.get(`ucenter-api/userlist/getUserList?depId=${depId}`);
                if (res.data.code === 0) {
                    this.userList = res.data.result;
                }
            },
            //树列表数据处理
            dataAssemblyss(data) {
                let _data = JSON.parse(JSON.stringify(data)); //深拷贝
                function change(data) {
                    Object.keys(data).forEach((val) => {
                        Object.assign(data, {isFirst: false, isEdit: false});
                        if (val == "children") {
                            data[val].forEach((val2) => {
                                change(val2);
                            });
                        }
                    });
                }

                change(_data);
                return _data;
            },
            //表格选中项数组
            select_checkBox(val) {
                this.select_box = val;
            },
            //批量领取
            lingqu_button() {
                if (this.select_box.length !== 0) {
                    var ids = this.select_box.map((item) => parseInt(item.leadsId));
                    this.$confirm("确认领取吗?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(() => {
                            let data = {
                                updateType: 0,
                                leadsId: [...ids],
                            };
                            this.lingqu_func(data);
                        })
                        .catch(() => {
                            this.showMessage("info", "已取消操作");
                        });
                } else {
                    this.showMessage("info", "请选择要操作的数据");
                }
            },
            //领取
            lingqu(row) {
                this.$confirm("确认领取吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        let ids = [];
                        ids.push(parseInt(row.leadsId));
                        let data = {
                            updateType: 0,
                            leadsId: ids,
                        };
                        this.lingqu_func(data);
                    })
                    .catch(() => {
                        this.showMessage("info", "已取消操作");
                    });
            },
            //指派搜索框选中
            changeformZP(val) {
                this.formZP.name = this.formZP.checkedName = val
            },
            infoWindowClose(e) {
                // this.infoWindow.show = false;
            },
            //详情
            router_to(row) {
                let querys = {
                    bool: true,
                    row_id: row.leadsId,
                    row_id_z: row.id,
                    row_id_company: row.companyId,
                    lingqulook: this.get_lingqu_list,
                    genjinLook: this.genjinLook,
                    bohaoLook: this.bohaoLook
                };
                this.pushParams(querys);
            },

            //搜索人名
            search_tree() {
            },

            //恢复默认
            huifumoren() {
            },
            //上传文件
            shangchuan() {
            },
            // 获取表格选中时的数据
            selectRow(val) {
                this.selectlistRow = val;
            },
            // 获取表格选中时的数据
            selectRow2(val) {
                this.selectlistRow2 = val;
            },
            //下载模板
            filingRate() {
                // var a = document.createElement('a')
                // // a.href = 'http://60.247.58.105:19608/api/item/export'
                // a.href = `${base.baseUrl}/item/export`
                // document.body.appendChild(a);
                // a.click();
                // document.body.removeChild(a);
            },
            //    清空
            empty_xiansuo() {
                this.add_dialog = false;
            },
            //地图选点
            map_add_show() {
                this.addMap_dialog = true;
            },
            //处理经纬度
            input_lng_lat(lng, lat) {
                this.lng_lat = `${lng},${lat}`;
            },
            //跟进
            genjin(row) {
                this.leadsId = row.leadsId;
                this.genjin_dialog = true;
            },
            //批量导入
            daoRu_button() {
                this.dialogDaoRu = true;
            },
            //线索来源change事件
            async laiyuanChange(val) {
                val = parseInt(val[val.length - 1]);
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getListTable(this.tableDatasList);
            },
            handleCurrentChange(val) {
                this.currentPage4 = val;
                this.pageNum = val - 1;
                this.getListTable(this.tableDatasList);
            },
            handleChange(value) {
                console.log(value);
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.cities.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
            closeDialog() {
                if (this.$refs.ruleFormXiansuo) {
                    this.$refs.ruleFormXiansuo.resetFields();
                    this.$refs.ruleFormXiansuo.clearValidate();
                    this.formAddXianSuo.contactList[0].contactType = "1"
                    this.formAddXianSuo.contactList[0].contactValue = ""
                    this.formAddXianSuo.contactList[0].sex = null
                    this.formAddXianSuo.contactList[0].contactName = ""
                    this.formAddXianSuo.contactList[0].position = ""
                    this.formAddXianSuo.company.financialCondition = ""
                    this.formAddXianSuo.company.latitude = null
                    this.formAddXianSuo.company.longitude = null
                    this.formAddXianSuo.company.businessScope = ""
                    this.formAddXianSuo.company.projectInfo = ""
                    this.formAddXianSuo.company.registeredAddress = ""
                    this.formAddXianSuo.company.insuredNumber = null
                    this.formAddXianSuo.company.registerOffice = ""
                    this.formAddXianSuo.company.staffSize = null
                    this.formAddXianSuo.company.companyType = null
                    this.formAddXianSuo.company.businessTerm = null
                    this.formAddXianSuo.company.approvedDate = ""
                    this.formAddXianSuo.company.industryId = null
                    this.formAddXianSuo.company.registeredCapital = ""
                    this.formAddXianSuo.company.contributedCapital = ""
                    this.formAddXianSuo.company.registeredStatus = null
                    this.formAddXianSuo.company.foundDate = ""
                    this.formAddXianSuo.company.legalPerson = ""
                    this.formAddXianSuo.company.companyName = ""
                    this.formAddXianSuo.company.companyId = null
                    this.formAddXianSuo.company.id = null
                    this.formAddXianSuo.company.qualifications = []
                    this.formAddXianSuo.company.projectApplications = []
                    this.formAddXianSuo.company.propertyBrand = ""
                    this.formAddXianSuo.company.propertyDesign = ""
                    this.formAddXianSuo.company.propertyInvent = ""
                    this.formAddXianSuo.company.propertyPattern = ""
                    this.formAddXianSuo.company.propertySoftware = ""
                    this.formAddXianSuo.company.remark = ""
                    this.formAddXianSuo.follow.followRecords = ""
                    this.formAddXianSuo.follow.intentionLevel = null
                    this.formAddXianSuo.follow.intentionId = null
                    this.formAddXianSuo.leads.sourceId = []
                    this.formAddXianSuo.leads.address = ""
                    this.formAddXianSuo.leads.area = ""
                    this.formAddXianSuo.leads.city = ""
                    this.formAddXianSuo.leads.province = ""
                    this.formAddXianSuo.leads.areaIdList = []
                    this.formAddXianSuo.leads.leadsType = null
                    this.formAddXianSuo.certList = []
                    this.formAddXianSuo.qualificationList = []
                }
                this.change_show_radio = true
                this.change_show_radio2 = true
                this.baoHao_form.intentionId = null
                this.baoHao_form.intentionLevel = null
                this.baoHao_form.callStatus = null
                this.baoHao_form.followRecords = ""
                this.$refs.BoHaoform && this.$refs.BoHaoform.resetFields();
                this.formFW.name = [];
            },
        },
        created() {
            this.get_column(0);
        },
    };
</script>
<style scope>
    @import "../xiansuo_common.css";
</style>
<!--全局hover-->
<style>
    .popoverXianSuo .el-card__body {
        padding: 5px;
    }

    .popoverXianSuo {
        position: absolute;
        background: rgba(0, 0, 0, 0.7) !important;
        min-width: 450px;
        max-width: 500px;
        border: 0 solid #ebeef5;
        border-radius: 5px;
        padding: 0 0 5px 0;
        z-index: 2000;
        margin-right: 55px;
        color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        word-break: break-all;
        max-height: 445px;
    }

    .popoverXianSuo .tagContent .tagContentDiv {
        display: flex;
        padding: 0 5px;
        align-items: center;
        flex-wrap: wrap;
    }

    .popoverXianSuo .hoverList {
        width: 100%;
    }

    .popoverXianSuo .listsHover,
    .tagContent .tagContentDiv {
        min-height: 40px;
    }

    .popoverXianSuo .hover_empty {
        text-align: center;
        width: 100%;
    }

    .popoverXianSuo .hover_empty,
    .popoverXianSuo .listsHover {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
    }

    .popoverXianSuo .el-card {
        border: none;
        background: none;
        box-shadow: none;
        color: #fff;
    }

    .popoverXianSuo .el-card__body {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .popoverXianSuo .card_time {
        border-bottom: 1px solid #f2f2f2;
    }

    .popoverXianSuo .card_time_left {
        height: 100%;
        width: 125px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 5px;
        font-size: 12px;
    }

    .popoverXianSuo .card_time_right {
        flex: 1;
        /*max-height: 98px;*/
        font-size: 12px;
    }

    .card_time_right .card_time_right_cont {
        display: flex;
        flex-direction: column;
    }

    .card_time_right_cont .card_time_right_top {
        display: flex;
    }

    .card_time_right_top .card_time_right_lef {
        width: 50%;
    }

    .genjinJl {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        overflow: hidden;
    }

    .el-popper[x-placement^="right"] .popper__arrow::after {
        bottom: -0.2px;
        margin-left: -6px;
        border-right-color: #000 !important;
        /*border: 1px solid #16265E;*/
        /*border-bottom-width: 0;*/
        /*border-width: 6px;*/
    }

    .el-popover__title {
        color: #fff;
        text-align: center;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        background-color: rgba(0, 0, 0, 0.5);
        margin-bottom: 0;
    }

    .popoverXianSuo .el-tag--small {
        height: 19px;
        padding: 0 3px;
        line-height: 19px;
    }
</style>
<style lang="less" scoped>
    @import "index.less";
</style>
