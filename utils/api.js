const api=(url,method,data,token)=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url: url,
      method: method,
      data:data,
      header:{
        'token': token
      },
      success:res=>{
          resolve(res);
      },
      fail:err=>{
        console.log(err);
        reject('请求失败')
      }
    })
  })
}

export default{
  api
}