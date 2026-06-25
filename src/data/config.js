export const config = {
  music: {
    storageKey: 'romantic-site-music-playing',
    pendingStartKey: 'romantic-site-music-pending',
  },
  auth: {
    storageKey: 'romantic-site-authenticated',
    adminStorageKey: 'romantic-site-admin',
  },
  animations: {
    screen: {
      fadeOut: 400,
      fadeIn: 720,
      y: 12,
      easeOut: 'ease-in',
      easeIn: 'cubic-bezier(0.22, 1, 0.36, 1)',
    },
    reveal: {
      stagger: 80,
      duration: 500,
      y: 16,
      ease: [0.22, 1, 0.36, 1],
    },
    welcome: {
      holdDuration: 1.4,
      openDuration: 1.2,
      heartCount: 65,
    },
    text: {
      wordDelay: 140,
      celebrationDuration: 4,
    },
  },
}
