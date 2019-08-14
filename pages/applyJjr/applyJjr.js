// pages/applyJjr/applyJjr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    msg:"",
    utoken:"",
    uid:"",
    userTx:"",
    userName:"",
    mobile:"",
    role:"",
    name: "",
    gs:"",
    md: "",
    gw: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getData();
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          uid: res.data.UserId,
          utoken: res.data.Token,
          userTx: res.data.HeadImg,
          userName: res.data.NickName,
          mobile:res.data.Mobile,
          role: res.data.RoleType
        })
        that.getUser();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  confim(e) {
    var that = this;
    that.setData({
      show: false,
    })
  },  
  cancel(e) {
    var that = this;
    that.setData({
      show: false,
    })
  },  
  setMsg(e){
    console.log(e);
    var that=this;
    var type=e.currentTarget.dataset.t;
    var msg=e.detail.value;
    if(type=="name"){
      that.setData({
        name:msg
      })
    } else if (type == "gs"){
      that.setData({
        gs: msg
      })      
    } else if (type == "md") {
      that.setData({
        md: msg
      })
    } else if (type == "gw") {
      that.setData({
        gw: msg
      })
    }
  },
  rz(){
    var that=this;
    if (that.data.name==''){
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
      })      
    } else if (that.data.gs == '') {
      wx.showToast({
        title: '请填写所在公司',
        icon: 'none',
      })
    }else{
      wx.showLoading({
        title: '认证中',
      })      
      wx.request({
        url: 'https://spapi.centaline.com.cn/api/Users/UserIsAgentrz',
        method:"post",
        header:{
          "token":that.data.utoken
        },
        data:{
          FullName: that.data.name,
          CompanyDes: that.data.gs,
          StoreDes: that.data.md,
          StationDes: that.data.gw
        },
        success:res=>{
          console.log(res);
          if(res.data.code==1001){
            setTimeout(function(){
              wx.hideLoading();
              wx.showToast({
                title: '认证成功',
                icon: 'success',
                duration: 2000
              }) 
              setTimeout(function(){
                that.getUser();
                wx.reLaunch({
                  url: '../my/my',
                })
              },300)
            },500)
           
          }else{
            wx.hideLoading();
            wx.showToast({
              title: "认证失败，请稍后再试",
              icon: "none"
            })            
          }
        }
      })
    }
  },
  getUser(){
    var that=this;
    wx.showLoading({
      title: '',
      icon:"none"
    })
    wx.request({
      url: 'https://spapi.centaline.com.cn/api/Users/GetUser',
      data: { UserId: that.data.uid },
      header: {
        'token': that.data.utoken
      },
      success(res) {
        console.log(res);
        if (res.data.code == 1001) {
          that.setData({
            name: res.data.data.FullName,
            gs: res.data.data.CompanyDes,
            mobile: res.data.data.Mobile,
            md: res.data.data.StoreDes,
            gw: res.data.data.StationDes
          })
          wx.setStorage({
            key: 'userInfo',
            data: res.data.data,
          })
          that.setData({
            uid: res.data.data.UserId,
            utoken: res.data.data.Token,
            userTx: res.data.data.HeadImg,
            userName: res.data.data.NickName,
            mobile: res.data.data.Mobile,
            role: res.data.data.RoleType
          })
          wx.hideLoading()
        }   
  } 
  })
  }, 
  getData() {
    var that = this;
    wx.request({
      url: 'https://spapi.centaline.com.cn/api/System/GetSystemConfigByKey',
      data: { Key: 2 },
      success: res => {
        console.log(res);
        if (res.data.code == 1001) {
          that.setData({
            msg: res.data.data.BrokerStoreSalePower
          })
        }

      }
    })
  }  
})