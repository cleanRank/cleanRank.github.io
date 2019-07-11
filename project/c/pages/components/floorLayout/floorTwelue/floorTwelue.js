const app = getApp()
import { wordCut } from '../../../../utils/wordCut.js' // 引入文字限制api
var WxParse = require('../../../detail/wxParse/wxParse.js')
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  properties: {
    floorData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.initFloorData(newVal)
      }
    },
  },
  data: {
    flag:false,
    btnWord:'全部展开',
    _item:[],
    toggleType:true,
    text: '',
    newText:''
  },
  attached: function () { },
  ready:function(){
    let result = wordCut(80, this.data.text);
    if(result.flag){
      this.setData({
        newText: result.str,
        flag: result.flag
      })
    }
    let arr=this.data._item;
    for (let i in arr.listFloorDetail.article){
      arr.listFloorDetail.article[i].flag=true
    }
    this.setData({
      _item:arr
    })
  },
  methods: {
    //初始化数据
    initFloorData: function (newVal, newSession) {
      this.setData({
        _item: newVal
      })
    },
    toDetail: function (e){
      getApp().globalData.icd = e.currentTarget.dataset.id
      getApp().globalData.number = e.currentTarget.dataset.number
      getApp().globalData.contentNum = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/vip/announceList/announceDetail/announceDetail?fromType=announcedetail&origin=floor&back=2&contentNum=' + e.currentTarget.dataset.id + '&number=' + e.currentTarget.dataset.number + '&contentId=' + e.currentTarget.dataset.id,
      })
    },
    toggleWord:function(e){
      let id = e.currentTarget.dataset.id;
      let newarr=this.data._item;
      for (let i in newarr.listFloorDetail.article){
        if(i==id){
          newarr.listFloorDetail.article[i].flag = !newarr.listFloorDetail.article[i].flag
        }
      }
      this.setData({
        _item:newarr
      })
    }
  }
})