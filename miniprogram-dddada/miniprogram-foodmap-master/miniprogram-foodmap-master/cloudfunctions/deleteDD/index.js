// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  await cloud.database().collection('ddIMO')
  .where({
    groupID:event.groupID
  })
  .remove()
  await cloud.database().collection('groupIMO')
  .where({
    groupID:event.groupID
  })
  .remove()
  await cloud.database().collection('groupMemberIMO')
  .where({
    groupID:event.groupID
  })
  .remove()

  await cloud.database().collection('chatRecords')
  .where({
    groupID:event.groupID
  })
  .remove()
  return {
    event
  }
}