// utils/appEvents.js
// Setup event global dan cleanup
import RecordingManager from './RecordingManager.js';

export function setupGlobalCleanup() {
  window.addEventListener('beforeunload', () => {
    RecordingManager.forceStop();
  });
  window.addEventListener('pagehide', () => {
    RecordingManager.forceStop();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      RecordingManager.forceStop();
    }
  });
}
