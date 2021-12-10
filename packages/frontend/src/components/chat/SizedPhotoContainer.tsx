import { SpinnerIos20Regular } from '@fluentui/react-icons';
import React from 'react';

import { Styled, mergeStyles } from '../../utils/style';

interface Props {
  src: string;
  alt: string;
  size?: [number, number];
}

const SizedPhotoContainer: React.FC<Styled<Props>> = ({
  src, alt, size: initialSize, className, style,
}) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [size, setSize] = React.useState<[number, number] | null>(initialSize ?? null);

  React.useEffect(() => {
    setLoading(true);
    setSize(null);
    if (!src) return () => {};

    const poll = setInterval(() => {
      if (imgRef.current?.naturalWidth && imgRef.current?.naturalHeight) {
        clearInterval(poll);
        setSize([imgRef.current?.naturalWidth!, imgRef.current?.naturalHeight!]);
      }
    }, 10);

    if (imgRef.current) {
      imgRef.current.addEventListener('load', () => {
        setLoading(false);
      });
    }

    return () => {
      clearInterval(poll);
    };
  }, [src, imgRef.current]);

  React.useEffect(() => {
    setLoading(true);
    setSize(null);

    const poll = setInterval(() => {
      if (imgRef.current?.naturalWidth && imgRef.current?.naturalHeight) {
        clearInterval(poll);
        setSize([imgRef.current?.naturalWidth!, imgRef.current?.naturalHeight!]);
      }
    }, 10);
  }, [src, imgRef.current]);

  const getRealSize = ([width, height]: [number, number]) => ({
    width: `min(100%, ${(width / height) * 280}px)`,
  });

  return (
    <div
      ref={divRef}
      className={`relative ${className}`}
      style={mergeStyles(
        size ? { ...getRealSize(size), overflow: 'hidden' } : { width: '100%', height: 280, overflow: 'hidden' },
        loading ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : null,
        style,
      )}
    >
      {loading && (
        <div
          className="absolute w-5 h-5"
          style={{
            height: 20, top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          }}
        >
          <SpinnerIos20Regular
            className="animate-spin block"
          />
        </div>
      )}
      {!!src && (
        <img ref={imgRef} src={src} alt={alt} className="w-full h-full object-cover object-center" style={{ opacity: loading ? 0 : 1 }} />
      )}
    </div>
  );
};

export default SizedPhotoContainer;
