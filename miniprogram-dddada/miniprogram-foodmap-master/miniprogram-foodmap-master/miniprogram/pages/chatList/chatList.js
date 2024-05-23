// pages/mainPage/mainPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupChats: [

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGroupList();
  },

    // 获取群聊列表
  getGroupList: function() {
    wx.cloud.callFunction({
      name: 'initChatList',
    })
    .then(res => {
      console.log('获取成功', res);
      // 格式化群聊列表数据
      const formattedGroupChats = this.formatGroupChats(res.result.groupData);
      // 更新页面数据
      this.setData({ groupChats: formattedGroupChats });
    })
    .catch(error => {
      console.error('获取失败', error);
    });
  },

    // 格式化群聊列表数据
  formatGroupChats: function(groupData) {
    const formattedGroupChats = groupData.map(group => {
      // 创建一个新的对象，避免直接修改原始数据
      const formattedGroup = Object.assign({}, group);
      // 假设每条消息的最大长度为10个字符
      if (formattedGroup.lastMessage.content.length > 14) {
        formattedGroup.lastMessage.content = formattedGroup.lastMessage.content.substring(0, 14) + '...';
      }
      return formattedGroup;
    });
    return formattedGroupChats;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.hasNextPage) {
      this.setData({
        groupId: this.data.groupId + 1
      });
      this.getGroupList();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      groupId: 1,
      groupList: [],
      hasNextPage: true
    });
    this.getGroupList();
    wx.stopPullDownRefresh();
  },


  /**
   * 页面相关事件处理函数--点击跳转到聊天室
   */

  goToChatRoom: function(event) {
    // 获取点击的群聊 ID
    console.log(event);
    console.log(event.currentTarget.dataset)
    const groupId = event.currentTarget.dataset.groupid;
    console.log("群聊 ID:", groupId);

      // 构造跳转的 URL
    const url = '/pages/chatRoom/chatRoom?groupId=' + groupId;
    console.log("跳转的 URL:", url);

    // 跳转到聊天页面，并传递群聊 ID 参数
    wx.navigateTo({
      url: url,
    fail: function(err) {
      // 输出跳转失败的错误信息
      console.error('跳转失败:', err);
      }
    });    
  }
})
