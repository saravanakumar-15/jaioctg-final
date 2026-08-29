// Scroll position cache keyed by unique history state key
const scrollPositions = new Map<string, { x: number; y: number }>();

// Helper to generate unique history entry keys
function generateHistoryKey(): string {
  return 'jai_nav_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

export type AppView = 'landing' | 'about' | 'services' | 'quote' | 'contact';

export const VIEW_TO_PATH: Record<AppView, string> = {
  landing: '/',
  about: '/about',
  services: '/services',
  quote: '/quote',
  contact: '/contact'
};

export const PATH_TO_VIEW: Record<string, AppView> = {
  '/': 'landing',
  '/home': 'landing',
  '/landing': 'landing',
  '/about': 'about',
  '/about-us': 'about',
  '/services': 'services',
  '/inspection-services': 'services',
  '/standards': 'services',
  '/quality-standards': 'services',
  '/quote': 'quote',
  '/quotation': 'quote',
  '/request-quote': 'quote',
  '/contact': 'contact',
  '/contact-us': 'contact'
};

export function getInitialView(): { view: AppView; hash: string } {
  if (typeof window === 'undefined') {
    return { view: 'landing', hash: '' };
  }

  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash;

  // Check direct path mapping
  if (PATH_TO_VIEW[pathname]) {
    return { view: PATH_TO_VIEW[pathname], hash };
  }

  // Check if hash matches a view name
  if (hash) {
    const cleanHash = hash.replace('#', '').toLowerCase();
    if (PATH_TO_VIEW['/' + cleanHash]) {
      return { view: PATH_TO_VIEW['/' + cleanHash], hash };
    }
  }

  return { view: 'landing', hash };
}

export interface NavigationState {
  key: string;
  view: AppView;
  scrollX: number;
  scrollY: number;
  hash?: string;
}

let isInitialized = false;

export function initScrollRestoration(
  onViewChange: (view: AppView, targetScroll?: { x: number; y: number; hash?: string }) => void
) {
  if (typeof window === 'undefined') return;

  // Disable default browser scroll restoration so we have deterministic control
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  // Initial state setup
  const initial = getInitialView();
  let currentKey = window.history.state?.key;

  if (!currentKey) {
    currentKey = generateHistoryKey();
    const initialState: NavigationState = {
      key: currentKey,
      view: initial.view,
      scrollX: window.scrollX || 0,
      scrollY: window.scrollY || 0,
      hash: initial.hash
    };
    const targetUrl = VIEW_TO_PATH[initial.view] + (initial.hash || '');
    window.history.replaceState(initialState, '', targetUrl);
  }

  // Save current scroll position on scroll (debounced / throttled)
  let scrollTimeout: any = null;
  const handleScroll = () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const state = window.history.state;
      if (state && state.key) {
        const x = window.scrollX || 0;
        const y = window.scrollY || 0;
        scrollPositions.set(state.key, { x, y });
        // Update history state silently
        window.history.replaceState({ ...state, scrollX: x, scrollY: y }, '', window.location.href);
      }
    }, 50);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Handle browser Back / Forward (popstate)
  const handlePopState = (event: PopStateEvent) => {
    const state = event.state as NavigationState | null;
    let targetView: AppView = 'landing';
    let targetScroll: { x: number; y: number; hash?: string } | undefined;

    if (state && state.view) {
      targetView = state.view;
      const cached = scrollPositions.get(state.key);
      const x = cached ? cached.x : (state.scrollX || 0);
      const y = cached ? cached.y : (state.scrollY || 0);
      targetScroll = { x, y, hash: state.hash || window.location.hash };
    } else {
      const parsed = getInitialView();
      targetView = parsed.view;
      targetScroll = { x: 0, y: 0, hash: parsed.hash };
    }

    onViewChange(targetView, targetScroll);
  };

  window.addEventListener('popstate', handlePopState);

  isInitialized = true;

  return () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('popstate', handlePopState);
  };
}

/**
 * Navigate to a new view programmatically.
 * Pushes a new browser history entry and sets scroll position to top (or target anchor).
 */
export function navigateTo(
  targetView: string,
  options?: { hash?: string; replace?: boolean; noScroll?: boolean }
) {
  if (typeof window === 'undefined') return;

  // Normalize view name
  let view: AppView = 'landing';
  const cleanTarget = targetView.toLowerCase().replace('/', '');
  if (cleanTarget === 'about' || cleanTarget === 'aboutpage') view = 'about';
  else if (cleanTarget === 'services' || cleanTarget === 'servicespage' || cleanTarget === 'standards' || cleanTarget === 'standardspage') view = 'services';
  else if (cleanTarget === 'quote' || cleanTarget === 'quotation' || cleanTarget === 'pricing') view = 'quote';
  else if (cleanTarget === 'contact' || cleanTarget === 'contactpage') view = 'contact';
  else view = 'landing';

  // 1. Save scroll position of current page before navigating away
  const currentState = window.history.state;
  if (currentState && currentState.key) {
    const currentX = window.scrollX || 0;
    const currentY = window.scrollY || 0;
    scrollPositions.set(currentState.key, { x: currentX, y: currentY });
    window.history.replaceState(
      { ...currentState, scrollX: currentX, scrollY: currentY },
      '',
      window.location.href
    );
  }

  // 2. Prepare new history entry
  const newKey = generateHistoryKey();
  const hash = options?.hash || '';
  const newState: NavigationState = {
    key: newKey,
    view,
    scrollX: 0,
    scrollY: 0,
    hash
  };

  const newUrl = VIEW_TO_PATH[view] + (hash ? (hash.startsWith('#') ? hash : '#' + hash) : '');

  if (options?.replace) {
    window.history.replaceState(newState, '', newUrl);
  } else {
    window.history.pushState(newState, '', newUrl);
  }

  // 3. Dispatch a custom navigation event so App can react immediately
  window.dispatchEvent(
    new CustomEvent('jai_navigate', {
      detail: {
        view,
        hash,
        noScroll: options?.noScroll,
        key: newKey
      }
    })
  );
}

/**
 * Robust scroll restoration function that accounts for DOM rendering timing.
 */
export function restoreScrollPosition(target: { x: number; y: number; hash?: string }) {
  if (typeof window === 'undefined') return;

  // If there's an anchor hash, attempt to scroll to element
  if (target.hash && target.hash !== '#') {
    const elementId = target.hash.replace('#', '');
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }

  const targetX = target.x || 0;
  const targetY = target.y || 0;

  // Use multi-frame restoration to handle async DOM mounts & layout adjustments
  requestAnimationFrame(() => {
    window.scrollTo({ left: targetX, top: targetY, behavior: 'instant' as ScrollBehavior });

    // Secondary verification frame for images / layout adjustments
    requestAnimationFrame(() => {
      if (Math.abs(window.scrollY - targetY) > 5) {
        window.scrollTo({ left: targetX, top: targetY, behavior: 'instant' as ScrollBehavior });
      }
    });
  });
}
