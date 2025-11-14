import React from 'react';
import {
  AntDesign,
  type AntDesignIconName,
} from '@react-native-vector-icons/ant-design';
import type {TextStyle} from 'react-native';

/**
 * Props for Icon component
 */
export interface IconProps {
  /** Icon name from AntDesign icon set */
  name: AntDesignIconName;
  /** Icon size (default: 24) */
  size?: number;
  /** Icon color */
  color?: string;
  /** Additional style */
  style?: TextStyle;
}

/**
 * Icon component using AntDesign icons from react-native-vector-icons
 *
 * @example
 * ```tsx
 * <Icon name="home" size={24} color="#007AFF" />
 * <Icon name="user" size={30} color={theme.text} />
 * ```
 */
export const Icon: React.FC<IconProps> = ({name, size = 24, color, style}) => {
  return <AntDesign name={name} size={size} color={color} style={style} />;
};

export default Icon;
