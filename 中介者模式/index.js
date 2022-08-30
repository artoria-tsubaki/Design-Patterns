// 中介者模式的作用是解除对象与对象之间的紧耦合关系
// 增加一个中介者对象后，所有的相关对象都通过中介者对象来通信，而不是互相引用
// 所以当一个对象发生改变时，只需要通知中介者对象即可

// 未使用中介者模式的例子 泡泡堂游戏
// 用户数少时处理起来比较简单
{
  function Player(name) {
    this.name = name
    this.enemy = null
  }

  Player.prototype.win = function () {
    console.log(this.name + ' won')
  }

  Player.prototype.lose = function () {
    console.log(this.name + ' lost')
  }

  Player.prototype.die = function () {
    this.lose()
    this.enemy.win()
  }

  var player1 = new Player('小红')
  var player2 = new Player('小白')

  player1.enemy = player2
  player2.enemy = player1

  player1.die()
}

// 当用户数变多，代码耦合度高
{
  var players = []
  function Player(name, teamColor) {
    this.partners = []
    this.enemies = []
    this.state = 'live'
    this.name = name
    this.teamColor = teamColor
  }

  Player.prototype.win = function () {
    console.log('winner:' + this.name)
  }

  Player.prototype.lose = function () {
    console.log('loser:' + this.name)
  }

  Player.prototype.die = function () {
    var all_dead = true
    this.state = 'dead'

    for (var i = 0, partner; (partner = this.partners[i++]); ) {
      if (partner.state !== 'dead') {
        all_dead = false
        break
      }
    }

    if (all_dead) {
      this.lose()
      for (var i = 0, partner; (partner = this.partners[i++]); ) {
        partner.lose()
      }
      for (var i = 0, enemy; (enemy = this.enemies[i++]); ) {
        enemy.win()
      }
    }
  }

  var playerFactory = function (name, teamColor) {
    var newPlayer = new Player(name, teamColor)

    for (var i = 0, player; (player = players[i++]); ) {
      if (player.teamColor === newPlayer.teamColor) {
        player.partners.push(newPlayer)
        newPlayer.partners.push(player)
      } else {
        player.enemies.push(newPlayer)
        newPlayer.enemies.push(player)
      }
    }
    players.push(newPlayer)
    return newPlayer
  }

  //红队：
  var player1 = playerFactory('皮蛋', 'red'),
    player2 = playerFactory('小乖', 'red'),
    player3 = playerFactory('宝宝', 'red'),
    player4 = playerFactory('小强', 'red')

  //蓝队：
  var player5 = playerFactory('黑妞', 'blue'),
    player6 = playerFactory('葱头', 'blue'),
    player7 = playerFactory('胖墩', 'blue'),
    player8 = playerFactory('海盗', 'blue')

  // 让红队玩家全部死亡：
  player1.die()
  player2.die()
  player4.die()
  player3.die()
}

// 使用中介者模式重写
{
  var playerFactory = function (name, teamColor) {}

  function Player(name, teamColor) {
    this.name = name
    this.teamColor = teamColor
    this.state = 'alive'
  }

  Player.prototype.win = function () {
    console.log(this.name + 'won')
  }

  Player.prototype.lose = function () {
    console.log(this.name + 'lose')
  }

  Player.prototype.die = function () {
    this.state = 'dead'
    playerDirector.reciveMessage('playerDead', this)
  }

  Player.prototype.remove = function () {
    playerDirector.reciveMessage('removePlayer', this)
  }

  Player.prototype.changeTeam = function () {
    playerDirector.reciveMessage('changeTeam', this, color)
  }

  var playerDirector = (function () {
    var players = {},
      operations = {}

    operations.addPlayer = function (player) {
      var teamColor = player.teamColor
      players[teamColor] = players[teamColor] || []

      players[teamColor].push(player)
    }

    operations.removePlayer = function (player) {
      var teamColor = player.teamColor,
        teamPlayers = players[teamColor] || []

      for (var i = teamPlayers.length - 1; i >= 0; i--) {
        if (teamPlayers[i].player === player) {
          teamPlayers.splice(i, 1)
        }
      }
    }

    operations.changeTeam = function (player, newTeamColor) {
      operations.removePlayer(player)
      player.teamColor = newTeamColor
      operations.addPlayer(player)
    }

    operations.playerDead = function (player) {
      var teamColor = player.teamColor,
        teamPlayers = players[teamColor]

      var all_dead = true

      for (var i = 0, player; (player = teamPlayers[i++]); ) {
        if (player.state !== 'dead') {
          all_dead = false
          break
        }
      }

      if (all_dead) {
        for (var i = 0, player; (player = teamPlayers[i++]); ) {
          player.lose()
        }

        for (var color in players) {
          if (color !== teamColor) {
            var teamPlayers = players[color]
            for (var i = 0, player; (player = teamPlayers[i++]); ) {
              player.win()
            }
          }
        }
      }
    }

    var reciveMessage = function () {
      var message = Array.prototype.shift.call(arguments)
      operations[message].apply(this, arguments)
    }

    return {
      reciveMessage,
    }
  })()
  console.log('------------------------')
  // 红队：
  var player1 = playerFactory('皮蛋', 'red'),
    player2 = playerFactory('小乖', 'red'),
    player3 = playerFactory('宝宝', 'red'),
    player4 = playerFactory('小强', 'red')
  // 蓝队：
  var player5 = playerFactory('黑妞', 'blue'),
    player6 = playerFactory('葱头', 'blue'),
    player7 = playerFactory('胖墩', 'blue'),
    player8 = playerFactory('海盗', 'blue')

  player1.die()
  player2.die()
  player3.die()
  player4.die()
}
