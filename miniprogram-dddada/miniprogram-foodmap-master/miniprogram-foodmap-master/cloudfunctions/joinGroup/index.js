// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const isJoin = await cloud.database().collection('groupMemberIMO')
  .where({
    groupID: event.groupID,
    memberID:wxContext.OPENID
  })
  .count();
  if(isJoin.total > 0)
  {
    return '已加入'
  }
  await cloud.database().collection('groupMemberIMO')
  .add({
    data:{
      groupID:event.groupID,
      memberID:wxContext.OPENID
    }
  })

  //获取用户昵称
  const userName = await cloud.database().collection('userIMO')
  .where({
    userAccount: wxContext.OPENID
  })
  .field({ userName: true })
  .get()
  
  //插入聊天记录表
  await cloud.database().collection('chatRecords')
  .add({
    data:{
      groupID:event.groupID,
      memberID:wxContext.OPENID,
      userName:userName.data[0].userName,
      nickName:userName.data[0].userName,
      textHistory:[]
    }
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}