import 'styled-components/native';
import type {ThemeColors} from '@/util/themeColors';

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeColors {}
}

