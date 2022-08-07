// 发布订阅模式其实是对象间一对多的依赖关系，当一个对象的状态发生改变时，所有依赖他的对象都将接收到状态改变的通知。

// ES6 class 实现
{
  class EventEmitter {
    // 1. 创建一个类，并初始化一个事件存储中心
    constructor() {
      this._events = {}
    }
  
    // 2. 实现方法的订阅 有可能一个事件触发多个回调函数
    on (name, callback) {
  
      // 6. 实现一个对于新事件订阅的监听
      if (!this._events[name]) {
        if (name !== 'newListener') {
          this.emit('newListener', name)
        }
      }
  
      const callbacks = this._events[name] || []
      callbacks.push(callback)
      this._events[name] = callbacks
    }
  
    // 3. 实现事件的发布
    emit (name, ...args) {
      const callbacks = this._events[name] || []
      callbacks.forEach(callback => callback(...args))
    }
  
    // 4. 实现事件的取消订阅方法
    off (name, callback) {
      const callbacks = this._events[name] || []
      const newCallbacks = callbacks.filter(cb => cb != callback && cb.initialCallback != callback)
      this._events[name] = newCallbacks
    }
  
    // 5. 实现事件的单次订阅方法
    once (name, callback) {
      const one = (...args) => { 
        callback(...args)
        this.off(name, callback)
      }
  
      one.initialCallback = callback
      this.on(name, one)
    }
  }
  
  const events = new EventEmitter()
  
  events.on('newListener', function (name) {
    console.log('newListener', name)
  })
  
  // events.on("hello", function () {
  //   console.log("hello");
  // })
  
  const cb = function () {
    console.log("cb");
  }
  
  // events.on("hello", cb)
  // events.off("hello", cb)
  
  // events.emit("hello")
  
  const once = function () {
    console.log("once");
  }
  
  events.once("hello", once)
  events.emit("hello")
  events.emit("hello")
}


// ES5 实现
{
  // 1. 实现中介对象
  var pubsub = {};
  (function (myObject) {
    var topics = {}
    /**
     * topics = {
     *  topicA: [
     *    {
     *      token: subuid,
     *      fn: func
     *    },
     *    {
     *      token: subuid,
     *      fn: func
     *    },
     *  ],
     *  topicB: [
     *    {
     *      token: subuid,
     *      fn: func
     *    },
     *    {
     *      token: subuid,
     *      fn: func
     *    },
     *  ],
     * }
     */
    var subUid = -1
    
    // 发布(执行)的方法
    myObject.publish = function (topic, args) { 
      if (!topics[topic]) {
        return false
      }

      var subscribers = topics[topic]
      var len = subscribers ? subscribers.length : 0
      while (len--) {
        subscribers[len].fn(args)
      }
    }
    
    // 订阅(监听)的方法
    myObject.subscribe = function (topic, func) {
      // 如果不存在响应事件就创建一个
      if (!topics[topic]) {
        topics[topic] = []
      }
      // 将订阅对象信息存储
      var token = (++subUid).toString()
      topics[topic].push({
        token,
        fn: func
      })
      // 返回订阅者标识返回，利于撤销时的访问
      return token
    }

    // 撤销订阅的方法
    myObject.unsubscribe = function (token) {
      for (var m in topics) {
        if (topics[m]) {
          for (var i = 0; i < topics[m].length; i++) {
            if (topics[m][i].token == token) {
              topics[m].splice(i, 1);
            }
          }
        }
      }
    }
  })(pubsub)

  let helloToken = pubsub.subscribe('hello', function () {
    console.log('pubsub hello');
  })

  pubsub.publish('hello')

  pubsub.unsubscribe(helloToken)

  pubsub.publish('hello')
}