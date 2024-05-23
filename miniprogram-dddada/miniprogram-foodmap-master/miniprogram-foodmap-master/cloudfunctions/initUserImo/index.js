// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const accountImo = await  cloud.database().collection('userIMO')
  .where({
    userAccount: wxContext.OPENID
  })
  .get()

  const favorImo = await  cloud.database().collection('userFavors')
  .where({
    userAccount: wxContext.OPENID
  })
  .get()

  
  const result = [accountImo,favorImo]
  return result
}