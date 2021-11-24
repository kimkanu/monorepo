import React from 'react';
import { Helmet } from 'react-helmet';

import { Theme } from '../../types/theme';

const manifest = {
  short_name: 'Blearn!',
  name: 'Blearn!',
  start_url: '.',
  display: 'standalone',
  background_color: '#ffffff',
};

const DynamicManifest: React.FC<{ theme: Theme }> = ({ theme }) => {
  const createManifestURL = () => {
    const dynamicManifest = {
      ...manifest,
      icons: [
        {
          src: 'favicon.ico',
          sizes: '64x64 32x32 24x24 16x16',
          type: 'image/x-icon',
        },
        {
          src: 'favicon-16x16.png',
          type: 'image/png',
          sizes: '16x16',
        },
        {
          src: 'favicon-32x32.png',
          type: 'image/png',
          sizes: '32x32',
        },
        {
          src: ['violet', 'pink'].includes(theme) ? 'logo192.png' : 'logo192-alt.png',
          type: 'image/png',
          sizes: '192x192',
        },
        {
          src: ['violet', 'pink'].includes(theme) ? 'logo512.png' : 'logo512-alt.png',
          type: 'image/png',
          sizes: '512x512',
        },
      ],
      theme_color: {
        violet: '#9154f5',
        pink: '#ff6492',
        green: '#18b268',
        blue: '#4e74fc',
      }[theme],
    };
    const stringManifest = JSON.stringify(dynamicManifest);
    const blob = new Blob([stringManifest], { type: 'application/json' });
    return URL.createObjectURL(blob);
  };
  const [manifestURL, setManifestURL] = React.useState<string>(createManifestURL);

  React.useEffect(() => {
    setManifestURL(createManifestURL());
  }, [theme]);

  return (
    <Helmet>
      <link rel="manifest" href={manifestURL} />
    </Helmet>
  );
};

export default DynamicManifest;
