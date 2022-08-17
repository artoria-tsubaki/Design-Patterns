var Beverage = function (param) {
  var boilWater =
    param.boilWater ||
    function () {
      throw new Error('必须传递 boilWater 参数')
    }
  var brew =
    param.brew ||
    function () {
      throw new Error('必须传递 brew 参数')
    }
  var pourInCup =
    param.pourInCup ||
    function () {
      throw new Error('必须传递 pourInCup 参数')
    }
  var addCondiments =
    param.addCondiments ||
    function () {
      throw new Error('必须传递 addCondiments 参数')
    }

  var F = function () {}

  F.prototype.init = async function () {
    var temp1 = await boilWater()
    var temp2 = await brew()
    var temp3 = await pourInCup()
    var temp4 = await addCondiments()
  }

  return F
}

var Coffee = Beverage({
  boilWater: function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('coffee boilWater')
      }, 1000)
    })
  },
  brew: function () {
    return new Promise((resolve, reject) => {
      resolve('coffee brew')
    })
  },
  pourInCup: function () {
    return new Promise((resolve, reject) => {
      resolve('coffee pourInCup')
    })
  },
  addCondiments: function () {
    return new Promise((resolve, reject) => {
      resolve('coffee addCondiments')
    })
  },
})

var coffee = new Coffee()
coffee.init()
