// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const isExist = await cloud.database().collection('groupIMO')
  .where(
    {groupID: wxContext.OPENID + event.groupName}
    )
  .count();
  if(isExist.total > 0)
  {
    return '已创建，请勿创建相同名称的群聊'
  }
  //dd信息表插入信息
  await cloud.database().collection('ddIMO')
  .add({
    data:{
      publisher:wxContext.OPENID,
      groupID:wxContext.OPENID + event.groupName,
      groupName:event.groupName,
      ddContent: event.ddContent,
      endDate: event.endDate,
      deadLine:event.deadLine,
      genderOptions: event.genderOptions,
      position: event.position,
      latitude: event.latitude,
      longitude: event.longitude,
      ddType: event.ddType
    }
  })
  const newDate = new Date();
  //群聊表插入信息
  await cloud.database().collection('groupIMO')
  .add({
    data:{
      publisher:wxContext.OPENID,
      groupID:wxContext.OPENID + event.groupName,
      groupName:event.groupName,
      memberNum:1,
      groupNotice:"暂无公告",
      groupImage:"",
      leastMessage : "暂无消息",
      sendTime: newDate
    }
  })
  
  //群聊成员表
  await cloud.database().collection('groupMemberIMO')
  .add({
    data:{
      groupID:wxContext.OPENID + event.groupName,
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
      groupID:wxContext.OPENID + event.groupName,
      memberID:wxContext.OPENID,
      userName:userName.data[0].userName,
      nickName:userName.data[0].userName,
      textHistory:[]
    }
  })
  return wxContext.OPENID

}