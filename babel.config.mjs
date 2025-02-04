export default {
  plugins: [
    '@babel/plugin-transform-modules-commonjs',
  ],
  // transform: {
  //   '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  // },
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
    ],
  };