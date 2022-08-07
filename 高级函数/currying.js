// 柯里化 又称部分求值。 一个 currying 函数在接受了某些参数后不会立即求值，而是返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。

// var cost = (function() {
//     var args = []

//     return function() {
//         if(arguments.length === 0) {
//             var money = 0
//             console.log(args);
//             for (let index = 0; index < args.length; index++) {
//                 money += args[index]
//             }
//             return money
//         } else {
//             [].push.apply(args, arguments)
//         }
//     }
// })()

// cost(100)
// cost(200)
// cost(300)

// console.log(cost());

var currying = function(fn) {
    var args = []

    return function() {
        if(arguments.length === 0) {
            return fn.apply(this, args)
        } else {
            [].push.apply(args, arguments)
            console.log(arguments.callee);
            return arguments.callee
        }
    }
}

var cost = (function() {
    var money = 0
    return function() {
        for (let index = 0; index < arguments.length; index++) {
            money += arguments[index]
        }
        return money
    }
})()

var cost = currying(cost)

// cost(100)
// cost(200)
// cost(300)

cost(100)(200)(300)

console.log(cost());