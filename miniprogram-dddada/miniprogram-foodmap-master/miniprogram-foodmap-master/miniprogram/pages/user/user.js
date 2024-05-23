Page({
 
 /**
  * 页面的初始数据
  */
 data: {
  userAccount: '',
  isEditing: false, // 控制编辑状态的变量
  isAccordionOpen: false, // 用于控制标签容器显示和隐藏状态的变量
  tags: ['暂无'], // 默认标签数据
  nickName:'用户',
  isEditingNickname: false,
  avatarSrc:'/images/默认头像.png',
  tagList: ['情感','游戏','学习','摄影','运动','美食']
},

  // 编辑头像函数
  editAvatar: function() {
    var that = this; // 保存页面上下文，在回调函数中使用
    // 弹出图片选择器
    wx.chooseImage({
      count: 1, // 最多只能选择一张图片
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 选择图片成功后的操作
        const tempFilePath = res.tempFilePaths[0]; // 获取选定图片的临时文件路径
        console.log("选择的图片路径：" + tempFilePath);
        
        // 将选定的图片保存到临时文件
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            // 图片保存成功后的操作
            const savedFilePath = res.savedFilePath; // 获取保存后的文件路径
            console.log("保存的图片路径：" + savedFilePath);
            // 更新页面上的头像显示
            that.setData({
              avatarSrc: savedFilePath // 更新页面数据中的头像路径
            });
            //将头像信息在云端更新
            const fileName = that.data.userAccount + 'headImage.png';
            console.log(fileName)
            wx.cloud.uploadFile({
              cloudPath: 'userAccountPicture/headImage/' + fileName, // 云端的文件路径
              filePath: savedFilePath, // 本地文件路径
              success: res => {
                console.log(res.fileID); // 返回文件 ID
                wx.cloud.callFunction({
                  name: 'updateUserAccountPicture',
                  data: {
                    newFileID: res.fileID
                    },
                })
                .then(updateRes => {
                  console.log('头像更新成功',updateRes)
                })
                .catch(updateRes =>{
                  console.log('头像更新失败',updateRes)
                })
              },
              fail: err => {
                console.error(err);
              }
            });
            
          },
          fail: function (res) {
            // 图片保存失败后的操作
            console.log("图片保存失败：" + res.errMsg);
          }
        });
      },
      fail: function (res) {
        // 选择图片失败后的操作
        console.log("选择图片失败：" + res.errMsg);
      }
    });
  },

// 编辑昵称函数
editNickname: function() {
  this.setData({
    isEditingNickname: true // 将编辑昵称的状态设置为真
  });
},

// 输入昵称函数
inputNickname: function(event) {
  this.setData({
    nickName: event.detail.value // 更新 nickName 数据为输入框中的值
  });
},

//退出昵称编辑函数
exitEditting: function() {
  this.setData({
    isEditingNickname: false // 将编辑昵称的状态设置为假，退出编辑模式
  });
},

// 保存昵称函数
saveNickname: function() {
  this.setData({
    isEditingNickname: false // 将编辑昵称的状态设置为假，退出编辑模式
  });
  wx.cloud.callFunction({
    name: 'updateUserName',
    data: {
      newUserName:this.data.nickName
      },
  })
  .then(res => {
    console.log('昵称更新成功',res)
  })
  .catch(res =>{
    console.log('昵称更新失败',res)
  })
},

// 事件处理函数
toggleAccordion: function () {
  // 切换 isAccordionOpen 的值
  this.setData({
    isAccordionOpen: !this.data.isAccordionOpen,
    isEditing: false,
  });
},

// 编辑按钮点击事件处理函数
toggleEditing: function() {
  this.setData({
    isEditing: !this.data.isEditing // 切换编辑状态
  });
  if(this.data.isEditing === false){
    this.updateTag()
  }
  
},

// 删除标签事件处理函数
removeTag: function(event) {
  const index = event.currentTarget.dataset.index; // 获取点击的叉号对应的标签索引
  this.data.tags.splice(index, 1); // 从标签数组中删除指定索引的标签
  this.setData({
    tags: this.data.tags // 更新数据，确保界面可以正确渲染新的标签数据
  });
},

//用户选择标签弹窗
showAllTags: function() {
  wx.showActionSheet({
    itemList: ['情感','游戏','学习','摄影','运动','美食'], //选项列表
    success: (res) => {
      console.log(this.data.tagList[res.tapIndex])
      this.data.tags.push(this.data.tagList[res.tapIndex]);
      // 更新数据，确保界面可以正确渲染新的标签数据
      this.setData({
        tags: this.data.tags
      });
    },
    fail (res) {
      console.log('取消选项')
    }
  });
},
// 添加标签事件处理函数
addTag: function() {
  this.showAllTags();
},

updateTag: function(){
  console.log("进入updateTag")
  wx.cloud.callFunction({
    name: 'updateUserFavorTag',
    data: {
      newTags:this.data.tags
      },
  })
  .then(res => {
    console.log('更新成功',res)
  })
  .catch(res =>{
    console.log('更新失败',res)
  })
},

goToUserDd: function () {
  console.log("122","点击了管理dd")
  wx.navigateTo({
    url: '/pages/userDd/userDd',
  })
},

goToUserData: function () {
  wx.navigateTo({
    url: '/pages/userData/userData',
  })
},

goToSetting: function () {
  wx.navigateTo({
    url: '/pages/setting/setting',
  })
},
 /**
  * 生命周期函数--监听页面加载
  */
 onLoad() {
  wx.cloud.callFunction({
    name: 'initUserImo'
  })
  .then(res => {
    console.log('云函数获取数据成功',res)
    this.setData({
      nickName: res.result[0].data[0].userName, 
      tags: res.result[1].data[0].favorType,
      userAccount:res.result[0].data[0].userAccount
    })
    wx.cloud.callFunction({
      name: 'getUserAccountPicture',
      data: {
        pictureID: res.result[0].data[0].pictureID
      },
    })
    .then(imageRes => {
      //console.log('imageRes',imageRes)
      this.setData({
        avatarSrc: imageRes.result.fileList[0].tempFileURL
      });
    })
    .catch(imageRes =>{
      console.log('云函数获取数据失败',imageRes)
    })
  })
  .catch(res =>{
    console.log('云函数获取数据失败',res)
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