import * as userInfoAction from 'store/actions/userInfo.action'
import * as headerBtnAction from 'store/actions/headerBtn.action'
import * as updateDialogFlag from 'store/actions/dialog.action'
// import * as dialogAction from 'store/actions/dialog.action'
let actions = Object.assign({}, userInfoAction, headerBtnAction, updateDialogFlag)

export default actions
