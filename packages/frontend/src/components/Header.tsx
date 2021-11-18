import React, { CSSProperties, PropsWithChildren, useEffect, useRef, useState } from 'react';
import language from '../assets/language.png';
import notification from '../assets/notification.png';
import profile from '../assets/profile.png';

const Header: React.FC = ({ children }) => {
    const [offset, setOffset] = useState<number | undefined>(undefined);
    const [height, setHeight] = useState<number>(0);
    const [style, setStyle] = useState<CSSProperties>({});
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (elementRef.current) {
            const boundingRect = elementRef.current.getBoundingClientRect();
            if (!offset) {
                setOffset(boundingRect.y);
            }

            if (height !== boundingRect.height) {
                setHeight(boundingRect.height);
            }
        }
    });

    useEffect(() => {
        if (offset) {
            setStyle({ position: 'fixed', top: offset, zIndex: 99 });
        }
    }, [offset]);

    return (
        <>
            <div ref={elementRef} style={style}>
                <div
                    className="w-full h-64 sm:flex items-center content-center justify-end shadow-class"
                    style={{ height: 'calc(env(safe-area-inset-top, 0px) + 64px)' }}
                >
                    <button type="button" className="w-7 h-7 mx-2 rounded-full hover:shadow-class items-center justify-center">
                        <img src={language} alt="language" />
                    </button>
                    <button type="button" className="w-7 h-7 mx-2 rounded-full items-center justify-center">
                        <img src={notification} alt="notification" />
                    </button>
                    <button type="button" className="w-9 h-9 ml-2 mr-5 px-2 py-2 bg-gray-400 rounded-full items-center content-center justify-center">
                        <img src={profile} alt="profile" style={{ height: "20px", width: "20px" }}/>
                    </button>
                </div>
                {children}
            </div>
            <div style={{ visibility: 'hidden', height }} />
        </>
    );
}

export default Header;
