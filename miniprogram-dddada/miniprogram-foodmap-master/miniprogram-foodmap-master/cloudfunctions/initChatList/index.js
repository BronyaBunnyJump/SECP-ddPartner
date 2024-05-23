// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const groupList = await cloud.database().collection('groupMemberIMO')
  .where({
    memberID: wxContext.OPENID
  })
  .get()
  const groupIDs = groupList.data.map(item => item.groupID);
  
  const groupsInfo = await  cloud.database().collection('groupIMO')
  .where({
    groupID: cloud.database().command.in(groupIDs)
  })
  .get()
  
  // 使用 Promise.all() 并行调用 cloud.callFunction
  const groupDataPromises = groupsInfo.data.map(async item => {
    const imageSrc = await cloud.callFunction({
      name: 'getUserAccountPicture',
      data: {
        pictureID: item.groupImage
      }
    });
    return {
      id: item.groupID,
      name: item.groupName,
      avatarUrl: imageSrc.result.fileList[0].tempFileURL,
      imageID:item.groupImage,
      lastMessage: {
        content: item.leastMessage,
        timestamp: item.sendTime
      }
    };
  });
  // 等待所有的 cloud.callFunction 完成
  const groupData = await Promise.all(groupDataPromises);
  return { groupData };
}