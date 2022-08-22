// 享元模式是一种用于性能优化的模式 核心是运用共享技术有效支持大量细粒度的对象
// 当系统中因为创建了大量类似的对象而导致内存占用过高时，享元模式就非常有用。

// 正常创建对象
// {
//   var id = 0

//   window.startUpload = function (uploadType, files) {
//     for (var i = 0, file; (file = files[i++]); ) {
//       var uploadObj = new Upload(uploadType, file.fileName, file.fileSize)
//       uploadObj.init(id++)
//     }
//   }

//   var Upload = function (uploadType, fileName, fileSize) {
//     this.uploadType = uploadType
//     this.fileName = fileName
//     this.fileSize = fileSize
//     this.dom = null
//   }

//   Upload.prototype.init = function (id) {
//     var _this = this
//     this.id = id
//     this.dom = document.createElement('div')
//     this.dom.innerHTML = `
//     <span>文件名称：${this.fileName}, 文件大小：${this.fileSize}</span>
//     <button class="delFile">删除</button>
//   `
//     this.dom.querySelector('.delFile').addEventListener('click', () => {
//       this.delFile()
//     })
//     document.body.appendChild(this.dom)
//   }

//   Upload.prototype.delFile = function () {
//     if (this.fileSize < 3000) {
//       return this.dom.parentNode.removeChild(this.dom)
//     }

//     if (window.confirm('确定要删除该文件嘛？' + this.fileName)) {
//       return this.dom.parentNode.removeChild(this.dom)
//     }
//   }

//   startUpload('plugin', [
//     {
//       fileName: '1.txt',
//       fileSize: 1000,
//     },
//     {
//       fileName: '2.txt',
//       fileSize: 3000,
//     },
//     {
//       fileName: '3.txt',
//       fileSize: 5000,
//     },
//   ])

//   startUpload('flash', [
//     {
//       fileName: '4.txt',
//       fileSize: 1000,
//     },
//     {
//       fileName: '5.txt',
//       fileSize: 3000,
//     },
//     {
//       fileName: '6.txt',
//       fileSize: 5000,
//     },
//   ])
// }

// 使用享元模式创建对象
// {
//   var Upload = function (uploadType) {
//     this.uploadType = uploadType
//   }

//   Upload.prototype.delFile = function (id) {
//     uploadManager.setExternalState(id, this)

//     if (this.fileSize < 3000) {
//       return this.dom.parentNode.removeChild(this.dom)
//     }

//     if (window.confirm('确定要删除该文件嘛？' + this.fileName)) {
//       return this.dom.parentNode.removeChild(this.dom)
//     }
//   }

//   // 如果内部状态对应的共享对象已经被创建过，那么直接返回这个对象，否则创建一个新的对象
//   var UploadFactory = (function () {
//     var createFlyWeightObjs = {}
//     return {
//       create: function (uploadType) {
//         if (createFlyWeightObjs[uploadType]) {
//           return createFlyWeightObjs[uploadType]
//         }

//         return (createFlyWeightObjs[uploadType] = new Upload(uploadType))
//       },
//     }
//   })()

//   var uploadManager = (function () {
//     var uploadDataBase = {}

//     return {
//       add: function (id, uploadType, fileName, fileSize) {
//         var flyWeightObj = UploadFactory.create(uploadType)

//         var dom = document.createElement('div')
//         dom.innerHTML = `
//           <span>文件名称：${fileName}, 文件大小：${fileSize}</span>
//           <button class="delFile">删除</button>
//         `
//         dom.querySelector('.delFile').addEventListener('click', () => {
//           flyWeightObj.delFile(id)
//         })

//         document.body.appendChild(dom)

//         uploadDataBase[id] = {
//           fileName,
//           fileSize,
//           dom,
//         }

//         return flyWeightObj
//       },
//       setExternalState: function (id, flyWeightObj) {
//         var uploadData = uploadDataBase[id]
//         for (var i in uploadData) {
//           flyWeightObj[i] = uploadData[i]
//         }
//       },
//     }
//   })()

//   var id = 0

//   window.startUpload = function (uploadType, files) {
//     for (var i = 0, file; (file = files[i++]); ) {
//       var uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize)
//     }
//   }

//   startUpload('plugin', [
//     {
//       fileName: '1.txt',
//       fileSize: 1000,
//     },
//     {
//       fileName: '2.txt',
//       fileSize: 3000,
//     },
//     {
//       fileName: '3.txt',
//       fileSize: 5000,
//     },
//   ])

//   startUpload('flash', [
//     {
//       fileName: '4.txt',
//       fileSize: 1000,
//     },
//     {
//       fileName: '5.txt',
//       fileSize: 3000,
//     },
//     {
//       fileName: '6.txt',
//       fileSize: 5000,
//     },
//   ])
// }

// 对象池的应用
{
  var toolFactory = (function () {
    var toolTipPool = [] // tooltip 对象池

    return {
      create: function () {
        if (toolTipPool.length == 0) {
          var div = document.createElement('div')
          document.body.appendChild(div)
          return div
        } else {
          return toolTipPool.shift()
        }
      },
      recover: function (tooltipEl) {
        return toolTipPool.push(tooltipEl) // 对象池回收dom
      },
    }
  })()

  console.log(toolFactory)

  var ary = []
  for (var i = 0, str; (str = ['A', 'B'][i++]); ) {
    var tooltip = toolFactory.create()
    tooltip.innerHTML = str
    ary.push(tooltip)
  }

  for (var i = 0; i < ary.length; i++) {
    toolFactory.recover(ary[i])
  }

  for (var i = 0, str; (str = ['A', 'B', 'C', 'D', 'E', 'F'][i++]); ) {
    var tooltip = toolFactory.create()
    tooltip.innerHTML = str
    ary.push(tooltip)
  }
}

// 通用对象池的实现
{
  var objectFactory = function (createObjFn) {
    var objectPool = []

    return {
      create: function () {
        var obj = objectPool.length === 0 ? createObjFn.apply(this, arguments) : objectPool.shift()
        return obj
      },
      recover: function (obj) {
        objectPool.push(obj)
      },
    }
  }

  var iframeFactory = objectFactory(function () {
    var iframe = document.createElement('iframe')
    document.body.appendChild(iframe)

    iframe.onload = function () {
      iframe.onload = null
      iframeFactory.recover(iframe)
    }

    return iframe
  })

  var iframe1 = iframeFactory.create()
  iframe1.src = 'http://baidu.com'

  var iframe2 = iframeFactory.create()
  iframe2.src = 'https://www.bilibili.com'

  var iframe3 = iframeFactory.create()
  iframe3.src = 'http://163.com'
}
