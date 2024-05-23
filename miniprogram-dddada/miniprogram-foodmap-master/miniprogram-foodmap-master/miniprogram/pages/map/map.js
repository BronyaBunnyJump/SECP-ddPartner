// pages/ddmap/ddmap.js
const app = getApp();
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    this.getCenterLocation()
    if(options.latitude != "undefined" && options.longitude != "undefined")
    {
      console.log("坐标不为空")
      this.setData({
        longitude:options.longitude,
        latitude:options.latitude,
      })
    }
    else
    {
      this.getCenterLocation()
    }
  },
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
    const marker = this.data.markers[0];
    if (marker!=null) {
      const latitude = marker.latitude;
      const longitude = marker.longitude;
      console.log(latitude,longitude)
      if(app.globalData.isLocating === true) {
        console.log("给出提示")
        app.globalData.isLocating = false
        app.globalData.position = [latitude,longitude]
        wx.navigateBack({
          delta: 1 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
        })
      }
    } else {
      // 提示用户先在地图上选择位置
      wx.showModal({
        content: "请选择位置", //提示的内容
        success: function(res) {
          if(res.confirm) {
            console.log('用户点击了确定')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        }
      })
    }
  },
  
})