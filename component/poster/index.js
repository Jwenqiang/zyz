const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    avater: { // 图片
      type: String,
      value: ''
    },
    phone: { // 价格
      type: String,
      value: ''
    },
    tx: { // 价格
      type: String,
      value: ''
    },    
    productname: { // 名称
      type: String,
      value: ''
    },
    codeimg: { // 二维码
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    productCode: "",
    showpost: false,
    imgHeight: 0,
  },

  ready: function() {
    console.log(this.data.tx)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //下载产品图片
    getAvaterInfo: function() {
      wx.showLoading({
        title: '生成中...',
        mask: true,
      });
      var that = this;
      that.setData({
        showpost: true
      })
      var productImage = that.data.avater;
      if (productImage) {
        wx.downloadFile({
          url: productImage,
          success: function(res) {
            // wx.hideLoading();
            if (res.statusCode === 200) {
              var productSrc = res.tempFilePath;
              that.calculateImg(productSrc, function(data) {
                console.log(data);
                that.getTx(productSrc, data);
              })
            } else {
              wx.showToast({
                title: '产品图片下载失败！',
                icon: 'none',
                duration: 2000,
                success: function() {
                  var productSrc = "";
                  that.getTx(productSrc);
                }
              })
            }
          }
        })
      } else {
        wx.hideLoading();
        var productSrc = "";
        that.getTx(productSrc);
      }
    },

    //下载头像
    getTx: function (productSrc, imgInfo) {
      // wx.showLoading({
      //   title: '生成中...',
      //   mask: true,
      // });
      var that = this;
      var productCode = that.data.tx;
      if (productCode) {
        wx.downloadFile({
          url: productCode,
          success: function (res) {
            // wx.hideLoading();
            if (res.statusCode === 200) {
              var codeSrc = res.tempFilePath;
              that.getQrCode(productSrc, codeSrc, imgInfo);
            } else {
              wx.showToast({
                title: '头像下载失败！',
                icon: 'none',
                duration: 2000,
                success: function () {
                  var codeSrc = "";
                  that.getQrCode(productSrc, codeSrc, imgInfo);
                }
              })
            }
          }
        })
      } else {
        // wx.hideLoading();
        var codeSrc = "";
        that.getQrCode(productSrc, codeSrc, imgInfo);
      }
    },



    //下载二维码
    getQrCode: function(productSrc, tx,imgInfo = "") {
      // wx.showLoading({
      //   title: '生成中...',
      //   mask: true,
      // });
      var that = this;
      var productCode = that.data.codeimg;
      if (productCode) {
        wx.downloadFile({
          url: productCode,
          success: function(res) {
            // wx.hideLoading();
            if (res.statusCode === 200) {
              var codeSrc = res.tempFilePath;
              console.log(productSrc)
              console.log(tx)
              console.log(codeSrc)
              that.sharePosteCanvas(productSrc,tx, codeSrc, imgInfo);
            } else {
              wx.showToast({
                title: '二维码下载失败！',
                icon: 'none',
                duration: 2000,
                success: function() {
                  var codeSrc = "";
                  that.sharePosteCanvas(productSrc, tx,  codeSrc, imgInfo);
                }
              })
            }
          }
        })
      } else {
        // wx.hideLoading();
        var codeSrc = "";
        that.sharePosteCanvas(productSrc, tx,  codeSrc);
      }
    },

    //canvas绘制分享海报
    sharePosteCanvas: function(avaterSrc,tx, codeSrc, imgInfo) {
      
      // wx.showLoading({
      //   title: '生成中...',
      //   mask: true,
      // })
      var that = this;
      const ctx = wx.createCanvasContext('myCanvas', that);
      var width = "";
      const query = wx.createSelectorQuery().in(this);
      query.select('#canvas-container').boundingClientRect(function(rect) {
        console.log(rect);
        var height = rect.height;
        var right = rect.right;
        width = rect.width;
        var left = rect.left;
        console.log(left);
        console.log(right);
        ctx.setFillStyle('#fff');
        ctx.fillRect(0, 0, rect.width, height);

        //头图背景
        if (avaterSrc) {
          console.log(imgInfo);
          if (imgInfo) {
          var imgheght = parseFloat(imgInfo);
          }
          console.log(imgheght);
          ctx.drawImage(avaterSrc, 0, 0, width, imgheght ? imgheght : width);
          ctx.setFontSize(14);
          ctx.setFillStyle('#fff');
          ctx.setTextAlign('left');
        }

        //  绘制二维码
        if (codeSrc) {
          ctx.drawImage(codeSrc, width - width / 4-10, imgheght + 10, width / 4, width / 4)
          ctx.setFontSize(10);
          ctx.setFillStyle('#999');
          ctx.fillText("长按扫码或保存图片", width - 100, imgheght + 110);
        }

        //名称
        if (that.data.productname) {
          console.log(that.data.productname);
          const CONTENT_ROW_LENGTH = 24; // 正文 单行显示字符长度
          let [contentLeng, contentArray, contentRows] = that.textByteLength((that.data.productname).substr(0, 40), CONTENT_ROW_LENGTH);
          ctx.font = 'normal 14px sans-serif';
          ctx.setTextAlign('left');
          ctx.setFillStyle('#000');
          // ctx.setFontSize(20);
          let contentHh = 22 * 1;
          for (let m = 0; m < contentArray.length; m++) {
            ctx.fillText(contentArray[m], width / 6 + 20, imgheght + 60 + contentHh * m);
          }
        }


        //电话
        if (that.data.phone || that.data.phone == 0) {
          ctx.setFontSize(16);
          ctx.setFillStyle('#000');
          ctx.setTextAlign('left');
          var phone = that.data.phone;
          if (!isNaN(phone)) {
            phone = that.data.phone
          }
          ctx.fillText(phone, width / 6 + 20, imgheght + 85); //电话
        }
        // 头像
        if (tx) {
          ctx.beginPath() //开始创建一个路径
          ctx.arc(10 + width / 12, imgheght + 90 - width / 12, width / 12, 0, 2 * Math.PI, false)
          // ctx.stroke();
          ctx.clip() //裁剪    

          ctx.drawImage(tx, 10, imgheght + 90 - width / 6, width / 6, width / 6)

        }

      }).exec()
      setTimeout(function() {
        ctx.draw();
        wx.hideLoading();
      }, 1000)

    },

    textByteLength(text, num) { // text为传入的文本  num为单行显示的字节长度
      let strLength = 0; // text byte length
      let rows = 1;
      let str = 0;
      let arr = [];
      for (let j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) > 255) {
          strLength += 2;
          if (strLength > rows * num) {
            strLength++;
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        } else {
          strLength++;
          if (strLength > rows * num) {
            arr.push(text.slice(str, j));
            str = j;
            rows++;
          }
        }
      }
      arr.push(text.slice(str, text.length));
      return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
    },

    //点击保存到相册
    saveShareImg: function() {
      var that = this;
      wx.showLoading({
        title: '正在保存',
        mask: true,
      })
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function(res) {
            wx.hideLoading();
            var tempFilePath = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success(res) {
                wx.showModal({
                  content: '图片已保存到相册,发个朋友圈吧~',
                  showCancel: false,
                  confirmText: '好的',
                  confirmColor: '#333',
                  success: function(res) {
                    // that.closePoste();
                    // if (res.confirm) {}
                  },
                  fail: function(res) {
                    console.log(res)
                  }
                })
              },
              fail: function(res) {
                wx.showToast({
                  title: "授权才能保存哦",
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          fail: function(err) {
            console.log(err)
          }
        }, that);
      }, 1000);
    },
    //关闭海报
    closePoste: function() {
      this.setData({
        showpost: false
      })
      // detail对象，提供给事件监听函数
      this.triggerEvent('myevent', {
        showVideo: true
      })
    },

    //计算图片尺寸
    calculateImg: function(src, cb) {
      var that = this;
      wx.getImageInfo({
        src: src,
        success(res) {
          wx.getSystemInfo({
            success(res2) {
              var ratio = res.width / res.height;
              console.log(res.height);
              var imgHeight = (res2.windowWidth * 0.85 / ratio);
              console.log(imgHeight);
              that.setData({
                imgHeight: imgHeight
              })
              cb(imgHeight-130);
            }
          })
        }
      })
    }
  }
})