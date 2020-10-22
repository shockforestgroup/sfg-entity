import soundAnswer1 from "./answer1.mp3";
import soundAnswer2 from "./answer2.mp3";
import soundAnswer3 from "./answer3.mp3";
import soundAnswer4 from "./answer4.mp3";
import soundBackground from "./background.mp3";
import soundPointer from "./pointer.mp3";

const answerSounds = [soundAnswer1, soundAnswer2, soundAnswer3, soundAnswer4];

class SoundMaker {
  constructor() {
    this.pointerSoundAudio = new Audio(soundPointer);
    this.pointerSoundAudio.loop = true;
    this.backgroundSound = new Audio(soundBackground);
    this.backgroundSound.loop = true;
    this.answerSounds = answerSounds.map((sound) => new Audio(sound));
  }
  playAnswerSound(answerID) {
    const audio = this.answerSounds[answerID % this.answerSounds.length];
    audio.play();
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
