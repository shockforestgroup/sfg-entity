import soundAnswer1 from "./answer1.flac";
import soundAnswer2 from "./answer2.flac";
import soundAnswer3 from "./answer3.flac";
import soundAnswer4 from "./answer4.flac";
import soundBackground from "./background.flac";
import soundPointer from "./pointer.flac";

import {Howl, Howler} from 'howler'; 

const answerSounds = [soundAnswer1, soundAnswer2, soundAnswer3, soundAnswer4];

class SoundMaker {
  constructor() {
    this.pointerSoundAudio = new Howl({
      src: soundPointer,
      loop: true,
      volume: 0.15
    })
    this.backgroundSound = new Howl({
      src: soundBackground,
      loop: true,
      autoplay: true
    })
    // this.answerSounds = answerSounds.map((sound) => new Audio(sound));
  }
  playAnswerSound(answerID) {
    // const audio = this.answerSounds[answerID % this.answerSounds.length];
    // audio.play();
  }
  playPointerSound() {
    this.pointerSoundAudio.play();
  }
  stopPointerSound() {
    this.pointerSoundAudio.pause();
  }
  playBackgroundSound() {
    this.backgroundSound.play();
  }
}

export default new SoundMaker();
