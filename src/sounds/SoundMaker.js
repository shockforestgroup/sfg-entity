import soundAnswer1 from "./answer1.flac";
import soundAnswer2 from "./answer2.flac";
import soundAnswer3 from "./answer3.flac";
import soundAnswer4 from "./answer4.flac";
import soundBackground from "./background.flac";
import soundPointer from "./pointer.flac";

import {Howl, Howler} from 'howler'; 

const answerSounds = [soundAnswer1, soundAnswer2, soundAnswer3, soundAnswer4];
const volumePointer = 0.15;
const fadeDuration = 300;

class SoundMaker {
  constructor() {
    this.pointerSoundAudio = new Howl({
      src: soundPointer,
      loop: true,
      volume: volumePointer
    })
    this.backgroundSound = new Howl({
      src: soundBackground,
      loop: true,
    })
    // this.answerSounds = answerSounds.map((sound) => new Audio(sound));
  }
  playAnswerSound(answerID) {
    // const audio = this.answerSounds[answerID % this.answerSounds.length];
    // audio.play();
  }
  playPointerSound() {
    this.pointerSoundAudio.play();
    this.pointerSoundAudio.fade(0, volumePointer, fadeDuration);
  }
  stopPointerSound() {
    this.pointerSoundAudio.once( 'fade', () => { this.pointerSoundAudio.stop(); });
    this.pointerSoundAudio.fade(volumePointer, 0, fadeDuration);
  }
  playBackgroundSound() {
    this.backgroundSound.play();
    this.backgroundSound.fade(0, 1, fadeDuration);
  }
}

export default new SoundMaker();
