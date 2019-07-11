/**
 * @method dispatchData 封装的发送commit 的函数
 */
import * as dialogAction from 'store/actions/dialog.action'
import * as userInfoAction from 'store/actions/userInfo.action'
import * as goodsInfoAction from 'store/actions/goodsInfo.action'
import * as addressInfoAction from 'store/actions/addressInfo.action'
import * as afterSalesAction from 'store/actions/afterSales.action'
import * as cutIndexInfoAction from 'store/actions/cutIndexInfo.action'
import * as myCollectionAction from 'store/actions/myCollection.action'
import * as shopCartAction from 'store/actions/shopCart.action'
import * as messageNumAction from 'store/actions/message.action'
import * as userSwitchAction from 'store/actions/switch.action'

let actions = Object.assign({}, dialogAction, userInfoAction, goodsInfoAction, addressInfoAction, afterSalesAction, cutIndexInfoAction, myCollectionAction, shopCartAction, messageNumAction, userSwitchAction)

export default actions
