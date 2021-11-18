declare module '@wmik/use-media-recorder' {
  interface UseMediaRecorderOptions {
    blobOptions?: BlobPropertyBag;
    recordScreen?: boolean;
    onStart?: () => void;
    onStop?: (blob: Blob) => void;
    onError?: (error: Error) => void;
    onDataAvailable?: (data: Blob) => void;
    mediaRecorderOptions?: MediaRecorderOptions;
    mediaStreamConstraints: MediaStreamConstraints;
  }

  interface MediaRecorderHookOptions {
    error?: Error;
    status: 'idle' | 'acquiring_media' | 'ready' | 'recording' | 'paused' | 'stopping' | 'stopped' | 'failed';
    mediaBlob: Blob;
    isAudioMuted: boolean;
    stopRecording: () => void;
    getMediaStream: () => void;
    clearMediaStream: () => void;
    startRecording: (timeSlice?: number) => void;
    pauseRecording: () => void;
    resumeRecording: () => void;
    muteAudio: () => void;
    unMuteAudio: () => void;
    liveStream: MediaStream;
  }

  export default function useMediaRecorder(
    options: UseMediaRecorderOptions
  ): MediaRecorderHookOptions;
}
