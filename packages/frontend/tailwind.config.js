/* eslint-disable import/no-extraneous-dependencies, global-require, sort-keys */
module.exports = {
  purge: ['./src/**/*.{ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      zIndex: {
        layout: 60,
        dialog: 70,
        'dialog-important': 80,
        toast: 90,
        'toast-important': 100,
        debug: 110,
        'debug-important': 120,
      },
      screens: {
        desktop: {
          raw: '(min-width: 1024px) and (min-height: 576px)',
        },
        'mobile-port': {
          raw: '(max-aspect-ratio: 5/6) and (max-width: 1023px), (max-aspect-ratio: 5/6) and (max-height: 575px)',
        },
        'mobile-land': {
          raw: '(min-aspect-ratio: 5/6) and (max-width: 1023px), (max-aspect-ratio: 5/6) and (max-height: 575px)',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};
