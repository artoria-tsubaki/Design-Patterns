// AOP 面向切面编程  将跟核心业务逻辑模块无关的功能抽离出来。 
// 这些功能通常包括 日记统计 安全控制 异常处理。
// 再通过 “动态织入” 的方式掺入业务逻辑模块。

Function.prototype.before = function (beforeFn) {
    var _self = this;
    return function() {
        console.log(arguments)
        beforeFn.apply(this, arguments) // 执行新函数
        return _self.apply(this, arguments) // 执行原函数
    }
}

Function.prototype.after = function (afterFn) {
    var _self = this;
    return function() {
        console.log(arguments)
        var ret = _self.apply(this, arguments)
        afterFn.apply(this, arguments)
        return ret
    }
}

var func = function() {
    console.log(2);
}

func.before(function () {
    console.log(1);
}).after(function () {
    console.log(3);
})(2,3)

