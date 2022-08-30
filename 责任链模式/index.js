// 职责链的定义是：使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系
// 将这些对象连成一条链，并沿着这条链传递该请求，知道有一个对象处理他为止。

// 使用责任链处理
{
  var order500 = function (orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
      console.log('500元定金预购，得到100优惠券')
    } else {
      order200(orderType, pay, stock)
    }
  }

  var order200 = function (orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
      console.log('200元定金预购，得到50优惠券')
    } else {
      orderNormal(orderType, pay, stock)
    }
  }

  var orderNormal = function (orderType, pay, stock) {
    if (stock > 0) {
      console.log('普通购买，无优惠券')
    } else {
      console.log('手机库存不足')
    }
  }

  order500(1, true, 500) // 输出：500 元定金预购, 得到 100 优惠券
  order500(1, false, 500) // 输出：普通购买, 无优惠券
  order500(2, true, 500) // 输出：200 元定金预购, 得到 500 优惠券
  order500(3, false, 500) // 输出：普通购买, 无优惠券
  order500(3, false, 0) // 输出：手机库存不足
}

// 灵活可拆分的职责链节点
{
  var order500 = function (orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
      console.log('500元定金预购，得到100优惠券')
    } else {
      return 'nextSuccessor' // 我不知道下一个节点是谁，反正把请求往后面传递
    }
  }

  var order200 = function (orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
      console.log('200元定金预购，得到50优惠券')
    } else {
      return 'nextSuccessor' // 我不知道下一个节点是谁，反正把请求往后面传递
    }
  }

  var orderNormal = function (orderType, pay, stock) {
    if (stock > 0) {
      console.log('普通购买，无优惠券')
    } else {
      console.log('手机库存不足')
    }
  }

  var Chain = function (fn) {
    this.fn = fn
    this.successor = null
  }

  Chain.prototype.setNextSuccessor = function (successor) {
    // 指定在链中的下一个节点
    return (this.successor = successor)
  }

  Chain.prototype.passRequest = function () {
    // 传递请求给某个节点
    var ret = this.fn.apply(this, arguments)

    if (ret == 'nextSuccessor') {
      return this.successor && this.successor.passRequest.apply(this.successor, arguments)
    }

    return ret
  }

  // 手动传递请求给职责链中的下一个节点
  Chain.prototype.next = function () {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments)
  }

  var chainOrder500 = new Chain(order500)
  var chainOrder200 = new Chain(order200)
  var chainOrderNormal = new Chain(orderNormal)

  chainOrder500.setNextSuccessor(chainOrder200)
  chainOrder200.setNextSuccessor(chainOrderNormal)

  console.log('------------------------')
  chainOrder500.passRequest(1, true, 500)
  chainOrder500.passRequest(1, false, 500)
  chainOrder500.passRequest(2, true, 500)
  chainOrder500.passRequest(3, false, 500)
  chainOrder500.passRequest(3, false, 0)

  var fn1 = new Chain(function () {
    console.log(1)
    return 'nextSuccessor'
  })

  var fn2 = new Chain(function () {
    console.log(2)
    setTimeout(() => {
      this.next()
    }, 1000)
  })

  var fn3 = new Chain(function () {
    console.log(3)
  })

  console.log('--------------------------')
  fn1.setNextSuccessor(fn2).setNextSuccessor(fn3)
  fn1.passRequest()
}

// 使用职责链模式获取文件上传方式对象
{
  Function.prototype.after = function (fn) {
    var self = this
    return function () {
      var ret = self.apply(this, arguments)
      if (ret === 'nextSuccessor') {
        return fn.apply(this, arguments)
      }

      return ret
    }
  }

  var getActiveUploadObj = function () {
    try {
      return new ActiveXObject('TXFTNActiveX.FTNUpload') // IE 上传控件
    } catch (e) {
      return 'nextSuccessor'
    }
  }

  var getFlashUploadObj = function () {
    if (false) {
      var str = '<object type="application/x-shockwave-flash"></object>'
      return $(str).appendTo($('body'))
    }
    return 'nextSuccessor'
  }

  var getFormUpladObj = function () {
    // return $('<form><input name="file" type="file"/></form>').appendTo($('body'))
    return 'getFormUpladObj'
  }

  var getUploadObj = getActiveUploadObj.after(getFlashUploadObj).after(getFormUpladObj)
  console.log(getUploadObj())
}
