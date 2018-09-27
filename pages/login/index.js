// pages/main/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password:'',
    aiUrl: './images/Group3@2x.png',
    user: './images/user@3x.png',
    pas: './images/lock-ico@3x.png'
  },
  //用户名
  userName: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  //密码
  userPass: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  login: function () {
    let [name, pass] = [this.data.username, this.data.password]
    if (!name) {
      wx.showToast({
        title: '请输入账号',
        image: './images/warm.png',
        duration: 1000
      })
      return false
    }
    if (!pass) {
      wx.showToast({
        title: '请输入密码',
        image: './images/warm.png',
        duration: 1000
      })
      return false
    }
    wx.showLoading({
      title: '登陆中',
      mask: true
    })
    wx.request({
      method: 'POST',
      url: app.globalData.url + "/api/auth_token/",
      data: {
        "username": name,
        "password": pass
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.statusCode === 200) {
           return wx.showToast({
            title: '登陆成功',
            icon: 'success',
            mask: 'true',
            duration: 1000,
            success: function () {
              wx.setStorage({
                key: "userinfor",
                data: { "name": name, "pass": pass}
              })
              app.globalData.userToken = res.data.token
              wx.redirectTo({
                url: "../home/index"
                  // url: "../touch/index"
              })
            }
          }) 
        }
        if (res.statusCode === 400) {
          return wx.showToast({
            title: '账号或密码错误',
            image: './images/warm.png',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '请求有误',
            image: './images/warm.png',
            duration: 2000
          })
        }
      },
      fail: (req) => {
        wx.hideLoading()
        wx.showToast({
          title: '服务异常',
          image: './images/warm.png',
          duration: 2000
        })
      }
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.getStorage({
      key: 'userinfor',
      success: function (res) {
        that.setData({
          username: res.data.name,
          password: res.data.pass
        })
      }
    })
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