// 迭代器的含义就是  在不暴露对象内部结构的同时可以按照一定顺序访问对象内部的元素

// 实现 数组迭代器 和 对象迭代器
{
  let eachArr = function (arr, fn) {
    for (let i = 0; i < arr.length; i++) {
      if (fn.apply(null, [arr[i], i]) === false) {
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