Component({
  properties: {
    value: {
      type: Array,
      value: [],
      observer: "onValue"
    },
    isShow: {
      type: Boolean,
      value: false,
      observer: "onShow"
    }
  },

  data: {
    provinces: [],
    showPicker: false,
    tempProvincePos: [0],
    tempCityPos: [0],
    tempRegionPos: [0]
  },

  attached: function() {
    let provinces = wx.getStorageSync('provinces')
    this.setData({
      provinces: provinces
    })
  },

  methods: {
    onTouchmask: function(event) {},
    onCacnelClick(e) {
      this.triggerEvent('cancelclick', {});
    },
    onSureClick(e) {
      var valueCode = [0, 0,0];
      var valueName = ['', '',''];
      if (this.data.provinces != null && this.data.provinces.length > this.data.tempProvincePos) {
        if (this.data.provinces[this.data.tempProvincePos].cityList != null && this.data.provinces[this.data.tempProvincePos].cityList.length > this.data.tempCityPos) {
          if (this.data.provinces[this.data.tempProvincePos].cityList[this.data.tempCityPos].areaList != null && this.data.provinces[this.data.tempProvincePos].cityList[this.data.tempCityPos].areaList.length > this.data.tempRegionPos) {
            valueCode = [this.data.provinces[this.data.tempProvincePos].id, this.data.provinces[this.data.tempProvincePos].cityList[this.data.tempCityPos].id, this.data.provinces[this.data.tempProvincePos].cityList[this.data.tempCityPos].areaList[this.data.tempRegionPos].id];
            valueName = [this.data.provinces[this.data.tempProvincePos].name, this.data.provinces[this.data.tempProvincePos].cityList[this.data.tempCityPos].name, this.data.provinces[this.data.tempProvincePos].cityList[this.data.tempCityPos].areaList[this.data.tempRegionPos].name];
          } else {
            valueCode = [this.data.provinces[this.data.tempProvincePos].id, this.data.provinces[this.data.tempProvincePos].cityList[this.data.tempCityPos].id, 0];
            valueName = [this.data.provinces[this.data.tempProvincePos].name, this.data.provinces[this.data.tempProvincePos].cityList[this.data.tempCityPos].name, ''];
          }
        }
      }

      this.triggerEvent('sureclick', {
        valueCode: valueCode,
        valueName: valueName
      });

    },
    province_onChange: function(e) {
      this.setData({
        tempProvincePos: e.detail.value,
        tempCityPos: [0]
      });
    },
    city_onChange: function(e) {
      this.setData({
        tempCityPos: e.detail.value
      });
    },
    region_onChange: function (e) {
      this.setData({
        tempRegionPos: e.detail.value
      });
    },
    onValue() {
      //通过传进来的省份城市的code计算对应的index
      var tempProvincePos = 0;
      for (var i = 0; i < this.data.provinces.length; i++) {
        var item = this.data.provinces[i];
        if (item.id == this.data.value[0]) {
          tempProvincePos = i;
          break;
        }
      }
      var tempCityPos = 0;
      if (this.data.provinces.length > tempProvincePos) {
        var cityList = this.data.provinces[tempProvincePos].cityList;
        for (var i = 0; i < cityList.length; i++) {
          var item = cityList[i];
          if (item.name == this.data.value[1]) {
            tempCityPos = i;
            break;
          }
        }
      }
      var tempRegionPos = 0;
      if (this.data.provinces.length > tempProvincePos) {
        var areaList = this.data.provinces[this.data.tempProvincePos].cityList[this.data.tempCityPos].areaList;
        for (var i = 0; i < areaList.length; i++) {
          var item = areaList[i];
          if (item.name == this.data.value[2]) {
            tempRegionPos = i;
            break;
          }
        }
      }
      this.setData({
        tempProvincePos: [tempProvincePos],
        tempCityPos: [tempCityPos],
        tempRegionPos: [tempRegionPos]
      });
    },
    onShow() {
      this.setData({
        showPicker: this.data.isShow
      });
    }
  }
});