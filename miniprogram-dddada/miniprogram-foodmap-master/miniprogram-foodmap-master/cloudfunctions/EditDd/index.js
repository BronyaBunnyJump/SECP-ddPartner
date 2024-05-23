// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const oldName = event.oldGroupName
  if(event.groupName != oldName)
  {
    const isExist = await cloud.database().collection('groupIMO')
    .where(
      {groupID: wxContext.OPENID + event.groupName}
      )
    .count();
    if(isExist.total > 1)
    {
      return '已创建，请勿创建相同名称的群聊'
    }
  }
  
  //dd信息表更新信息
  await cloud.database().collection('ddIMO')
  .where({
    groupID:event.groupID
  })
  .update({
    data:{
      publisher:wxContext.OPENID,
      groupID:wxContext.OPENID + event.groupName,
      groupName:event.groupName,
      ddContent: event.ddContent,
      endDate: event.endDate,
      genderOptions: event.genderOptions,
      position: event.position,
      latitude: event.latitude,
      longitude: event.longitude,
      ddType: event.ddType
    }
  })
  
  const newDate = new Date();
  //群聊表更新信息
  await cloud.database().collection('groupIMO')
  .where({
    groupID:event.groupID
  })
  .update({
    data:{
      publisher:wxContext.OPENID,
      groupID:wxContext.OPENID + event.groupName,
      groupName:event.groupName,
    }
  })
  
  //群聊成员表
  await cloud.database().collection('groupMemberIMO')
  .where({
    groupID:event.groupID
  })
  .update({
    data:{
      groupID:wxContext.OPENID + event.groupName,
    }
  })
  //聊天记录表
  await cloud.database().collection('chatRecords')
  .where({
    groupID:event.groupID
  })
  .update({
    data:{
      groupID:wxContext.OPENID + event.groupName,
    }
  })
  return wxContext.OPENID
}