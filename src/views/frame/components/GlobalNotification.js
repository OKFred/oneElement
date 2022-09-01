// 模块引入
import { Notification } from 'element-ui';

// 本地变量和函数
function queryResult(type, info, title = '通知') {
  const noteType = type ? 'success' : 'error';
  const noteInfo = typeof info === 'object' ? JSON.stringify(info) : info;
  Notification[noteType]({
    title,
    message: noteInfo,
    duration: type ? 3000 : 7000,
  });
} // ⭐显示通知

window.queryResult = queryResult; // ⭐全局函数
