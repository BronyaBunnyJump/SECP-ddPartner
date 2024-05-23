const app = getApp();
const db = wx.cloud.database()
const activitiesCollection = db.collection('activities');
// activityDetail.js

Page({
  data: {
    activityDetail: {} ,// 活动详情数据
    showLocationButton: true, // 添加一个数据属性来控制位置按钮的显示与隐藏
    gender:'',
    groupName:'',
    position:''

  },

  onLoad: function(options) {
    let ddInfo = JSON.parse(options.activityInfo)
    console.log("Activity Info:", ddInfo);
    // this.renderStaticActivityDetail(ddInfo);
    this.setData({
      activityDetail: ddInfo,
      gender:ddInfo.genderOptions,
      groupName:ddInfo.groupName,
      position:ddInfo.position,
    })
  },

   // 处理 tap 事件的函数
   viewActivityDetail: function (event) {
    // 这里可以添加你想要执行的逻辑
    console.log("点击了活动详情");
  },
  // 处理加入活动按钮点击事件的函数
  joinActivity: function() {
    console.log("activityDetail",this.data.activityDetail)
    wx.cloud.callFunction({
      name: 'joinGroup',
      data: {
        groupID:this.data.activityDetail.id,
      }
    })
    .then(joinRes => {
      console.log('joinRes',joinRes)
      // 这里添加您希望执行的加入活动的逻辑
      const groupId = this.data.activityDetail.id;
      // 跳转到群组页面
      wx.navigateTo({
        url: '/pages/chatRoom/chatRoom?groupId=' + groupId,
        success: function(res) {
          console.log("跳转成功");
        },
        fail: function(err) {
          console.error("跳转失败", err);
        }
      });
    })
    .catch(joinRes => {
      console.error('云函数调用失败', joinRes);
    });

    
  },
  // 添加一个函数来处理位置按钮的点击事件
  viewLocation: function() {
    const latitude = this.data.activityDetail.latitude; // 从活动详情获取位置的纬度，或者替换成你期望的数据来源
    const longitude = this.data.activityDetail.longitude; // 从活动详情获取位置的经度，或者替换成你期望的数据来源
    console.log("positionLatitude",latitude)
    console.log("positionLongitude",longitude)
    if(latitude != undefined && longitude != undefined)
    {
      // 跳转到与地图相关的页面，并提供纬度和经度作为参数
      wx.navigateTo({
        url: `/pages/showmap/showmap?latitude=${latitude}&longitude=${longitude}`,
        success: function(res) {
          console.log("跳转成功");
        },
        fail: function(err) {
          console.error("跳转失败", err);
        }
      });
    }
    else{
      wx.showModal({
        title: '地点定位', //提示的标题
        content: '发布者未在地图定位，请查看dd信息或进群了解详情', //提示的内容
        success: function(res) {
          if(res.confirm) {
            console.log('用户点击了确定')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        }
      })
    }
  }



});
