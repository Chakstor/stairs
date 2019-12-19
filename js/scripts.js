window.onload = () => {
    let button = document.getElementById('start');

    button.addEventListener('click', (e) => {
        const game = new Game();
              game.init();

        button.style.display = "none";
    });
}

