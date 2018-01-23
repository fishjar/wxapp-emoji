//app.js
App({
  onLaunch: function () {
    //
  },
  getUserInfo: function(cb){
    if (this.globalData.userInfo){
      cb(res.userInfo);
    } else {
      // 获取用户信息
      wx.getUserInfo({
        success: res => {
          this.globalData.userInfo = res.userInfo
          cb(res.userInfo);
        }
      })
    }
  },
  globalData: {
    userInfo: null
  },
})