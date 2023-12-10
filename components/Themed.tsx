import {
  Text as DefaultText,
  View as DefaultView
} from 'react-native';
import Colors from '../constants/Colors';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];


export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = Colors.black;

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

