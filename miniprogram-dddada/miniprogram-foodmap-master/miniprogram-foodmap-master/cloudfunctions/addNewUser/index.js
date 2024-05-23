// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 在这里插入数据的逻辑
  await cloud.database().collection('userIMO')
  .add({
    data:{
      pictureID: 'cloud://cloud1-5go2hx89296fd52a.636c-cloud1-5go2hx89296fd52a-1325763270/userAccountPicture/11.webp',
      userAccount: wxContext.OPENID,
      userName: '用户'
    }
  })

  await cloud.database().collection('userFavors')
  .add({
    data:{
      userAccount: wxContext.OPENID,
      favorType:['美男','美女']
    }
  })

  await cloud.database().collection('userInfo')
  .add({
    data:{
      userAccount: wxContext.OPENID,
      gender: '男',
      age: 0,
      subject: '',
      region:'',
      starSign:'白羊座',
      signature:'',
    }
  })
  return wxContext.OPENID
}