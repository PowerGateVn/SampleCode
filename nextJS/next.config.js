// @ts-check

/**
 * @type {import('next').NextConfig}
 **/

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const lessToJS = require('less-vars-to-js');
const withPlugins = require('next-compose-plugins');
const withAntdLess = require('next-plugin-antd-less');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

const loadEnvConfig = require('./bin/env');
const { i18n } = require('./next-i18next.config');

loadEnvConfig();

const antdVariables = lessToJS(
	fs.readFileSync(path.resolve(__dirname, 'src/styles/variables.less'), 'utf8'),
);

const nextConfig = {
	i18n,
	images: {
		domains: ['image-cdn.medkomtek.com'],
	},
};

const plugins = [
	withBundleAnalyzer(
		withAntdLess({
			lessVarsFilePath: './src/styles/variables.less',
			lessVarsFilePathAppendToEndOfContent: true,
			// optional https://github.com/webpack-contrib/css-loader#object
			cssLoaderOptions: {
				// @ts-ignore
				modules: {
					localIdentName:
						process.env.MODE !== 'production' ? '[folder]__[local]__[hash:4]' : '[hash:8]',
				},
			},

			// Other config here...
			webpack(config) {
				config.module.rules.push({
					test: /\.(jpe?g|png|svg|gif|ico|eot|ttf|woff|woff2|mp4|pdf|webm|txt)$/,
					type: 'asset/resource',
					generator: { filename: 'static/chunks/[path][name].[hash][ext]' },
				});

				config.plugins.push(
					new webpack.EnvironmentPlugin({ ...process.env, THEME: { ...antdVariables } }),
					new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' }),
				);

				return config;
			},
		}),
	),
];

module.exports = withPlugins(plugins, nextConfig);
