import { useTheme } from '@emotion/react';
import React from 'react';

export default function TransparentHeader() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const backColor = isDark ? '0,0,0' : '255,255,255';
  const textColor = isDark ? 'white' : 'dark';

  return (
    <style>
      {`header {
        background: rgba(${backColor}, 0.40) !important;
        border-bottom-color: rgba(${backColor},0.45) !important;
        color: ${textColor} !important;
        font-weight: bold;
        backdrop-filter: blur(15px);
    }

    header .MuiChip-label  {
        color: ${textColor} !important;
    }

    header .MuiButtonBase-root, header .MuiChip-colorDefault  {
        color: ${textColor} !important;
        background: rgba(${backColor},0.5) !important;
    }

    .app {
        backdrop-filter: blur(15px);
        transition: background 0.1s ease-in-out;
        transition: transform 0.1s ease-in-out;
    }
    
    .app-hover:hover {
        cursor: pointer;
        background: rgba(${backColor},0.8) !important;
        transform: scale(1.05);
    }

    .MuiAlert-standard {
        backdrop-filter: blur(15px);
        background: rgba(${backColor},0.40) !important;
        color: ${textColor} !important;
        font-weight: bold;
    }

`}
    </style>
  );
}
