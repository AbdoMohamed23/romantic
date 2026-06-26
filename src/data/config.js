export const config = {
  music: {
    storageKey: 'romantic-site-music-playing',
    pendingStartKey: 'romantic-site-music-pending',
  },
  auth: {
    storageKey: 'romantic-site-authenticated',
    adminStorageKey: 'romantic-site-admin',
    skipIntroKey: 'romantic-site-skip-intro',
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
    },
    loginReveal: {
      burstDuration: 2.8,
      coverDuration: 0.5,
      welcomeFadeDuration: 2,
      exitDuration: 1.8,
      heartCount: 220,
      mobileHeartCount: 155,
    },
    text: {
      wordDelay: 140,
      celebrationDuration: 4,
    },
  },
  hearts: {
    count: 65,
    mobileRatio: 0.85,
    rgb: '251, 113, 133',
    opacityMin: 0.38,
    opacityMax: 0.82,
  },
}
