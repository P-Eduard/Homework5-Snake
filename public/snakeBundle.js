/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/snake.js":
/*!**********************!*\
  !*** ./src/snake.js ***!
  \**********************/
/***/ (() => {

eval("$(document).ready(function()\r\n{\r\n    class Snake\r\n    {\r\n        constructor()\r\n        {\r\n\r\n        }\r\n\r\n        isPositionInSnake(position, snakePosition) // Check if the given position is on the snake.\r\n        {\r\n            for (let i = 0; i < snakePosition.length; i++)\r\n                if (position[0] === snakePosition[i][0] && position[1] === snakePosition[i][1]) \r\n                    return true;\r\n            return false;\r\n        }\r\n\r\n        randomPip = () => // A new pip for the board.\r\n        {\r\n            let pipSpot;\r\n            do pipSpot = [Math.floor(Math.random() * 12), Math.floor(Math.random() * 12)];\r\n            while (this.isPositionInSnake(pipSpot, this.position));\r\n            return pipSpot;\r\n        }\r\n\r\n        getPlayerName() // Inputed player name\r\n        {\r\n            let pName = $('#inputName').val();\r\n            if(pName) return pName;\r\n            else return \"Anon\";\r\n        }\r\n\r\n        setControl = (event) => // Set the keyboard control.\r\n        {\r\n            switch (event.key)\r\n            {\r\n                case this.keys[0]:\r\n                    if ((this.direction[0] !== 1 || this.direction[1] !== 0)) this.changeDirection = [-1,0];\r\n                    break;\r\n                case this.keys[1]:\r\n                    if ((this.direction[0] !== -1 || this.direction[1] !== 0)) this.changeDirection = [1,0];\r\n                    break;\r\n                case this.keys[2]:\r\n                    if ((this.direction[0] !== 0 || this.direction[1] !== 1)) this.changeDirection = [0,-1];\r\n                    break;\r\n                case this.keys[3]:\r\n                    if ((this.direction[0] !== 0 || this.direction[1] !== -1)) this.changeDirection = [0,1];\r\n                    break;\r\n                case ' ':\r\n                    pauseFunction();\r\n                    break;\r\n                default:\r\n                    break;\r\n            }\r\n        }\r\n\r\n        reset = () => // Restore the game to default.\r\n        {\r\n            $(document).off('keydown');\r\n            this.timeouts.forEach(timeoutId => clearTimeout(timeoutId));\r\n            $('#inputName').removeAttr('disabled');\r\n            $('#btnStartReset').text('Start');\r\n            $('#modalLose').show();\r\n            $('#modalWin').show();\r\n            $('#btnPause').attr('disabled', 'disabled');\r\n            $('#playerScore').html(0);\r\n            $('#modalScore').html(0);\r\n            this.position = [[4,4], [4,3], [4,2], [4,1]];\r\n            this.pip = [-1,-1];\r\n            this.score = 0;\r\n            this.updateBoard();\r\n            keyboardStart();\r\n        }\r\n      \r\n        start = (withDir) => // Start the game.\r\n        {\r\n            this.playerName = this.getPlayerName();\r\n            $(document).off('keydown');\r\n            $('#btnPause').removeAttr('disabled');\r\n            $('#btnStartReset').text('Reset');\r\n            $('#inputName').attr('disabled', 'disabled');\r\n            $('#modalName').attr('placeholder', this.playerName);\r\n            this.position = [[4,4], [4,3], [4,2], [4,1]];\r\n            this.pip = this.randomPip();\r\n            this.direction = [0,1];\r\n            if(withDir)\r\n            {\r\n                if(withDir === 38) this.direction = [-1,0]; // Up\r\n                if(withDir === 40) this.direction = [1,0]; // Down\r\n                if(withDir === 87) this.direction = [-1,0]; // W\r\n                if(withDir === 83) this.direction = [1,0]; // S\r\n            }\r\n            this.changeDirection = this.direction.concat();\r\n            this.score = 0;\r\n            this.borderKill = $('#borderKillSwitch').prop('checked');\r\n            this.gameSpeed = parseInt($('input[name=\"inlineRadioOptions\"]:checked').val().slice(-1));\r\n            this.timeouts = [];\r\n            this.isPause = false;\r\n            $('#playerName').html(this.playerName);\r\n            this.keys = $('#keySwitch').prop('checked') ? ['w','s','a','d'] : ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];\r\n            $(document).on('keydown', this.setControl);\r\n            this.updateBoard();\r\n            this.updateGameMode();\r\n            this.move();\r\n        }\r\n\r\n        move = () => // Update the position according to the direction.\r\n        {\r\n            if(this.isPause) return;\r\n            let nextSpot = [this.position[0][0]+snakeGame.changeDirection[0],snakeGame.position[0][1]+snakeGame.changeDirection[1]];\r\n            this.direction = this.changeDirection.concat();\r\n            this.pastPosition = this.position.concat();\r\n            if(!this.borderKill) this.loop(nextSpot);\r\n            else if(nextSpot[0] > 11 || nextSpot[0] < 0 || nextSpot[1] > 11 || nextSpot[1] < 0) {this.fail(); return;};\r\n            if(this.isPositionInSnake(nextSpot, this.position)) {this.fail(); return;};\r\n            this.moveSnake(nextSpot);\r\n            this.animate();\r\n            this.timeouts.push(setTimeout(() => {this.updateBoard();}, 400 / this.gameSpeed));\r\n            if (this.position.length === 144) {this.win(); return;};\r\n            this.timeouts.push(setTimeout(() => {this.move();}, 400 / this.gameSpeed));\r\n        }\r\n      \r\n        animate = () => // Create the animation for the snake.\r\n        {\r\n            let pos = this.position, pastPos = this.pastPosition, speed = 400 / this.gameSpeed;\r\n            for (let i = 0; i < pastPos.length; i++)\r\n            {\r\n                let dirDown = parseInt(pos[i][0]-pastPos[i][0]) * 50;\r\n                let dirRight = parseInt(pos[i][1]-pastPos[i][1]) * 50;\r\n                if(dirDown > 50) // Loop U -> D\r\n                {\r\n                    dirDown = -50;\r\n                    $(`.0-${pastPos[i][1]} > :first-child`).clone().appendTo(`.12-${pastPos[i][1]}`);\r\n                    $(`.12-${pastPos[i][1]} > :first-child`).animate({top: '-=50px'}, { duration: speed, queue: false, easing: \"linear\" });\r\n                }\r\n                if(dirDown < -50) // Loop D -> U\r\n                {\r\n                    dirDown = 50;\r\n                    $(`.11-${pastPos[i][1]} > :first-child`).clone().appendTo(`.-1-${pastPos[i][1]}`);\r\n                    $(`.-1-${pastPos[i][1]} > :first-child`).animate({top: '+=50px'}, { duration: speed, queue: false, easing: \"linear\" });\r\n                }\r\n                if(dirRight > 50) // Loop L -> R\r\n                {\r\n                    dirRight = -50;\r\n                    $(`.${pastPos[i][0]}-0 > :first-child`).clone().appendTo(`.${pastPos[i][0]}-12`);\r\n                    $(`.${pastPos[i][0]}-12 > :first-child`).animate({left: '-=50px'}, { duration: speed, queue: false, easing: \"linear\" });\r\n                }\r\n                if(dirRight < -50) // Loop R -> L\r\n                {\r\n                    dirRight = 50;\r\n                    $(`.${pastPos[i][0]}-11 > :first-child`).clone().appendTo(`.${pastPos[i][0]}--1`);\r\n                    $(`.${pastPos[i][0]}--1 > :first-child`).animate({left: '+=50px'}, { duration: speed, queue: false, easing: \"linear\" });\r\n                }\r\n                $(`.${pastPos[i][0]}-${pastPos[i][1]} > :first-child`).animate(\r\n                { \r\n                    left: '+=' + dirRight + 'px',\r\n                    top: '+=' + dirDown + 'px',\r\n                }, { duration: speed, queue: false, easing: \"linear\" });\r\n            }\r\n        }\r\n\r\n        updateBoard = () => // Update the board with a new snake.\r\n        {\r\n            let pos = this.position;\r\n            $('.my-position').html('');\r\n            $.each(pos, function(index, spot)\r\n            {\r\n                if(index === 0) $(`.${spot[0]}-${spot[1]}`).html('<div class=\"w-100 h-100 position-relative my-empty-dot\"></div>');\r\n                else if(index === pos.length - 1) $(`.${spot[0]}-${spot[1]}`).html('<div class=\"w-100 h-100 position-relative my-little-dot\"></div>');\r\n                else $(`.${spot[0]}-${spot[1]}`).html('<div class=\"w-100 h-100 position-relative my-full-dot\"></div>');\r\n            })\r\n            $(`.${this.pip[0]}-${this.pip[1]}`).html('<div class=\"w-100 h-100 position-relative my-little-red-dot\"></div>');\r\n        }\r\n\r\n        loop(nextSpot) // Loop the snake around the border.\r\n        {\r\n            if(nextSpot[0] > 11) nextSpot[0] = 0;\r\n            if(nextSpot[1] > 11) nextSpot[1] = 0;\r\n            if(nextSpot[0] < 0) nextSpot[0] = 11;\r\n            if(nextSpot[1] < 0) nextSpot[1] = 11;\r\n        }\r\n\r\n        moveSnake = (nextSpot) => // Modify the snake array and collect pips you run into.\r\n        {\r\n            if(nextSpot[0] === this.pip[0] && nextSpot[1] === this.pip[1])\r\n            {\r\n                this.score += 1;\r\n                $('#playerScore').html(this.score);\r\n                $('#modalScore').html(this.score);\r\n                this.position.unshift(nextSpot);\r\n                this.pip = this.randomPip();\r\n            }\r\n            else\r\n            {\r\n                this.position.unshift(nextSpot);\r\n                this.position.pop();\r\n            }\r\n        }\r\n\r\n        fail = () => // The snake died.\r\n        {\r\n            this.updateBest();\r\n            $(document).off('keydown');\r\n            $('#btnPause').prop('disabled', 'disabled');\r\n            $('#modalWin').hide();\r\n            $('#gameModal').modal('show');\r\n        }\r\n\r\n        win = () => // Filled the board.\r\n        {\r\n            this.updateBest();\r\n            $('#modalLose').hide();\r\n            $('#gameModal').modal('show');\r\n        }\r\n\r\n        updateBest = () => // Update the best score onthe current session.\r\n        {\r\n            if(parseInt($(\"#playerBest\").html())<this.score)\r\n            {\r\n                $(\"#playerBest\").html(this.score);\r\n                $(\"#modalBest\").html(this.score);\r\n            }\r\n        }\r\n\r\n        updateGameMode = () => // Update the gamemode.\r\n        {\r\n            let mode = \"\";\r\n            mode += this.borderKill ? \"K-\"+this.gameSpeed : \"S-\"+this.gameSpeed;\r\n            $(\"#playerMode\").html() === mode ? null : $(\"#playerBest\").html(0);\r\n            $(\"#playerMode\").html(mode);\r\n            $(\"#modalMode\").html(mode);\r\n        }\r\n    }\r\n\r\n    let isStart = true;\r\n    const snakeGame = new Snake();\r\n\r\n    (function() // IIFE for default settings.\r\n    {\r\n        $('#borderKillSwitch').prop('checked', true);\r\n        $('#inlineRadio2').prop('checked', true);\r\n    })();\r\n\r\n    function screenTooSmall() // Hide board if the window is too small.\r\n    {\r\n        $(window).width() < 1530 ? $('#my-game-grid, #gameWindow').hide() : $('#my-game-grid, #gameWindow').show();\r\n    }\r\n\r\n    screenTooSmall(); // Hide on load if the window is too small.\r\n\r\n    $(window).on('resize', screenTooSmall); // Check if the window is too small when resizing.\r\n\r\n    $('#inputName').focus(function() // Don't start when the player clicks on the input field.\r\n    {\r\n        $(document).off('keydown');\r\n    });\r\n      \r\n    $('#inputName').blur(function(event) // Allow to start after the player sets the name.\r\n    {\r\n        let clickedElement = event.relatedTarget;\r\n        if (clickedElement && clickedElement.id === 'btnStartReset') return;\r\n        keyboardStart();\r\n    });\r\n\r\n    $('#modalReset').click(function() // Modal reset button.\r\n    {\r\n        snakeGame.reset();\r\n        $('#btnStartReset').text('Start');\r\n        isStart = !isStart;\r\n    })\r\n\r\n    $('#btnPause').click(pauseFunction) // Pause button.\r\n\r\n    $('#modalResume').click(resumeFunction) // Resume buton.\r\n\r\n    function pauseFunction() // Pause the game.\r\n    {\r\n        snakeGame.isPause = true; \r\n        snakeGame.timeouts.forEach(timeoutId => clearTimeout(timeoutId));\r\n        $(document).off('keydown');\r\n        $('#pauseModal').modal('show');\r\n    }\r\n\r\n    function resumeFunction() // Resume the game.\r\n    {\r\n        $('#btnPause').removeAttr('disabled');\r\n        snakeGame.isPause = false;\r\n        $(document).on('keydown', snakeGame.setControl);\r\n        snakeGame.timeouts.push(setTimeout(() => {snakeGame.move();}, 400 / Snake.gameSpeed));\r\n    }\r\n\r\n    $('#btnStartReset').click(function() // Start / Reset button.\r\n    {\r\n        isStart ? snakeGame.start() : snakeGame.reset();\r\n        isStart = !isStart;\r\n        $(this).blur();\r\n    });\r\n\r\n    function keyboardStart() // Start with wasd or arrows.\r\n    {\r\n        $(document).on('keydown', function(event)\r\n        {\r\n            if ([37, 38, 39, 40].includes(event.which)) // Arrows.\r\n            {\r\n                $(document).off('keydown');\r\n                if($('#keySwitch').prop('checked'))$('#keySwitch').prop('checked', false);\r\n                snakeGame.start(event.which);\r\n                $('#btnStartReset').text('Reset');\r\n                isStart = !isStart;\r\n            }\r\n            if ([87, 65, 83, 68].includes(event.which)) // WASD.\r\n            {\r\n                $(document).off('keydown');\r\n                if(!$('#keySwitch').prop('checked'))$('#keySwitch').prop('checked', true);\r\n                snakeGame.start(event.which);\r\n                $('#btnStartReset').text('Reset');\r\n                isStart = !isStart;\r\n            }\r\n        });\r\n    }\r\n    \r\n    keyboardStart();\r\n});\n\n//# sourceURL=webpack://homework5-snake/./src/snake.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/snake.js"]();
/******/ 	
/******/ })()
;