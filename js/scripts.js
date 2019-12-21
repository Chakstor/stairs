window.onload = () => {
    let button = document.getElementById('start-btn');

    button.addEventListener('click', (e) => {
        let game = new Game();
            game.init();

        document.querySelector('.game-instructions').style.display = "none";
    });
}

function retry() {
    let canvasElement = document.getElementById('stairs');
    document.querySelector('.game-container').removeChild(canvasElement);

    let canvas = document.createElement('canvas');
        canvas.id = 'stairs';
        canvas.width = "900";
        canvas.height = "800";

    document.querySelector('.game-container').appendChild(canvas);

    game = new Game();
    game.init();
}