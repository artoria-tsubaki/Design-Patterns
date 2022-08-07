// 策略模式的目的是将算法的使用和算法的实现分离开来
// 一个基于策略模式的程序至少由两部分组成 1.一组策略类 2.环境类 Context
// 一组策略类：封装了具体的算法，并负责具体的计算过程
// 环境类 Context：Context 接受用户的请求，随后将请求委托给某一个策略类。
// 要做到以上的要点，说明 Context 中要维持对某个策略对象的引用
var w = window
{
    // 策略类
    var PerformaceS = function () {}
    PerformaceS.prototype.calculate = function(salary) {
        return salary * 4
    }

    var PerformaceA = function () {}
    PerformaceA.prototype.calculate = function(salary) {
        return salary * 3
    }

    var PerformaceB = function () {}
    PerformaceB.prototype.calculate = function(salary) {
        return salary * 2
    }

    // 奖金类（环境类 Context）
    var Bonus = function() {
        this.salary = null;
        this.strategy = null;
    }

    Bonus.prototype.setSalary = function(salary) {
        this.salary = salary
    }

    Bonus.prototype.setStrategy = function(strategy) {
        this.strategy = strategy
    }

    Bonus.prototype.getBonus = function() {
        if(!this.strategy) {
            throw new Error("未设置 strategy 属性")
        }
        return this.strategy.calculate(this.salary)
    }

    // 调用
    var bonus = new Bonus()
    bonus.setSalary(1000)
    bonus.setStrategy(new PerformaceS())

    console.log(bonus.getBonus())

    bonus.setStrategy(new PerformaceA())
    console.log(bonus.getBonus())
}


// 在 JavaScript 中，函数也是对象，所以可以把 strategy 和计算方式 直接定义为函数
{
    var strategies = {
        "S": function (salary) {
            return salary * 4
        },
        "A": function (salary) {
            return salary * 3
        },
        "B": function (salary) {
            return salary * 2
        }
    }

    var calculateBonus = function(level, salary) {
        return strategies[level](salary)
    }

    console.log(calculateBonus("S", 1000))
    console.log(calculateBonus("A", 1000))
}


// 使用策略模式能大幅减少 if 等分支的使用


// 使用策略模式实现小球运动的方式
{
    // 动画已消耗时间 小球原始位置 小球目标位置 动画持续时间
    var tween = {
        linear: function(t, b, c, d) {
            return c * t/d + b
        },
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b
        },
        strongEaseIn: function(t, b, c, d) {
            return c* (t /= d) * t * t* t * t + b;
        },
        strongEaseOut: function(t, b, c, d) {
            return c * ( t /= d) * t * t + b
        }
    }

    var Animate = function(dom) {
        this.dom = dom;
        this.startTime = 0;
        this.startPos = 0;
        this.endPos = 0;
        this.propertyName = null; // dom节点需要被改变的 css 属性名 (top left)
        this.easing = null; // 缓动算法
        this.durating = null; // 动画持续时间
    }

    Animate.prototype.start = function(propertyName, endPos, duration, easing) {
        this.startTime = +new Date; // 直接获取时间戳
        this.startPos = this.dom.getBoundingClientRect()[propertyName]
        this.propertyName = propertyName
        this.endPos = endPos
        this.durating = duration
        this.easing = tween[easing]

        var self = this
        var timeId = setInterval(function () { // 启动执行器 执行动画
            if(self.step() === false) { // 如果动画已结束，清除计时器
                clearInterval(timeId)
            }
        }, 19)
    }

    Animate.prototype.step = function() {
        var t = +new Date;
        if(t >= this.startTime + this.durating) {
            this.update(this.endPos) // 更新小球的 css 属性值
            return false
        }
        var pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.durating)
        // pos 为小球当前的位置
        this.update(pos)
    }

    Animate.prototype.update = function(pos) {
        this.dom.style[this.propertyName] = pos + 'px'
    }
}


// 表单校验
{
    var strategies = {
        isNonEmpty: function (value, errorMsg) {
            if(value === '') {
                return errorMsg
            }
        },
        isOverMinLength: function(value, min, errorMsg) {
            if(value.length < min) {
                return errorMsg
            }
        },
        isMobile: function(value, errorMsg) {
            if(!/(^1[3|5|8][0-9]{9})/.test(value)) {
                return errorMsg
            }
        }
    }

    var validatorFunc = function() {
        var validator = new Validator()

        // 添加校验规则
        validator.add(registerForm.username, 'isNonEmpty', '用户名不能为空')
        validator.add(registerForm.password, 'isOverMinLength', '密码长度不能小于6')
        validator.add(registerForm.tel, 'isMobile', '手机号码格式不正确')

        var errorMsg = validator.start()
        return errorMsg
    }

    var Validator = function() {
        this.cache = []
    }

    Validator.prototype.add = function(dom, rule, errorMsg) {
        var ary = rule.split(':')
        this.cache.push(function() {
            var strategy = ary.shift()
            ary.unshift(dom.value)
            ary.push(errorMsg)
            return strategies[strategy].apply(dom, ary)
        })
    }

    Validator.prototype.start = function() {
        for(var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
            var msg = validatorFunc()
            if(msg) {
                return msg
            }
        }
    }
}