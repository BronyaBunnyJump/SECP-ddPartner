// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return cloud.database().collection('userInfo')
  .where({
    userAccount: wxContext.OPENID
  })
  .update({
      data:{
        gender: event.gender,
        age:event.age,
        subject:event.subject,
        region:event.region,
        starSign: event.starSign,
        signature: event.signature,
      }
  })
}