// pages/home/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    animationData: {},
    horizontal: true,
    swing: false,
    url:'',
    scaleWidth:95,
    scaleHeight:100,
    url2: './images/test.jpg',
    no_data: './images/hua@3x.png',
    tip_1:'./images/1@2x.png',
    tip_2: './images/2@2x.png',
    currentId: '',
    nextId: '',
    prevId: '',
    checkMsg:null,
    show_wrapper: false,
    tip: 'NORMAL',
    numbers: 0,
    counts: 0,
    sourceImg:'无',
    tifId:'无',
    labelId:'无',
    token: '',
    btn: [],
    items: [
      {
        name_en: 'NORMAL',
        id: 1
      },
      {
        name_en: 'NORMAL',
        id: 2
      },
      {
        name_en: 'NORMAL',
        id: 3
      },
      {
        name_en: 'NORMAL',
        id: 4
      },
      {
        name_en: 'NORMAL',
        id: 5
      }
    ],
    catalogSelect: 0, //判断是否选中
    otherSelect: false,
    msg: '',
    retId: '',
    flag_hd: true,
    touchDot: 0,
    current: '', // 当前显示图片的http链接
    urls:[],
    tip_msg: '当前暂无切片'
  },

  btnAction (e) {
    let that = this
    let [id, label, restId] = [that.data.currentId, that.data.lableId, e.currentTarget.dataset.restid]
    that.setData({
      retId: e.currentTarget.dataset.restid,
    })
    if (restId === 0) {
      that.fail()
      return
    }
    if (restId === 1) {
      that.nextActions(restId, id, label)
      return
    }
    if (restId === 2) {
      that.nextActions(restId, id, label)
      return
    }
    if (restId === 3) {
      that.nextActions(restId, id, label)
      return
    }
  },

// 正确   // 待定
  nextActions: function (restId, id, label) {
    let that = this
    // console.log(restId, id, label)
    let obj = {
      'id': id,
      'ret': restId,
      'label': label,
      'remark': ''
    }
    that.getNext(obj)
  },

  // 错误
  fail: function () {
    let that = this;
    that.setData({
      show_wrapper: true
    })
  },

  // 点击列表
  chooseCatalog: function (e) {
    let that = this;
    // console.log(e.currentTarget.dataset)
    that.setData({
      catalogSelect: e.currentTarget.dataset.id,
      otherSelect: false,
      msg: e.currentTarget.dataset.id
    })
  },

  // 其他选择
  chooseOther: function (e) {
    let that = this;
    that.setData({
      catalogSelect:0,
      otherSelect: true,
      msg: e.currentTarget.dataset.text
    })
  },

  // 提交下一张
  next_image: function () {
    if (!this.data.msg) {
    wx.showModal({
      showCancel: false,
      confirmColor: '#000',
      confirmText:'知道了',
      content: '至少选择一个标签',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
    } else {
      let that = this;
      that.setData({
        show_wrapper: false
      })
      let obj = {
        'id': that.data.currentId,
        'ret': that.data.retId,
        'label': that.data.catalogSelect,
        'remark': ''
      }
        that.getNext(obj)
    }
  },

  // 下一例提交
  getNext(obj) {
    console.log(obj)
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      method: 'POST',
      url: app.globalData.url + '/api/submit_checked_data/',
      header: {
        'content-type': 'application/json',
        'Authorization': 'JWT ' + app.globalData.userToken
      },
      data: obj,
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.code === 200) { 
          let[nid, cid] = [that.data.nextId, that.data.currentId]
          if (!nid) {
            nid = 0
            that.getCurrent(nid, cid)
            return wx.showToast({
            title: '没有更多数据',
            image: './images/warm.png',
            duration: 1000
          })
          }
          that.getCurrent(nid,cid)
        } else {
          wx.showToast({
            title: '请求异常',
            image: './images/warm.png',
            duration: 2000
          })
        }
      },
      fail: (req) => {
        console.log(req)
        wx.hideLoading()
        wx.showToast({
          title: '服务器错误',
          image: './images/warm.png',
          duration: 2000
        })
      }
    })
  },

  // 取消
  cancel_image:function () {
    let that = this;
    that.setData({
      show_wrapper: false,
      catalogSelect: 0,
      otherSelect: false,
      msg: ''
    })
  },

  // 获取label
  getLabel: function () {
    let that = this;
    wx.request({
      method: 'GET',
      url: app.globalData.url + '/api/get_labels/',
      header: {
        'content-type': 'application/json',
        'Authorization': 'JWT ' +  app.globalData.userToken
      },
      success: (res) => {
        if (res.data.code === 200 && res.data.data.length !== 0) {
          that.setData({
            items: res.data.data.labels
          })
        } else {
          that.setData({
            items: null
          })
        }
      },
      fail: (req) => {
        that.setData({
          items: null
        })
      }
    })
  },

  // 获取当前图片
  getCurrent: function (nid, cid, flag) {
    console.log(nid, cid, flag)
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      method: 'GET',
      url: app.globalData.url + '/api/patch/224/?id=' + nid + '&current=' + cid,
      header: {
        'content-type': 'application/json',
        'Authorization': 'JWT ' + app.globalData.userToken
      },
      success: (res) => {
        wx.hideLoading()
        console.log(res)
        if (res.data.code === 200 && res.data.data.patch !== null) {
          if (!res.data.data.patch) {
            return wx.showToast({
              title: '没有更多数据',
              image: './images/warm.png',
              duration: 1000,
              success: function () {
                that.setData({
                  url: null
                })
              }
            })
          }
          that.setData({
            url: res.data.data.patch.url,
            currentId: res.data.data.patch.id,
            tip: res.data.data.patch.label,
            numbers: res.data.data.info.mission.done,
            counts: res.data.data.info.mission.total,
            sourceImg: res.data.data.title.label,
            tifId: res.data.data.title.root,
            labelId: res.data.data.title.id,
            checkMsg: res.data.data.patch.check,
            lableId: res.data.data.patch.label.id,
            btn: res.data.data.choices,
            nextId: res.data.data.next,
            prevId: res.data.data.prev
          })
          let [cid, nid, prevId] = [res.data.data.patch.id,res.data.data.next, res.data.data.prev]
          if (flag === -1) {
            return that.getNextImage(prevId, cid)
          }
          that.getNextImage(nid, cid)
        } 
        else if (res.statusCode === 403) {
          that.setData({
            tip_msg: res.data.detail
          })
          return
        }
        else {
          return wx.showToast({
            title: '没有更多数据',
            image: './images/warm.png',
            duration: 1000
          })
        }
      },
      fail: (req) => {
        wx.hideLoading()
        return wx.showToast({
          title: '请求有误',
          image: './images/warm.png',
          duration: 1000
        })
      }
    })
  },

// 获取下一张图片
  getNextImage: function (nid, cid) {
    if (!nid){
      return false
    }
    let that = this
    wx.request({
      method: 'GET',
      url: app.globalData.url + '/api/patch/224/?id=' + nid + '&current=' + cid,
      header: {
        'content-type': 'application/json',
        'Authorization': 'JWT ' + app.globalData.userToken
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code === 200 && res.data.data.patch !== null) {
          if (!res.data.data.patch) {
            return false
          }
          that.setData({
            url2: res.data.data.patch.url
          })
        } else {
        }
      },
      fail: (req) => {
        return wx.showToast({
          title: '请求有误',
          image: './images/warm.png',
          duration: 1000
        })
      }
    })
  },

  touchStart: function (e) {
    e.stopPropagation;
    // console.log(e)
    this.touchDot = e.touches[0].pageX
    // console.log(this.touchDot)
  },

  touchEnd: function (e) {
    e.stopPropagation;
    let that = this;
    let touchMove = e.changedTouches[0].pageX
    let flag = touchMove - this.touchDot
    // 向右滑动   
    if (flag > 1) {
      let deg = 700
      that.animationthis(deg)
      let [nid, cid, flag] = [that.data.prevId, that.data.currentId,-1]
      that.getCurrent(nid, cid, flag)
      // if (!nid) {
      //   nid = 0
      //   that.getCurrent(nid, cid, flag)
      //   return
      // }
      console.log("向右滑动")
      return
    }
    if (flag < -1) {
      let deg = -700
      that.animationthis(deg)
      let [nid, cid] = [that.data.nextId, that.data.currentId]
      console.log(nid, cid)
      if (!nid) {
        nid = 0
        that.getCurrent(nid, cid)
        return wx.showToast({
          title: '没有更多数据',
          image: './images/warm.png',
          duration: 1000
        })
      }
      that.getCurrent(nid, cid)
      console.log("向左滑动")
      return
    }
  },

  // 动画
  animationthis: function (deg) {
    let that = this;
    let animation = wx.createAnimation({
      duration: 300,
      transformOrigin: '50% 50% 300',
      timingFucntion: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
    })
    that.animation = animation;
    // that.animation.translate(deg, 0, 0).rotate(0).step()
    that.animation.translate(0, 0, 0).translateZ(0).rotate(0).rotateZ(0).step()
    // that.animation.translate(0, 0, 0).rotate(0).translate3d(0, 0, -135).step()
    that.setData({
      animationData: that.animation.export()
    })
  },

  // 点击查看
  clickImage: function (e) {
    e.stopPropagation;
    let current = e.target.dataset.src
    let List = []
    List.push(e.target.dataset.src);
    let imgList = List//获取data-list
    wx.previewImage({
      current: current,
      urls: imgList,//内部的地址为绝对路径+
      success: function () {
        console.log('success')
      },
      fail: function () {
        console.log('fail')
      },
      complete: function () {
        // console.info("点击图片了");
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let [cid, nid, flag] = [0, 0, 0]
    this.getCurrent(nid,cid, flag)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLabel()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})