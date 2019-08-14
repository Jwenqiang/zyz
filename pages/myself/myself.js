// pages/myself/myself.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    uimg:"",
    mobile:"",
    utoken:"",
    role:"",
    fullName:"",
    company:"",
    store:"",
    job:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that=this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          utoken: res.data.Token,
          role: res.data.RoleType,
          uimg: res.data.HeadImg,
          name: res.data.NickName,
          mobile: res.data.Mobile,
          company: res.data.CompanyDes,
          store: res.data.StoreDes,
          job: res.data.StationDes          
        })
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
  onShow: function (e) {

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
  onShareAppMessage: function (res) {

  }, 
  exit:function(){
    wx.clearStorage();
    wx.reLaunch({
      url: '../my/my',
    })
  },
  // 修改昵称
  setName(e){
    var that=this;
    var newName=e.detail.value;
    if (newName==''){
      wx.showToast({
        title: '昵称不能为空',
        icon:"none"
      })
      that.setData({
        name:that.data.name
      })
    }else{
      wx.request({
        url: 'https://spapi.centaline.com.cn/api/Users/UpdateNickName',
        header: { token: that.data.utoken },
        method: "post",
        data: { NickName: newName },
        success: r => {
          console.log(r);
          if(r.data.code==1001){
            wx.getStorage({
              key: 'userInfo',
              success: function (res) {
                res.data.NickName = newName;
                that.restHz(res.data);
              }
            })
            that.setData({
              name: newName
            })         
          }
        } 
      })     
    }
  },
  setTx(e){
    var that = this;
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res);
            wx.showToast({
              title: '正在上传...',
              icon: 'loading',
              mask: true,
              duration: 10000
            })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: r => { //成功的回调
            var baseUrl='data:image/jpg;base64,' + r.data;
            wx.request({
              url: 'https://spapi.centaline.com.cn/api/System/PostImgByBase64',
              method:"post",
              data:{
                ImgBase64: baseUrl,
                Type: 1
              },
              success:r=>{
                if(r.data.code==1001){
                  var newImg = r.data.message;
                  wx.request({
                    url: 'https://spapi.centaline.com.cn/api/Users/UpdateHeadImg',
                    header: { token: that.data.utoken },
                    method:"post",
                    data: { HeadImg:r.data.message},
                    success:r=>{
                        if(r.data.code==1001){
                          wx.getStorage({
                            key: 'userInfo',
                            success: function (res) {
                              res.data.HeadImg = newImg;
                              that.restHz(res.data);
                            }
                          })                          
                          that.setData({
                            uimg: newImg
                          })  
                          wx.hideToast();
                        }else{
                          wx.hideToast();
                          wx.showModal({
                            title: '错误提示',
                            content: '上传图片失败,请稍后再试~',
                            showCancel: false,
                            success: function (res) { }
                          })                          
                        }
                    }
                  })
                }else{
                  wx.hideToast();
                  wx.showModal({
                    title: '错误提示',
                    content: '上传图片失败,请稍后再试~',
                    showCancel: false,
                    success: function (res) { }
                  })
                }
              }
            })
        //启动上传等待中...
            // wx.showToast({
            //   title: '正在上传...',
            //   icon: 'loading',
            //   mask: true,
            //   duration: 10000
            // })
            // console.log(tempFilePaths)
            // wx.uploadFile({
            //   url: '192.168.1.1/home/uploadfilenew',
            //   filePath: tempFilePaths[0],
            //   name: 'uploadfile_ant',
            //   formData: {
            //   },
            //   header: {
            //     "Content-Type": "multipart/form-data"
            //   },
            //   success: function (res) {
            //     var data = JSON.parse(res.data);
            //     //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }
            //     console.log(data);
            //   },
            //   fail: function (res) {
            //     wx.hideToast();
            //     wx.showModal({
            //       title: '错误提示',
            //       content: '上传图片失败',
            //       showCancel: false,
            //       success: function (res) { }
            //     })
            //   }
            // });
          }
        })   

      }
    })   
  },
  restHz(val){
    wx.setStorage({
      key: 'userInfo',
      data: val,
      success: y => {
        console.log("成功");
      }
    })
  },
 
})