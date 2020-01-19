/**
 * 大转盘抽奖
 */

var util = require("../../utils/util.js");
var $api = require("../../utils/api.js").default;
var app = getApp();

Page({

  //奖品配置
  awardsConfig: {
    chance: true,
    awards: [
      { 'index': 0, 'name': '0元红包' },
      { 'index': 1, 'name': '1元话费' },
      { 'index': 2, 'name': '2元红包' },
      { 'index': 3, 'name': '3元红包' },
      { 'index': 4, 'name': '4元话费' },
      { 'index': 5, 'name': '5元红包' }
    ]
  },

  data: {
    activeId:43,
    ready:false,
    awardsList: {},
    qzList:"",
    animationData: {},
    btnDisabled: '',
    navH:"",
    roleS:false,
    wxcode:"",
    showSq:false,
    hasSale:false,
    hasSaleMoney:false,
    isYq:false,
    hasYq:false,
    isShare:false,
    oneId:"",
    house:"",
    shareImg:""
  },

  onLoad: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    if(e.id){
      if(e.Id.indexOf(",")<0){
        this.setData({
          activeId: e.Id
        })
      }else{
        var arr=e.Id.split(",");
        this.setData({
          isShare:true,
          activeId: arr[0],
          oneId: arr[1]
        })        
      }
      this.getInfo();
    }
    this.getInfo();
    this.setData({
      navH: app.globalData.navHeight
    })   
    this.getCode(); 
  },
  onShow:function(){
    var that=this;
    wx.getStorage({
      key: 'userInfo',
      success:res=>{
        that.setData({
          utoken: res.data.Token,
          showSq:true
        })
        this.getData();          
      }
    })
  }, 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },  
  getInfo(){
    var that=this;
    $api.api("https://spapi.centaline.com.cn/api/Rotate/GetRotateById", "post", {Id:that.data.activeId,RotateType:2},that.data.utoken).then(res=>{
      console.log(res);    
      if(res.data.code==1001){
        that.setData({
          house:res.data.data,
          shareImg: res.data.data.ShareMainImg
        })
        that.awardsConfig.awards=res.data.data.RotateMaxAmountConfigList
        console.log(that.awards);
      }
    }).then(res=>{
      this.drawAwardRoundel();
      that.setData({
        ready:true
      })
      wx.hideLoading();
    })
  },
  getData(){
    var that=this;
    $api.api("https://spapi.centaline.com.cn/api/Rotate/AddRotateStartUserAmount", "post", {RotateId: that.data.activeId},that.data.utoken).then(res=>{
      console.log(res);
    })
  },

  //画抽奖圆盘
  drawAwardRoundel: function () {
    var awards = this.awardsConfig.awards;
    var awardsList = [];
    var qzList = [];
    var turnNum = 1 / awards.length;  // 文字旋转 turn 值  1turn=一圈

    // 奖项列表
    for (var i = 0; i < awards.length; i++) {
      // awardsList.push({ turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: awards[i].name });原始状态
      awardsList.push({ turn: i * turnNum + turnNum / 2 + 'turn', lineTurn: i * turnNum  + 'turn', award: awards[i].Amount});      
      qzList.push(awards[i].Probability);
    }

    this.setData({
      btnDisabled: this.awardsConfig.chance ? '' : 'disabled',
      awardsList: awardsList,
      qzList: qzList
    });
    console.log(awardsList);
  },

  //发起抽奖
  playReward: function () {

    var weightArr = this.data.qzList;
    weightArr = this.arrOverAdd(weightArr);
    console.log(weightArr);
    var totalWeight = weightArr[weightArr.length - 1];
    var random = Math.random() * totalWeight;
    console.log(random);
    var arrIndex = this.getArrIndex(random,weightArr);
    console.log("索引："+arrIndex);    
    //中奖index
    var awardIndex = arrIndex;


    console.log(awardIndex);
    var runNum = 3;//旋转8周
    var duration = 5000;//时长
    // 旋转角度
    this.runDeg = this.runDeg || 0;
    console.log(this.runDeg);
    console.log(360 - this.runDeg % 360);
    // this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - awardIndex * (360 / 6))  原始状态
    this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - awardIndex * (360 / 6))-30
    //360 - this.runDeg % 360表示回到起点项需要转的角度   360 * runNum - awardIndex * (360 / 6)表示中奖项的角度
    //创建动画
    var animationRun = wx.createAnimation({
      duration: duration,
      timingFunction: 'ease'
    })
    animationRun.rotate(this.runDeg).step();
    this.setData({
      animationData: animationRun.export(),
      btnDisabled: 'disabled'
    });

    // 中奖提示
    var awardsConfig = this.awardsConfig;
    setTimeout(function () {
      this.showSaleM(awardsConfig.awards[awardIndex].Amount);
      // wx.showModal({
      //   title: '恭喜',
      //   content: '获得' + (awardsConfig.awards[awardIndex].name),
      //   showCancel: false
      // });
      this.setData({
        btnDisabled: ''
      });
    }.bind(this), duration);

  },

  // onShareAppMessage: function () {
  //   var that = this;
  //   return util.doShare("大转盘抽奖", "pages/test/test", that);
  // }
  goF(e){
    const t=e.currentTarget.dataset.t;
      wx.pageScrollTo({
        scrollTop: 600,
        duration: 300
      })    
    if(t=='f'){
      wx.pageScrollTo({
        scrollTop: 600,
        duration: 300
      })
    }else{
      wx.pageScrollTo({
        scrollTop: 870,
        duration: 300
      })     
    }
  },
  showRole(){
    this.data.roleS=!this.data.roleS;
    this.setData({
      roleS:this.data.roleS
    })
  },
  showSale(n){
    this.data.hasSale=!this.data.hasSale;
    this.setData({
      hasSale:this.data.hasSale,
    })
  },  
  showYq(n){
    this.data.isYq=!this.data.isYq;
    this.setData({
      isYq:this.data.isYq,
    })
  },  
  showHyq(n){
    this.data.hasYq=!this.data.hasYq;
    this.setData({
      hasYq:this.data.hasYq,
    })
  },  
  showSaleM(n){
    this.data.hasSaleMoney=!this.data.hasSaleMoney;
    this.setData({
      hasSaleMoney:this.data.hasSaleMoney,
      moneyNum:n
    })
  },   
  getCode: function () {
    var that = this;
    return new Promise(function (resolve) {
      wx.login({
        success(res) {
          that.setData({
            wxcode: res.code
          })
          resolve(res.code);
        }
      })
    })
  },  
  //获取头像昵称
  getUserInfo(e) {
    const isCj=e.currentTarget.dataset.t;
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData;
    var that = this;
    //-----------------是否授权，授权通过进入主页面，授权拒绝则停留在登陆界面
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') { //用户点击拒绝
      wx.showToast({
        title: "授权后才能抽奖哦",
        icon: "none"
      })      
    } else { //授权通过执行跳转
      if (that.data.wxcode!=''){
        wx.showLoading({
          title: '授权中',
          mask: true
        })
        wx.request({
          url: 'https://spapi.centaline.com.cn/api/Users/UserLogin', //接口地址
          data: {
            code: that.data.wxcode,
            encryptedData: telObj,
            iv: ivObj,
            Type: 4,
            AuthorizeType: 2
          },
          method: "post",
          success: function (res) {
            console.log(res);
            if (res.data.code == 1001) {
              wx.setStorage({   //存储数据并准备发送给下一页使用
                key: "userInfo",
                data: res.data.data,
              })
              that.setData({             
                showSq: true
              })
              that.getData(); 
              if(isCj=='cj'){
                that.playReward(); 
              }
                             
            }
            else {
              wx.showToast({
                title: "授权失败，请稍后再试",
                icon: "none"
              })
              that.getCode()
            }
            wx.hideLoading();
          }
        })
      }
    }

  },  
  goNf(){
    wx.navigateTo({
      url: '../nyFriends/nyFriends',
    })
  }, 
  goNm(){
    wx.navigateTo({
      url: '../nyMoney/nyMoney',
    })
  }, 
  
  
// 抽奖随机
//数组元素叠加 [1,2,3,4,,] -> [1,3,6,10,,,,]
arrOverAdd(arr){
  if( !arr || arr.length <= 0){
      return [];
  } else {
      var temp = [];
      for(var i = 0;i < arr.length ; i++){
          if(i == 0){
              temp[i] = parseInt(arr[i]);
          } else {
              temp[i] = temp[i-1] + parseInt(arr[i]);
          }
      }
      return temp;
  }
},
/**
 * 获取数组中最接近的值得index
 * @param random 随机数
 * @param weightArray 权重数组
 * @returns {number}
 */
getArrIndex(random,weightArray){
  var index = 0;
  if(random <= weightArray[0]){
      return 0;
  } else if(random >= weightArray[weightArray.length-1]){
      index = weightArray.length - 1;
      return index;
  } else {
      for(var i = 0 ;i < weightArray.length; i++){
          if(random <= weightArray[i]){
              index = i;
          } else if(random > weightArray[i] && random <= weightArray[i + 1]){
              index = i + 1;
              break
          } else if (random > weightArray[i] && random <= weightArray[ i + 1] ){
              index = i + 1;
              break;
          }
      }
  }
  return index;
}



})
