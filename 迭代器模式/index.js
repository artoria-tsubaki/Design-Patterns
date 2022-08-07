// 迭代器的含义就是  在不暴露对象内部结构的同时可以按照一定顺序访问对象内部的元素

// 实现 数组迭代器 和 对象迭代器
{
  let eachArr = function (arr, fn) {
    for (let i = 0; i < arr.length; i++) {
      if (fn.apply(null, [arr[i], i]) === false) { // fn的执行结果是 false，则终止迭代器
        break;
      }
    }
  }

  eachArr([1, 2, 3, 4], (item, index) => console.log(item, index))


  let eachObj = function (obj, fn) {
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        if (fn.apply(obj, [key, obj[key]]) === false) {
          break;
        }        
      }
    }
  }

  eachObj({a:1, b:2, c:3}, (index, value) => console.log(index, value))
}


// 路径查找器
{
  function getAttrValue (obj, key) {
    if (!obj || !key) {
      throw new Error("参数传递错误")
    }

    let keyArr = key.split('.')
    let result = obj

    for (var k = 0; k < keyArr.length; k++) {
      if (result[keyArr[k]] !== undefined) {
        result = result[keyArr[k]]
      } else {
        return undefined
      }
    }

    return result
  }

  let a = { b : { c: { d: { e: { f : 1 } } } } }

  getAttrValue(a, 'a.b.c.d.e.f')
}


// 路径赋值器
{
  function setAttrValue (obj, key, value) {
    if (!obj || !key) {
      throw new Error("参数传递错误")
    }

    let keyArr = key.split('.')
    let result = obj
    let k = 0
    for (; k < keyArr.length; k++) {
      if (result[keyArr[k]] === undefined) {
        result[keyArr[k]] = {}
      }

      if (!result[keyArr[k]] instanceof Object) {
        throw new Error("Invalid obj")
      }

      result = result[keyArr[k]]
    }

    return result[key[k]] = value
  }

  let a = {}

  setAttrValue(a, 'a.b.c.d.e.f', 'xxx')
}


// 内部迭代器与外部迭代器的区别
// 1. eachArr 和 eachObj 即内部迭代器
// 2. 内部迭代器完全接手整个迭代过程，外部只需要一次初始调用。
// 3. 内部迭代器使用简单，外部不关心内部的实现，外部跟内部的交互也就仅以一次初始调用。
// 4. 由于内部迭代器的迭代规则已经被实现，因此无法实现同时迭代两个数组或对象
{
  const compare = function(arr1, arr2) {
    if(arr1.length !== arr2.length) {
      console.log('两个数组不相等');
    }
    eachArr(arr1, function(n, i) {
      if(arr2[i] !== n) {
        console.log('两个数组不相等');
        return false
      }
    })
  }

  const eachArr = function (arr, fn) {
    for (let i = 0; i < arr.length; i++) {
      if (fn.apply(null, [arr[i], i]) === false) {
        break;
      }
    }
  }

  compare([1,2,3], [1,2,3,4])
}


// 外部迭代器
// 1. 必须显式地迭代下一个元素。
// 2. 增加了一些调用的复杂度，但也相对增强了迭代器的灵活性，更重要的是可以手工控制迭代的过程或者顺序。
{
  const Iterator = function(obj) {

    var current = 0;

    var next = function() {
      current++
    }

    var isDone = function() {
      return current >= obj.length
    }

    var getCurrItem = function () {
      return obj[current]
    }

    return {
      next,
      isDone,
      getCurrItem,
      length: obj.length
    }
  }

  const compare = function (iterator1, iterator2) {
    if(iterator1.length !== iterator2.length) {
      console.log('不相等');
    }

    while(!iterator1.isDone() && !iterator2.isDone()) {
      if(iterator1.getCurrItem() !== iterator2.getCurrItem()) {
        console.log('不相等');
        break;
      }
      iterator1.next()
      iterator2.next()
    }
  }

  const i1 = Iterator([1,2,3,4]) 
  const i2 = Iterator([1,2,3]) 
  compare(i1, i2)
}


// 迭代器的使用
{
  var IteratorUploadObj = function() {
    // for(var i = 0; i < arguments.length; i++) {

    // }

    for(var i = 0, fn; fn = arguments[i++];) {
      var uploadObj = fn()
      if(uploadObj !== false) {
        return uploadObj
      }
    }
  }

  var getActiveUploadObj = function() {
    try {
      return new ActiveXObject("xxxxxx")
    } catch (error) {
      return false
    }
  }

  var getFlashUploadObj = function () {
    if(supportFlash()) {
      return 'xxx'
    } else {
      return false
    }
  }

  var getFormUploadObj = function() {
    return 'xxx'
  }

  // 按照优先级被循环迭代
  // 如果正在被迭代的函数返回一个对象，表示找到了正确的 upload 对象。反之如果函数返回 false， 则让迭代器继续工作
  IteratorUploadObj(getActiveUploadObj, getFlashUploadObj, getFormUploadObj)

}