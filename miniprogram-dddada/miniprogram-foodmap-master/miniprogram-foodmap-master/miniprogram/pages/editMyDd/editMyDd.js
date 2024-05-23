const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityDetail: {} ,// 活动详情数据
    options: '',
    groupName: '',
    content: '',
    date: '',
    gender: '性别不限',
    genderOptions: ['性别不限', '男', '女'],
    location: '',
    longitude: '',
    latitude: '',
    ddType: '',
    imageSrc: '/images/群聊默认头像.png',
    tags:['暂无'],
    groupID:'',
    isChooseNewImage:false,
    deadLine:'',
  },

  onShow()
  {
    console.log("onshow")
    if(app.globalData.position[1] != undefined)
    {
      console.log("defined")
      this.setData({
        longitude: app.globalData.position[1],
        latitude: app.globalData.position[0],
      });
      app.globalData.position[1] = undefined
      app.globalData.position[0] = undefined
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let ddInfo = JSON.parse(options.activityInfo)
    console.log("filePath",options.filePath)
    console.log("Activity Info:", ddInfo);
    this.setData({
      groupID : ddInfo.id,
      activityDetail: ddInfo,
      options: options,
      groupName: ddInfo.groupName,
      content: ddInfo.title,
      date: ddInfo.date,
      gender: ddInfo.gender,
      location: ddInfo.location,
      longitude: ddInfo.longitude,
      latitude: ddInfo.latitude,
      ddType: '',
      imageSrc: options.filePath,
      tags:ddInfo.tags,
      deadLine:ddInfo.deadLine,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 页面初次渲染完成后执行的代码
  },

  /**
   * 生命周期函数--监听页面显示
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // 页面隐藏时执行的代码
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载时执行的代码
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 用户下拉时执行的代码
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 页面上拉触底时执行的代码
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    // 用户分享时执行的代码
  },

  // 输入框内容改变时的处理函数
  onInputTitle(e) {
    this.setData({ groupName:e.detail.value });
  },
  onInputContent(e) {
    this.setData({ content: e.detail.value });
  },
  onInputDate(e) {
    this.setData({ date: e.detail.value });
  },
  onSelectGender(e) {
    const index = e.detail.value;
    this.setData({
      gender: this.data.genderOptions[index]
    });
  },
  onInputLocation(e) {
    this.setData({ location: e.detail.value });
  },
  onInputLongitude(e) {
    this.setData({ longitude: e.detail.value });
  },
  onInputLatitude(e) {
    this.setData({ latitude: e.detail.value });
  },
  onInputTag(e) {
    this.setData({ ddType: e.detail.value });
  },
  
  //添加标签处理函数
  addTag:function()
  {
    console.log("addedTypeName",this.data.ddType)
    const typeName = this.data.ddType + '  '
    this.data.tags = this.data.tags.filter(tag => tag !== '暂无');
    this.data.tags.push(typeName);
      // 更新数据，确保界面可以正确渲染新的标签数据
    this.setData({
      tags: this.data.tags,
      ddType:'',
    });
  },
  
  //清空标签处理函数
  clearTags: function(){
    this.setData({
      tags: ['暂无'],
    });
    wx.showModal({
      content: "成功清除已选标签！", //提示的内容
      success: function(res) {
        if(res.confirm) {
          console.log('用户点击了确定')
        } else if (res.cancel) {
          console.log('用户点击了取消')
        }
      }
    })
  },

  // 图片选择处理函数
  chooseImage :function() {
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
            // 更新页面上的图像显示
            that.setData({
              imageSrc: savedFilePath, // 更新页面数据中的图像路径
              isChooseNewImage: true
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

  // 处理选择经纬度的函数
  chooseLocation: function() {
    // 跳转到地图页面，可以传递当前页面的路由作为参数，以便返回时使用
    app.globalData.isLocating = true
    wx.navigateTo({
      url: `/pages/map/map`,
      success: function(res) {
        console.log("跳转成功");
      },
      fail: function(err) {
        console.error("跳转失败", err);
      }
    });
  },

  //重置页面的处理函数
  resetDd: function() {
  console.log(this.data.activityDetail)
  this.setData({
  groupName:this.data.activityDetail.groupName,
  content: this.data.activityDetail.title,
  date: this.data.activityDetail.date,
  gender: this.data.activityDetail.gender,
  location: this.data.activityDetail.location,
  ddType: '',
  imageSrc: this.data.options.filePath,
  tags:this.data.activityDetail.tags,
  });
  wx.showModal({
    content: "重置成功！", //提示的内容
    success: function(res) {
      if(res.confirm) {
        console.log('用户点击了确定')
      } else if (res.cancel) {
        console.log('用户点击了取消')
      }
    }
  })
  },

  // 提交修改后公告的处理函数
  submitEditedDd() {
    // 这里可以添加代码将公告信息提交到服务器
    let that = this
    console.log('updated',this.data)
    //添加到数据库
    wx.cloud.callFunction({
      name: 'EditDd',
      data: {
        oldGroupName:this.data.activityDetail.id,
        groupID : this.data.groupID,
        groupName: this.data.groupName,
        ddContent: this.data.content,
        endDate: this.data.date,
        genderOptions: this.data.gender,
        position:this.data.location,
        latitude: this.data.latitude,
        longitude:this.data.longitude,
        ddType:this.data.tags,
        deadline:this.data.deadline
        },
    })
    .then(res => {
      console.log('上传成功',res)
      if(res.result === '已创建，请勿创建相同名称的群聊')
      {
        wx.showModal({
          title: '修改结果', //提示的标题
          content: '修改失败，您已创建过相同名称的群聊请更改', //提示的内容
          success: function(res) {
            if(res.confirm) {
              console.log('用户点击了确定')
            } else if (res.cancel) {
              console.log('用户点击了取消')
            }
          }
        })
      }
      else
      {
        //上传图片
        console.log("images",that.data.imageSrc)
        const time = new Date().toLocaleString()
        const fileName = res.result + that.data.groupName + time + "HeadImage.png";
        console.log("fileName",fileName)
        if(this.data.isChooseNewImage === true){
          wx.cloud.uploadFile({
            cloudPath: 'groupImoPicture/groupHeadImage/' + fileName, // 云端的文件路径
            filePath: that.data.imageSrc, // 本地文件路径
            success: uploadRes => {
              console.log(uploadRes.fileID); // 返回文件 ID
              wx.cloud.callFunction({
                name: 'updateGroupHeadImage',
                data: {
                  groupID: res.result + that.data.groupName,
                  newFileID: uploadRes.fileID
                  },
              })
              .then(updateRes => {
                console.log('群聊头像更新成功',updateRes)
              })
              .catch(updateRes =>{
                console.log('群聊头像更新失败',updateRes)
              })
              // 存储公告信息到本地缓存
              wx.setStorage({
                key: 'announcement',
                data: this.data,
                success: function() {
                  console.log('公告信息已发布');
                },
                fail: function() {
                  console.log('存储公告信息失败');
                }
              });
            },
            fail: err => {
              console.error(err);
            }
          });
        }
        // 显示发布成功的弹窗
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000
        });
      }
    })
    .catch(res =>{
      console.log('更新失败',res)
    })
  },
})