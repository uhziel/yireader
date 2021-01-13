//https://cli.vuejs.org/config/#vue-config-js
module.exports = {
    devServer: {
        proxy: 'http://localhost:3001'
    },
    configureWebpack: {
        devtool: 'source-map'
    }
}
