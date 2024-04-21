import React from 'react';
import { Alert } from '@mui/material';

export default function AlertNotification({ severity, message, additionalComponent }) {
  return (
    <Alert severity={severity}>
      {message}
      {additionalComponent}
    </Alert>
  );
}
