import { Button, styled } from '@mui/material';

/**
 * A customized MUI Button component with a solid background color.
 * This component styles a MUI Button to have a solid background color based on the specified color
 * or the 'primary' color by default.
 *
 * @component
 * @param {object} props - The component's properties.
 * @param {string} [props.color='primary'] - The color to use for the button background. Should be
 * a valid color key from the MUI theme's palette.
 * @returns {React.Element} A styled MUI Button component.
 *
 * @example
 * // Usage of SolidButton component with a custom color:
 * <SolidButton color="secondary">Click Me</SolidButton>
 *
 * @example
 * // Usage of SolidButton component with the default 'primary' color:
 * <SolidButton>Click Me</SolidButton>
 */
const SolidButton = styled(Button)(({ theme, color = 'primary' }) => ({
  '&.MuiButton-contained': {
    backgroundColor: theme.palette[color].main,
  },
  ':hover': {
    backgroundColor: theme.palette[color].dark,
  },
}));

export default SolidButton;
