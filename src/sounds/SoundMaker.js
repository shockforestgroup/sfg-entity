//Using both webm and mp3 audioformats, since the combination of these gives highest browser support
//with lowest filesize (See: https://github.com/goldfire/howler.js#format-recommendations).
//Also webm can do gapless looping.

import soundAnswer1Webm from "./answer1.webm";
import soundAnswer2Webm from "./answer2.webm";
import soundAnswer3Webm from "./answer3.webm";
import soundAnswer4Webm from "./answer4.webm";
import soundAnswer1Mp3 from "./answer1.mp3";
import soundAnswer2Mp3 from "./answer2.mp3";
import soundAnswer3Mp3 from "./answer3.mp3";
import soundAnswer4Mp3 from "./answer4.mp3";
import soundBackgroundWebm from "./background.webm";
import soundPointerWebm from "./pointer.webm";
import soundBackgroundMp3 from "./background.mp3";
import soundPointerMp3 from "./pointer.mp3";

import { Howl } from "howler";

const answerSounds = [
  [soundAnswer1Webm, soundAnswer1Mp3],
  [soundAnswer2Webm, soundAnswer2Mp3],
  [soundAnswer3Webm, soundAnswer3Mp3],
  [soundAnswer4Webm, soundAnswer4Mp3],
];
const volumePointer = 0.15;
const fadeDuration = 300;

class SoundMaker {
  constructor() {
    this.pointerSoundAudio = new Howl({
      src: [soundPointerWebm, soundPointerMp3],
      loop: true,
      volume: volumePointer,
    });
    this.backgroundSound = new Howl({
      src: [soundBackgroundWebm, soundBackgroundMp3],
      loop: true,
    });
    this.answerSounds = answerSounds.map(
      (sound) =>
        new Howl({
          src: sound,
        })
    );
  }
  playAnswerSound(answerID) {
    const sound = this.answerSounds[answerID % this.answerSounds.length];
    sound.play();
  }
  playPointerSound() {
    this.pointerSoundAudio.play();
    this.pointerSoundAudio.fade(0, volumePointer, fadeDuration);
  }
  stopPointerSound() {
    this.pointerSoundAudio.once("fade", () => {
      this.pointerSoundAudio.stop();
    });
    this.pointerSoundAudio.fade(volumePointer, 0, fadeDuration);
  }
  playBackgroundSound() {
    this.backgroundSound.play();
    this.backgroundSound.fade(0, 1, fadeDuration);
  }
}

export default new SoundMaker();
