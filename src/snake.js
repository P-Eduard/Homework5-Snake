$(document).ready(function()
{
    var isStart = true;

    class Snake
    {
        constructor()
        {

        }

        isPositionInSnake(position, snakePosition) // Check if the given position is on the snake.
        {
            for (var i = 0; i < snakePosition.length; i++)
                if (position[0] === snakePosition[i][0] && position[1] === snakePosition[i][1]) 
                    return true;
            return false;
        }

        randomPip = () => // A new pip for the board.
        {
            var pipSpot;
            do pipSpot = [Math.floor(Math.random() * 12), Math.floor(Math.random() * 12)];
            while (this.isPositionInSnake(pipSpot, this.position));
            return pipSpot;
        }

        getPlayerName() // Inputed player name
        {
            var pName = $('#inputName').val();
            if(pName) return pName;
            else return "Anon";
        }

        setControl = (event) => // Set the keyboard control.
        {
            switch (event.key)
            {
                case this.keys[0]:
                    if ((this.direction[0] !== 1 || this.direction[1] !== 0)) this.changeDirection = [-1,0];
                    break;
                case this.keys[1]:
                    if ((this.direction[0] !== -1 || this.direction[1] !== 0)) this.changeDirection = [1,0];
                    break;
                case this.keys[2]:
                    if ((this.direction[0] !== 0 || this.direction[1] !== 1)) this.changeDirection = [0,-1];
                    break;
                case this.keys[3]:
                    if ((this.direction[0] !== 0 || this.direction[1] !== -1)) this.changeDirection = [0,1];
                    break;
                case ' ':
                    pauseFunction();
                    break;
                default:
                    break;
            }
        }

        reset = () => // Restore the game to default.
        {
            $(document).off('keydown');
            this.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
            $('#inputName').removeAttr('disabled');
            $('#btnStartReset').text('Start');
            $('#modalLose').show();
            $('#modalWin').show();
            $('#btnPause').attr('disabled', 'disabled');
            $('#playerScore').html(0);
            $('#modalScore').html(0);
            this.position = [[4,4], [4,3], [4,2], [4,1]];
            this.pip = [-1,-1];
            this.score = 0;
            this.updateBoard();
            keyboardStart();
        }
      
        start = (withDir) => // Start the game.
        {
            this.playerName = this.getPlayerName();
            $(document).off('keydown');
            $('#btnPause').removeAttr('disabled');
            $('#btnStartReset').text('Reset');
            $('#inputName').attr('disabled', 'disabled');
            this.position = [[4,4], [4,3], [4,2], [4,1]];
            this.pip = this.randomPip();
            this.direction = [0,1];
            if(withDir)
            {
                if(withDir === 38) this.direction = [-1,0]; // Up
                if(withDir === 40) this.direction = [1,0]; // Down
                if(withDir === 87) this.direction = [-1,0]; // W
                if(withDir === 83) this.direction = [1,0]; // S
            }
            this.changeDirection = this.direction.concat();
            this.score = 0;
            this.borderKill = $('#borderKillSwitch').prop('checked');
            this.gameSpeed = parseInt($('input[name="inlineRadioOptions"]:checked').val().slice(-1));
            this.timeouts = [];
            this.isPause = false;
            $('#playerName').html(this.playerName);
            this.keys = $('#keySwitch').prop('checked') ? ['w','s','a','d'] : ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
            $(document).on('keydown', this.setControl);
            this.updateBoard();
            this.updateGameMode();
            this.move();
        }

        move = () => // Update the position according to the direction.
        {
            if(this.isPause) return;
            var nextSpot = [this.position[0][0]+snakeGame.changeDirection[0],snakeGame.position[0][1]+snakeGame.changeDirection[1]];
            this.direction = this.changeDirection.concat();
            this.pastPosition = this.position.concat();
            if(!this.borderKill) this.loop(nextSpot);
            else if(nextSpot[0] > 11 || nextSpot[0] < 0 || nextSpot[1] > 11 || nextSpot[1] < 0) {this.fail(); return;};
            if(this.isPositionInSnake(nextSpot, this.position)) {this.fail(); return;};
            this.moveSnake(nextSpot);
            this.animate();
            this.timeouts.push(setTimeout(() => {this.updateBoard();}, 400 / this.gameSpeed));
            if (this.position.length === 144) {this.win(); return;};
            this.timeouts.push(setTimeout(() => {this.move();}, 400 / this.gameSpeed));
        }
      
        animate = () => // Create the animation for the snake.
        {
            let pos = this.position, pastPos = this.pastPosition, speed = 400 / this.gameSpeed;
            for (let i = 0; i < pastPos.length; i++)
            {
                let dirDown = parseInt(pos[i][0]-pastPos[i][0]) * 50;
                let dirRight = parseInt(pos[i][1]-pastPos[i][1]) * 50;
                if(dirDown > 50) // Loop U -> D
                {
                    dirDown = -50;
                    $(`.0-${pastPos[i][1]} > :first-child`).clone().appendTo(`.12-${pastPos[i][1]}`);
                    $(`.12-${pastPos[i][1]} > :first-child`).animate({top: '-=50px'}, { duration: speed, queue: false, easing: "linear" });
                }
                if(dirDown < -50) // Loop D -> U
                {
                    dirDown = 50;
                    $(`.11-${pastPos[i][1]} > :first-child`).clone().appendTo(`.-1-${pastPos[i][1]}`);
                    $(`.-1-${pastPos[i][1]} > :first-child`).animate({top: '+=50px'}, { duration: speed, queue: false, easing: "linear" });
                }
                if(dirRight > 50) // Loop L -> R
                {
                    dirRight = -50;
                    $(`.${pastPos[i][0]}-0 > :first-child`).clone().appendTo(`.${pastPos[i][0]}-12`);
                    $(`.${pastPos[i][0]}-12 > :first-child`).animate({left: '-=50px'}, { duration: speed, queue: false, easing: "linear" });
                }
                if(dirRight < -50) // Loop R -> L
                {
                    dirRight = 50;
                    $(`.${pastPos[i][0]}-11 > :first-child`).clone().appendTo(`.${pastPos[i][0]}--1`);
                    $(`.${pastPos[i][0]}--1 > :first-child`).animate({left: '+=50px'}, { duration: speed, queue: false, easing: "linear" });
                }
                $(`.${pastPos[i][0]}-${pastPos[i][1]} > :first-child`).animate(
                { 
                    left: '+=' + dirRight + 'px',
                    top: '+=' + dirDown + 'px',
                }, { duration: speed, queue: false, easing: "linear" });
            }
        }

        updateBoard = () => // Update the board with a new snake.
        {
            let pos = this.position;
            $('.my-position').html('');
            $.each(pos, function(index, spot)
            {
                if(index === 0) $(`.${spot[0]}-${spot[1]}`).html('<div class="w-100 h-100 position-relative my-empty-dot"></div>');
                else if(index === pos.length - 1) $(`.${spot[0]}-${spot[1]}`).html('<div class="w-100 h-100 position-relative my-little-dot"></div>');
                else $(`.${spot[0]}-${spot[1]}`).html('<div class="w-100 h-100 position-relative my-full-dot"></div>');
            })
            $(`.${this.pip[0]}-${this.pip[1]}`).html('<div class="w-100 h-100 position-relative my-little-red-dot"></div>');
        }

        loop(nextSpot) // Loop the snake around the border.
        {
            if(nextSpot[0] > 11) nextSpot[0] = 0;
            if(nextSpot[1] > 11) nextSpot[1] = 0;
            if(nextSpot[0] < 0) nextSpot[0] = 11;
            if(nextSpot[1] < 0) nextSpot[1] = 11;
        }

        moveSnake = (nextSpot) => // Modify the snake array and collect pips you run into.
        {
            if(nextSpot[0] === this.pip[0] && nextSpot[1] === this.pip[1])
            {
                this.score += 1;
                $('#playerScore').html(this.score);
                $('#modalScore').html(this.score);
                this.position.unshift(nextSpot);
                this.pip = this.randomPip();
            }
            else
            {
                this.position.unshift(nextSpot);
                this.position.pop();
            }
        }

        fail = () => // The snake died.
        {
            this.updateBest();
            $(document).off('keydown');
            $('#btnPause').prop('disabled', 'disabled');
            $('#modalWin').hide();
            $('#gameModal').modal('show');
        }

        win = () => // Filled the board.
        {
            this.updateBest();
            $('#modalLose').hide();
            $('#gameModal').modal('show');
        }

        updateBest = () => // Update the best score onthe current session.
        {
            if(parseInt($("#playerBest").html())<this.score)
            {
                $("#playerBest").html(this.score);
                $("#modalBest").html(this.score);
            }
        }

        updateGameMode = () => // Update the gamemode.
        {
            var mode = "";
            mode += this.borderKill ? "K-"+this.gameSpeed : "S-"+this.gameSpeed;
            $("#playerMode").html() === mode ? null : $("#playerBest").html(0);
            $("#playerMode").html(mode);
            $("#modalMode").html(mode);
        }
    }

    function setInitialOptions() // Default settings.
    {
        $('#borderKillSwitch').prop('checked', true);
        $('#inlineRadio2').prop('checked', true);
    }

    $(window).on('resize', function() // Hide the grid if the window is too small.
    {
        if ($(window).width() < 1530)
        {
            $('.my-game-grid').hide();
        }
        else
        {
            $('.my-game-grid').show();
        }
    });

    $('#inputName').focus(function() // Don't start when the player clicks on the input field.
    {
        $(document).off('keydown');
    });
      
    $('#inputName').blur(function(event) // Allow to start after the player sets the name.
    {
        let clickedElement = event.relatedTarget;
        if (clickedElement && clickedElement.id === 'btnStartReset') return;
        keyboardStart();
    });

    $('#modalReset').click(function() // Modal reset button.
    {
        snakeGame.reset();
        $('#btnStartReset').text('Start');
        isStart = !isStart;
    })

    $('#btnPause').click(pauseFunction)

    $('#modalResume').click(resumeFunction)

    function pauseFunction() // Pause the game.
    {
        snakeGame.isPause = true; 
        snakeGame.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
        $(document).off('keydown');
        $('#pauseModal').modal('show');
    }

    function resumeFunction() // Resume the game.
    {
        $('#btnPause').removeAttr('disabled');
        snakeGame.isPause = false;
        $(document).on('keydown', snakeGame.setControl);
        snakeGame.timeouts.push(setTimeout(() => {snakeGame.move();}, 400 / Snake.gameSpeed));
    }

    $('#btnStartReset').click(function() // Start / Reset button.
    {
        if (isStart) snakeGame.start();
        else snakeGame.reset();
        isStart = !isStart;
        $(this).blur();
    });

    function keyboardStart() // Start with wasd or arrows.
    {
        $(document).on('keydown', function(event)
        {
            $(document).off('keydown');
            if ([37, 38, 39, 40].includes(event.which)) // Arrows.
            {
                if($('#keySwitch').prop('checked'))$('#keySwitch').prop('checked', false);
                snakeGame.start(event.which);
                $('#btnStartReset').text('Reset');
                isStart = !isStart;
            }
            if ([87, 65, 83, 68].includes(event.which)) // WASD.
            {
                if(!$('#keySwitch').prop('checked'))$('#keySwitch').prop('checked', true);
                snakeGame.start(event.which);
                $('#btnStartReset').text('Reset');
                isStart = !isStart;
            }
        });
    }
    
    const snakeGame = new Snake();
    setInitialOptions();
    keyboardStart();
});