// utils/errorHandler.js
// Fungsi error handler terpusat

export function showError(message, title = 'Terjadi Kesalahan') {
  const errorMessage = message instanceof Error ? message.message : String(message);
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.error('App container not found');
    return;
  }
  try {
    appContainer.innerHTML = `
      <div class="error-container" style="text-align: center; padding: 2rem;">
        <h2>${title}</h2>
        <p>${errorMessage}</p>
        <button 
          onclick="window.history.back()" 
          class="error-button"
          style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;"
        >
          Kembali
        </button>
      </div>
    `;
  } catch (error) {
    console.error('Failed to render error:', error);
  }
  console.error('Application Error:', errorMessage);
}
