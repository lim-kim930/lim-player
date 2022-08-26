import typescript from '@rollup/plugin-typescript';
import less from 'rollup-plugin-less';
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";

console.log(process.env.BUILD_TYPE);
let input = 'src/index.ts';
let output = {};
let plugins = [];
switch (process.env.BUILD_TYPE) {
    case "UMD":
        output = {
            format: "umd",
            name: "LimPlayer",
            file: "dist/limplayer.min.js"
        };
        plugins = [
            terser(),
            less({
                output: "dist/css/limplayer.min.css",
                option: {
                    compress: true
                }
            }),
            typescript({
                outDir: "dist",
                compilerOptions: {
                    declaration: false,
                    removeComments: true
                }
            })
        ];
        break;
    case "ESM":
        output = {
            format: "esm",
            dir: "lib"
        };
        plugins = [
            less({
                output: "lib/assets/css/index.css"
            }),
            typescript({
                outDir: "lib",
                compilerOptions: {
                    declaration: false,
                    removeComments: true,
                    module: "es6"
                }
            })
        ];
        break;
    case "TYPE":
        input = 'src/index.ts';
        output = {
            file: "lib/index.d.ts",
            format: "es6"
        };
        plugins = [
            less({
                output: "lib/css/index.css",
                option: {
                    compress: true
                }
            }),
            dts()
        ];
        break;
}

export default { input, output, plugins };