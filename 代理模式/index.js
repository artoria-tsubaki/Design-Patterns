// 代理模式就是为一个对象提供一个代用品或者占位符，以便控制对它的访问。
// 代理模式的关键是，当用户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问。

let w = window

// 案例一， 小明追 MM 的故事 小明想给 MM A 送花，但不熟，也不知道喜欢什么花，于是通过 A 的朋友 B 送花。
{
    var Flower = function() {}

    var xiaoming = {
        sendFlower: function (target) {
            var flower = new Flower()
            target.receiveFlower(flower)
        }
    }

    var B = {
        receiveFlower: function(flower) {
            A.tellFavoriteFlower(function () {
                A.receiveFlower(flower)
            })
        }
    }

    var A = {
        receiveFlower: function(flower) {
            console.log('收到了flower')
        },
        // B 向 A 打听喜欢的花
        tellFavoriteFlower: function(fn) {
            setTimeout(() => {
                fn()
            },1000);
        }
    }

    xiaoming.sendFlower(B)
}


// 虚拟代理实现图片预加载
{
    var loadImg = (function(){
        var imgNode = document.createElement('img')
        imgNode.className = 'img1'
        document.body.appendChild(imgNode)

        return {
            setSrc: function(src) {
                imgNode.src = src
            }
        } 
    })()

    var proxyLoadImg = (function () {
        var img = document.createElement('img')
        // 不添加到 dom树 中


        // onload 事件会在页面或图像加载完成后立即发生。
        img.onload = function() {
            loadImg.setSrc(this.src)
        }

        return {
            setSrc: function(src) {
                loadImg.setSrc('https://img-1302665742.cos.ap-shenzhen-fsi.myqcloud.com/2020/07/kokolou.jpg')
                // 加载要被正常展示的图片，加载完成后触发 onload 事件
                img.src = src
            }
        }
    })()

    w.proxyLoadImg = proxyLoadImg
}


// 代理的意义
/**
 * 1. 确保单一职责： 一个类（包括对象或函数）应该仅有一个引起他变化的原因。
 * 2. 确保开放-封闭原则： 要是之后不需要代理的功能（如上例的预加载loading图），可以直接移除而不修改 loadImg 里的代码
 */