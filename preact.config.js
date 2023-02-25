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
        let date_time_as_string = date_time.toLocaleDateString()

        /** you can change the config here **/
        config.plugins.push(
            new webpack.DefinePlugin({
                build_time:JSON.stringify(date_time_as_string),
                content3_str: JSON.stringify("(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.51.1]KM[7.5]SZ[19]DT[2023-02-25];B[dd];W[fc];B[cf];W[dc];B[cc];W[cb];B[ec];W[db];B[ed];W[eb])")
            })
        );

        config.externals = {
            fs: "null"
        }
    }
};
