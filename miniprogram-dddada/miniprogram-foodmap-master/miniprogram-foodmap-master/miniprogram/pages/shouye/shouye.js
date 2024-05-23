// pages/shouye/shouye.js
const app = getApp();
const db = wx.cloud.database()
const activitiesCollection = db.collection('activities');
Page({
  data: {
    activities: [],
    filteredActivities: [], // 筛选后的活动列表
    keyword: '' ,// 筛选关键词
    tags: [] , // 存储用户输入的标签
    gender:'',
    groupName:'',
    position:''
  },
  /* onLoad(options) {
    // 页面加载时，默认展示所有活动
    this.getActivitiesFromBackend(); // 从后端获取活动数据
  }, */
  onShow(){
    console.log("kjkjkjk")
    wx.cloud.callFunction({
      name: 'initActivitiesPage',
    })
    .then(getDDIMOres => {
      console.log('获取成功',getDDIMOres)
      this.setData({
        activities:  getDDIMOres.result.ddData,
        filteredActivities : getDDIMOres.result.ddData
      });
    })
    .catch(getDDIMOres =>{
      console.log('获取失败',getDDIMOres)
    })
  },
  onLoad(options) {
    // 页面加载时，默认展示所有活动
    wx.cloud.callFunction({
      name: 'initActivitiesPage',
    })
    .then(getDDIMOres => {
      console.log('获取成功',getDDIMOres)
      this.setData({
        activities:  getDDIMOres.result.ddData,
        filteredActivities : getDDIMOres.result.ddData,
        
      });
    })
    .catch(getDDIMOres =>{
      console.log('获取失败',getDDIMOres)
    })
    
  },

  // 输入框输入事件
  onInput: function (e) {
    const keyword = e.detail.value.trim(); // 获取输入框中的关键字并去除两端空格
    this.setData({ keyword }); // 更新关键字数据
    this.filterActivities(); // 调用筛选函数
  },

  //！！！ 筛选按钮点击事件
  filter: function () {
    this.filterActivities(); // 调用筛选函数
  },
    // 筛选活动函数
    filterActivities: function () {
      if(this.data.keyword === '')
      {
        console.log("空")
        this.setData({ filteredActivities:this.data.activities });
        return
      }
      const filteredActivities = this.data.activities.filter(activity => {
        // 检查活动标题是否包含关键字
        let titleMatch = false
        for (let i = 0; i < this.data.keyword.length; i++) {
          if(this.data.keyword[i] === ' ')
          {
            continue
          }
          if(activity.title.includes(this.data.keyword[i])){
            titleMatch = true
            break
          }
        }
        // 检查活动标签是否包含关键字
        let tagMatch = false
        for (let i = 0; i < this.data.keyword.length; i++) {
          activity.tags.some(tag => {
            if(this.data.keyword[i] === ' ')
            {
              console.log("空格")
              return false
            }
            if (tag.includes(this.data.keyword[i])) {
                tagMatch = true;
                return true; // 结束循环
            }
            return false; // 继续循环
          });
          if(tagMatch === true)
          {
            break
          }
        }
        return titleMatch || tagMatch; // 返回标题或标签中包含关键字的活动
      });
      this.setData({ filteredActivities }); // 更新筛选后的活动列表数据
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
    wx.cloud.callFunction({
      name: 'initActivitiesPage',
    })
    .then(getDDIMOres => {
      console.log('获取成功',getDDIMOres)
      this.setData({
        activities:  getDDIMOres.result.ddData,
        filteredActivities : getDDIMOres.result.ddData
      });
    })
    .catch(getDDIMOres =>{
      console.log('获取失败',getDDIMOres)
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    wx.cloud.callFunction({
      name: 'initActivitiesPage',
    })
    .then(getDDIMOres => {
      console.log('获取成功',getDDIMOres)
      this.setData({
        activities:  getDDIMOres.result.ddData,
        filteredActivities : getDDIMOres.result.ddData
      });
    })
    .catch(getDDIMOres =>{
      console.log('获取失败',getDDIMOres)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
// 首页点击活动跳转到详情页的事件处理函数
viewActivityDetail: function(event) {
  const activityInfo = event.currentTarget.dataset.info;
  let ddInfo = JSON.stringify(activityInfo)
  console.log("即将跳转到活动详情页，活动信息为：", activityInfo);

  wx.navigateTo({
    url: '/pages/activityDetail/activityDetail?activityInfo=' + ddInfo,
  });
}

});
