import React, { Component } from 'react'
import ReactHowler from 'react-howler'

import soundAnswer1 from "../sounds/answer1.flac";
import soundAnswer2 from "../sounds/answer2.flac";
import soundAnswer3 from "../sounds/answer3.flac";
import soundAnswer4 from "../sounds/answer4.flac";
import soundBackground from "../sounds/background.flac";
import soundPointer from "../sounds/pointer.flac";

const answerSounds = [soundAnswer1, soundAnswer2, soundAnswer3, soundAnswer4];
const volume = 1;
const fadeDuration = 1;
 
class AudioPlayer extends Component {
  PlayAudio(){
    this.player.playing = true;
    this.player.howler.fade(this.player.volume, volume, fadeDuration);
  }

  StopAudio(){
    this.player.howler.fade(this.player.volume, 0, fadeDuration);
    this.player.playing = false;
  }
  
  // This sound file may not work due to cross-origin setting
  render () {
    return (
      <ReactHowler
        src={soundPointer}
        playing={true}
        loop={true}
        volume={volume}

      />
    )
  }
}

export default AudioPlayer;