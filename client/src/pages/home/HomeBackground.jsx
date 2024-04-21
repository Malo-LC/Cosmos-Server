import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import React from 'react';
import * as API from '../../api';
import wallpaper from '../../assets/images/wallpaper2.jpg';
import wallpaperLight from '../../assets/images/wallpaper2_light.jpg';

export default function HomeBackground() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const customPaper = API.HOME_BACKGROUND;
  return (
    <Box
      sx={{
        position: 'fixed',
        float: 'left',
        overflow: 'hidden',
        zIndex: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundImage: customPaper ? `url(${customPaper})` : isDark ? `url(${wallpaper})` : `url(${wallpaperLight})`
      }}></Box>
  );
}
