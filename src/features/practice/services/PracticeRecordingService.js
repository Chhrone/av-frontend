// Service untuk logika perekaman audio dan pengelolaan sesi rekaman
class PracticeRecordingService {
  constructor(recordingManager) {
    this.recordingManager = recordingManager;
    this.isRecording = false;
    this.recordingInterval = null;
    this.recordingStartTime = null;
    this.sessionRecordings = [];
    this.sessionScores = [];
    this.maxSession = 4;
    this.sessionLogs = [];
  }

  startRecordingTimer(setDurationCallback) {
    this.recordingStartTime = Date.now();
    setDurationCallback('00:00');
    this.recordingInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
      const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const sec = String(elapsed % 60).padStart(2, '0');
      setDurationCallback(`${min}:${sec}`);
    }, 500);
  }

  stopRecordingTimer(setDurationCallback) {
    if (this.recordingInterval) clearInterval(this.recordingInterval);
    setDurationCallback('00:00');
  }

  logSessionStart() {
    const sessionNumber = this.sessionRecordings.length + 1;
    const startLog = {
      session: sessionNumber,
      type: 'mulai',
      time: new Date().toLocaleString(),
    };
    this.sessionLogs.push(startLog);
    return startLog;
  }

  logSessionEnd() {
    const sessionNumber = this.sessionRecordings.length + 1;
    const endLog = {
      session: sessionNumber,
      type: 'berakhir',
      time: new Date().toLocaleString(),
    };
    this.sessionLogs.push(endLog);
    return endLog;
  }

  resetSession() {
    this.sessionRecordings = [];
    this.sessionScores = [];
  }
}

export default PracticeRecordingService;
