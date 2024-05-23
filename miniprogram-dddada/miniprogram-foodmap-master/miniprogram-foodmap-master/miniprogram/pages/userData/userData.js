// pages/userData/userData.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temporaryData: {} ,// 云端下载的临时数据
    genderOptions:["男","女","其他"],
    gender: '男',
    age: '',
    major: '',
    region: '',
    constellationOptions: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
    constellation: '白羊座',
    signature: '',
    showToast: false,
  },

  genderChange: function(e) {
    const selectedIndex = e.detail.value; // 获取用户选择的性别在选项数组中的索引
    const selectedGender = this.data.genderOptions[selectedIndex]; // 根据索引获取用户选择的性别
    this.setData({
      gender: selectedGender // 更新页面数据，显示用户选择的性别
    });
  },

  checkAgeInput: function(e) {
    let inputValue = e.detail.value;
    // 如果输入为空，则直接返回
    if (inputValue === '') {
      return;
    }
    // 将输入转换为数字类型
    let age = parseFloat(inputValue);
    // 如果输入不是数字，或者小于0，则重置输入框的值为0
    if (isNaN(age) || age < 0) {
      this.setData({
        age: 0
      });
    } else {
      // 否则将输入的值更新到 data 中
      this.setData({
        age: age
      });
    }
  },

  majorInput: function(e) {
    this.setData({
      major: e.detail.value // 将输入框中的值存储到名为 major 的数据中
    });
  },

  regionInput: function(e) {
    this.setData({
      region: e.detail.value // 将输入框中的值存储到名为 region 的数据中
    });
  },

  // 当用户选择星座时触发的事件处理函数
  constellationChange: function(e) {
    const selectedIndex = e.detail.value; // 获取用户选择的星座在选项数组中的索引
    const selectedConstellation = this.data.constellationOptions[selectedIndex]; // 根据索引获取用户选择的星座
    this.setData({
      constellation: selectedConstellation // 更新页面数据，显示用户选择的星座
    });
  },

  signatureInput: function(e) {
    this.setData({
      signature: e.detail.value // 将文本框中的值存储到名为 signature 的数据中
    });
  },

  handleSubmitButtonClick: function(e) {
    wx.cloud.callFunction({
      name: 'updatePersonalData',
      data: {
        gender: this.data.gender,
        age:this.data.age,
        subject:this.data.major,
        region:this.data.region,
        starSign: this.data.constellation,
        signature: this.data.signature,
        },
    })
    .then(res => {
      console.log('更新成功',res)
      wx.showModal({
        title: '更新结果', //提示的标题
        content: '更新成功', //提示的内容
        success: function(res) {
          if(res.confirm) {
            console.log('用户点击了确定')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        }
      })
    })
    .catch(res =>{
      console.log('更新失败',res)
    })
  },

  handleResetButtonClick: function() {
    // 显示提示框
    this.setData({
      showToast: true
    });


    // 清除数据，恢复到默认状态（示例代码，请根据实际情况修改）
    this.setData({
      age: this.data.temporaryData.age,
      gender: this.data.temporaryData.gender, 
      major: this.data.temporaryData.subject, 
      region: this.data.temporaryData.region,
      constellation: this.data.temporaryData.starSign,
      signature: this.data.temporaryData.signature,
    });

    // 延时隐藏提示框
    setTimeout(() => {
      this.setData({
        showToast: false
      });
    }, 2000); // 延时 2000 毫秒（2秒）后隐藏提示框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.callFunction({
      name: 'getPersonalData'
    })
    .then(res => {
      console.log('获取成功',res)
      this.setData({
        temporaryData: res.result.data[0],
        gender: res.result.data[0].gender,
        age:res.result.data[0].age,
        major:res.result.data[0].subject,
        region:res.result.data[0].region,
        constellation: res.result.data[0].starSign,
        signature: res.result.data[0].signature,
      });
    })
    .catch(res =>{
      console.log('获取失败',res)
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