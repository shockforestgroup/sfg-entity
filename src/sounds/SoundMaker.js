import soundAnswer1 from "./answer1.mp3";
import soundAnswer2 from "./answer2.mp3";
import soundAnswer3 from "./answer3.mp3";
import soundAnswer4 from "./answer4.mp3";
import soundBackground from "./background.mp3";
import soundPointer from "./pointer.mp3";

const answerSounds = [soundAnswer1, soundAnswer2, soundAnswer3, soundAnswer4];

class SoundMaker {
  constructor() {
    this.pointerSoundAudio = null;
  }

  playAnswerSound(answerID) {
    const audio = new Audio(answerSounds[answerID % answerSounds.length]);
    audio.play();
  }
  playPointerSound() {
    this.pointerSoundAudio = new Audio(soundPointer);
    this.pointerSoundAudio.loop = true;
    this.pointerSoundAudio.play();
  }
  stopPointerSound() {
    this.pointerSoundAudio.pause();
  }
}

export default new SoundMaker();
