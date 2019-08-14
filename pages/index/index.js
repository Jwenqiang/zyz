//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    imgUrls:"",
    timer:"",
    bzHouse: [],
    datetime:{},
    ptotal: 0,
    pidx: 2,
    pval: "",
    no: false,
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中'
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

    var p1 = this.getBanner();
    var p2 = this.getData();
    var that = this;
    // 同步执行
    Promise.all([p1, p2]).then(function (results) {
      console.log(results); // 获得一个Array: ['P1', 'P2',"P3"]
      // 设计定时器
      that.setData({
        timer: setInterval(function () {
          that.djsList();
        }, 1000)
      })
      setTimeout(function () { wx.hideLoading(); }, 300)
    })
    .catch(function (error) {
      console.log(error)
    })

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
  djsList: function () {
    // 倒计时时间转换为时间戳
    var dates = [];
    for (var i in this.data.bzHouse) {
      if (this.data.bzHouse[i].EndTime != "") {
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

})
