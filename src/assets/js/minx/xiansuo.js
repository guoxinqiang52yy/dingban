/*线索系统混入  属性和方法*/
import axios from "axios";
import Sortable from "sortablejs";

/*表格拖动排序*/
let valiData = 0
let mixin = {
  data() {
    // 校验跟进记录长度
    let isfollowRecords = function isfollowRecords(rule, value, callback) {
      if (value.length < 10) {
        callback(new Error("请输入最少10个字符"));
      } else {
        callback();
      }
    };
    //校验公司名称长度
    let iscompanyVali = function iscompanyVali(rule, value, callback) {
      if (value.length < 5 || value.length > 50) {
        callback(new Error("请输入 5 到 50 个字符"));
        valiData = 1
      } else {
        valiData = 2
        callback();
      }
    };
    let isZIbenVali = function isZIbenVali(rule, value, callback) {
      if (value) {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        const isPhone = reg.test(value);
        value = Number(value); //转换为数字
        if (typeof value === "number" && !isNaN(value)) {
          //判断是否为数字
          value = value.toString(); //转换成字符串
          if (value.length < 0 || value.length > 12 || !isPhone) {
            //判断是否为11位手机号
            callback(new Error("请输入完整手机号"));
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入电话号码"));
        }
      }
    };

    //级联下拉懒加载获取数据
    function changeSele(node, resolve) {
      console.log(resolve);

      axios.get(`common-api/address/query?parentId=${node.value}`).then((res) => {
        if (res.data.code === 0) {
          const nodes = res.data.result.map((val) => ({
            value: val.addressId,
            label: val.addressName,
            leaf: node.level >= 2,
          }));
          resolve(nodes);
        }
      });
    }

    return {
      listPropsSHDQ: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          if (node.level === 0) {
            node.value = 0
          }
          changeSele(node, resolve)
          //清除第四级
          if (node.level == 3) {
            node.loading = false
          }
        },
      },
      marpData: [] /*地图标注点*/,
      formAddXianSuo: {
        contactList: [
          {
            contactType: "1",
            contactValue: "",
            sex: null,
            contactName: "",
            position: "",
          },
        ],
        company: {
          financialCondition: "",
          latitude: null,
          longitude: null,
          businessScope: "",
          projectInfo: "",
          registeredAddress: "",
          insuredNumber: null,
          registerOffice: "",
          staffSize: null,
          companyType: null,
          businessTerm: null,
          approvedDate: "",
          industryId: null,
          registeredCapital: "",
          contributedCapital: "",
          registeredStatus: null,
          foundDate: "",
          legalPerson: "",
          companyName: "",
          companyId: "",
          id: null,
          qualifications: [],
          projectApplications: [],
          propertyBrand: "",
          propertyDesign: "",
          propertyInvent: "",
          propertyPattern: "",
          propertySoftware: "",
          remark: "",
          address: '',
        },
        follow: {
          followRecords: "",
          intentionLevel: null,
          intentionId: null,
        },
        leads: {
          sourceId: [],
          address: "",
          area: "",
          city: "",
          province: "",
          areaIdList: [],
          leadsType: null,
        },
        certList: [],
        qualificationList: [],
      } /*添加线索*/,
      form_list_: {
        // companyType: null,
        labelId: [],
        followQueryInfo: {
          intentionId: null || "",
          ignoringStatus: false,
          callStatus: null || "",
          intentionLevel: null || "",
        },
        companyInfo: {
          industryId: [],
          // foundDates: "" /*成立日期*/,
          // foundDateStart: null,
          // foundDateEnd: null,
          // contributed: "" /*实缴资本*/,
          // contributedCapitalStart: null,
          // contributedCapitalEnd: null,
          // registered: "" /*注册资本*/,
          // registeredCapitalStart: null,
          // registeredCapitalEnd: null,
          // businessTerm: null /*营业期限*/,
          // registeredStatus: null,
        },
        leadsQueryInfo: {
          areaType: null,
          sourceId: [],
          province: "",
          city: "",
          area: "",
          rangeType: 0,
          checkRange: [],
          like: "",
          leadsType: null,
          pageNum: 0,
          pageSize: 10,
          areaIdList: [],
        },
      } /*筛选表单*/,
      // genjin_form: {
      //   intentionId: null,
      //   intentionLevel: null,
      //   followRecords: "",
      // } /*跟进表单*/,
      // baoHao_form: {
      //   intentionId: null,
      //   intentionLevel: null,
      //   callStatus: null,
      //   followRecords: "",
      // } /*拨号表单*/,
      formZP: {
        checkedName: "",
        name: "",
      } /*指派表单*/,
      formFW: {
        name: [],
      } /*指派表单*/,
      ruleFormXiansuo: {
        "company.companyName": [{required: true, message: "请输入企业名称", trigger: "blur"},
          {validator: iscompanyVali, trigger: "blur"}],
        "company.contributedCapital": [{required: false, pattern: /^[0-9]*$/, message: "只能输入数字"}],
        "company.registeredCapital": [{required: false, pattern: /^[0-9]*$/, message: "只能输入数字"}]
      },
      // RMBdatas: [
      //   {
      //     RMBdata1: [
      //       {id: 1, label: "0-100万"},
      //       {id: 2, label: "100-500万"},
      //       {id: 3, label: "500-1000万"},
      //     ],
      //     RMBdata2: [
      //       {id: 4, label: "1000-2000万"},
      //       {id: 5, label: "2000万-5000万"},
      //       {id: 6, label: "5000万以上"},
      //     ],
      //   },
      // ] /*实缴资本*/,
      rygmoptions: [
        {id: 0, label: "0-50"},
        {id: 1, label: "50-100"},
        {id: 2, label: "100-500"},
        {id: 3, label: "500以上"},
      ] /*人员规模*/,
      zzqkdata: [
        {id: 0, label: "有"},
        {id: 1, label: "无"},
      ],
      ckfwData: [
        {id: 0, label: "查看自己", type: false},
        {id: 1, label: "查看部门", type: false},
      ],
      ckfwDatas: [
        {id: 0, label: "5公里"},
        {id: 1, label: "30公里"},
        {id: 2, label: "150公里"},
      ],
      yq_options: [
        {id: 0, label: "10年"},
        {id: 1, label: "30年"},
        {id: 2, label: "永久"},
      ],
      leixing_options: [
        {leixing_val: 0, leixing_label: "未知"},
        {leixing_val: 1, leixing_label: "有限公司"},
        {leixing_val: 2, leixing_label: "有限责任公司"},
      ] /*企业类型*/,
      zwData: [
        {id: 0, label: "总经理"},
        {id: 1, label: "副经理"},
        {id: 2, label: "秘书"},
        {id: 3, label: "普通员工"},
      ] /*职位*/,
      phoneTelData: [
        {id: 1, label: "空号"},
        {id: 2, label: "错号"},
        {id: 3, label: "未接通"},
        {id: 4, label: "可接通"},
      ],
      yixData: [
        {id: 2, label: "高度意向"},
        {id: 1, label: "一般意向"},
        {id: 0, label: "无意向"},
      ],
      dengji_options: [
        {label: "未知", id: 0},
        {label: "存续", id: 1},
        {label: "在业", id: 2},
        {label: "吊销", id: 3},
        {label: "注销", id: 4},
        {label: "迁入", id: 5},
        {label: "迁出", id: 6},
        {label: "停业", id: 7},
        {label: "清算", id: 8},
      ],
      listPropsHY: {
        value: "industryId",
        label: "industryTitle",
        children: "children",
        expandTrigger: "hover",
      },
      listPropsBq: {
        value: "labelId",
        label: "name",
        children: "children",
        expandTrigger: "hover",
      },
      listPropsLy: {
        value: "sourceId",
        label: "name",
        children: "children",
        expandTrigger: "hover",
      },
      xaidan_form: {
        fwvalue: null,
        templateId: null,
        isTalent: false,
      } /*下单*/,
      dianhuajilu_form: {
        date_count: "",
        date: "",
        search: "",
      } /*电话记录*/,
      lng_lat: {
        longitude: "",
        latitude: "",
        address: "",
      } /*地图选点*/,
      userCheckJIludata: {
        status: false,
      } /*用户检验未填数据*/,
      // rulesBoHao: {
      //   intentionId: [{required: true, message: "请选择意向服务", trigger: "change"}],
      //   intentionLevel: [{required: true, message: "请选择意向度", trigger: "change"}],
      //   callStatus: [{required: true, message: "请选择电话状态", trigger: "change"}],
      //   followRecords: [{required: true, message: "请输入备注", trigger: "blur"},
      //     {validator: isfollowRecords, trigger: "blur"}],
      // },

      cities: ["知识产权贯标", "高新技术企业认定", "两化融合贯标", "雏鹰", "瞪羚", "国家科小", "股改", "新三板", "OTC"],
      cities_shenbao: ["科委项目", "工信局项目", "商委项目", "区级项目"],
      tableHead: [] /*表头*/,
      hangYeData: [] /*行业*/,
      treeList: [] /*标签树列表*/,
      treeListLy: [],
      liexiang_dialog: false /*显示列项*/,
      status_tree: "BqPz",
      table_liexiang: [],
      table_liexiang2: [],
      tableEmpty: "",
      //表头样式
      table_heard_style: {
        backgroundColor: "#F3F6FD",
        color: "#606266",
        padding: "8px 0",
        textAlign: "center",
      },
      uploadProgress: "",
    };
  },
  methods: {
    //打开标注点窗口
    async infoWindowOpen(comId, leaType, lng, lat) {
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
    async getEaceSelectData(areaId, leaType, areaType) {
      let res = await this.Axios.get(`leads-api/companylist/queryByArea?areaId=${areaId}&leadsType=${leaType}&areaType=${areaType}`);
      if (res.data.code === 0) {
        this.marpData = res.data.result;
        if (res.data.result.length === 0) {
          this.showMessage("info", "当前位置暂无数据");
        }
      }
    },
    //级联下拉获取地图公司位置
    handleSelects(val, num) {
      if (!this.isobjEmpty(val)) {
        this.getEaceSelectData(val[val.length - 1], num, val.length);
      }
    },
    // 校验当前用户是否有未跟进的备注
    async userCheckJIlu() {
      let res = await this.Axios.get("leads-api/followlist/ifFollowUp");
      if (res.data.code === 0) {
        if (!this.isobjEmpty(res.data.result)) {
          let leadid = res.data.result.leadsId;
          this.userCheckJIludata = {
            leadsId: leadid,
            id: res.data.result.id,
            followId: res.data.result.followId,
            status: true,
          };
          console.log(this.userCheckJIludata);
          this.getuserCheckJIlu(leadid);
          this.bohao_dialog = true;
        }
      }
    },
    //获取未备注的用户信息
    async getuserCheckJIlu(leadsId) {
      let res = await this.Axios.get(`leads-api/leadslist/getByLeadsId?leadsId=${leadsId}`);
      this.rowData = res.data.result;
    },
    //拨号提交修改备注
    async updateUserData(data) {
      let res = await this.Axios.post(`leads-api/followlist/updateRecords`, data, "postJson");
      if (res.data.code === 0) {
        this.showMessage("success", "修改成功");
        console.log(this.userCheckJIludata);
        this.userCheckJIludata.status = false;
        this.bohao_dialog = false;
        this.getListTable(this.tableDatasList);
        // /*回调递归*/
        let that = this;
        setTimeout(function () {
          that.userCheckJIlu();
        }, 1000);
      }
    },
    bohaoClose(){
      this.bohao_dialog = false
    },
    // //公海库拨号提交并领取
    // bohaoGHSubmit(formData, num) {
    //   this.$refs[formData].validate((valid) => {
    //     if (valid) {
    //       this.$confirm("执行领取操作后,线索添加到到私有库,确认领取吗?", "提示", {
    //            confirmButtonText: "确定",
    //            cancelButtonText: "取消",
    //            type: "warning",
    //          })
    //          .then(() => {
    //            let data_ = {
    //              updateType: 0,
    //              leadsId: [this.userCheckJIludata.leadsId],
    //            };
    //            this.lingqu_func(data_, num);
    //            this.bohaoSubmit(formData);
    //            this.bohao_dialog = false;
    //          })
    //          .catch(() => {
    //            this.showMessage("info", "已取消此操作");
    //          });
    //     }
    //   })
    //
    // },
    // //公海库拨号提交不领取
    // bohaoGHSubmitCacle(formData) {
    //   this.$refs[formData].validate((valid) => {
    //     if (valid) {
    //       this.$confirm("执行不领取操作后,线索会流转到公海且该线索自动隐藏,确认放弃吗?", "提示", {
    //            confirmButtonText: "确定",
    //            cancelButtonText: "取消",
    //            type: "warning",
    //          })
    //          .then(() => {
    //            this.bohaoSubmit(formData);
    //          })
    //          .catch(() => {
    //            this.showMessage("info", "已取消此操作");
    //          });
    //     }
    //   })
    // },
    // //拨号提交
    // bohaoSubmit(formData, num) {
    //   if (!this.change_show_radio2) {
    //     let data1 = {
    //       followType: 0,
    //       callStatus: this.baoHao_form.callStatus,
    //     };
    //     let datas = data1;
    //     Object.assign(datas, this.userCheckJIludata);
    //     if (this.userCheckJIludata.status) {
    //       delete datas.status;
    //       this.updateUserData(datas);
    //     } else {
    //       this.updateUserData(datas);
    //     }
    //   } else {
    //     this.$refs[formData].validate((valid) => {
    //       if (valid) {
    //         let data2 = {
    //           callStatus: this.baoHao_form.callStatus,
    //           intentionId: this.baoHao_form.intentionId,
    //           intentionLevel: this.baoHao_form.intentionLevel,
    //           followRecords: this.baoHao_form.followRecords,
    //           followType: 0 /*跟进类型(0:电话 1:跟进 2:拜访)*/,
    //         };
    //         let datas = data2;
    //         Object.assign(datas, this.userCheckJIludata);
    //         if (this.userCheckJIludata.status) {
    //           delete datas.status;
    //           this.updateUserData(datas);
    //         } else {
    //           this.updateUserData(datas);
    //         }
    //       }
    //     });
    //   }
    // },
    //拨号dialog
    statusRadio(val, num) {
      if (val === 1) {
        this.change_show_radio = false;
        this.change_show_radio2 = false;
      } else {
        if (num !== 0) {
          this.change_show_radio = true;
        } else {
          this.change_show_radio = false;
        }
        this.change_show_radio2 = true;
      }
    },
    //拨号
    async telIng(leadsId) {
      let res = await this.Axios.get(`leads-api/followlist/makingCall?leadsId=${leadsId}`);
      if (res.data.code === 0) {
        this.bohao_dialog = true;
        this.userCheckJIludata = {
          leadsId: res.data.result.leadsId,
          id: res.data.result.id,
          followId: res.data.result.followId,
        };
      }
    },
    //获取展示的标签列表
    async tag_list_(leadId) {
      let res = await this.Axios.get(`leads-api/leadslabel/queryLabelByLeadsId?leadsId=${leadId}`);
      if (res.data.code === 0) {
        this.dynamicTags = res.data.result;
      }
    },
    //
    hoverHide() {
      this.dynamicTags = [];
      this.listHover = [];
    },
    //hover表格事件
    hoveRow(row) {
      this.getHoverLIst(row);
    },
    // 获取
    async getHoverLIst(row) {
      let res = await this.Axios.get(`leads-api/followlist/selectByLeadsId?leadsId=${row.leadsId}&pageNum=0&pageSize=3`);
      this.listHover = res.data.result;
      this.tag_list_(row.leadsId);
    },
    //领取
    async lingqu_func(data, num) {
      let res = await this.Axios.post("leads-api/leadslist/updateStatusById", data);
      if (res.data.code === 0) {
        this.showMessage("success", "操作成功");
        if (num === "details") {
          this.activeName1 = "基本信息";
          this.show = false
          this.showGonghai = false
          this.routerTitle = "私有库"
          this.get_xiansuo_details();
          this.tag_list_(this.leadId);
          this.userCheckJIlu();
        }
        if (this.isobjEmpty(num)) {
          this.getListTable(this.tableDatasList);
        }
      }
    },
    //递归处理行业数据删除 children 字段
    data_(data) {
      data.forEach((val) => {
        if (val.children.length === 0) {
          delete val.children;
        } else {
          this.data_(val.children);
        }
      });
      return data;
    },

    //所在地区
    handleChange1(val, type) {
      // this.$refs['objArrcasa'].dropDownVisible = false; //监听值发生变化就关闭它
      if (type === 1) {
        this.form_list_.leadsQueryInfo.areaType = val.length
        if (val.length === 1) {
          this.form_list_.leadsQueryInfo.area = parseInt(val[0]);
        } else if (val.length === 2) {
          this.form_list_.leadsQueryInfo.area = parseInt(val[1]);
        } else {
          this.form_list_.leadsQueryInfo.area = parseInt(val[2]);
        }
      }
      //添加和编辑
      if (type === 2) {
        this.$nextTick(()=>{
          if (this.formAddXianSuo.leads.areaIdList.length === 1) {
            this.formAddXianSuo.leads.province = parseInt(val[0]);
            this.formAddXianSuo.leads.city = -1
            this.formAddXianSuo.leads.area = -1
          } else if (this.formAddXianSuo.leads.areaIdList.length === 2) {
            this.formAddXianSuo.leads.province = parseInt(val[0]);
            this.formAddXianSuo.leads.city = parseInt(val[1]) || -1;
            this.formAddXianSuo.leads.area = -1
          } else {
            this.formAddXianSuo.leads.province = parseInt(val[0]);
            this.formAddXianSuo.leads.city = parseInt(val[1]) || -1;
            this.formAddXianSuo.leads.area = parseInt(val[2]) || -1;
          }
        })
      }
    },
    // selectFwLx(val) {
    //   if (val) {
    //     this.getMoBanLeiX(val);
    //   } else {
    //     this.xaidan_form.templateId = null;
    //   }
    // },
    // //选择服务获取模板类型
    // async getMoBanLeiX(groupId) {
    //   let res = await this.Axios.get(`order-api/contractconfig/query/by/serve?groupId=${groupId}&type=1`);
    //   this.options_mblx = res.data.result;
    // },

    // option查看范围
    click_ckfw_change(val) {
      if (val === 1) {
        this.fanwei_dialog = true;
      }
    },
    //查看范围
    form_fanwei(val) {
      if (val === 1) {
        this.getOrgLists(this.userID);
        this.fanwei_dialog = true;
      } else {
        this.form_list_.leadsQueryInfo.checkRange = [];
        this.get_tableData();
      }
    },
    //
    async y_fanwei() {
      let arr = [];
      console.log(this.formFW.name);
      if (this.formFW.name.length === 0) {
        this.userList.forEach(value => {
          arr.push(value.userId)
        })
      } else {
        arr = this.formFW.name;
      }
      console.log(arr);
      this.form_list_.leadsQueryInfo.checkRange = arr;
      this.fanwei_dialog = false;
      this.get_tableData();
    },
    //取消
    cacle_fanwei() {
      this.fanwei_dialog = false;
    },
    //获取当前用户下部门
    async getOrgLists() {
      let res = await this.Axios.get(`ucenter-api/admindep/tree`);
      if (res.data.code === 0) {
        this.lists = res.data.result;
        this.depId = await res.data.result[0].depId;
        this.getUserList(this.depId);
      }
    },
    //显示列项按钮
    async liexiang_button(type) {
      this.get_column(type);
      this.liexiang_dialog = true;
      this.$nextTick(() => {
        this.dragSort();
      });
    },
    // //获取筛选表格列
    async get_column(type) {
      this.listLoading = true
      let res = await this.Axios.get(`leads-api/customdisplay/queryByUserId?type=${type}`);
      if (res.data.code === 0) {
        this.table_liexiang = res.data.result;
        let objColumn = {},
           objArr = [],
           field = "",
           fieldName = "",
           statusSope = {},
           statusTable = null,
           sortTable = null;
        this.table_liexiang.forEach((val) => {
          if (val.status === 1 || val.status === 2) {
            field = val.field;
            fieldName = val.fieldName;
            statusTable = val.status;
            sortTable = val.sort;
            objColumn = {
              sort: sortTable,
              status: statusTable,
              field: field,
              fieldName: fieldName,
            };
            objArr.push(objColumn);
            this.tableHead = [...objArr];
          }

          //列项列表处理
          statusSope = {
            showStatus: false,
            showStatus2: 1,
          };
          if (val.status === 1) {
            val.status = true;
            Object.assign(val, statusSope);
          } else if (val.status === 2) {
            val.status = true;
            statusSope.showStatus = true;
            statusSope.showStatus2 = 2;
            Object.assign(val, statusSope);
          } else {
            val.status = false;
            Object.assign(val, statusSope);
          }
        });
        this.table_liexiang2 = this.table_liexiang;
        this.table_liexiang2 = this.table_liexiang2.filter((val) => {
          return val.fieldName !== "企业名称" && val.fieldName !== "联系人" && val.fieldName !== "联系方式";
        });
        this.listLoading = false
      }
    },
    // //表格拖动排序
    async dragSort() {
      const el = this.$refs.singleTable.$el.querySelectorAll(".el-table__body-wrapper > table > tbody")[0];
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost",
        setData: function (dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: (e) => {
          //e.oldIndex为拖动一行原来的位置，e.newIndex为拖动后新的位置
          const targetRow = this.table_liexiang2.splice(e.oldIndex, 1)[0];
          this.table_liexiang2.splice(e.newIndex, 0, targetRow);
        },
      });
    },
    //自定义列表格排序保存
    async sort_Submit(type) {
      this.liexiang_dialog = false;
      let objColumn = {},
         objArr = [],
         field = "",
         fieldName = "";
      let data = this.$refs.singleTable.tableData;
      console.log(this.$refs.singleTable);
      console.log(data);
      let obj = {
        customDisplayList: [...data],
      };
      obj.customDisplayList.forEach((val) => {
        if (val.status === true) {
          if (val.showStatus2 === 2) {
            val.status = 2;
          } else {
            val.status = 1;
          }
        } else {
          val.status = 0;
        }
        if (typeof val.showStatus === "boolean" || val.showStatus2 === "number") {
          delete val.showStatus;
          delete val.showStatus2;
        }
      });
      let res = await this.Axios.post("leads-api/customdisplay/updateCustomDisplayList", obj, "postJson");
      if (res.data.code === 0) {
        this.showMessage("success", "保存成功");
      }
      this.get_column(type);
      this.getListTable(this.tableDatasList);
    },
    //添加线索按钮
    add_xiansuo() {
      this.getYixiang();
      this.get_laiyuanData();
      this.add_dialog = true;
    },
    //处理经纬度
    input_lng_lat(lng, lat) {
      this.lng_lat = `${lng},${lat}`;
    },
    //保存线索
    async submit_xiansuo(formData, num) {
      this.$refs[formData].validate((valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.formAddXianSuo));
          delete data.leads.areaIdList;
          data.leads.leadsType = num;
          data.company.address = this.lng_lat.address
          if (!this.isobjEmpty(data.leads.sourceId)) data.leads.sourceId = parseInt(data.leads.sourceId);
          if (!this.isobjEmpty(data.company.approvedDate)) data.company.approvedDate = this.set_date(data.company.approvedDate);
          if (!this.isobjEmpty(data.company.foundDate)) data.company.foundDate = this.set_date(data.company.foundDate);
          if (!this.isobjEmpty(data.company.industryId))
            data.company.industryId = data.company.industryId[data.company.industryId.length - 1];
          if (!this.isobjEmpty(data.qualificationList)) {
            let arrs = [],
               objs = {};
            for(let a = 0; a <= data.qualificationList.length; a++) {
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
            for(let a = 0; a <= data.certList.length; a++) {
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
            this.removeNullItem(data);
            this.add_func(data);
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
    async add_func(data) {
      let res = await this.Axios.post(`leads-api/leadslist/addLeads`, data, "postJson");
      if (res.data.code === 0) {
        this.showMessage("success", "添加成功");
        this.add_dialog = false;
        this.getListTable(this.tableDatasList);
      }
    },
    //获取企业列表
    async querySearchAsync(queryString, cb) {
      // if (this.gggg){
      this.getNameList(queryString)
      var results = queryString ? this.restaurants.filter(this.createStateFilter(queryString)) : this.restaurants;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1);
      // }
    },
    createStateFilter(queryString) {
      return (state) => {
        return state.companyName.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    async getNameList(queryString) {
      let res = await this.Axios.get(`leads-api/companylist/likeCompanyName?companyName=${queryString}`);
      this.restaurants = res.data.result;
      this.restaurants.forEach((val) => {
        val.value = val.companyName;
      });
    },
    //选择公司
    handleSelect(item, num) {
      if (!this.statusAL) {
        this.companyFunc(item.companyName, num);
      }
    },
    //失去焦点change
    changecom(val, num) {
      if (valiData === 2) {
        setTimeout(() => {
          if (!this.statusAL) {
            this.companyFunc(val, num);
          }
          if (val === '') {
            this.formAddXianSuo.company = {
              financialCondition: "",
              latitude: null,
              longitude: null,
              businessScope: "",
              projectInfo: "",
              registeredAddress: "",
              insuredNumber: null,
              registerOffice: "",
              staffSize: null,
              companyType: null,
              businessTerm: null,
              approvedDate: "",
              industryId: null,
              registeredCapital: "",
              contributedCapital: "",
              registeredStatus: null,
              foundDate: "",
              legalPerson: "",
              companyName: "",
              companyId: "",
              id: null,
              qualifications: [],
              projectApplications: [],
              propertyBrand: "",
              propertyDesign: "",
              propertyInvent: "",
              propertyPattern: "",
              propertySoftware: "",
              remark: "",
            };
          }
        }, 500);
      }
    },
    //实时监测值变化
    inputChange(val, formData) {
      console.log(this.statusAL);
      this.$refs[formData].validate((valid) => {
        if (valid) {
          if (this.statusAL) {
            this.formAddXianSuo.company = {
              financialCondition: "",
              latitude: null,
              longitude: null,
              businessScope: "",
              projectInfo: "",
              registeredAddress: "",
              insuredNumber: null,
              registerOffice: "",
              staffSize: null,
              companyType: null,
              businessTerm: null,
              approvedDate: "",
              industryId: null,
              registeredCapital: "",
              contributedCapital: "",
              registeredStatus: null,
              foundDate: "",
              legalPerson: "",
              companyName: "",
              companyId: "",
              id: null,
              qualifications: [],
              projectApplications: [],
              propertyBrand: "",
              propertyDesign: "",
              propertyInvent: "",
              propertyPattern: "",
              propertySoftware: "",
              remark: "",
            };
          }
          this.statusAL = false;
        }
      })

    },
    //验证公司名称
    async companyFunc(item, num) {
      let msg = "", res;
      if (num === 1) {
        msg = "该企业信息已存在,是否拉取企业信息?";
      } else {
        msg = "该企业信息已存在,是否替换当前线索的企业信息?";
      }
      try {
        res = await this.Axios.get(`leads-api/companylist/ifCompanyName?companyName=${item}`);
        if (res.data.code === 0) {
          this.statusAL = true;
          let datas = JSON.parse(JSON.stringify(res.data.result));
          this.$confirm(msg, "提示", {
               confirmButtonText: "确定",
               cancelButtonText: "取消",
               type: "warning",
             })
             .then(() => {
               delete datas.geoHash;
               delete datas.email;
               delete datas.qqNumber;
               delete datas.qualification;
               delete datas.projectApplication;
               delete datas.status;
               delete datas.addTime;
               delete datas.updateTime;
               datas.approvedDate = this.setDate(datas.approvedDate)
               datas.foundDate = this.setDate(datas.foundDate)
               this.setObj_(datas)
               this.formAddXianSuo.company = datas;
               this.companyId = datas.companyId
             })
             .catch(() => {
               this.statusAL = false;
               this.formAddXianSuo.company.companyName = "";
               this.$refs.inputVal.focus();
             });
        }
      } catch (error) {
        //不存在提示是否继续添加
        if (error.code === 400000) {
          if (!this.statusAL) {
            this.itemsData = item
            this.tips_dalig = true
          }
        } else {
          this.showMessage("error", res.data.message);
        }
      }
    },
    companyChunagJian() {
      this.companyFuncAdd(this.itemsData)
    },
    //添加企业信息
    async companyFuncAdd(item) {
      let data = {
        companyName: item,
      };
      let res = await this.Axios.post(`leads-api/companylist/insertCompany`, data);
      if (res.data.code === 0) {
        this.formAddXianSuo.company.id = parseInt(res.data.result.id);
        this.showMessage("success", "创建成功");
        this.tips_dalig = false
        this.companyId = parseInt(res.data.result.companyId);
        // this.getTableQyZz();
        // this.getTableZcRy();
      }
    },
    //检验手机号格式
    isMobileNumber(rule, value, callback) {
      if (!value) {
        return new Error("请输入电话号码");
      } else {
        //是否有星号
        let substrin = value;
        let dat = substrin.substr(3, 4);
        if (dat === "****") {
          callback();
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
          const isPhone = reg.test(value);
          value = Number(value); //转换为数字
          if (typeof value === "number" && !isNaN(value)) {
            //判断是否为数字
            value = value.toString(); //转换成字符串
            if (value.length < 0 || value.length > 12 || !isPhone) {
              //判断是否为11位手机号
              callback(new Error("请输入完整手机号"));
            } else {
              callback();
            }
          } else {
            callback(new Error("请输入电话号码"));
          }
        }
      }
    },
    //验证座机号格式
    isTelOrFax(rule, value, callback) {
      if (!value) {
        return new Error("请输入座机号码");
      } else {
        //是否有星号
        let substrin = value;
        let dat = substrin.indexOf("****") != -1
        if (dat === true) {
          callback();
        } else {
          const reg = /^(\d{3,4}-)?\d{7,8}$/;
          const isTel = reg.test(value);
          if (value.length < 10 || value.length > 13 || !isTel) {
            //判断传真字符范围是在10到13
            callback(new Error("请输入正确的座机格式"));
          } else {
            callback();
          }
        }
      }
    },
    //联系方式change
    teltype_rules(val) {
      let pas = parseInt(val);
      if (pas === 1) {
        this.$nextTick(() => {
          this.$refs.inputVals[0].focus();
        });
      } else if (pas === 2) {
        this.$nextTick(() => {
          this.$refs.inputVals1[0].focus();
        });
      } else if (pas === 3) {
        this.$nextTick(() => {
          this.$refs.inputVals2[0].focus();
        });
      } else {
        return false;
      }
    },
    //验证手机号是否已添加
    async phone_rules(num) {
      let data = JSON.parse(JSON.stringify(this.formAddXianSuo.contactList));
      let res = await this.Axios.post("leads-api/leadslist/ifContact", data, "postJson");
      let datas = res.data.result;
      if (datas.length !== 0) {
        this.$confirm("此线索公海库已存在,是否领取到私有库?", "提示", {
             confirmButtonText: "确定",
             cancelButtonText: "取消",
             type: "warning",
           })
           .then(() => {
             //领取接口
             let ids = [];
             ids.push(parseInt(datas[0].leadsId));
             let data_ = {
               updateType: 0,
               leadsId: ids,
             };
             this.lingqu_func(data_);
             this.formAddXianSuo.contactList[0].contactValue = "";
           })
           .catch(() => {
             this.showMessage("info", "已取消操作");
             this.formAddXianSuo.contactList[0].contactValue = "";
           });
      }
    },
    // change事件
    changeInputs1(val) {
      this.lng_lat.longitude = val;
      this.lng_lat = this.lng_lat.longitude;
    },
    // change事件
    changeInputs2(val) {
      this.lng_lat.latitude = val;
    },
    //去除数据中的默认 -1
    setObj_(obj) {
      Object.keys(obj).forEach(key => {
        if (obj[key] == -1) {
          obj[key] = typeof obj[key] === 'string' ? '' : null
        }
      })
      return obj
    },
    toMapVal(data){
      this.lng_lat.address = data.address;
      this.formAddXianSuo.company.longitude = this.lng_lat.longitude = data.longitude;
      this.formAddXianSuo.company.latitude = this.lng_lat.latitude = data.latitude;
      if (this.lng_lat.address !== "") {
        this.showMessage("success", "选取成功");
        this.addMap_dialog = false
      } else {
        this.showMessage("error", "选取失败,请重新选取");
      }
    },
    mapClose(){
      this.addMap_dialog = false
    },
    xiadanNo(){
      this.xiadan_dalig = false;
    },
    gjClose(){
      this.genjin_dialog = false
    },
    //获取标签列表
    async get_biaoqian_list() {
      let res = await this.Axios.get("leads-api/labellist/tree");
      if (res.data.code === 0) {
        this.treeList = res.data.result;
        if (this.status_tree === "BqPz") {
          this.treeList.forEach((val) => {
            val.children = null;
          });
        }
      }
    },
    //获取来源列表
    async get_laiyuan_list() {
      let res = await this.Axios.get("leads-api/sourcelist/manager/tree");
      if (res.data.code === 0) {
        this.treeListLy = res.data.result;
        if (this.status_tree === "LyPz") {
          this.treeListLy.forEach((val) => {
            val.children = null;
          });
        }
      }
    },
    // 员工获取来源表
    async get_laiyuanData() {
      let res = await this.Axios.get("/leads-api/sourcelist/tree");
      if (res.data.code === 0) {
        this.laiyuan_options = res.data.result;
      }
    },
    //获取意向服务
    async getYixiang() {
      let res = await this.Axios.get("product-api/productgroup/list?firstLevel=0");
      if (res.data.code === 0) {
        this.yxGenJinData = res.data.result;
      }
    },
    //获取行业
    async getHangye() {
      let res = await this.Axios.get("/common-api/industrylist/tree");
      if (res.data.code === 0) {
        this.hangYeData = res.data.result;
        this.hangYeData.forEach((val) => {
          val.children = null;
        });
        // if (this.hangYeData.length !== 0) {
        //   this.hangYeData = this.data_(this.hangYeData);
        // }
      }
    },
    //添加一行表单
    add_form() {
      this.formAddXianSuo.contactList.push({
        contactValue: "",
        contactType: "1",
        contactName: "",
        position: "",
        sex: "1",
      });
      this.$nextTick(() => {
        this.formAddXianSuo.contactList.length > 1 ? (this.button_status_del = true) : (this.button_status_del = false);
      });
    },
    //删除一行表单
    delete_form(index) {
      this.formAddXianSuo.contactList.splice(index, 1);

      this.$nextTick(() => {
        this.formAddXianSuo.contactList.length > 1 ? (this.button_status_del = true) : (this.button_status_del = false);
      });
    },
    //添加表格1
    add_table_1() {
      var list = {
        issueUnit: "",
        openDate: "",
        qualificationNames: "",
        qualificationNumber: "",
        qualificationType: "",
        validity: "",
      };
      this.formAddXianSuo.qualificationList.push(list);
      this.rowNum += 1;
    },
    //删除表格1
    async delete_table_1(row, index) {
      this.formAddXianSuo.qualificationList.splice(index, 1);
      this.showMessage("success", "删除成功");
    },
    //添加表格2
    add_table_2() {
      var list = {
        certType: "",
        content: "",
        identityCard: "",
        major: "",
        name: "",
        registryNumber: "",
      };
      this.formAddXianSuo.certList.push(list);
      this.rowNum2 += 1;
    },
    //删除表格2
    delete_table_2(row, index) {
      this.formAddXianSuo.certList.splice(index, 1);
      this.showMessage("success", "删除成功");
    },


    //时间处理
    // dateFunction2(val) {
    //     this.form_list_.companyInfo.businessTermStart = this.set_date(val[0])
    //     this.form_list_.companyInfo.businessTermEnd = this.set_date(val[1])
    // },
    //钱处理
    sjzbFunction(val) {
      if (val.indexOf("-") === -1) {
        let e = val.split("万以上")[0];
        this.form_list_.companyInfo.contributedCapitalStart = parseInt(e);
        this.form_list_.companyInfo.contributedCapitalEnd = null;
      } else {
        let a = val;
        let b = a.split("-")[0];
        let c = a.split("-")[1];
        let d = c.split("万")[0];
        this.form_list_.companyInfo.contributedCapitalStart = parseInt(b);
        this.form_list_.companyInfo.contributedCapitalEnd = parseInt(d);
      }
    },
    //钱处理
    zczbFunction(val) {
      if (val.indexOf("-") === -1) {
        let e = val.split("万以上")[0];
        this.form_list_.companyInfo.registeredCapitalStart = parseInt(e);
        this.form_list_.companyInfo.registeredCapitalEnd = null;
      } else {
        let a = val;
        let b = a.split("-")[0];
        let c = a.split("-")[1];
        let d = c.split("万")[0];
        this.form_list_.companyInfo.registeredCapitalStart = parseInt(b);
        this.form_list_.companyInfo.registeredCapitalEnd = parseInt(d);
      }
    },
    // 点击收起/展开
    clickshowbut(num) {
      this.show = !this.show;
      this.showbut = num;
    },
    //
    radio_change(val) {
      if (val == 1 || val == 2) {
        this.change_show_radio = true;
      } else {
        this.change_show_radio = false;
      }
    },
    handleChanges(val) {
      console.log(val);
    },
    /* elementui  图片上传 共用方法*/
    handleAvatarSuccess() {
    },
    beforeAvatarUpload(file) {
      console.log(file.type);
      const isJPG = file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 <= 3;
      // const isLt2M = true;
      if (!isJPG) {
        this.$message.error("上传图片格式不正确!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过3MB!");
      }
      return isJPG && isLt2M;
    },
    suceessAvataruploadPic(params) {
      console.log(params);
      let that = this;
      let _file = params.file;
      let param = new FormData(); //创建form对象
      param.append("file", _file); //通过append向form对象添加数据
      let config = {
        headers: {"Content-Type": "multipart/form-data"},
      }; //添加请求头
      axios
         .post("http://gateway.kuaiban.com/common-api/file/upload", param, config)
         .then((res) => {
           // console.log(res.data.result[0]);
           this.getPicture(res.data.result[0]);
         })
         .catch((err) => {
           this.showMessage("error", "图片上传错误");
         });
    },
    getPicture(data) {
    },
    /* 弹框 */
    showMessage(type, data) {
      this.$message({
        message: data,
        type: type,
        duration: 2500,
      });
    },
    /* 权限验证 */
    verification(list, data) {
      if (list.includes(data)) {
        return true;
      } else {
        return false;
      }
    },
    //时间格式数据处理成20201211
    set_date(data) {
      let date1, date2, date3;
      if (data !== "" && data.length === 10) {
        date1 = data.split("-");
        date2 = parseInt(date1.join(""));
        date3 = date2;
        return date3;
      } else {
        return data;
      }
    },
    ////时间格式数据处理成2020-12-11
    setDate(date) {
      let datess = date.toString()
      if (datess.length === 8) {
        let timearr = datess.split("", 4).join("");
        let strs = datess.substring(datess.length - 2);
        let str = datess.substr(-4, 2);
        date = `${timearr}-${str}-${strs}`;
        console.log(date);
      } else if (datess.length === 1) {
        date = ""
      }
      return date
    },
    //计算分钟
    s_to_hs(s) {
      //算法：将秒数除以60，然后下舍入，既得到分钟数
      var h;
      h = Math.floor(s / 60);
      //计算秒
      //算法：取得秒%60的余数，既得到秒数
      s = s % 60;
      //将变量转换为字符串
      h += "";
      s += "";
      //如果只有一位数，前面增加一个0
      h = h.length == 1 ? "0" + h : h;
      s = s.length == 1 ? "0" + s : s;
      return h + ":" + s;
    },
    //对象为空数据过滤
    isEmptyObj(o) {
      for(var attr in o) return !1;
      return !0;
    },
    processArray(arr) {
      for(var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === null || arr[i] === undefined) arr.splice(i, 1);
        else if (typeof arr[i] == "object") this.removeNullItem(arr[i], arr, i);
      }
      return arr.length == 0;
    },
    proccessObject(o) {
      for(var attr in o) {
        if (o[attr] === null || o[attr] === undefined || o[attr] === "") delete o[attr];
        else if (typeof o[attr] == "object") {
          this.removeNullItem(o[attr]);
          if (this.isEmptyObj(o[attr])) delete o[attr];
        }
      }
    },
    removeNullItem(o, arr, i) {
      var s = {}.toString.call(o);
      if (s == "[object Array]") {
        if (this.processArray(o) === true) {
          //o也是数组，并且删除完子项，从所属数组中删除
          if (arr) arr.splice(i, 1);
        }
      } else if (s == "[object Object]") {
        this.proccessObject(o);
        if (arr && this.isEmptyObj(o)) arr.splice(i, 1);
      }
    },
    //封装为一个方法判断变量是否为空
    isobjEmpty(obj) {
      if (obj === null || obj === undefined || obj === "" || obj.length === 0 || obj === {}) {
        return true;
      } else {
        return false;
      }
    },
    /* 本地存储 页面跳转 */
    pushParams(data) {
      sessionStorage.setItem("params", JSON.stringify(data));
    },
    getParams() {
      return JSON.parse(sessionStorage.getItem("params"));
    },
    //表格样式
    row_key(row) {
      return row.id;
    },
    cellStyle({row, column, rowIndex, columnIndex}) {
      return "text-align:center";
    },

    /* 本地存储  */
    addDataStorge(params, data) {
      sessionStorage.setItem(params, JSON.stringify(data));
    },
    getDataStorge(params) {
      return JSON.parse(sessionStorage.getItem(params));
    },
    /*  数据传值 (给对象赋值 以第一个字段为准 )  */
    copyData(data1, data2) {
      Object.keys(data1).forEach((key) => {
        data1[key] = data2[key];
      });
    },
  },
};

export default mixin;
