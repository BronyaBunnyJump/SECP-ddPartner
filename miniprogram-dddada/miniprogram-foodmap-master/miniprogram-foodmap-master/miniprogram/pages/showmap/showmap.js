// pages/ddmap/ddmap.js
const app = getApp();
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    longitude: config.center_longitude,
    latitude: config.center_latitude,
    windowHeight: 600,
    mapSubKey: config.mapSubKey,
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("地图页面加载")
    console.log(options)
    console.log("坐标不为空")
    this.setData({
      options:options,
      longitude:options.longitude,
      latitude:options.latitude,
      markers: [{
        id: 0,
        latitude: options.latitude,
        longitude: options.longitude,
        width: 30,
        height: 30
      }]
    })
  },

  //获取我的位置
  getCenterLocation: function () {
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
        console.log(
          "当前中心点的位置：",
          this.data.longitude,
          this.data.latitude
        );
      },
      fail: (err) => {
        wx.showToast({
          title: "GPS定位失败",
          icon: "fail",
        });
        console.log("err", err);
      },
    });
  },

  // 创建标记
  createMarker: function (e) {
    console.log('点击地图，获取到的位置信息：', e.detail);
    const latitude = e.detail.latitude;
    const longitude = e.detail.longitude;

    // 检查经纬度是否为合法数值
    if (!isNaN(latitude) && !isNaN(longitude)) {
      const markers = [{
        id: 0,
        latitude: latitude,
        longitude: longitude,
        width: 30,
        height: 45
      }];
      this.setData({ markers: markers });
    } else {
      console.error('经纬度值不合法：', latitude, longitude);
    }
  },

  // 确定按钮点击事件
  confirmLocation: function () {
    wx.navigateBack({
      delta: 1 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
    })
  },

  // 回到目标位置
  getDdPosition: function (){
    console.log(this.data.options)
    this.setData({
      longitude:this.data.options.longitude,
      latitude:this.data.options.latitude,
      scale: 16
    })
  }
})