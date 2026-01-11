// Service Worker for Chicken Delivery App
// Temporarily disabled to fix CSS loading issues

const CACHE_NAME = 'chicken-delivery-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/bundle.js',
  '/images/logo.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png'
];

// Skip installing this service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Disabled for CSS loading issues');
  // Skip waiting to prevent caching issues
  event.waitUntil(self.skipWaiting());
});

// Don't intercept fetch events to prevent CSS loading issues
self.addEventListener('fetch', (event) => {
  // Allow all requests to go through normally
  return;
});

// Activate and claim clients immediately
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Deactivated');
  event.waitUntil(self.clients.claim());
});
