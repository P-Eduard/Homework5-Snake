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

        getBorderKill() // If the border kills or not
        {
            return $('#borderKillSwitch').prop('checked');
        }

        getGameSpeed() // Chosen game speed
        {
            return parseInt($('input[name="inlineRadioOptions"]:checked').val().slice(-1));
        }

        getButtonControl() // Check whether wasd or arrows.
        {
            return $('#keySwitch').prop('checked');
        }

        setArrowControl = (event) => // Set the control to arrow keys.
        {
            switch (event.key)
            {
                case 'ArrowUp':
                    if ((this.direction[0] !== 1 || this.direction[1] !== 0)) this.changeDirection = [-1,0];
                    break;
                case 'ArrowDown':
                    if ((this.direction[0] !== -1 || this.direction[1] !== 0)) this.changeDirection = [1,0];
                    break;
                case 'ArrowLeft':
                    if ((this.direction[0] !== 0 || this.direction[1] !== 1)) this.changeDirection = [0,-1];
                    break;
                case 'ArrowRight':
                    if ((this.direction[0] !== 0 || this.direction[1] !== -1)) this.changeDirection = [0,1];
                    break;
                default:
                    break;
            }
        }

        setWASDControl = (event) => // Set the control to wasd keys.
        {
            switch (event.key)
            {
                case 'w':
                    if ((this.direction[0] !== 1 || this.direction[1] !== 0)) this.changeDirection = [-1,0];
                    break;
                case 's':
                    if ((this.direction[0] !== -1 || this.direction[1] !== 0)) this.changeDirection = [1,0];
                    break;
                case 'a':
                    if ((this.direction[0] !== 0 || this.direction[1] !== 1)) this.changeDirection = [0,-1];
                    break;
                case 'd':
                    if ((this.direction[0] !== 0 || this.direction[1] !== -1)) this.changeDirection = [0,1];
                    break;
                default:
                    break;
            }
        }
      
        next = () => // Where head will go on next turn.
        {
            return [this.position[0][0]+snakeGame.changeDirection[0],snakeGame.position[0][1]+snakeGame.changeDirection[1]];
        }
      
        reset() // Restore the game to default.
        {
            clearInterval(this.running);
            $('#modalLose').show();
            $('#modalWin').show();
            this.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
            this.position = [[4,4], [4,3], [4,2], [4,1]];
            this.pip = [-1,-1];
            this.score = 0;
            this.buttonControl ? $(document).off('keydown', this.setWASDControl) : $(document).off('keydown', this.setArrowControl)
            this.updateBoard();
        }
      
        start() // Start the game.
        {
            this.playerName = this.getPlayerName();
            $('#btnPause').removeAttr('disabled');
            this.position = [[4,4], [4,3], [4,2], [4,1]];
            this.pip = this.randomPip();
            this.direction = [0,1];
            this.changeDirection = this.direction.concat();
            this.score = 0;
            this.borderKill = this.getBorderKill();
            this.gameSpeed = this.getGameSpeed();
            this.buttonControl = this.getButtonControl();
            this.timeouts = [];
            this.isPause = false;
            $('#playerName').html(this.playerName);
            this.buttonControl ? $(document).on('keydown', this.setWASDControl) : $(document).on('keydown', this.setArrowControl);
            this.updateGameMode();
            this.move();
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

        move = () => // Update the position according to the direction.
        {
            var nextSpot = this.next();
            this.direction = this.changeDirection.concat();
            this.pastPosition = this.position.concat();
            if(!this.borderKill) this.loop(nextSpot);
            else if(nextSpot[0] > 11 || nextSpot[0] < 0 || nextSpot[1] > 11 || nextSpot[1] < 0) {this.fail(); return;}
            if(this.isPositionInSnake(nextSpot, this.position)) {this.fail(); return;}
            this.moveSnake(nextSpot);
            this.animate();
            this.timeouts.push(setTimeout(() => {this.updateBoard();}, 400 / this.gameSpeed));
            if (this.position.length === 144) {this.win(); return}
            if (this.isPause) return;
            this.timeouts.push(setTimeout(() => {this.move();}, 400 / this.gameSpeed));
        }

        fail = () => // The snake died.
        {
            this.updateBest();
            // alert("You lose!");
            $('#modalWin').hide();
            $('#gameModal').modal('show');
        }

        win = () => // Filled the board.
        {
            clearInterval(this.running);
            this.updateBest();
            // alert("You win!");
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

    $('#btnStartReset').click(function() // Start / Reset button.
    {
        if (isStart)
        {
            snakeGame.start();
            $(this).text('Reset');
        } 
        else
        {
            snakeGame.reset();
            $(this).text('Start');
        }
        isStart = !isStart;
    });

    $('#modalReset').click(function() // Modal reset button.
    {
        snakeGame.reset();
        $('#btnStartReset').text('Start');
        isStart = !isStart;
    })

    $('#btnPause').click(function() // Pause the game.
    {
        snakeGame.isPause = true;
        $('#pauseModal').modal('show');
    })

    $('#modalResume').click(function() // Resume the game.
    {
        $('#btnPause').removeAttr('disabled');
        $('#btnPause').attr('disabled', 'disabled');
        snakeGame.isPause = false;
        snakeGame.timeouts.push(setTimeout(() => {snakeGame.move();}, 400 / Snake.gameSpeed));
    })
    

    const snakeGame = new Snake();
    setInitialOptions();
});