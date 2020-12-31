<template>
   <el-dialog :close-on-click-modal="false" @close="closeDialog" :visible.sync="addMap_dialog" class="baidumapBox" style="height: 100%;" title="地图选点" width="80%">
      <baidu-map
       :center="{lng: mapselect.center.lng, lat: mapselect.center.lat}"
       :scroll-wheel-zoom="true"
       :style="{width: mapselect.width, minHeight: '600px'}"
       :zoom="mapselect.zoom"
       @click="clickEvent"
       @moveend="syncCenterAndZoom" @moving="syncCenterAndZoom"
       @ready="handlerBMap"
       @zoomend="syncCenterAndZoom"
       ak="F7yxQs0HeVUoxSRa6TlHpGLtwqp91BrN"
       class="map"
       style="padding: 0;"
      >
         <bm-view class="maps" style="min-height: 800px"></bm-view>
         <!--比例尺控件-->
         <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
         <!--缩放控件-->
         <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
         <bm-control :offset="{width: '10px', height: '10px'}">
            <bm-auto-complete :sugStyle="{zIndex: 999999}" v-model="mapLocation.address">
               <el-input class="serachinput" clearable placeholder="请输入地点关键词搜索" type="text" v-model="mapLocation.address" />
            </bm-auto-complete>
         </bm-control>
         <bm-local-search :auto-viewport="true" :keyword="mapLocation.address" style="width:0;height:0;overflow: hidden;"></bm-local-search>
      </baidu-map>
      <span class="dialog-footer" slot="footer">
        <el-button @click="xuandian_Submit" size="mini" type="primary">确认</el-button>
      </span>
   </el-dialog>
</template>

<script>
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
    props: ['addMap_dialog', 'jd', 'wd'],
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
      BmView
    },
    data() {
      return {
        mapselect: {
          width: "100%",
          height: "100%",
          padding: "0 20px 20px 0",
          center: {lng: 0, lat: 0},
          zoom: 10,
          // chfwSelectData: null
        },
        mapLocation: {
          address: undefined,
          coordinate: undefined,
        },
        eventmap: {},
        mapData: {}
      }
    },
    methods: {
      //点击地图监听
      syncCenterAndZoom(e) {
        const {lng, lat} = e.target.getCenter()
        this.mapselect.center.lng = lng
        this.mapselect.center.lat = lat
        this.mapselect.zoom = e.target.getZoom()
      },
      //选点
      clickEvent(e) {
        window.map.clearOverlays();
        let Icon_0 = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
          offset: new BMap.Size(10, 25), // 指定定位位置
          imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
        });
        var myMarker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat), {
          icon: Icon_0,
        });
        map.addOverlay(myMarker);
        //存点
        this.eventmap = {
          lng: e.point.lng, lat: e.point.lat
        }
      },
      //选点确定
      xuandian_Submit() {
        //用所定位的经纬度查找所在地省市街道等信息
        var point = new BMap.Point(this.eventmap.lng, this.eventmap.lat);
        var gc = new BMap.Geocoder();
        let that = this
        gc.getLocation(point, function (rs) {
          that.mapData = {
            address: rs.address,
            longitude: rs.point.lng,
            latitude: rs.point.lat
          }
          console.log(that.mapData);
          that.$emit('toMapVal', that.mapData)
        });
      },
      handlerBMap({BMap, map}) {
        window.BMap = BMap;
        window.map = map;
        if (this.mapLocation.coordinate && this.mapLocation.coordinate.lng) {
          this.mapselect.center.lng = this.mapLocation.coordinate.lng;
          this.mapselect.center.lat = this.mapLocation.coordinate.lat;

          map.addOverlay(new window.BMap.Marker(this.mapLocation.coordinate));
        } else {
          if (this.jd !== null && this.wd !== null) {
            if (this.jd !== 0 || this.wd !== 0){
              this.theLocation(this.jd, this.wd)
              this.mapselect.center.lng = this.jd
              this.mapselect.center.lat = this.wd
            }else {
              this.mapselect.center.lng = 117.2157
              this.mapselect.center.lat = 39.080326
            }
          }else{
            this.mapselect.center.lng = 117.2157
            this.mapselect.center.lat = 39.080326
          }
        }
        this.mapselect.zoom = 10;
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
      },
      // 用经纬度设置地图中心点
      theLocation(lng, lat) {
        if (lng != "" && lat != "") {
          map.clearOverlays();
          var new_point = new BMap.Point(lng, lat);
          let Icon_0 = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
            offset: new BMap.Size(10, 25), // 指定定位位置
            imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
          });
          var myMarker = new BMap.Marker(new BMap.Point(lng, lat), {
            icon: Icon_0,
          });
          map.addOverlay(myMarker);
          map.panTo(new_point);
        }
        // var point = new BMap.Point(this.company_details.longitude, this.company_details.latitude);
        // console.log(point);
        // var gc = new BMap.Geocoder();
        // let _this = this;
        // gc.getLocation(point, function (rs) {
        //   console.log(rs);
        //   _this.lng_lat.address = rs.address;
        // })
      },
      closeDialog(){
        this.$emit("mapClose")
      }
    },
    mounted() {

    }
  }
</script>

<style scoped lang="less">
   .baidumapBox {
      /deep/ .el-dialog__body {
         padding: 0 !important;
      }
   }
</style>