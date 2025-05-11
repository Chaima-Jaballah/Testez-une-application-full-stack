import * as path from 'path';
import { Configuration } from 'webpack';

export default function (config: Configuration): Configuration {
  if (!config.module) {
    config.module = { rules: [] };
  }

  config.module.rules!.push({
    test: /\.(js|ts)$/,
    loader: '@jsdevtools/coverage-istanbul-loader',
    options: { esModules: true },
    enforce: 'post',
    include: path.join(__dirname, '..', 'src'),
    exclude: [
      /\.(e2e|spec)\.ts$/,
      /node_modules/,
      /(ngfactory|ngstyle)\.js/,
    ],
  });

  return config;
}

