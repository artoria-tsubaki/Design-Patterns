/**
 * 命令模式：有时候需要向某些对象发送请求，但不知道请求的接收对象是谁，也不知道请求的操作是什么。
 *           此时希望有一种松耦合的请求方式来设计软件，使得请求发送者和请求接收者能消除彼此之间的耦合关系。
 */

const button1 = document.querySelector("#button1")
const button2 = document.querySelector("#button2")
const button3 = document.querySelector("#button3")

// 通过 command 将按钮和其功能分离开来
{
  // var setCommand = function (button, command) {
  //   button.addEventListener("click", function (e) {
  //     command.execute()
  //   })
  // }


  // var MenuBar = {
  //   refresh: function () {
  //     console.log('meubar refresh');
  //   }
  // }

  // var SubBar = {
  //   add: function () {
  //     console.log('subbar add');
  //   },
  //   del: function () {
  //     console.log('subbar del');
  //   }
  // }


  // var RefreshMenuBarCommand = function (receiver) {
  //   this.receiver = receiver;
  // }

  // RefreshMenuBarCommand.prototype.execute = function () {
  //   this.receiver.refresh()
  // }

  // var AddSubBarCommand = function (receiver) {
  //   this.receiver = receiver;
  // }

  // AddSubBarCommand.prototype.execute = function () {
  //   this.receiver.add()
  // }

  // var DeleteSubBarCommand = function (receiver) {
  //   this.receiver = receiver;
  // }

  // DeleteSubBarCommand.prototype.execute = function () {
  //   this.receiver.del()
  // }


  // setCommand(button1, new RefreshMenuBarCommand(MenuBar))
  // setCommand(button2, new AddSubBarCommand(SubBar))
  // setCommand(button3, new DeleteSubBarCommand(SubBar))
}


// JavaScript 中的命令模式
{
  var buttonBind = function (button, fn) {
    button.addEventListener("click", fn)
  }

  var MenuBar = {
    refresh: function () {
      console.log('meubar refresh');
    }
  }
  var SubBar = {
    add: function () {
      console.log('subbar add');
    },
    del: function () {
      console.log('subbar del');
    }
  }

  // buttonBind(button1, MenuBar.refresh)
  // buttonBind(button2, SubBar.add)
  // buttonBind(button3, SubBar.del)

  var RefreshMenuBarCommand = function (command) {
    return {
      execute: function () {
        command.refresh()
      }
    }
  }

  var OpearteBarCommand = function (command, operation) {
    return {
      execute: function () {
        command[operation]()
      }
    }
  }

  buttonBind(button1, OpearteBarCommand(MenuBar, "refresh").execute)
}


// 宏命令
{
  var closeDoorCommand =  {
    execute: function () {
      console.log('关门');
    }
  }

  var openPcCommand = {
    execute: function () {
      console.log('打开pc');
    }
  }

  var openQQCommand = {
    execute: function () {
      console.log('打开QQ');
    }
  }

  var openSoundCommand =  {
    execute: function () {
      console.log('打开音响');
    }
  }

  var openCameraCommand = {
    execute: function () {
      console.log('打开摄像头');
    }
  }

  var MacroCommand = function () {
    var commandList = []
    return {
      add: function (command) {
        commandList.push(command)
      },
      execute: function () {
        for (var i = 0, command; command = commandList[i++];) {
          command.execute()
        }
      }
    }
  }

  var macroCommand1 = MacroCommand()

  macroCommand1.add(closeDoorCommand)
  macroCommand1.add(openPcCommand)
  macroCommand1.add(openQQCommand)

  var macroCommand2 = MacroCommand()
  macroCommand2.add(openSoundCommand)
  macroCommand2.add(openCameraCommand)

  var macroCommand = MacroCommand()
  macroCommand.add(macroCommand1)
  macroCommand.add(macroCommand2)
  macroCommand.execute()
}