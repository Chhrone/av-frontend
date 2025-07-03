// src/utils/appHelpers.js

// Helper: Map kebab-case route to categoryId used in model
export const categoryRouteMap = {
  // Old routes (kept for backward compatibility)
  'peta-vokal-amerika': 'pronunciation',
  'irama-dan-penekanan': 'pronunciation',
  'gugus-konsonan': 'pronunciation',
  'membaca-paragraf': 'pronunciation',
  'latihan-intensif': 'pronunciation',
  
  // New category routes
  'inventaris-vokal': 'vokal',
  'inventaris-konsonan': 'konsonan',
  'struktur-suku-kata': 'suku-kata',
  'penekanan-kata': 'penekanan',
  'irama-bahasa': 'irama',
  'skenario-dunia-nyata': 'skenario'
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
