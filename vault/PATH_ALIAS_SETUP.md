# Path Alias Setup

Path aliases have been configured to use `@/` instead of relative paths like `../../`.

## Configuration

### 1. TypeScript (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 2. Babel (`babel.config.js`)
Added `babel-plugin-module-resolver` configuration:
```js
[
  'module-resolver',
  {
    root: ['./src'],
    extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
    alias: {
      '@': './src',
    },
  },
]
```

## Installation Required

You need to install `babel-plugin-module-resolver`:

```bash
npm install --save-dev babel-plugin-module-resolver
```

Or with yarn:
```bash
yarn add -D babel-plugin-module-resolver
```

## Usage

Instead of:
```tsx
import SafeAreaContainer from '../../components/SafeAreaContainer';
import useThemeStore from '../hooks/useThemeStore';
```

Use:
```tsx
import SafeAreaContainer from '@/components/SafeAreaContainer';
import useThemeStore from '@/hooks/useThemeStore';
```

## Benefits

- ✅ Cleaner imports
- ✅ No more `../../` path hell
- ✅ Easier refactoring
- ✅ Better IDE autocomplete
- ✅ Type-safe with TypeScript

## After Installation

1. Clear Metro bundler cache:
   ```bash
   npm start -- --reset-cache
   ```

2. Restart your development server

3. Rebuild your app if needed

