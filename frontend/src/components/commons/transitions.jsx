import { Slide } from '@mui/material';
import React, { forwardRef } from 'react';

export const SlideTransition = (direction) => {
  forwardRef((props, ref) => <Slide direction={direction} ref={ref} {...props} />);
};
