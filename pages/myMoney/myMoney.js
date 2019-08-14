// pages/myMoney/myMoney.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    utoken: "",
    ptotal: 0,
    pidx: 2,
    pval: "",
    no: false,
    load:false,
    totalMoney:0,
    payMoney:0,
    noMoney:0   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          utoken: res.data.Token
        })
        setTimeout(function () {
          that.getData();
        }, 100)

      },
    })
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
    var that = this;
    if (Math.ceil(that.data.ptotal / 10) >= that.data.pidx) {
      wx.showLoading({
        title: '加载中'
      });

      that.getData(that.data.pidx);

      that.setData({
        pidx: that.data.pidx + 1
      })
      setTimeout(function () {
        wx.hideLoading();
      }, 1000)
    } else {
      that.setData({
        no: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getData(num) {
    var that = this;
    if (num == undefined) {
      num = 1
    }    
    wx.request({
      url: 'https://spapi.centaline.com.cn/api/Rotate/GetRotateStartUserAmountPageList',
      header: {
        "token": that.data.utoken
      },
      success: res => {
        console.log(res);
        if(res.data.code==1001){
          that.setData({
            totalMoney: res.data.data.Total,
            payMoney: res.data.data.YesTotal,
            noMoney: res.data.data.NotTotal,              
            ptotal: res.data.data.PageList.TotalRecord,
            no: false,
            load:true
          })
          if (num == 1) {
            that.setData({
              list: res.data.data.PageList.DataList
            })
          }
          if (num > 1) {
            that.setData({
              list: that.data.list.concat(res.data.data.PageList.DataList)
            })
          } 

        }
      }
    })
  }
})