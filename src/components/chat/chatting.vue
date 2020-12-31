<template>
  <div class="chatbox">
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      @close="closedrawer"
      class="drawerbox"
    >
      <div class="messagename">
        <div class="messagenametitle">消息列表</div>
        <i class="el-icon-close" @click="closedrawer"></i>
      </div>
      <ul
        class="messagebox"
        v-infinite-scroll="load"
        style="overflow: auto"
        :infinite-scroll-distance="100"
      >
        <div class="messageboxtitle">未读消息</div>
        <li class="readmessage" v-for="(item, index) in countk" :key="index">
          <div class="messagelist">
            <div class="messagesection">
              <div class="messagesectionleft">服务系统</div>
              <div class="messagesectionright">
                <div class="minute">1分钟前</div>
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div class="messagepage">
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
            </div>
          </div>
          <div class="messagelist">
            <div class="messagesection">
              <div class="messagesectionleft">人才系统</div>
              <div class="messagesectionright">
                <div class="minute">1分钟前</div>
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div class="messagepage">
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read" v-if="noMore">朕知道了</span>
              </div>
            </div>
          </div>
        </li>
        <div class="messageboxtitleal">已读读消息</div>
        <li class="readmessage" v-for="(item, index) in count" :key="index">
          <div class="messagelist">
            <div class="messagesection">
              <div class="messagesectionleft">服务系统</div>
              <div class="messagesectionright">
                <div class="minute">1分钟前</div>
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div class="messagepage">
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
            </div>
          </div>
          <div class="messagelist">
            <div class="messagesection">
              <div class="messagesectionleft">人才系统</div>
              <div class="messagesectionright">
                <div class="minute">1分钟前</div>
                <i class="el-icon-close"></i>
              </div>
            </div>
            <div class="messagepage">
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read">朕知道了</span>
              </div>
              <div class="messageitem">
                外聘人员（姓名）于（剩余天数）天后到期，如需续约，请尽快处理，
                <span class="read" v-if="noMore">朕知道了</span>
              </div>
            </div>
          </div>
        </li>

        <p class="momoretext">没有更多了~~</p>
      </ul>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: ["drawer"],
  data() {
    return {
      direction: "rtl",
      count: 1,
      countk: 2,
      noMore: false,
    };
  },
  methods: {
    closedrawer() {
      this.$emit("ishowwrap", false);
    },
    load() {
      console.log(typeof this.count, "9999");
      if (this.count == 10) {
        this.count += 1;
        //  this.count=10
      } else {
        this.count += 1;
      }
    },
  },
};
</script>

<style scoped>
.messagebox {
  height: 100vh;
  /* height: calc(100vh - 10px); */
  overflow-y: scroll;
  padding-bottom: 50px;
  box-sizing: border-box;
}
.messageboxtitle {
  width: 100%;
  padding: 13px 0;
  box-sizing: border-box;
  background: #409eff;
  color: #fff;
  font-size: 16px;
  text-align: center;
}
.messagesection {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.messagesectionright {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.minute {
  font-size: 13px;
  margin-right: 10px;
}
.messagesection {
  padding: 10px 20px;
  box-sizing: border-box;
  background: #f0f0f0;
}
.messageitem {
  padding: 10px 20px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.5;
}
.read {
  color: #409eff;
  font-size: 14px;
  margin-left: 10px;
  cursor: pointer;
}
.messageboxtitleal {
  width: 100%;
  padding: 13px 0;
  box-sizing: border-box;
  background: #b0b0b0;
  color: #fff;
  font-size: 16px;
  text-align: center;
}
.messagename {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 40px 10px 20px;
  box-sizing: border-box;
}
.messagenametitle {
  flex: 1;
  font-weight: bold;
  font-size: 16px;
}
.momoretext {
  text-align: center;
}
</style>