const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const webpack = require("webpack");

module.exports = defineConfig({
	filenameHashing: false,
	productionSourceMap: true,
	publicPath: "./",
	outputDir: path.resolve("../StaticFiles/js/themeUi"),
	chainWebpack: (config) => {
		config.optimization.delete("splitChunks");
		config.plugin("limitSplitChunks").use(webpack.optimize.LimitChunkCountPlugin, [{ maxChunks: 1 }]);

		config.plugins.delete("html");
		config.plugins.delete("preload");
		config.plugins.delete("prefetch");

		config.entryPoints.clear();
		config.entry("app").add("./src/app/main.ts").end();
	},
	configureWebpack: {
		resolve: {
			alias: {
				//https://github.com/vuejs/vue-cli/issues/4271
				vue$: path.resolve("./node_modules/vue/dist/vue.esm.js"),
			},
		},
	},
});
