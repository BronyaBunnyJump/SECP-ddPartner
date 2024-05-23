const config = require('config.js');
App({
  onLaunch: function (options) {
    /**
     * 初始化云开发
     */
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: config.envID
      })
    }
    /**
     * 获取屏幕高度
     */
    let { windowHeight } = wx.getSystemInfoSync();
    let showAdmin = wx.getStorageSync('showAdmin');
    if (showAdmin == ""){
      showAdmin = false;
    }
    this.globalData = { 
      windowHeight, 
      is_administrator: false, 
      showAdmin: showAdmin,
      position:[],
      isLocating: false,
      }

    wx.cloud.callFunction({
      name: 'initUserImo'
    })
    .then(res => {
      console.log('云函数获取数据成功',res)
      //如果没有用户数据就将此新用户插入用户表中
      if(res.result[0].data.length === 0){
        wx.cloud.callFunction({
          name: 'addNewUser'
        })
        .then(insertRes => {
          console.log('插入结果',insertRes)
        })
        .catch(insertRes =>{
          console.log('插入失败',insertRes)
        })
      }
    })
    .catch(res =>{
      console.log('云函数获取数据失败',res)
    })

    wx.cloud.callFunction({
      name: 'getNeedToDeleteDD'
    })
    .then(res => {
      console.log('获取结果',res)
      // 遍历结果执行删除操作
      res.result.forEach(item => {
        wx.cloud.callFunction({
          name: 'deleteDD', // 这里替换为你的删除数据的云函数名称
          data: {
            groupID: item // 传递要删除的数据的 groupID
          }
        })
        .then(deleteRes => {
          console.log('删除成功', deleteRes)
        })
        .catch(deleteErr => {
          console.error('删除失败', deleteErr)
        })
      })

    })
    .catch(res =>{
      console.log('获取结果',res)
    })
  }
})