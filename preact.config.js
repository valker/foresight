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
        const fs = require('fs')
        const content3 = fs.readFileSync('src/josekis/content3.sgf').toString()
        const content4 = fs.readFileSync('src/josekis/content4.sgf').toString()
        const content6 = fs.readFileSync('src/josekis/content6.sgf').toString()
        let date_time = new Date();
        let date_time_as_string = date_time.toLocaleDateString()

        /** you can change the config here **/
        config.plugins.push(
            new webpack.DefinePlugin({
                build_time:JSON.stringify(date_time_as_string),
                content3_str: JSON.stringify(content3),
                content4_str: JSON.stringify(content4),
                content6_str: JSON.stringify(content6)
            })
        );

        config.externals = {
            fs: "null"
        }
    }
};
