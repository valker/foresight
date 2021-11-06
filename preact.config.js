export default
{
    // let { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
    // let babelConfig = rule.options;
    //
    // babelConfig.plugins.push(require.resolve('my-chosen-plugin'));
    // babelConfig.env = {
    //     // ...some settings...
    // }
    // config.resolve.alias.fs = "null";

    webpack(config, env, helpers, options)
    {
        const webpack = require("webpack")
        let date_time = new Date();
        let date_time_as_string = date_time.toDateString()

        /** you can change the config here **/
        config.plugins.push(                new webpack.DefinePlugin({
                build_time:JSON.stringify(date_time_as_string)
            })
        );
    }
};
