// {
//   pagePath: "/pages/house/house",
//     iconPath: "/img/house.png",
//       selectedIconPath: "/img/house1.png",
//         text: "房源"
// }
Component({
  data: {
    selected: 0,
    color: "#999",
    selectedColor: "#ff4631",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/img/fx.png",
      selectedIconPath: "/img/fx1.png",
      text: "发现"
    }, {
        pagePath: "/pages/my/my",
        iconPath: "/img/my.png",
        selectedIconPath: "/img/my1.png",
        text: "我的"
      }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(data);
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    },
  }
})