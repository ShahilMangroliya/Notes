module.exports = function (api) {
  api.cache(true);
  const plugins = [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
    'react-native-worklets/plugin',
  ];

  if (
    process.env.NODE_ENV === 'production' ||
    process.env.BABEL_ENV === 'production'
  ) {
    return {
      presets: ['module:@react-native/babel-preset'],
      plugins: ['transform-remove-console', ...plugins],
    };
  } else {
    return {
      presets: ['module:@react-native/babel-preset'],
      plugins,
    };
  }
};
