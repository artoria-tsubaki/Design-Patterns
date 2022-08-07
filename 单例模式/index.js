// 用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象

// 方法一
{
    var Singleton = function(name) {
        this.name = name
    }
    
    Singleton.instance = null
    
    Singleton.prototype.getName = function() {
        return this.name
    }
    
    Singleton.getInstance = function(name) {
        if(!this.instance) {
            this.instance = new Singleton(name)
        }
        return this.instance
    }
    
    var a = Singleton.getInstance('seven1')
    var b = Singleton.getInstance('seven2')
    
    console.log(a === b); // true
}


// 方法二（闭包）
{
    var Singleton = function(name) {
        this.name = name
    }
    
    Singleton.prototype.getName = function() {
        return this.name
    }
    
    Singleton.getInstance = (function() {
        var instance = null
        return function(name) {
            if(!instance) {
                instance = new Singleton(name)
            }
            return instance
        }
    })()
}


// 使用单例模式来生成一个 div
{
    var CreateDiv = function(html) {
        this.html = html
        this.init()
    }
    
    CreateDiv.prototype.init = function() {
        var div = document.createElement('div')
        div.innerHTML = this.html
        document.body.appendChild(div)
    }
    
    var ProxySingletonCreateDiv = (function() {
        var instance = null
    
        return function(html) {
            if(!instance) {
                instance = new CreateDiv(html)
            }
            return instance
        }
    })()
    
    let div1 = new ProxySingletonCreateDiv("div1")
    let div2 = new ProxySingletonCreateDiv("div2")
    
    console.log(div1 === div2)
}


// 避免全局变量
{
    // 1. 命名空间
    var myApp = {}

    // MyApp.namespace('event') => myApp.event = {}
    // MyApp.namespace('dom.style') => myApp.dom = { style: {} } }
    // 
    myApp.namespace = function(name) {
        let nameArr = name.split('.')
        var cur = myApp
        for(var i in nameArr) {
            if(!cur[i]) {
                cur[nameArr[i]] = {}
            }
            cur = cur[nameArr[i]]
        }
    }

    // 2. 闭包
    var user = (function() {
        var name = 'artoria'
        var age = 18
        return {
            getUserInfo: function() {
                return `my name is ${name}, age is ${age}`
            } 
        }
    })()
}


// 惰性单例
{
    // 在要被使用的时候才去创建这个对象
    // 通用的惰性单例
    var getSingle = function(fn) {
        var result
        return function() {
            return result || (result = fn.apply(this, arguments))
        }
    }

    // 使用惰性单例实现插入div
    function createDiv() {
        var div = document.createElement('div')
        div.innerHTML = '我是一个div'
        document.body.appendChild(div)
        div.style.display = 'none'
        return div
    }
    document.querySelector('#btn').addEventListener('click', (e) => {
        var div = getSingle(createDiv)()
        div.style.display = 'block'
    })

    // 使用惰性单例实现事件仅限一次绑定
    var bindEvent = getSingle(function () {
        document.querySelector("#btn").addEventListener("click" , (e) => {
            console.log(e);
        })
        return true
    })

    var render = function () {
        bindEvent()
        console.log('开始渲染')
    }
}