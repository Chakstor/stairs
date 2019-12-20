window.onload = () => {
    let button = document.getElementById('start-btn');

    button.addEventListener('click', (e) => {
        const game = new Game();
              game.init();

        document.querySelector('.game-instructions').style.display = "none";
    });
}

