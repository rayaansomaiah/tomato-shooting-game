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
    let lastShotTime = 0;

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
        const currentTime = new Date().getTime();
        if (currentTime - lastShotTime < 300) return; // Debounce time of 300ms
        lastShotTime = currentTime;

        event.preventDefault(); // Prevent the default action (e.g., scrolling) for touch events

        let bulletX, bulletY;

        if (event.type === 'touchstart') {
            bulletX = event.touches[0].pageX - 5;
            bulletY = event.touches[0].pageY - 5;
        } else {
            bulletX = event.pageX - 5;
            bulletY = event.pageY - 5;
        }

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
        $score.text('Score: ' + score);
        clearInterval(timerInterval);
        startTimer();
        $('.target').remove();  // Clear existing targets before creating new ones
        createTarget();
        $modal.hide();
    }

    $('#reset-btn').on('click', restartGame);
    $('#restart-btn-modal').on('click', restartGame);

    // Bind both click and touchstart events
    $(document).on('click touchstart', shoot);

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
