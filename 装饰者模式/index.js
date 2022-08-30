// 给对象动态地增加职责的方式称为装饰者（decorator）模式。装饰者模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责。

// 在JavaScript中可以给对象添加属性方法来实现装饰者模式
{
  var plane = {
    fire: function () {
      console.log('点火')
    },
  }

  var missileDecorator = function () {
    console.log('发射导弹')
  }

  var atomDecorator = function () {
    console.log('发射原子弹')
  }

  var plane1 = plane.fire

  plane.fire = function () {
    plane1()
    missileDecorator()
  }

  var plane2 = plane.fire

  plane.fire = function () {
    plane2()
    atomDecorator()
  }

  plane.fire()
}

// 使用装饰者模式控制表单校验提交
{
  const usernameInput = document.querySelector('#username')
  const passwordInput = document.querySelector('#password')
  const submitButton = document.querySelector('#submit')

  function validate() {
    if (usernameInput.value.trim() === '' || !usernameInput.value) {
      console.log('用户名不能为空')
      return false
    }
    if (passwordInput.value.trim() === '' || !passwordInput.value) {
      console.log('密码不能为空')
      return false
    }
  }

  function submit() {
    const param = {
      username: usernameInput.value,
      password: passwordInput.value,
    }

    console.log('ajax提交', param)
  }

  Function.prototype.before = function (beforeFn) {
    var _self = this // 暂存执行函数
    return function () {
      if (beforeFn.apply(this, arguments) === false) {
        return false
      }
      return _self.apply(this, arguments)
    }
  }

  submit = submit.before(validate)

  submitButton.onclick = function () {
    console.log('222')
    submit()
  }
}
