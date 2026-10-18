import winnieSong from '../assets/audio/winnie_song.mp3';

class MusicBox {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  constructor() {
    // Lazily initialized on interaction
  }

  private initAudio() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio(winnieSong);
      this.audio.loop = true;
      this.audio.volume = 0.5; // Cozy background volume
    }
  }

  public start() {
    if (this.isPlaying) return;
    this.initAudio();
    if (this.audio) {
      this.audio.play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch((err) => {
          console.error("Error playing audio:", err);
        });
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
  }

  public toggle() {
    this.initAudio();
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
      this.isPlaying = true;
    }
    return this.isPlaying;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const musicBox = new MusicBox();

