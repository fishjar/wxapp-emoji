//index.js
//获取应用实例
const app = getApp()
const { emojis, emojiToPath, textToEmoji } = require('../../utils/emojis');
const inputHeight = 51;
const emojiHeight = 171;
const timeouts = [];
let windowHeight;

Page({
  data: {
    userInfo: {},
    emojiList: [],
    showEmojis: false,
    showFiles: false,
    sysInfo: {},
    scrollHeight: '0',
    scrollTop: 9999,
    msg: '',
    chatList: [],
  },
  onLoad: function () {
    // 获取用户信息
    app.getUserInfo(userInfo => {
      this.setData({ userInfo })
    });
    // 获取表情包
    const emojiList = Object.keys(emojis).map(key => ({
      key: key,
      img: emojiToPath(key)
    }))
    // 获取屏幕高度信息
    const sysInfo = wx.getSystemInfoSync()
    windowHeight = sysInfo.windowHeight
    const scrollHeight = `${windowHeight - inputHeight}px`
    // 获取缓存中聊天记录
    // const chatList = (wx.getStorageSync('chatList') || []).map(chat=>{
    //   if (chat.msg_type === 'text') {
    //     chat.text_list = textToEmoji(chat.msg_text)
    //   }
    //   return chat
    // })
    const chatList = (wx.getStorageSync('chatList') || [])
    // 更新状态
    this.setData({
      emojiList,
      sysInfo,
      scrollHeight,
      chatList,
    })
  },
  onUnload: function () {
    // 清除定时器
    timeouts.forEach(item => {
      clearTimeout(item)
    })
  },
  // 滚动聊天
  goBottom: function (n = 0) {
    timeouts.push(setTimeout(() => {
      this.setData({
        scrollTop: 9999
      })
    }, n))
  },
  // 隐藏表情选择框
  hideEmojis: function () {
    this.setData({ showEmojis: false });
  },
  // 隐藏或显示表情选择框
  toggleEmojis: function () {
    const { showEmojis, showFiles } = this.data;
    if (showFiles) {
      this.setData({
        showEmojis: true,
        showFiles: false
      });
    } else {
      if (showEmojis) {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight}px`,
          showEmojis: !showEmojis
        })
      } else {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - emojiHeight}px`,
          showEmojis: !showEmojis
        });
        this.goBottom(50);
      }
    }
  },
  // 隐藏或显示图片选择框
  toggleFiles: function () {
    const { showEmojis, showFiles } = this.data;
    if (showEmojis) {
      this.setData({
        showEmojis: false,
        showFiles: true
      });
    } else {
      if (showFiles) {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight}px`,
          showFiles: !showFiles
        })
      } else {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - emojiHeight}px`,
          showFiles: !showFiles
        });
        this.goBottom(50);
      }
    }
  },
  inputFocus: function () {
    const { showEmojis, showFiles } = this.data;
    if (showEmojis || showFiles) {
      this.setData({
        scrollHeight: `${windowHeight - inputHeight}px`,
        showEmojis: false,
        showFiles: false,
      });
    }
  },
  inputMsg: function(e){
    //
  },
  blurInput: function (e) {
    this.setData({
      msg: e.detail.value
    })
  },
  // 点击滚动框
  scrollClick: function () {
    const { showEmojis, showFiles } = this.data;
    if (showEmojis || showFiles) {
      this.setData({
        scrollHeight: `${windowHeight - inputHeight}px`,
        showEmojis: false,
        showFiles: false,
      });
    }
  },
  // 点击表情
  clickEmoji: function (e) {
    const { key } = e.currentTarget.dataset;
    const { msg } = this.data;
    this.setData({ msg: msg + key });
  },
  // 发送信息
  sendMsg: function (e) {
    const { msg, chatList } = this.data
    if (!msg) {
      return
    }
    const newChatList = [...chatList, {
      msg_type: 'text',
      msg_text: msg,
      text_list: textToEmoji(msg)
    }]
    this.setData({
      chatList: newChatList,
      msg: ''
    })
    wx.setStorageSync('chatList', newChatList);
    this.goBottom(500);
  },
  // 发送图片
  sendPic: function (e) {
    const that = this
    const { chatList } = this.data

    wx.chooseImage({
      count: 1,
      success: function (res) {
        const src = res.tempFilePaths[0]
        wx.getImageInfo({
          src,
          success: function (res) {
            const { width, height } = res
            const newChatList = [...chatList, {
              msg_type: 'image',
              msg_image: { src, width, height }
            }]
            that.setData({ chatList: newChatList })
            wx.setStorageSync('chatList', newChatList);
            that.goBottom(500);
          }
        })
      }
    })
  },
  // 预览图片
  previewImage: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.id]
    })
  },

})
