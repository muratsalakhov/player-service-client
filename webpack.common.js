const path = require("path");

module.exports = {
    entry: path.join(__dirname, "src", "main", "ts", "main.ts"),
    module: {
        rules: [
            {
                test: /\.ts/,
                use: "awesome-typescript-loader"
            }
        ]
    },
    output: {
        filename: "js/bundle.js",
        path: path.join(__dirname, "target", "classes", "static")
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".jsx"]
    }
};
