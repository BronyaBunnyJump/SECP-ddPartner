const config = require('../../config.js');


Page({
  data: {
    longitude: config.center_longitude,
    latitude: config.center_latitude,
    scale:"",
    windowHeight: 600,
    mapSubKey: config.mapSubKey,
    markers: [], // 存储从云函数返回的经纬度数据
    activities: [],
  },

  onLoad(options) {
    this.getCenterLocation();
    this.initActivitiesMarkers();
  },

  // 获取中心位置
  getCenterLocation: function() {
    wx.getLocation({
      type: 'gcj02', // 获取的坐标系类型
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
        console.log('当前位置:', this.data.longitude, this.data.latitude);
      },
      fail: (err) => {
        wx.showToast({
          title: '获取位置失败',
          
        });
        console.error('获取位置失败:', err);
      }
    });
  },

  // 初始化活动标记
  initActivitiesMarkers: function () {
    wx.cloud.callFunction({
      name: 'initActivitiesPage',
    })
    .then(res => {
      console.log('获取成功', res);
      const ddData = res.result.ddData; // 从返回结果中获取经纬度数据

      this.setData({
        activities: res.result.ddData,      
      });

      // 根据返回的经纬度数据创建标记
      const markers = ddData.map((item, index) => {
        return {
          id: index, // 使用索引作为 id，确保是数字
          longitude: item.longitude,
          latitude: item.latitude,
          title: item.title,
          width: 30,
          height: 45,
        };
      });
      
      // 将标记数据保存到页面数据中
      this.setData({
        markers: markers
      });
    })
    .catch(error => {
      console.error('获取失败', error);
    });
  },

    // 点击标记时触发
  markerTap: function (e) {
    console.log(e);
    const markerId = e.detail.markerId;
    console.log(markerId);
    const activityInfo = this.data.activities[markerId]; // 获取对应活动信息
    console.log(activityInfo);
    const ddInfo = JSON.stringify(activityInfo); // 将活动信息转换为 URL 参数
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail?activityInfo=' + ddInfo,
      fail: function(err) {
        // 输出跳转失败的错误信息
        console.error('跳转失败:', err);
      }
    });
  },  
});
