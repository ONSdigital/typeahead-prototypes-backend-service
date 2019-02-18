import merge from 'webpack-merge';
import WebpackShellPlugin from 'webpack-shell-plugin';

import { commonConfig } from './webpack.common';

export default merge(commonConfig, {
  mode: 'development',

  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: ['nodemon build/app.js --watch build'],
    })
  ]
});
