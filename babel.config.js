module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', {
    }],
    ['@babel/preset-typescript', {
    }],
  ],
  plugins: [
    [
      "transform-rename-import", {
        original: '^(.+?)\\.scss$',
        replacement: '$1.css',
      },
    ],
  ],
};
