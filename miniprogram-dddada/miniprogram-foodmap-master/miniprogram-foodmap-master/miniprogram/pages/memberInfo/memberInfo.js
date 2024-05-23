Page({
  onLoad: function(options) {
    const memberID = options.memberID;
    console.log("接收到的 memberID:", memberID);
    const avatar = options.avatar;
    console.log("接收到的 avatar:", avatar);
    const nickname = options.nickname;
    console.log("接收到的 nickname:", nickname);

    // 调用云函数获取成员信息
    wx.cloud.callFunction({
      name: 'getGroupMemberInfo',
      data: {
        memberID: memberID,
      }
    })
    .then(res => {
      console.log('获取成功', res);
      // 将成员信息保存到数据中
      this.setData({
        avatar: avatar,
        nickname: nickname,
        age: res.result.data[0].age,
        gender: res.result.data[0].gender,
        region: res.result.data[0].region,
        starSign: res.result.data[0].starSign,
        subject: res.result.data[0].subject,
        signature: res.result.data[0].signature
      });
    })
    .catch(error => {
      console.error('获取失败', error);
    });
  }
});
