class soundPlayer {

    play(sound, shouldLoop = false) {
        if (!sound.ended)
            sound.currentTime = 0;

        sound.loop = shouldLoop;
        sound.play();
    }

    stop(sound) {
        sound.loop = false;
        sound.pause();
        sound.currentTime = 0;
    }

    isPlaying(sound) {
        return !sound.ended ? true : false;
    }
}