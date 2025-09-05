// Cache clearing script for ESCOM Citizen Scientist App
console.log('🧹 Clearing application cache...');

// Clear all caches
if ('caches' in window) {
  caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
      console.log('🗑️ Deleting cache:', cacheName);
      caches.delete(cacheName);
    });
    console.log('✅ All caches cleared');
  });
}

// Clear localStorage
localStorage.clear();
console.log('✅ localStorage cleared');

// Clear sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage cleared');

// Force reload
console.log('🔄 Reloading page...');
window.location.reload(true);
