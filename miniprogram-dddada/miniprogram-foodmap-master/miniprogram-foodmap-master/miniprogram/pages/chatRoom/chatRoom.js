Page({
  data: {
    groupId: '111', // 群聊ID
    memberID: '222', // 当前用户ID
    messages: [], // 聊天消息列表
    inputMessage: '', // 输入框中的消息内容
    scrollLast: null,
    isLabelShow: false,
  },

  onLoad: function(options) {
    console.log("groupID",options.groupId)
    this.setData({
      groupId:options.groupId
    })
    this.loadChatMessages();
    this.listenToChatRecordChanges();
  },
  //滚到最底部&无消息提示
  getScollBottom() {
    console.log('length',this.data.messages.length)
    if(this.data.messages.length==0)
    {
      console.log("群聊无消息");
      this.setData({
        isLabelShow:true,
      })
    }
    let that = this
    const length = this.data.messages.length - 1
    this.setData({
      scrollLast: 'item' + length
    })
  },

  // 加载并显示聊天消息
  loadChatMessages: function() {
    wx.cloud.callFunction({
      name: 'getUserId',
    })
    .then(res => {
      // 清空输入框中的消息内容
      this.setData({ memberID: res.result.openid });
      wx.cloud.callFunction({
        name: 'getChatRecord',
        data: {
          groupID: this.data.groupId,
        }
      })
      .then(res => {
        console.log('res',res)
        if (res.result && res.result.data && res.result.data.length > 0) {
          // 合并并排序消息数据
          let allMessages = [];
          res.result.data.forEach(record => {
            const messages = record.textHistory.map(message => {
              return {
                memberID: record.memberID,
                isSelf: record.memberID === this.data.memberID, // 根据memberID判断消息是否为自己发送
                avatar: record.avatar,
                nickname: record.nickName,
                timestamp: new Date(message[1]),
                content: message[0]
              };
            });
            
            allMessages = allMessages.concat(messages);
          });
          // 按照消息的发送时间顺序排序
          allMessages.sort((a, b) => a.timestamp - b.timestamp);
  
          // 将时间戳转换为字符串形式
          allMessages.forEach(message => {
            message.timestamp = new Date(message.timestamp).toLocaleString();
          });
          this.setData({
            messages:allMessages
          })
          this.getScollBottom();
  
        } else {
          console.error('获取聊天记录失败', res.result);
        }
      })
      .catch(error => {
        console.error('云函数调用失败', error);
      });
    })
    .catch(error => {
      console.error('云函数调用失败', error);
    });
  },

  // 监听聊天记录变化
  listenToChatRecordChanges: function() {
    const db = wx.cloud.database();
    const _ = db.command;
    const that = this;
    
    // 监听集合中数据的变化
    db.collection('chatRecords')
      .where({
        groupID: that.data.groupId // 查询条件：群聊ID
      })
      .watch({
        onChange: function(snapshot) {
          console.log('收到数据更新事件：', snapshot);
          // 在数据更新时重新加载聊天消息
          that.loadChatMessages();          
        },
        onError: function(err) {
          console.error('监听数据更新事件失败：', err);
        }
      });
  },

  // 输入框输入事件处理函数
  onInput: function(event) {
    this.setData({ inputMessage: event.detail.value });
  },

  // 发送消息事件处理函数
  onSend: function() {
    if(this.data.inputMessage === '')
    {
      return
    }
    let that = this
    const newMessage = this.data.inputMessage
    console.log(this.data.groupId+this.data.memberID+this.data.inputMessage+Date().toLocaleString())
    const newrecord = [this.data.inputMessage,new Date()]
    wx.cloud.callFunction({
      name: 'insertIntoChatRecords',
      data: {
        groupID:that.data.groupId,
        record:newrecord
      }
    })
    .then(res => {
      console.log(res)
      //更新群组最新消息数据
      wx.cloud.callFunction({
        name: 'updateNewRecord',
        data: {
          groupID:that.data.groupId,
          message:newMessage,
          time:new Date()
        }
      })
      .then(res => {
        console.log(res)
        
      })
      .catch(error => {
        console.error('云函数调用失败', error);
      });
    })
    .catch(error => {
      console.error('云函数调用失败', error);
    });
    // 清空输入框中的消息内容
    that.setData({ inputMessage: '' });
  },

  goToMemberInfo: function(event) {
    const memberID = event.currentTarget.dataset.info.memberID;
    const Avatar = event.currentTarget.dataset.info.avatar;
    const NickName = event.currentTarget.dataset.info.nickname;
    console.log(memberID)
    console.log(Avatar)
    console.log(NickName)
    wx.navigateTo({
      url: '/pages/memberInfo/memberInfo?memberID=' + memberID + '&avatar=' + Avatar+'&nickname='+NickName,
      fail: function(err) {
        // 输出跳转失败的错误信息
        console.error('跳转失败:', err);
      }
    });
  }
});
