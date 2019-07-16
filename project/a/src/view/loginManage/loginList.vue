<template>
  <div class="page-loginlist">
    <!-- 头部 -->
    <el-row class="top-content">
      <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
        <div class="left-box">
          <span>账号管理</span>
          <span>账号列表</span>
        </div>
      </el-col>
      <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
        <div class="right-box" @click="addUsers"><img src="../../assets/img/zhlb_icon_add.png" alt="">新建用户</div>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <div class="table-box" v-if="accountList.length">
      <el-table :data="accountList.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width:100%">
        <el-table-column prop="id" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>
        <el-table-column prop="account" label="用户账号" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center">
          <template scope="scope">
            <span v-if='scope.row.sex===1'>男</span>
            <span v-if='scope.row.sex===2'>女</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column prop="cityName" label="所在地" align="center"></el-table-column>
        <el-table-column prop="stealth" label="状态" align="center">
          <template scope="scope">
            <span v-if='scope.row.stealth===0'>在线</span>
            <span v-if='scope.row.stealth===1'>离线</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="handle-box">
              <div class="change" @click="ediorAccount(scope.$index, scope.row.id)">编辑</div>
              <div class="check" @click="delAccount(scope.$index, scope.row.id)">删除</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout=" prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 新建账号，编辑弹框 -->
    <div class="model-wrapper" v-if="isShow">
      <div class="model">
        <div class="model-header">会员信息</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="1">
            <el-form :label-position="labelPosition" ref="ruleForm" :rules="rules" :model="formLabelAlign" size="small" label-width="100px" >
              <el-row :gutter="50">
                <el-col :span="7">
                  <div class="grid-content">
                    <el-form-item label="用户ID:" prop="id">
                      <el-input v-model="formLabelAlign.id" size="mini" placeholder="用户ID" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称:" prop="name">
                      <el-input v-model="formLabelAlign.name" size="mini" placeholder="请输入用户昵称"></el-input>
                    </el-form-item>
                    <el-form-item label="身高CM:" prop="high">
                      <el-select v-model="formLabelAlign.high" placeholder="请选择" size="mini">
                        <el-option v-for="(item, index) in highs" :key="index" :label="item.fieldVal" :value="item.fieldVal">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="7">
                  <div class="grid-content">
                    <el-form-item label="用户账号:" prop="acountNum">
                      <el-input v-model="formLabelAlign.acountNum" size="mini" placeholder="请输入用户账号" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ:" prop="qq">
                      <el-input v-model="formLabelAlign.qq" size="mini" placeholder="请输入qq号"></el-input>
                    </el-form-item>
                    <el-form-item label="体重KG:" prop="weight">
                      <el-select v-model="formLabelAlign.weight" placeholder="请选择" size="mini">
                        <el-option v-for="(item, index) in weights" :key="index" :label="item.fieldVal" :value="item.fieldVal">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="grid-content">
                    <el-form-item label="性别:" prop="gender">
                      <el-select v-model="formLabelAlign.gender" placeholder="请选择" size="mini"  :disabled="disabled" @change="selectSex">
                        <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="微信:" prop="weixin">
                      <el-input v-model="formLabelAlign.weixin" size="mini" placeholder="请输入微信号"></el-input>
                    </el-form-item>
                    <el-form-item label="行业:" required>
                      <el-form-item prop="industry">
                        <el-select v-model="formLabelAlign.industry" placeholder="请选择" size="mini" @change="selectedJob">
                          <el-option v-for="(item, index) in industrys" :key="index" :label="item.fieldName" :value="item.fieldName">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item prop="industryDetail">
                        <el-select v-model="formLabelAlign.industryDetail" placeholder="请选择" size="mini">
                          <el-option v-for="(item, index) in industryDetails" :key="index" :label="item.fieldName" :value="item.fieldName">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="50">
                <el-col :span="7">
                  <div class="grid-content">
                    <el-form-item label="生日:" prop="birst">
                      <el-date-picker v-model="formLabelAlign.birst" type="date" placeholder="选择日期" suffix-icon="el-icon-date"
                        size="mini">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="7">
                  <div class="grid-content">
                    <el-form-item label="年收入:" prop="yearMoney">
                      <el-select v-model="formLabelAlign.yearMoney" placeholder="请选择" size="mini" :disabled="yearMoneyManOrWo">
                        <el-option v-for="(item, index) in yearMoneys" :key="index" :label="item.fieldVal" :value="item.fieldVal">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="grid-content">
                    <el-form-item label="所在地:" required>
                      <el-form-item prop="city">
                        <el-select v-model="formLabelAlign.city" placeholder="请选择" size="mini" @change="selectedCity">
                          <el-option v-for="(item, index) in citys" :key="index" :label="item.provinceName" :value="item.provinceName">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item prop="address">
                        <el-select v-model="formLabelAlign.address" placeholder="请选择" size="mini" @change="selectedCitySub">
                          <el-option v-for="(item, index) in addresses" :key="index" :label="item.cityName" :value="item.cityName">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="50">
                <el-col :span="10">
                  <div class="grid-content">
                    <el-form-item label="个人介绍:">
                      <el-input type="textarea" v-model="formLabelAlign.desc" :autosize="{ minRows: 4, maxRows: 5}" placeholder="请输入自己的个人介绍" minlength="10" maxlength="50" show-word-limit>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="7">
                  <div class="grid-content">
                  </div>
                </el-col>
                <el-col :span="7">
                  <div class="grid-content">
                  </div>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="相册视频" name="2" v-if="disabled">
            <div class="wrapper">
              <div class="photo-wrapper">
                <div class="title">相册信息</div>
                <div class="photo-content-wrapper">
                  <div class="photo-content" v-for="(item,index) in usersImgList" :key="index">
                    <img :src="item.mediaUrl" alt="" class="photo" @click="changePic(item, index)">
                    <div class="del" @click="delUploadImg(0, item.id,index)">删除</div>
                  </div>
                  <div class="photo-content1" @click="uploadloadImgOrVideo(0)">
                    <div class="photo-content">
                      <img src="../../assets/img/pop_pic_add.png" alt="" class="add-pic-viedo">
                      <input class="license" type="file" ref="input0" name="license0" @change="changeUploadFile($event, 0)" accept="image/*">
                    </div>
                  </div>
                </div>
              </div>
              <el-divider></el-divider>
              <div class="photo-wrapper">
                <div class="title">视频信息</div>
                <div class="photo-content-wrapper">
                  <div class="photo-content" v-for="(item,index) in usersVideoList" :key="index">
                      <div class="play-video-wrapper">
                          <video :src="item.mediaUrl" alt="" class="photo video-tag" ref="video"></video>
                          <div class="play-video-pic"  @click="changeVideo(item, index)">
                            <img src="../../assets/img/rm_icon_bf_play.png" alt="" class="play-video">
                          </div>
                      </div>
                      <div class="del" @click="delUploadImg(1, item.id,index)">删除</div>
                  </div>
                  <div class="photo-content1" @click="uploadloadImgOrVideo(1)">
                    <div class="photo-content">
                      <img src="../../assets/img/pop_pic_add.png" alt="" class="add-pic-viedo">
                      <input class="license" type="file" ref="input1" name="license1" @change="changeUploadFile($event, 1)">
                    </div>
                  </div>
                  <div class="photo-content-video">
                      <div class="play-video-wrapper">
                        <video  alt="" class="photo video-tag" ref="videotest"></video>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="动态管理" name="3" v-if="disabled">
            <div class="pic-wrap" v-if="mediaInfoList.length">
              <vue-data-loading :loading="loading" :completed="completed" :offset="-1" :listens="['infinite-scroll', 'pull-down']" :init-scroll="true" @infinite-scroll="infiniteScroll" @pull-down="pullDown">
                <div class="pic-wrapper" v-for="(item, index) in mediaInfoList" :key="index">
                  <div class="name">{{item.content}}</div>
                  <div class="time">{{item.createTime}}</div>
                  <div class="pic-content-wrapper">
                    <div class="pic-content" v-for="(v, i) in item.img" :key="i">
                      <div class="pic">
                        <img :src="v" alt="">
                      </div>
                    </div>
                  </div>
                  <div class="support-del">
                    <div class="support"><img class="support-icon" src='../../assets/img/pop_icon_zan.png'><span
                        class="num">{{item.thumbUp}}</span>人</div>
                    <div class="del" @click="delPublishInfo(item)">删除</div>
                  </div>
                </div>
                <div slot="infinite-scroll-loading">loading...</div>
                <div slot="completed">数据加载完毕</div>
              </vue-data-loading>
            </div>
            <img src="../../assets/img/pop_icon_tj.png" alt="" class="publish" @click="showPublistModel"
          v-if="activeName == '3'">
          </el-tab-pane>
        </el-tabs>
        <div class="input-box btn-wrapper" v-if="activeName != '3'">
          <div class="confirm btn" @click="createOrEdiorConfirm(activeName,'ruleForm')">确定</div>
          <div class="cancle btn" @click="cancle">取消</div>
        </div>
        <div class="cancle-x el-icon-close" @click="cancle"></div>
      </div>
    </div>
    <!-- 发布弹框 -->
    <div class="publish-model-wrapper" v-if="onShow">
      <div class="publish-model">
        <el-input type="textarea" placeholder="输入自己想说的话" v-model="wantTalk" :autosize="{ minRows: 4, maxRows: 5}" minlength="2" maxlength="50" show-word-limit>
        </el-input>
        <div class="pic-viedo-wrapper">
          <div class="pic-video" v-for="(item, index) in userDynamicPicList" :key="index">
            <img :src="item" alt="">
          </div>
          <div class="pic-video" @click="uploadloadImgOrVideo1(2)" v-if="userDynamicPicList.length<=3">
            <img class="add-pic-viedo" src="../../assets/img/pop_pic_add.png">
            <input class="license" type="file" ref="input2" name="license0" @change="changeUploadFile1($event)" accept="image/*">
          </div>
        </div>
        <div class="input-box btn-wrapper">
          <div class="confirm btn" @click="confirmPublish()">确定</div>
          <div class="cancle btn" @click="canclePublish">取消</div>
        </div>
      </div>
    </div>
    <!-- 图片播放弹框 -->
    <div class="video-player-wrapper" v-show="picShow" @click.stop="hidePicModel">
        <div class="video-player" @click.stop="showpicModel" v-if="displayPicOrVideo">
          <img :src="curPicUrl">
        </div>
        <div class="video-player" @click.stop="showpicModel" v-else>
          <video :src="curVideoUrl" controls autoplay></video>
        </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import OSS from '../../lib/aliyun-oss-sdk-4.4.4.min.js'
import VueDataLoading from 'vue-data-loading'
import { setTimeout } from 'timers'
import { formatTime } from 'lib/filter'
export default {
  name: 'standapply',
  data () {
    var checkqq = (rule, value, callback) => {
      const phoneReg = /^[1-9]\d{4,9}$/
      if (!value) {
        return callback(new Error('qq号不能为空'))
      }
      setTimeout(() => {
        // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
        // 所以我就在前面加了一个+实现隐式转换
        if (phoneReg.test(value)) {
          callback()
        } else {
          callback(new Error('qq号格式不正确'))
        }
      }, 100)
    }
    var checkweixin = (rule, value, callback) => {
      const mailReg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/
      const mailReg1 = /^1[3456789]\d{9}$/
      if (!value) {
        return callback(new Error('微信号不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value) || mailReg1.test(value)) {
          callback()
        } else {
          callback(new Error('微信号格式不正确'))
        }
      }, 100)
    }
    var checkAcountNum = (rule, value, callback) => {
      const accountReg = /^[a-zA-Z0-9]{1,18}$/
      if (!value) {
        return callback(new Error('用户账号不能为空'))
      }
      setTimeout(() => {
        if (accountReg.test(value) || accountReg.test(value)) {
          callback()
        } else {
          callback(new Error('用户账号为1-18位英文数字'))
        }
      }, 100)
    }
    return {
      accountList: [],
      total: 0,
      curPicUrl: '',
      curVideoUrl: '',
      isShow: false,
      onShow: false,
      picShow: false,
      btnShow: false,
      activeName: '1',
      yearMoneyManOrWo: false, // 填写子账户信息男女年收入显示标志
      labelPosition: "left",
      curEdiorOrCreatedSelect: 1, // 点击编辑或者创建用户标志
      formLabelAlign: {
        id: null,
        name: "",
        high: '',
        acountNum: null,
        qq: '',
        weight: '',
        gender: null,
        weixin: "",
        industry: "",
        industryDetail: '',
        birst: '',
        city: '',
        yearMoney: '',
        address: '',
        desc: ""
      },
      genders: [{
        value: '1',
        label: '男'
      }, {
        value: '2',
        label: '女'
      }],
      industrys: [],
      industryDetails: [],
      highs: [],
      weights: [],
      citys: [],
      addresses: [],
      yearMoneys: [],
      disabled: false, // 个人信息填写时部分禁止更改
      curCityId: null,
      usersImgList: [],
      usersVideoList: [],
      mediaInfoList: [],
      userDynamicPicList: [],
      loading: false,
      completed: false,
      curUserId: null, // 当前子账号id
      page: 1, // 动态列表分页页数
      wantTalk: '',
      imgLen: null,
      videoLen: null,
      currentPage: 1, // 子账号表格显示列表当前页数
      pageSize: 10, // 子账号表格显示列表当前每页显示个数
      imgAndVideoNum: null, // 图片视频总数
      displayPicOrVideo: true, // 图片视频弹框显示img或video标签
      rules: {
        name: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        high: [
          { required: true, message: '请选择身高', trigger: 'change' }
        ],
        acountNum: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { validator: checkAcountNum, trigger: 'blur' }
        ],
        qq: [
          { required: true, message: '请输入qq号', trigger: 'blur' },
          { validator: checkqq, trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '请选择体重', trigger: 'change' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        weixin: [
          { required: true, message: '请输入微信号', trigger: 'blur' },
          { validator: checkweixin, trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择行业', trigger: 'change' }
        ],
        industryDetail: [
          { required: true, message: '请选择行业', trigger: 'change' }
        ],
        birst: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        yearMoney: [
          { required: true, message: '请选择年收入', trigger: 'change' }
        ],
        city: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请选择城市', trigger: 'change' }
        ],
        desc: [
          { required: false, message: '请填写个人介绍', trigger: 'blur' },
          { min: 10, max: 50, message: '长度在50个字符以内', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  components: {
    VueDataLoading
  },
  created () {
    this.getAccountList()
    this.cityTree()
    this.field("HEIGHT_TAG")
    this.field("WEIGHT_TAG")
    this.field("INDUSTRY_TAG")
    this.field("ANNUAL_SALARY_TAG")
  },
  methods: {
    checkinput () {
      if (!this.wantTalk) {
        this.$message({
          message: "文本内容为必填项"
        })
        return false
      } else if (!this.userDynamicPicList.length) {
        this.$message({
          message: "请传入图片"
        })
        return false
      }
      return true
    },
    // 添加子账 号弹框显示
    addUsers () {
      this.curEdiorOrCreatedSelect = 1
      if (this.accountList.length > 49) {
        this.$message({
          message: "最多创建 50 条子账号"
        })
        this.isShow = false
      }
      this.isShow = true
      this.disabled = false
      // this.activeName = "1"
      this.formLabelAlign = {
        id: null,
        acountNum: null,
        gender: null
      }
      this.usersImgList = []
      this.usersVideoList = []
      this.mediaInfoList = []
      // this. = 1
    },
    // 创建编辑弹框隐藏
    cancle () {
      this.isShow = false
    },
    // 显示发布弹框
    showPublistModel () {
      this.isShow = false
      this.onShow = true
    },
    // 隐藏发布弹框
    canclePublish () {
      this.onShow = false
    },
    // 编辑 获取当前子账号详情，展示到页面
    ediorAccount (index, rows) {
      this.curEdiorOrCreatedSelect = 2
      this.activeName = "1"
      this.curUserId = rows
      this.page = 1
      // this.count(0, rows)
      // this.count(1, rows)
      this.disabled = true
      let params = {
        userId: rows
      }
      this.$http.profile(params).then(res => {
        let x = res.result
        this.industrys.forEach(v => {
          v.children.forEach(z => {
            if (z.fieldName == x.job) {
              this.formLabelAlign.industry = v.fieldName
              this.industryDetails = v.children
            }
          })
        })
        this.citys.forEach(v => {
          v.items.forEach(z => {
            if (z.cityName == x.cityName) {
              this.addresses = v.items
            }
          })
        })
        if (x.sex == 1) {
          this.formLabelAlign.gender = "男"
        } else {
          this.yearMoneyManOrWo = true
          this.rules.yearMoney[0].required = false
          this.formLabelAlign.gender = "女"
        }
        this.formLabelAlign = {
          id: x.id,
          name: x.nickname,
          high: x.height,
          acountNum: x.account,
          qq: x.qq,
          weight: x.weight,
          gender: this.formLabelAlign.gender,
          weixin: x.wechat,
          industry: this.formLabelAlign.industry,
          industryDetail: x.job,
          birst: formatTime((x.birthday)*1000, "yyyy-MM-dd"),
          city: x.provinceName,
          yearMoney: x.annualSalary,
          address: x.cityName,
          desc: x.introduction
        }
        this.isShow = true
      })
      this.getUserImgOrVideo(0, rows)
      this.getUserImgOrVideo(1, rows)
      this.mediaInfoList = []
      this.mediaList(rows)
    },
    // 删除子账号
    delAccount (index, rows) {
      let params = {
        userId: rows
      }
      this.$confirm('确认删除该子账号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async (action) => {
        if (action == 'confirm') {
          this.$http.deleteAccount(params).then(res => {
            this.$message({
              message: "删除子账号成功"
            })
            this.getAccountList()
          })
        }
      }).catch(async (action) => {})
    },
    // 创建账号或者编辑账号时的确认按钮
    createOrEdiorConfirm (data, formName) {
      switch (data) {
        case '1':
          if (this.curEdiorOrCreatedSelect==1) {
            this.$refs[formName].validate((valid) => {
              // 提交基本信息
              if (valid) {
                let params = {
                  account: this.formLabelAlign.acountNum,
                  annualSalary: this.formLabelAlign.yearMoney,
                  auditStatus: null,
                  avatar: '',
                  birthday: this.formLabelAlign.birst,
                  height: this.formLabelAlign.high,
                  id: parseInt(this.formLabelAlign.id),
                  introduction: this.formLabelAlign.desc,
                  job: this.formLabelAlign.industryDetail,
                  mobile: '',
                  nickname: this.formLabelAlign.name,
                  parentId: null,
                  pid: null,
                  qq: this.formLabelAlign.qq,
                  realname: "",
                  regionId: parseInt(this.curCityId),
                  sex: parseInt(this.formLabelAlign.gender),
                  token: '',
                  userType: null,
                  wechat: this.formLabelAlign.weixin,
                  weight: this.formLabelAlign.weight,
                  wxOpenId: ''
                }
                this.$http.subAccountCreate(params).then(res => {
                  this.isShow = false
                  this.getAccountList()
                })
              } else {
                console.log('error submit!!')
                return false
              }
            })
          } else {
            this.$refs[formName].validate((valid) => {
              // 提交基本信息
              if (valid) {
                let params = {
                  annualSalary: this.formLabelAlign.yearMoney,
                  auditStatus: null,
                  avatar: '',
                  birthday: this.formLabelAlign.birst,
                  height: this.formLabelAlign.high,
                  introduction: this.formLabelAlign.desc,
                  job: this.formLabelAlign.industryDetail,
                  mobile: '',
                  nickname: this.formLabelAlign.name,
                  parentId: null,
                  pid: null,
                  qq: this.formLabelAlign.qq,
                  realname: "",
                  regionId: parseInt(this.curCityId),
                  token: '',
                  userType: null,
                  wechat: this.formLabelAlign.weixin,
                  weight: this.formLabelAlign.weight,
                  subAccountId: this.curUserId
                }
                this.$http.updateUserInfo(params).then(res => {
                  this.isShow = false
                  this.getAccountList()
                })
              } else {
                console.log('error submit!!')
                return false
              }
            })
          }
          break
        case '2':
          this.usersImgList.forEach((v, i) => {
            if (v.id) {
              this.usersImgList.splice(i, 1)
            }
          })
          this.usersVideoList.forEach((v, i) => {
            if (v.id) {
              this.usersVideoList.splice(i, 1)
            }
          })
          let getUserImgOrVideoList = this.usersImgList.concat(this.usersVideoList)
          this.$http.upload(getUserImgOrVideoList, this.curUserId).then(res => {
            this.getUserImgOrVideo(0, this.curUserId)
            this.getUserImgOrVideo(1, this.curUserId)
            // this.count(0, this.curUserId)
            // this.count(1, this.curUserId)
          })
          break
        case '3':
          // 代码块
          break
      }
    },
    uploadloadImgOrVideo (data) {
      let inp = 'input' + data
      this.$refs[inp].click()
    },
    uploadloadImgOrVideo1 (data) {
      let inp = 'input' + data
      this.$refs[inp].click()
    },
    // 上传图片点击事件 0图片 1视频
    changeUploadFile (event, data) {
      this.$refs.videotest.style.display='none'
      let img = event.target.files
      var url = this.getFileURL(img[0]) //把当前的 files[0] 传进去
      if (url) {
        this.$refs.videotest.src = url
        let that = this
        setTimeout(function () {
          let duration = that.$refs.videotest.duration
          if (Math.floor(duration) > 15) {
            that.$message({ message: "上传视频不能大于 15 秒" })
          } else {
            // this.$refs.videotest.style.display='block'
            let type = img[0].type
            if (!img.length) {
              return false
            }
            if (data == 0) {
              if (!type.includes('jpg') && !type.includes('jpeg') && !type.includes('png')) {
                that.$message({ message: '请上传图片' })
                return false
              }
            } else if (data == 1) {
              if (!type.includes('mp4') && !type.includes('m2v') && !type.includes('mkv')) {
                that.$message({ message: '请上传视频' })
                return false
              }
            }
            if (that.imgAndVideoNum < 20) {
              that.uploadMedia(img[0], data)
            } else {
              that.$message({ message: "最多上传二十张图片视频" })
            }
            event.srcElement.value = "" // 及时清空
          }
        }, 1000)
      }
    },
    // 上传图片点击事件 0图片 1视频
    changeUploadFile1 (event, data) {
      let img = event.target.files
      let that = this
      let type = img[0].type
      if (!img.length) {
        return false
      }
      if (!type.includes('jpg') && !type.includes('jpeg') && !type.includes('png')) {
        that.$message({ message: '只能上传图片' })
        return false
      }
      this.uploadMedia(img[0])
      event.srcElement.value = "" // 及时清空
    },
    getOSS (params) {
      return new Promise((resolve, reject) => {
        axios('http://106.14.58.213:28201/media/oss/token', JSON.stringify(params), 'get').then(res => {
          if (res) {
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(res => {
          reject(res)
        })
      })
    },
    uploadMedia (file, data) {
      return new Promise(async (resolve, reject) => {
        // let fileSize = 5000000
        // let typeArr = 'image/png,image/jpg,image/gif,image/jpeg,video/mp4,video/MOV,video/quicktime'
        let type = file.type
        let saveType
        if (type.split('/')[0]=='video') {
          saveType = 'mp4'
        } else {
          saveType = file.name.replace(/.+\./, "").toLowerCase()
        }

        let storeAs = new Date().getTime() + '.' + saveType
        // let boolean = true
        // if (file.size > fileSize) {
        //     //   console.log('图片' + i + '不能超过!' + fileSize / 1000 + 'kb');
        //     //   reject({status: false, msg: '图片' + i + '不能超过!' + fileSize / 1000 + 'kb'})
        //     // }
        // if (typeArr && typeArr.indexOf(type) > 0) {
        //   boolean = false;
        // }
        // if (boolean) {
        //   console.log('图片格式不支持!请选择' + typeArr);
        //   reject({status: false, msg: '图片' + '格式不支持!请选择' + typeArr})
        // }
        if (!this.OSSclient) {
          let OSSResult = await this.getOSS()
          if (OSSResult.data.success) {
            OSSResult = OSSResult.data.result
          } else {
            reject({ status: false, msg: '获取OSS认证错误' })
          }
          this.OSSclient = new OSS.Wrapper({
            region: "oss-cn-shanghai",
            // secure: true,//https
            // endpoint: 'https://oss-cn-shanghai.aliyuncs.com/webim',
            accessKeyId: OSSResult.AccessKeyId,
            // accessKeyId,accessKeySecret两者到阿里云控制台获得
            accessKeySecret: OSSResult.AccessKeySecret,
            stsToken: OSSResult.SecurityToken,
            bucket: 'waterelephant' // 装图片的桶名
          })
        }
        let d = new Date()
        let y = d.getFullYear()
        let m = d.getMonth()
        let dd = d.getDate()
        let path = 'webim/' + y + '-' + m + '-' + dd + '/' + storeAs
        storeAs = path
        this.OSSclient.multipartUpload(storeAs, file).then((result) => {
          if (result.res.requestUrls.length) {
            let url = ''
            let url1 = []
            let url2 = ''
            let imgOrVideo = {}
            for (let i = 0; i < result.res.requestUrls.length; i++) {
              result.res.requestUrls[i] = result.res.requestUrls[i].split("?")[0]
              url = result.res.requestUrls[i]
              url1 =url.split(".")
              url2 = url1[url1.length-1]
            }
            if (data === 0 || data === 1) {
              if (data === 0 && url2 == "jpg" || url2 == "jpeg" || url2 == "png" || url2 == "gif") {
                imgOrVideo = {
                  mediaType: data,
                  mediaUrl: url
                }
                this.usersImgList.push(imgOrVideo)
              } else if (data === 1 && url2 == "mp4" || url2 == "mov" || url2 == "rmvb") {
                imgOrVideo = {
                  mediaType: data,
                  mediaUrl: url
                }
                this.usersVideoList.push(imgOrVideo)
              }
              this.imgAndVideoNum = this.usersImgList.length + this.usersVideoList.length
            } else {
              this.userDynamicPicList.push(url)
            }
          } else {
            // console.log(result.url)
          }
          resolve(result)
        }, result => {
          reject(result)
        }).catch(function (err) {
          reject(err)
        })
      })
    },
    // 获取本地上传图片视频地址
    getFileURL (file) {
      var getUrl = null
      if (window.createObjectURL != undefined) { // basic
        getUrl = window.createObjectURL(file)
      } else if (window.URL != undefined) { // mozilla(firefox)
        getUrl = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) { // webkit or chrome
        getUrl = window.webkitURL.createObjectURL(file)
      }
      return getUrl
    },
    // 删除上传图片
    delUploadImg (data, item, index) {
      if (item) {
        this.$http.userDelete([item], this.curUserId).then(res => {
          this.getUserImgOrVideo(data, this.curUserId)
          // this.count(0, rows)
          // this.count(1, rows)
          this.imgAndVideoNum = this.usersImgList.length + this.usersVideoList.length
        })
      } else {
        this.usersImgList.splice(index, 1)
        this.usersVideoList.splice(index, 1)
        this.imgAndVideoNum = this.usersImgList.length + this.usersVideoList.length
      }
    },
    // 将缩放图片中的url更改为当前点击的url
    changePic (item, index) {
      this.picShow = true
      this.curPicUrl = item.mediaUrl
      this.displayPicOrVideo = true
    },
    // 将缩放视频中的url更改为当前点击的url
    changeVideo (item, index) {
      this.picShow = true
      this.curVideoUrl = item.mediaUrl
      this.displayPicOrVideo = false
    },
    // 隐藏缩放视频图片弹框
    hidePicModel () {
      this.picShow = false
    },
    showpicModel () {
      this.picShow = true
    },
    // 删除动态
    delPublishInfo (item) {
      let params = {
        id: item.id
      }
      this.$http.mediaDelete(params).then(res => {
        this.page =1
        this.mediaList(item.userId)
      })
    },
    // 发布动态
    confirmPublish () {
      if (!this.checkinput()) return
      this.mediaInfoList = []
      let currentTime = this.format(new Date(), "yyyy-MM-dd HH:mm:ss")
      let imgList = this.userDynamicPicList.join(",")
      let params = {
        content: this.wantTalk,
        createTime: this.parserDate(currentTime),
        id: null,
        img: imgList,
        isShow: null,
        lat: null,
        lon: null,
        regionId: null,
        status: null,
        thumbUp: null,
        updateTime: '',
        userId: this.curUserId
      }
      this.$http.mediaCreate(params).then(res => {
        this.page = 1
        this.mediaList(this.curUserId)
        this.onShow = false
        this.isShow = true
        this.activeName = '3'
        this.userDynamicPicList = []
        this.wantTalk = ''
      })
    },
    parserDate (date) {
      var t = Date.parse(date)
      if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, '/')))
      }
    },
    format (date, fmt) {
      let o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "H+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S": date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
      for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
      return fmt
    },
    // 获取省市区列表
    cityTree () {
      // 获取地区
      this.$http.cityTree().then(res => {
        let allCityNameList = res.result
        allCityNameList.forEach(v => {
          this.citys=[...this.citys, v]
        })
      })
    },
    // 获取陪聊账号列表
    getAccountList () {
      this.$http.getAccountList().then(res => {
        this.accountList = res.result
        this.total =this.accountList.length
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      console.log(`当前页: ${val}`)
    },
    // 选择省名
    selectedCity (value) {
      this.citys.forEach(v => {
        if (v.provinceName == value) {
          this.addresses = v.items
        }
      })
    },
    // 选择市名
    selectedCitySub (value) {
      this.addresses.forEach(v => {
        if (v.cityName == value) {
          this.curCityId = v.city
        }
      })
    },
    // 获取身高，体重，行业，年收入
    field (data) {
      let params = {
        fieldTag: data
      }
      this.$http.field(params).then(res => {
        if (data === "HEIGHT_TAG") {
          // 身高
          this.highs = res.result
        } else if (data === "WEIGHT_TAG") {
          // 体重
          this.weights = res.result
        } else if (data === "INDUSTRY_TAG") {
          // 职业
          this.industrys = res.result
        } else if (data === "ANNUAL_SALARY_TAG") {
          // 年收入
          this.yearMoneys = res.result
        }
      })
    },
    // 获取各行业中的子行业
    selectedJob (value) {
      this.industrys.forEach(v => {
        if (v.fieldName == value) {
          this.industryDetails = v.children
        }
      })
    },
    // 查询用户相册及视频信息
    getUserImgOrVideo (data, id) {
      let params = {
        page: 1,
        param: {
          mediaType: data,
          subAccountId: id
        },
        size: 20
      }
      this.$http.my(params).then(res => {
        if (data == 0) {
          this.usersImgList = res.result
        } else if (data == 1) {
          this.usersVideoList = res.result
        }
        this.imgAndVideoNum = this.usersImgList.length + this.usersVideoList.length
      })
    },
    // 年收入更改，为男显示，为女不显示
    selectSex (value) {
      this.yearMoneyManOrWo = false
      this.rules.yearMoney[0].required = true
      if (value == 2) {
        this.yearMoneyManOrWo = true
        this.rules.yearMoney[0].required = false
      }
    },
    // 用户动态列表查询
    mediaList (id) {
      let params = {
        page: this.page,
        param: {
          userId: id
        },
        size: 5
      }
      this.$http.mediaList(params).then(res => {
        let x = res.result.datas
        if (x.length) {
          for (let i = 0; i < x.length; i++) {
            x[i].createTime = formatTime((x[i].createTime)*1000, "yyyy-MM-dd hh:mm:ss")
            x[i].img = x[i].img.split(",")
            if (!x[i].thumbUp) {
              x[i].thumbUp = 0
            }
          }
          this.mediaInfoList = [...this.mediaInfoList, ...res.result.datas]
          this.completed = false
        } else {
          this.completed = true
        }
      })
    },
    pullDown () {
      this.page = 1
      // this.completed = false
      this.mediaList(this.curUserId)
    },
    infiniteScroll () {
      this.page++
      this.mediaList(this.curUserId)
    },
    handleClick (tab, event) {
    },
    // 获取视频图片个数
    count (data, id) {
      let params = {
        subAccountId: id,
        type: data
      }
      this.$http.count(params).then(res => {
        if (data == 0) {
          this.imgLen = res.result
        } else if (data == 1) {
          this.videoLen = res.result
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .el-message-box__wrapper .el-button--small.el-button--primary {
    background-color: #FEAF27!important;
    border-color: #FEAF27!important;
  }
  .page-loginlist {
    // 头部
    .top-content {
      width: 100%;
      height: 75px;
      box-sizing: border-box;
      padding: 30px 20px 0 20px;
      font-size: 14px;
      color: #333;

      .left-box {
        float: left;

        span {
          position: relative;
          margin-right: 15px;

          &:not(:last-child) {
            color: #666;

            &::after {
              content: '>';
              display: inline-block;
              position: absolute;
              right: -13px;
              top: 0;
            }
          }
        }
      }

      .right-box {
        float: right;
        width: 73px;
        height: 28px;
        font-size: 12px;
        color: #FEAF27 !important;
        background: #fff;
        border: 1px solid #FEAF27 !important;
        text-align: center;
        line-height: 28px;
        border-radius: 3px;

        &.active {
          color: #929292;
          border-color: #929292;
        }

        img {
          width: 10px;
          height: 10px;
        }
      }
    }
    // 表格
    .table-box {
      // margin-top: ;
      padding: 20px 20px 20px 20px;
      margin: 20px 20px 0 20px;
      background-color: #fff;

      .el-table {
        // padding: 20px 20px 45px 20px;

        &::before {
          height: 0;
        }
      }

      .el-table__header {
        th {
          background: #EBECF0;
        }
      }

      .cell {
        text-align: center;
      }
      .block {

        .el-pager li {
          padding: 0;
          width: 28px;
          border-radius: 4px;
          border: 1px solid rgba(229, 229, 229, 1);
          min-width: 0;
          margin: 0 4px;
          color: #666;

          &.active {
            color: #fff;
            border: 1px solid #FEAF27;

            &:hover {
              color: #fff !important;
            }
          }

          &:hover {
            color: #666 !important;
          }
        }

        .el-pagination {
          padding-top: 20px;

          button {
            padding: 0
          }

          .btn-next,
          .btn-prev {
            border-radius: 4px;
            border: 1px solid rgba(229, 229, 229, 1);

            &:hover {
              color: #333;
            }
          }

          .btn-next {
            padding-left: 0;
            margin-left: 4px;
          }

          .btn-prev {
            padding-right: 0;
            margin-right: 4px;
          }
        }

        .el-pagination button,
        .el-pagination span:not([class*=suffix]) {
          min-width: 0;
          width: 28px;
        }

        .el-pagination__jump {
          margin-left: 86px;
        }

        .el-pagination__sizes {
          margin: 0 10px 0 16px;
        }
      }

      .handle-box {

        .change,
        .check {
          display: inline-block;
          text-align: center;
          line-height: 25px;
          font-size: 12px;
          color: #FF5E4B !important;
          border-radius: 4px;

          &.change {
            color: #FFC455 !important;
            border-color: #FFC455;
            margin-right: 10px;
          }
        }
      }
    }
    // 新建账号，编辑弹框
    .model-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      min-height: 100%;
      background: rgba(0, 0, 0, .7);
      z-index: 666;
      .model {
        position: relative;
        width: 1036px;
        max-height: 100%;
        background-color: #fff;
        .model-header {
          width: 100%;
          height: 45px;
          font-size: 15px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          line-height: 45px;
          text-align: center;
          background-color: #FEAF27;
        }
        .el-tabs--top {
          .el-tabs__header {
            background: #FBFBFB;
            padding: 0 47px;
            box-sizing: border-box;
            margin: 0;
            .el-tabs__nav-wrap {
              &::after {
                height: 0;
              }
              .el-tabs__item {
                color: #666;
                &.is-active {
                  color: #333;
                }
              }
              .el-tabs__active-bar {
                background-color: #FEAF27;
              }
            }
          }
          .el-tabs__content {
            padding: 0 47px 20px;
            box-sizing: border-box;
            .el-form {
              margin-top: 12px;
            }
            .el-form-item--mini.el-form-item,
            .el-form-item--small.el-form-item {
              margin-bottom: 0;
              margin-top: 39px;
              .el-form-item__content {
                display: flex;
                justify-content: flex-start;
                .el-form-item--mini.el-form-item,
                .el-form-item--small.el-form-item {
                  margin-bottom: 0;
                  margin-top: 0;
                  .el-select--mini {
                    &:last-child {
                      margin-left: 10px;
                    }
                  }
            }
                .el-input {
                  .el-input__suffix {
                    right: 0;
                    background-color: #FEAF27;
                    height: 28px;
                    margin-top: 2px;
                    border-top-right-radius: 4px;
                    border-bottom-right-radius: 4px;

                    .el-select__caret {
                      color: #fff;
                    }
                  }
                }
              }
            }
            .wrapper {
              margin-top: 25px;
              .photo-wrapper {
                .title {
                  font-size: 13px;
                  font-family: PingFangSC-Medium;
                  font-weight: 500;
                  color: rgba(102, 102, 102, 1);
                  padding-left: 10px;
                  border-left: 3px solid #FEAF27;
                }
                .photo-content-wrapper {
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: flex-start;
                  margin-top: 25px;
                  .photo-content {
                    width: 144px;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    margin:0 6.5px;
                    .play-video-wrapper{
                      position: relative;
                      .play-video-pic {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                      }
                    }
                    .photo {
                      display: block;
                      width: 143px;
                      height: 158px;
                      border-radius: 5px;
                      background-color: #E5E5E5;
                    }
                    .video-tag {
                      position: relative;
                    }
                    .license {
                      display: none;
                    }
                    .del {
                      width: 66px;
                      height: 24px;
                      line-height: 24px;
                      background: rgba(255, 94, 75, 1);
                      border-radius: 4px;
                      font-size: 12px;
                      font-family: PingFangSC-Regular;
                      font-weight: 400;
                      color: rgba(255, 255, 255, 1);
                      text-align: center;
                      margin: 18px auto;
                    }
                  }
                  .photo-content1{
                    display:flex;
                    justify-content: flex-start;
                    flex-direction: column;
                  }
                  .photo-content1{
                    display:flex;
                    justify-content: flex-start;
                    flex-direction: column;
                  }
                }
              }
            }

            .pic-wrap {
              // height: 640px;
              // overflow-x: none;
              // overflow-y: scroll;

              .pic-wrapper {
                border-bottom: 1px solid #F0F0F0;
                padding: 23px 0 36px 0;

                &:last-child {
                  border: 0;
                }

                .title {
                  font-size: 13px;
                  font-family: PingFangSC-Medium;
                  font-weight: 500;
                  color: rgba(102, 102, 102, 1);
                  padding-left: 10px;
                  border-left: 3px solid #FEAF27;
                }

                .name {
                  font-size: 14px;
                  font-family: PingFangSC-Semibold;
                  font-weight: 600;
                  color: rgba(51, 51, 51, 1);
                  line-height: 20px;
                }

                .time {
                  font-size: 12px;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  color: rgba(153, 153, 153, 1);
                  line-height: 17px;
                }

                .pic-content-wrapper {
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: flex-start;
                  margin-top: 10px;

                  .pic-content {
                    width: 143px;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    margin-left: 15px;

                    &:first-child {
                      margin-left: 0;
                    }

                    .pic {
                      width: 143px;
                      height: 158px;
                      border-radius: 5px;
                      background-color: #999;

                      img {
                        width: 143px;
                        height: 158px;
                      }
                    }
                  }
                }

                .add-pic-viedo {
                  width: 143px;
                  height: 158px;
                  background: url("../../assets/img/pop_pic_add.png") no-repeat;
                  margin-left: 15px;
                }

                .support-del {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-top: 19px;

                  .support {
                    font-size: 12px;
                    font-family: PingFangSC-Regular;
                    font-weight: 400;
                    color: rgba(153, 153, 153, 1);

                    .support-icon {
                      width: 13px;
                      height: 13px;
                    }

                    .num {
                      margin-left: 6px;
                    }
                  }

                  .del {
                    width: 66px;
                    height: 24px;
                    line-height: 24px;
                    background: rgba(255, 94, 75, 1);
                    border-radius: 4px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    text-align: center;
                  }
                }
              }
            }
            #pane-3 {
              width: 100%;

              .publish {
                width: 90px;
                height: 90px;
                margin: 0 auto;
                margin-top: 50px;
                display: block;
              }
            }

            .el-divider {
              background-color: #F0F0F0;
            }

            .el-divider--horizontal {
              margin: 17px 0 35px;
            }

          }

        }

        .btn-wrapper {
          display: flex;
          justify-content: center;
          margin: 60px 0 45px 0;

          .btn {
            width: 117px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            font-size: 14px;
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            border-radius: 4px;
          }

          .confirm {
            background-color: #FEAF27;
            color: #fff;
            border: 1px solid rgba(254, 175, 39, 1);
          }

          .cancle {
            margin-left: 28px;
            background-color: #fff;
            color: rgba(102, 102, 102, 1);
            border: 1px solid rgba(229, 229, 229, 1);
          }
        }

        .cancle-x {
          position: absolute;
          top: 0;
          right: 0;
          width: 15px;
          height: 15px;
          color: rgba(216, 216, 216, 1);
          padding: 15px;
        }
      }
    }

    // 发布模块弹框
    .publish-model-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .7);
      z-index: 666;

      .publish-model {
        width: 565px;
        padding: 40px 35px 0 37px;
        box-sizing: border-box;
        background-color: #fff;

        .el-input {}

        .pic-viedo-wrapper {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          width: 493px;
          margin-top: 30px;

          .pic-video {
            width: 111px;
            height: 123px;
            margin-left: 15px;
            border-radius: 5px;
            background-color: #999;
            margin-top: 15px;

            &:first-child {
              margin-left: 0;
            }

            img {
              width: 111px;
              height: 123px;
            }
            input {
              display: none
            }
          }
          .add-pic-viedo {
            width: 111px;
            height: 123px;
          }
        }

        .btn-wrapper {
          display: flex;
          justify-content: center;
          margin: 60px 0 45px 0;

          .btn {
            width: 117px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            font-size: 14px;
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            border-radius: 4px;
          }

          .confirm {
            background-color: #FEAF27;
            color: #fff;
            border: 1px solid rgba(254, 175, 39, 1);
          }

          .cancle {
            margin-left: 28px;
            background-color: #fff;
            color: rgba(102, 102, 102, 1);
            border: 1px solid rgba(229, 229, 229, 1);
          }
        }
      }
    }

    // 新建账号，编辑弹框中select选框选择后字体颜色样式
    .el-select-dropdown {
      .el-select-dropdown__item.selected {
        color: #FEAF27;
      }
    }
    .video-player-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .7);
      z-index: 666;
      .video-player {
        // width: 700px;
        // height: 500px;
        background-color: #fff;
        z-index: 999;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

</style>
