// pages/userDd/userDd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: [],
    avatarSrc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时，默认展示用户所有活动
    wx.cloud.callFunction({
      name: 'getUserDD',
    })
    .then(getDDIMOres => {
      console.log('获取成功',getDDIMOres)
      this.setData({
        activities:  getDDIMOres.result.ddData,
      });
    })
    .catch(getDDIMOres =>{
      console.log('获取失败',getDDIMOres)
    })
  },
  
  editMyDd: function(event) {
    
    const activityInfo = event.currentTarget.dataset.info;
    let imageSrc = '';
    wx.cloud.callFunction({
      name: 'getGroupHeadImage',
      data: {
        groupID: activityInfo.id
      },
    })
    .then(imageRes => {
      console.log('imageRes',imageRes)
      imageSrc = imageRes.result.fileList[0].tempFileURL
      let ddInfo = JSON.stringify(activityInfo)
      console.log("即将跳转到活动详情页，活动信息为：", activityInfo);
      wx.navigateTo({
        url: '/pages/editMyDd/editMyDd?activityInfo=' + ddInfo + '&filePath=' + imageSrc,
      });
    })
    .catch(imageRes =>{
      console.log('云函数获取数据失败',imageRes)
    })
  },

  deleteMyDd(event){
    const activityInfo = event.currentTarget.dataset.info;
    let that = this
    wx.showModal({
      content: "确认删除", //提示的内容
      success: function(res) {
        if(res.confirm) {
          console.log('用户点击了确定')
          wx.cloud.callFunction({
            name: 'deleteDD',
            data: {
              groupID: activityInfo.id
            },
          })
          .then(delRes => {
            console.log("删除结果",delRes)
            const updatedActivities = that.data.activities.filter(activity => activity.id !== activityInfo.id);
            that.setData({
              activities: updatedActivities,
            });
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            });
          })
          .catch(delRes =>{
            console.log('云函数获取数据失败',delRes)
          })
        } else if (res.cancel) {
          console.log('用户点击了取消')
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log("上拉")
     // 页面加载时，默认展示用户所有活动
     wx.cloud.callFunction({
      name: 'getUserDD',
    })
    .then(getDDIMOres => {
      console.log('获取成功',getDDIMOres)
      this.setData({
        activities:  getDDIMOres.result.ddData,
      });
    })
    .catch(getDDIMOres =>{
      console.log('获取失败',getDDIMOres)
    })
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})