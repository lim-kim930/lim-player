import typescript from '@rollup/plugin-typescript';
import less from 'rollup-plugin-less';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const input = 'src/index.ts';
export default [
    {
        input,
        output: {
            format: 'umd',
            name: 'LimPlayer',
            file: 'dist/limplayer.min.js'
        },
        plugins: [
            terser(),
            less({
                output: 'dist/assets/limplayer.css',
                option: {
                    compress: true
                }
            }),
            typescript({
                outDir: 'dist',
                compilerOptions: {
                    declaration: false,
                    removeComments: true,
                    module: 'es6'
                }
            }),
            nodePolyfills({
                include: ['crypto']
            })
        ]
    },
    {
        input,
        output: {
            format: 'esm',
            dir: 'lib'
        },
        plugins: [
            less({
                // insert: true,
                output: 'lib/assets/index.css'
            }),
            typescript({
                outDir: 'lib',
                compilerOptions: {
                    declaration: false,
                    removeComments: true,
                    module: 'es6'
                }
            })
        ]
    },
    {
        input,
        output: {
            file: 'lib/index.d.ts'
        },
        external: id => /less/.test(id),
        plugins: [
            dts()
        ]
    }
];
