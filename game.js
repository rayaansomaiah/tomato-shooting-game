
$(document).ready(function() {
    let score = 0;
    let timeLeft = 20;
    let timerInterval;
    const $bullet = $('#bullet');
    const $score = $('#score');
    const $timer = $('#timer');
    const $modal = $('#endgame-modal');
    const $finalScore = $('#final-score');
    const $gameContainer = $('#game-container');
    const gameWidth = $gameContainer.width();
    const gameHeight = $gameContainer.height();
    
    function createTarget() {
        const $newTarget = $('<div class="target"></div>');
        const newLeft = Math.random() * (gameWidth - 100);
        const newTop = Math.random() * (gameHeight - 100);

        $newTarget.css({
            left: newLeft,
            top: newTop
        }).appendTo($gameContainer);
        
        animateTarget($newTarget);
    }

    function animateTarget($target) {
        function move() {
            const newLeft = Math.random() * (gameWidth - 100);
            const newTop = Math.random() * (gameHeight - 100);

            $target.animate({
                left: newLeft,
                top: newTop
            }, 1000, move);
        }

        move();
    }

    function shoot(event) {
        const bulletX = event.changedTouches[0].pageX - 5;
        const bulletY = event.changedTouches[0].pageY - 5;
        $bullet.css({
            left: bulletX,
            top: bulletY,
            display: 'block'
        }).fadeOut(500, function() {
            $bullet.hide();
        });

        $('.target').each(function() {
            const $target = $(this);
            const targetX = $target.offset().left;
            const targetY = $target.offset().top;

            if (bulletX >= targetX && bulletX <= targetX + 100 && bulletY >= targetY && bulletY <= targetY + 100) {
                score++;
                $score.text('Score: ' + score);
                $target.stop(true).fadeOut(100, function() {
                    $target.remove();
                    createTarget();
                });
            }
        });
    }

    function startTimer() {
        timeLeft = 20;
        $timer.text('Time: ' + timeLeft);
        timerInterval = setInterval(function() {
            timeLeft--;
            $timer.text('Time: ' + timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        $finalScore.text('Your final score is: ' + score);
        $modal.show();
        $('.target').remove();
        $bullet.hide();
    }

    function restartGame() {
        score = 0;
        $score.text('Scoore: ' + score);
        clearInterval(timerInterval);
        startTimer();
        $('.target').remove();  // Clear existing targets before creating new ones
        createTarget();
        $modal.hide();
    }

    $('#reset-btn').on('click', restartGame);
    $('#restart-btn-modal').on('click', restartGame);
    $(document).addEventListener('touchstart', shoot);
    restartGame(); // Start the game immediately when the page loads

    // Close the modal when the close button is clicked
    $('.close-btn').on('click', function() {
        $modal.hide();
    });

    // Close the modal when clicking outside of the modal content
    $(window).on('click', function(event) {
        if ($(event.target).is($modal)) {
            $modal.hide();
        }
    });
});
