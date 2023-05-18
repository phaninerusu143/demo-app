module.exports = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
        ],
      });
  
      return config;
    },
  };
  