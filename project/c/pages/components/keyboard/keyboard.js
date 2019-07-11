// pages/components/downloadBtn/downloadBtn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    downloadTxt: {
      type: String,
      value: '保存图片'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    keyList: [
      {
        num: 1
      },
      {
        num: 2,
        keyLetter: "ABC"
      },
      {
        num: 3,
        keyLetter: "DEF"
      },
      {
        num: 4,
        keyLetter: "GHI"
      },
      {
        num: 5,
        keyLetter: "JKL"
      },
      {
        num: 6,
        keyLetter: "MNO"
      },
      {
        num: 7,
        keyLetter: "PQRS"
      },
      {
        num: 8,
        keyLetter: "TUV"
      },
      {
        num: 9,
        keyLetter: "WXYZ"
      },
      {
        text: ''
      },
      {
        num: "0"
      },
      {
        text: '删除'
      }
    ],
    codeList: ['','','','','',''],
    verificationCode: '',
    timeDown: 59
  },
  attached: function () {
    this.timeDwon()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tapKey (e) {
      var key = e.currentTarget.dataset.key.num || ''
      var index = e.currentTarget.dataset.index
      if (key && this.data.verificationCode.length < 6) {
        this.data.verificationCode+=key
        this.data.codeList[this.data.verificationCode.length - 1] = key
      } else if (index!='11')  {
        return
      }
      if (index == this.data.keyList.length-1) {
        this.data.codeList[this.data.verificationCode.length - 1] = ''
        this.data.verificationCode = this.data.verificationCode.substring(0, this.data.verificationCode.length - 1)
      }
      this.setData({
        codeList: this.data.codeList,
        verificationCode: this.data.verificationCode
      })
      if (this.data.verificationCode.length == 6) {
        // 6 位验证码输入完成后执行回调函数
        this.triggerEvent('verificationFn', this.data.verificationCode)   // 执行确定的回调函数
      }
    },
    close () {
      this.triggerEvent('closeKeyboard')
    },
    // 倒计时
    timeDwon() {
      this.setData({ timeDown: 59 })
      var interval = setInterval(() => {
        if (this.data.timeDown <= 0) {
          clearInterval(interval)
          return false
        }
        var second = parseInt(this.data.timeDown) - 1
        this.setData({ timeDown: second })
      }, 1000)
    },
    // 再次调取水象通预支付
    sxtPrePay () {
      // this.data.codeList.map((i, index) => {
      //   this.data.codeList[index] = ''
      // })
      // this.setData({
      //   verificationCode: '',
      //   codeList: this.data.codeList
      // })
      this.triggerEvent('sxtPrePay')
    }
  }
})
