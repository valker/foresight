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
                content3: "(;GM[1]FF[4]SZ[19];B[dp];W[fq](;B[cn];W[dq];B[cq];W[cr];B[eq];W[dr](;B[ep];W[er](;B[bq](;W[fp])(;W[hq]))(;B[fp];W[gq]))(;B[fp];W[er];B[ep];W[gq])(;B[er](;W[ep];B[fr];W[cp];B[do];W[bp];B[gq])(;W[cp];B[ep];W[co](;B[dn])(;B[do];W[bq];B[bo];W[bp](;B[dm])(;B[dn])))))(;B[hq];W[cq];B[dq];W[cp];B[do];W[dr];B[er];W[cr];B[fr];W[cn]))"
            })
        );

        config.externals = {
            fs: "null"
        }
    }
};
