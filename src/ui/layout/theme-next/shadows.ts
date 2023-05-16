import { Shadows } from '@material-ui/core/styles/shadows';

const THEME_SHADOWS = {
  0: 'none',
  1: '0 4px 24px rgba(22, 34, 41, 0.06)',
  2: '0 10px 20px rgba(0, 0, 0, 0.1)',
  3: '0 0 40px rgba(0, 0, 0, 0.1)',
};

const shadows = (): Shadows => Array(25).fill(0).reduce(
  (list, value, index) => [...list, THEME_SHADOWS[index] ?? 'none'],
  []
);

export default shadows();
