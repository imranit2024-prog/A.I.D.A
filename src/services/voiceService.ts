import { AIModel } from '../types';

export interface VoiceServiceCallbacks {
  onListeningStart?: () => void;
  onListeningEnd?: () => void;
  onSpeechResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
  onAudioFrequencyUpdate?: (frequencyData: Uint8Array, averageVolume: number) => void;
}

class VoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private synthUtterance: SpeechSynthesisUtterance | null = null;
  private callbacks: VoiceServiceCallbacks = {};
  private silenceTimer: any = null;
  private synthOscillator: OscillatorNode | null = null;
  private synthGain: GainNode | null = null;
  private currentLang: string = 'en-US';

  constructor() {
    this.initSpeechRecognition();
  }

  public setLanguage(lang: string) {
    this.currentLang = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public setCallbacks(callbacks: VoiceServiceCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  private initSpeechRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API is not natively supported in this browser.');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onListeningStart?.();
        this.startAudioAnalysis();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        if (text) {
          this.callbacks.onSpeechResult?.(text, Boolean(finalTranscript));
          this.resetSilenceTimer();
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          this.callbacks.onError?.('Microphone access was denied. Please check your browser permissions.');
        } else if (event.error !== 'no-speech') {
          this.callbacks.onError?.(`Speech input error: ${event.error}`);
        }
        this.stopListening();
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          this.stopListening();
        }
      };
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
    }
  }

  private resetSilenceTimer() {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    // After 2.5 seconds of silence, stop listening and trigger final submission
    this.silenceTimer = setTimeout(() => {
      if (this.isListening) {
        this.stopListening();
      }
    }, 2800);
  }

  public async startListening() {
    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    if (!this.recognition) {
      this.callbacks.onError?.('Speech recognition is not supported in this browser. Please use text chat.');
      return;
    }

    try {
      this.recognition.start();
    } catch (err) {
      // If already started, ignore or restart
      try {
        this.recognition.stop();
        setTimeout(() => this.recognition?.start(), 150);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    try {
      this.recognition?.stop();
    } catch (e) {
      // ignore
    }
    this.callbacks.onListeningEnd?.();
    this.stopAudioAnalysis();
  }

  public toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  private async startAudioAnalysis() {
    try {
      const ctx = this.getAudioContext();
      if (!this.analyser) {
        this.analyser = ctx.createAnalyser();
        this.analyser.fftSize = 64;
      }

      if (navigator.mediaDevices?.getUserMedia) {
        this.microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.micSource = ctx.createMediaStreamSource(this.microphoneStream);
        this.micSource.connect(this.analyser);
      }

      this.runAudioAnalysisLoop();
    } catch (err) {
      console.warn('Audio analysis setup fallback to simulated wave:', err);
      this.runSimulatedAudioLoop();
    }
  }

  private stopAudioAnalysis() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach((track) => track.stop());
      this.microphoneStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
    // zero out frequency
    this.callbacks.onAudioFrequencyUpdate?.(new Uint8Array(32), 0);
  }

  private runAudioAnalysisLoop = () => {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    const average = sum / bufferLength;

    this.callbacks.onAudioFrequencyUpdate?.(dataArray, average);

    if (this.isListening || this.isSpeaking) {
      this.animationFrameId = requestAnimationFrame(this.runAudioAnalysisLoop);
    }
  };

  private runSimulatedAudioLoop = () => {
    const dataArray = new Uint8Array(32);
    let time = 0;

    const loop = () => {
      time += 0.15;
      let sum = 0;
      for (let i = 0; i < 32; i++) {
        const val = Math.floor(Math.sin(time + i * 0.3) * 60 + Math.random() * 80 + 70);
        dataArray[i] = Math.max(0, Math.min(255, val));
        sum += dataArray[i];
      }
      const avg = sum / 32;
      this.callbacks.onAudioFrequencyUpdate?.(dataArray, avg);

      if (this.isListening || this.isSpeaking) {
        this.animationFrameId = requestAnimationFrame(loop);
      }
    };
    this.animationFrameId = requestAnimationFrame(loop);
  };

  public speak(text: string, model: AIModel, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      onEnd?.();
      return;
    }

    this.stopSpeaking();

    // Clean markdown symbols for cleaner speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[#*_~>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    const isBengali = /[\u0980-\u09FF]/.test(cleanText);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = model.voiceConfig.pitch;
    utterance.rate = model.voiceConfig.rate;
    utterance.lang = isBengali ? 'bn-BD' : (this.currentLang || model.voiceConfig.lang || 'en-US');

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const match = voices.find((v) =>
        isBengali
          ? v.lang.includes('bn') || v.name.toLowerCase().includes('bengali') || v.name.toLowerCase().includes('bangla')
          : model.voiceConfig.preferredVoiceNames.some((name) =>
              v.name.toLowerCase().includes(name.toLowerCase())
            )
      );
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.callbacks.onSpeakingStart?.();
      this.runSimulatedSpeakingVisemes();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.callbacks.onSpeakingEnd?.();
      this.stopAudioAnalysis();
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isSpeaking = false;
      this.callbacks.onSpeakingEnd?.();
      this.stopAudioAnalysis();
      onEnd?.();
    };

    this.synthUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  private runSimulatedSpeakingVisemes() {
    const dataArray = new Uint8Array(32);
    let time = 0;

    const loop = () => {
      time += 0.2;
      // Speech modulation envelope
      const cadence = Math.sin(time * 3.5) * 0.5 + 0.5;
      let sum = 0;

      for (let i = 0; i < 32; i++) {
        // Speech formants concentrated in lower-mid frequencies (bins 2-14)
        const formantWeight = i >= 2 && i <= 14 ? 1.5 : 0.4;
        const val = Math.floor(
          (Math.sin(time * 6 + i) * 70 + Math.random() * 50 + 90) * cadence * formantWeight
        );
        dataArray[i] = Math.max(10, Math.min(255, val));
        sum += dataArray[i];
      }

      const avg = sum / 32;
      this.callbacks.onAudioFrequencyUpdate?.(dataArray, avg);

      if (this.isSpeaking) {
        this.animationFrameId = requestAnimationFrame(loop);
      }
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stopSpeaking() {
    this.isSpeaking = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.synthUtterance = null;
    this.stopAudioAnalysis();
    this.callbacks.onSpeakingEnd?.();
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const voiceService = new VoiceService();
