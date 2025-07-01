// src/utils/appHelpers.js

// Helper: Map kebab-case route to categoryId used in model
export const categoryRouteMap = {
  'peta-vokal-amerika': 'pronunciation',
  'irama-dan-penekanan': 'pronunciation',
  'gugus-konsonan': 'pronunciation',
  'membaca-paragraf': 'pronunciation',
  'skenario-dunia-nyata': 'pronunciation',
  'latihan-intensif': 'pronunciation',
  // Tambahkan mapping lain jika ada kategori baru
};

// Helper to scroll to top
export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

// Helper to check intro completion
export function hasCompletedIntro() {
  return localStorage.getItem('hasCompletedIntro') === 'true';
}

// Helper to set intro completion
export function setCompletedIntro() {
  localStorage.setItem('hasCompletedIntro', 'true');
}
