export default (config, env, helpers) => {
    // let { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
    // let babelConfig = rule.options;
    //
    // babelConfig.plugins.push(require.resolve('my-chosen-plugin'));
    // babelConfig.env = {
    //     // ...some settings...
    // }
    config.resolve.alias.fs = "null";
};