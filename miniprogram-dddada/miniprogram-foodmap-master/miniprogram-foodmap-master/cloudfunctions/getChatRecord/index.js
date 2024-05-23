// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // const userPicture = await cloud.database().collection('userIMO')
  // .where({
  //   userAccount: event.memberID
  // })
  // .field({ pictureID: true })
  // .get()
  
  // const pictureImo = await cloud.getTempFileURL({
  //   fileList: [userPicture.data[0].pictureID]
  // });

  const result = await cloud.database().collection('chatRecords')
  .where({
    groupID: event.groupID,
  })
  .get()

  for (const doc of result.data) {
    const userPicture = await cloud.database().collection('userIMO')
      .where({
        userAccount: doc.memberID
      })
      .field({ pictureID: true })
      .get()

    const pictureImo = await cloud.getTempFileURL({
      fileList: [userPicture.data[0].pictureID]
    });

    doc.avatar = pictureImo.fileList[0].tempFileURL;
  }

  return result

}