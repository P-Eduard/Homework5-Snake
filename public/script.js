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
            this.position = [[4,4], [4,3], [4,2], [4,1]];
            this.pip = [-1,-1];
            this.score = 0;
            // if(!this.buttonControl)
            //     $(document).off('keydown', this.setArrowControl);
            // else
            //     $(document).off('keydown', this.setWASDControl);
            this.buttonControl ? $(document).off('keydown', this.setWASDControl) : $(document).off('keydown', this.setArrowControl)
            this.placeOnBoard();
        }
      
        start() // Start the game.
        {
            this.playerName = this.getPlayerName();
            this.position = [[4,4], [4,3], [4,2], [4,1]];
            this.pip = this.randomPip();
            this.direction = [0,1];
            this.changeDirection = this.direction.concat();
            this.score = 0;
            this.borderKill = this.getBorderKill();
            this.gameSpeed = this.getGameSpeed();
            this.buttonControl = this.getButtonControl();
            $('#playerName').html(this.playerName);
            this.placeOnBoard();
            // if(!this.buttonControl)
            //     $(document).on('keydown', this.setArrowControl);
            // else
            //     $(document).on('keydown', this.setWASDControl);
            this.buttonControl ? $(document).on('keydown', this.setWASDControl) : $(document).on('keydown', this.setArrowControl);
            this.updateGameMode();
            this.running = setInterval(this.move, 400 / this.gameSpeed);
        }
      
        placeOnBoard = () => // Update the board with the new position.
        {
            let pos = this.position;
            $.each($('#my-game-grid').children().toArray(), function(index, box)
            {
                $(box).removeClass("my-little-dot my-full-dot my-empty-dot my-little-red-dot");
            })
            $.each(pos, function(index, spot)
            {
                if(index === 0) $(`.${spot[0]}-${spot[1]}`).addClass("my-empty-dot");
                else if(index === pos.length - 1) $(`.${spot[0]}-${spot[1]}`).addClass("my-little-dot");
                else $(`.${spot[0]}-${spot[1]}`).addClass("my-full-dot");
            })

            $(`.${this.pip[0]}-${this.pip[1]}`).addClass('my-little-red-dot');
        }

        loop(nextSpot) // Loop the snake around the border.
        {
            if(nextSpot[0] > 11) nextSpot[0] = 0;
            if(nextSpot[1] > 11) nextSpot[1] = 0;
            if(nextSpot[0] < 0) nextSpot[0] = 11;
            if(nextSpot[1] < 0) nextSpot[1] = 11;
        }

        collectPip(nextSpot) // Collect pips you run into.
        {
            if(nextSpot[0] === this.pip[0] && nextSpot[1] === this.pip[1])
            {
                this.score += 1;
                $('#playerScore').html(this.score);
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
            if(!this.borderKill) this.loop(nextSpot);
            else if(nextSpot[0] > 11 || nextSpot[0] < 0 || nextSpot[1] > 11 || nextSpot[1] < 0) {this.fail(); return;}
            if(this.isPositionInSnake(nextSpot, this.position)) {this.fail(); return;}
            this.collectPip(nextSpot);
            this.placeOnBoard();
        }

        fail = () => // The snake died.
        {
            clearInterval(this.running);
            this.updateBest();
            alert("You lose!");
        }

        win = () => // Filled the board.
        {
            clearInterval(this.running);
            this.updateBest();
            alert("You win!");
        }

        updateBest = () => // Update the best score onthe current session.
        {
            if(parseInt($("#playerBest").html())<this.score)$("#playerBest").html(this.score);
        }

        updateGameMode = () => // Update the gamemode.
        {
            var mode = "";
            mode += this.borderKill ? "K-"+this.gameSpeed : "S-"+this.gameSpeed;
            $("#playerMode").html() === mode ? null : $("#playerBest").html(0);
            $("#playerMode").html(mode);
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

    $('#my-btn').click(function() // Start / Reset button.
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

    const snakeGame = new Snake();
    setInitialOptions();
});