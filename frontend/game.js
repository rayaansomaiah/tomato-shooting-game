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

    function loadLeaderboard() {
    fetch('/api/scores')
        .then(res => res.json())
        .then(scores => {
            const $scoreList = $('#scoreList');
            $scoreList.empty();
            scores.forEach(score => {
                $scoreList.append(`<li>Score: ${score.value}</li>`);
            });
            $('#leaderboard').show();
        })
        .catch(err => {
            console.error("Failed to load leaderboard:", err);
        });
}

    function createTarget() {
        const $newTarget = $('<div class="target"></div>');
        const newLeft = Math.random() * (gameWidth - 100);
        const newTop = Math.random() * (gameHeight - 100);
        $('body').css('background-color',"#10bce2");
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
        if (currentTime - lastShotTime < 60) return; //debounce time of 60ms
        lastShotTime = currentTime;

        event.preventDefault(); // Prevents the default action like scrolling

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
                $('body').css('background-color',"#000000")
                $target.stop(true).fadeOut(70, function() {               
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

    // Save score to backend and show leaderboard
    fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: score })
    })
    .then(() => {
        loadLeaderboard();
    })
    .catch(err => console.error("Error saving score:", err));
}


    function restartGame() {
    score = 0;
    $score.text('Score: ' + score);
    clearInterval(timerInterval);
    startTimer();
    $('.target').remove();
    createTarget();
    $modal.hide();
    $('#leaderboard').hide();
}


    $('#reset-btn').on('click', restartGame);
    $('#restart-btn-modal').on('click', restartGame);

    // we put both click and touchstart events
    $(document).on('click touchstart', shoot);

    restartGame(); // Start the game immediately when the page loads

    // Close the modal when the close button is clicked
    $('.close-btn').on('click',function(){
        $modal.hide();
    });
});
