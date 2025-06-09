import { writable } from 'svelte/store';

export const currentRoute = writable('overview');

const routes = {
  '': 'overview',
  'overview': 'overview',
  'temporal': 'temporal',
  'map': 'map',
  'profile': 'profile'
};

export function navigateTo(route) {
  window.location.hash = route;
}

function getRouteFromHash() {
  const hash = window.location.hash.slice(1); 
  return routes[hash] || 'overview'; 
}

export function initRouter() {
  currentRoute.set(getRouteFromHash());
  
  window.addEventListener('hashchange', () => {
    const route = getRouteFromHash();
    currentRoute.set(route);
  });
  
  if (!window.location.hash) {
    window.location.hash = 'overview';
  }
}