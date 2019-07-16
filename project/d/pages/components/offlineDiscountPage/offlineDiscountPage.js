// pages/fpages/discountPage/discountPage.js
import {
    formatTimeAmt
}
from '../../../utils/util.js'
const app = getApp()
Component({
    data: {
        currentTab1: 0,
        index1: undefined,
        index2: undefined,
        index3: undefined,
        total: [0, 0, 0], // tab条数
        oldindex1: 0,
        oldindex2: 0,
        oldindex3: 0,
        loadFlag: [false, false, false], //分页是否到底
        size: 8, // 每页条数
        page: [1, 1, 1], // 当前nav当前页码
        usedFlag: [0, 1, -1], // 当前tab入参flag
        ticketInfoNoUse: [],
        ticketInfoUsed: [],
        ticketInfoExpired: []
    },
    methods: {
        clickTab1: function (e) {
            if (this.data.currentTab1 === e.target.dataset.current) {
                return false;
            } else {
                this.setData({
                    currentTab1: e.target.dataset.current,
                })
            }
        },
        modelShow(e) {
            var that = this;
            let index = e.currentTarget.dataset.index
            if (that.data.currentTab1 == 0) { // 如果是第一个tab选项，则操作未使用的数据
                this.data.index1 = e.currentTarget.dataset.index
                let nowToggle1 = this.data.ticketInfoNoUse[index].isShow
                let ticketInfoNoUse = this.data.ticketInfoNoUse
                if (this.data.oldindex1 !== index) {
                    this.setData({
                        ['ticketInfoNoUse[' + this.data.oldindex1 + '].isShow']: false,
                    })
                }
                this.setData({
                    ['ticketInfoNoUse[' + index + '].isShow']: !nowToggle1
                })

                this.data.oldindex1 = index
            } else if (that.data.currentTab1 == 1) { // 如果是第二个tab选项，则操作已使用的数据
                this.data.index2 = e.currentTarget.dataset.index
                let nowToggle2 = this.data.ticketInfoUsed[index].isShow
                let ticketInfoUsed = this.data.ticketInfoUsed
                if (this.data.oldindex2 !== index) {
                    this.setData({
                        ['ticketInfoUsed[' + this.data.oldindex2 + '].isShow']: false,
                    })
                }
                this.setData({
                    ['ticketInfoUsed[' + index + '].isShow']: !nowToggle2
                })
                this.data.oldindex1 = index
            } else if (that.data.currentTab1 == 2) { // 如果是第三个tab选项，则操作已过期的数据
                this.data.index3 = e.currentTarget.dataset.index
                let nowToggle3 = this.data.ticketInfoExpired[index].isShow
                let ticketInfoExpired = this.data.ticketInfoExpired
                if (this.data.oldindex3 !== index) {
                    this.setData({
                        ['ticketInfoExpired[' + this.data.oldindex3 + '].isShow']: false,
                    })
                }
                this.setData({
                    ['ticketInfoExpired[' + index + '].isShow']: !nowToggle3
                })
                this.data.oldindex3 = index
            }



        },
        // 下拉分页
        onReachBottom() {
            console.log("hahahah")
            let i = this.data.currentTab1
            if (!this.data.loadFlag[i]) {
                this.getLoadingPageTicket(i)
            }
        },
        getLoadingPageTicket(x = 0) {
            console.log(this.data.page[x])
            let params = Object.assign({}, {
                page: this.data.page[x]++,
                size: this.data.size,
                param: {
                    usedFlag: this.data.usedFlag[x]
                }
            })
            app.$http.getMyTicketInfo(params).then(res => {
                res.result.datas.forEach(v => {
                    v.isShow = false
                    v.beginDate = formatTimeAmt(v.beginDate, 'yyyy.MM.dd')
                    v.endDate = formatTimeAmt(v.endDate, 'yyyy.MM.dd')
                    if (v.actionMemo) {
                        v.actionMemo = v.actionMemo.split("\n")
                    } else {
                        v.actionMemo = []

                    }
                    if (v.ticketType == 9) {
                        if ((v.discountValue * 10).toString().length > 1) {
                            v.discountValue = (v.discountValue * 10).toFixed(1)

                        } else {
                            v.discountValue = (v.discountValue * 10)
                        }
                    }

                })
                if (res.result.datas.length < this.data.size) {
                    this.setData({
                        ['loadFlag[' + x + ']']: true
                    })
                }
                if (x == 1) {
                    this.setData({
                        ticketInfoUsed: [...this.data.ticketInfoUsed, ...res.result.datas],
                        ['total[' + x + ']']: res.result.total
                    })
                } else if (x == 2) {
                    this.setData({
                        ticketInfoExpired: [...this.data.ticketInfoExpired, ...res.result.datas],
                        ['total[' + x + ']']: res.result.total
                    })
                } else {
                    this.setData({
                        ticketInfoNoUse: [...this.data.ticketInfoNoUse, ...res.result.datas],
                        ['total[' + x + ']']: res.result.total
                    })
                }
            }).catch(res => {})
        },
    },
    // 组件生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},
    moved: function () {},
    detached: function () {},
    // 组件生命周期
    lifetimes: {
        // created () {
        //   this.init()
        // },

    },
    pageLifetimes: {
        show() {
            this.data.currentTab1 = 0
            this.getLoadingPageTicket(0); //已过期
            this.getLoadingPageTicket(1); //已使用
            this.getLoadingPageTicket(2); //已过期
        }
    },

})