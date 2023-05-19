import Colors from '../../layout/theme/utils/colors';

type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase' | 'initial' | 'inherit';

const commonStyles = {
  height: '36px',
  textTransform: 'capitalize' as TextTransform,
  borderRadius: '100px',
};
const styles = {
  cancelStyle: {
    ...commonStyles,
    width: '83px',
    background: Colors.sky_blue,
    color: Colors.navy,
    border: `1px solid ${Colors.sky_blue}`,
  },
  submitStyle: {
    ...commonStyles,
    width: '66px',
    background: Colors.navy,
    color: Colors.white,
    border: `1px solid ${Colors.navy}`,
  },
};

export default styles;
