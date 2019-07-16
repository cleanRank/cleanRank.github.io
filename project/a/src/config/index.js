import login from './login'
import cashManage from './cashManage'
import accountManage from './accountManage'
import message from './message'
import mine from './mine'
import userApi from './userApi'
import entryApplication from './entryApplication'
let http = {
  ...login,
  ...cashManage,
  ...accountManage,
  ...message,
  ...mine,
  ...userApi,
  ...entryApplication
}
export default http
