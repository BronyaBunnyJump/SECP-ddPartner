// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const ddActivities = await  cloud.database().collection('ddIMO')
  .where({
    publisher:wxContext.OPENID,
  })
  .get()
  let data = ddActivities.data;
  // 使用map方法遍历数组，并修改对象的属性名称
  let ddData = data.map(item => {
    let newItem = {};
    newItem.id = item.groupID;
    newItem.title = item.ddContent;
    newItem.tags = item.ddType;
    newItem.date = item.endDate;
    newItem.deadLine = item.deadLine,
    newItem.groupName = item.groupName
    newItem.location = item.position
    newItem.gender = item.genderOptions
    newItem.description = "性别限制：" + item.genderOptions + '\n' + "        群聊名称：" + item.groupName + '\n' + "      活动地点：" + item.position;
    newItem.latitude = item.latitude;
    newItem.longitude = item.longitude;
    return newItem;
  });
  return {ddData}
  
}