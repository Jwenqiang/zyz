//index.js
//获取应用实例
import { hexMD5 } from "../../utils/md5.js"//md5加密
var clearT="";
const app = getApp()
Page({
  data: {
    show:false,
    imgUrls:"",
    timer:"",
    bzHouse: [],
    datetime:"",
    ptotal: 0,
    pidx: 2,
    pval: "",
    no: false,
    navH:"132px",
    showHome:false,
    openId:""
  },
  onLoad: function () {
    this.setData({
      navH: app.globalData.navHeight
    })       
    wx.showLoading({
      title: '加载中'
    })       
    var p1 = this.getBanner();
    var p2 = this.getData();
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          openId:res.data.OpenId
        })
      },
    })
    // 同步执行
    Promise.all([p1, p2]).then(function (results) {
      console.log(results); // 获得一个Array: ['P1', 'P2',"P3"]
      // 设计定时器   
      // clearT=setInterval(function () {
      //   that.djsList();
      // }, 1000); 
      setTimeout(function () { wx.hideLoading(); }, 300)
    })
      .catch(function (error) {
        console.log(error)
      })     
  },
  onShow(){
    // 底部tabbar
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    } 
    var that=this;
    clearInterval(clearT);
    clearT = setInterval(function () {
      that.djsList();
    }, 1000);      
  },
  onHide: function () {
    // 页面从前台变为后台时执行
    console.log('hide');
    console.log(clearT);
    clearInterval(clearT);
    console.log(clearT);
  },
  onUnload: function () {
    // 页面销毁时执行
    console.log('unload');
  },  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    clearInterval(clearT);
    wx.showLoading({
      title: '加载中'
    })       
    wx.stopPullDownRefresh();
    //显示动画
    // wx.showNavigationBarLoading();
    that.setData({
      ptotal: 0,
      pidx: 2,
      pval: "",
      no: false      
    })
    var p1 = this.getBanner();
    var p2 = this.getData();
    var that = this;
    // 同步执行
    Promise.all([p1, p2]).then(function (results) {
      console.log(results); // 获得一个Array: ['P1', 'P2',"P3"]
 
      setTimeout(function () { wx.hideLoading(); }, 100)
    })
      .catch(function (error) {
        console.log(error)
      })
    setTimeout(function () {
      //隐藏动画
      wx.hideNavigationBarLoading()
    }, 500)
  },  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    var that = this;
    if (Math.ceil(that.data.ptotal / 3) >= that.data.pidx) {
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
  djsList: function () {
    // 倒计时时间转换为时间戳
    var dates = [];
    for (var i in this.data.bzHouse) {
      if (this.data.bzHouse[i].StateTerm==1){
        var end_time = new Date((this.data.bzHouse[i].StartTime).replace(/-/g, '/')).getTime();//月份是实际月份-1  
        // console.log(end_time);
        var current_time = new Date().getTime();
        var sys_second = (end_time - new Date().getTime());
        dates.push({ dat: sys_second });
      }
      else if(this.data.bzHouse[i].EndTime != "") {
        var end_time = new Date((this.data.bzHouse[i].EndTime).replace(/-/g, '/')).getTime();//月份是实际月份-1  
        // console.log(end_time);
        var current_time = new Date().getTime();
        var sys_second = (end_time - new Date().getTime());
        dates.push({ dat: sys_second });
      }
    }
    this.setData({
      datetime: dates
    })
    // 倒计时执行
    let that = this;
    let len = that.data.datetime.length;//时间数据长度

    // var timer = setInterval(function () {//时间函数

    for (var i = 0; i < len; i++) {
      var intDiff = that.data.datetime[i].dat;//获取数据中的时间戳
      if (intDiff > 0) {//转换时间
        that.data.datetime[i].dat -= 1000;
        var day = Math.floor((intDiff / 1000 / 3600) / 24);
        var hour = Math.floor(intDiff / 1000 / 3600);
        var minute = Math.floor((intDiff / 1000 / 60) % 60);
        var second = Math.floor(intDiff / 1000 % 60);

        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        var str = day + "," + hour + ',' + minute + ',' + second
        that.data.datetime[i].difftime = str;//在数据中添加difftime参数名，把时间放进去
        that.data.bzHouse[i].djs = that.data.datetime[i].difftime;

        that.setData({
          bzHouse: that.data.bzHouse
        })
        // const ctx = wx.createCanvasContext('bzcanvas'+i);
        // ctx.font = 'normal bold 15px sans-serif';
        // ctx.setFillStyle('#ff4631');
        // ctx.setTextAlign('left');
        // ctx.fillText(hour + ' 时 ' + minute + ' 分 ' + second + ' 秒', 2, 16);
        // ctx.draw()
      } else {
        // var str = "已结束！";
        // clearInterval(that.data.timer);
      }
    }

    //  }, 1000)

  },
  goActive(e){
    var that=this;
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../active/active?Id='+id,
    })
  },
  goRole(){
    wx.navigateTo({
      url: '../role/role',
    })
  },
  getBanner(){
    var that = this;
    return new Promise(function (resolve) {
      wx.request({
        url: 'https://spapi.centaline.com.cn/api/System/GetBanner',
        data: {
          AdPositionId: 31
        },
        success(res) {
          console.log(res);
          if (res.data.code == 1001) {
            that.setData({
              imgUrls: res.data.data.Item[0]
            })
            resolve(1);
          }
        }
      })
    })
  }, 
  //列表
  getData: function (num) {
    var that = this;
    if(num==undefined){
      num=1
    }
    return new Promise(function (resolve) {
      wx.request({
        url: 'https://spapi.centaline.com.cn/api/Rotate/GetRotatePageList',
        method: "post",
        data:{
          PageSize:3,
          PageIndex: num,
          State:1
        },
        success(res) {
          console.log(res);
          if (res.data.code == 1001) {
            that.setData({
              ptotal: res.data.data.TotalRecord,
              no: false
            })
            if (num == 1) {
              that.setData({
                bzHouse: res.data.data.DataList
              })
            }
            if (num > 1) {
              that.setData({
                bzHouse: that.data.bzHouse.concat(res.data.data.DataList)
              })
            }            
            resolve(2);
          }
        }
      })
    })
  }, 
  pay() {
    var t = Date.parse(new Date()) / 1000;
    console.log(t)
    wx.request({
      url: 'https://spapi.centaline.com.cn/api/Users/WxUsersPay ',
      method:"post",
      header:{
        token:"1111111"
      },
      data:{
        total_fee:10,
        openid:this.data.openId,
        timeStamp:t
      },
      success(res){
        // var t = parseInt(new Date().getTime() / 1000);
        // console.log(t)
        console.log(res);
        // var md5Data = hexMD5('appId =' + res.data.data.appId + '&nonceStr=' + res.data.data.nonce_str + ' & package=prepay_id = ' + res.data.data.prepay_id+'& signType=MD5 & timeStamp='+t+' & key='+qazwsxedcrfvtgbyhnujmikolp111111)
    // wx.requestPayment(
    //   {
    //     'timeStamp': t,
    //     'nonceStr': res.data.data.nonce_str,
    //     'package': 'prepay_id ='+res.data.data.prepay_id,
    //     'signType': 'MD5',
    //     'paySign': md5Data,
    //     'success': function (r) {
    //       console.log(r);
    //      },
    //     'fail': function (res) { },
    //     'complete': function (res) { }
    //   })
      wx.requestPayment(
        {
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonce_str,
          'package': res.data.data.package,
          'signType': res.data.data.signType,
          'paySign': res.data.data.paySign,
          'success': function (r) {
            console.log(r)
          },
          'fail': function (res) { },
          'complete': function (res) { }
        })
      }
    })
    // wx.requestPayment(
    //   {
    //     'timeStamp': '',
    //     'nonceStr': '',
    //     'package': '',
    //     'signType': 'MD5',
    //     'paySign': '',
    //     'success': function (res) { },
    //     'fail': function (res) { },
    //     'complete': function (res) { }
    //   })
  },
})
