import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import babel from "@rollup/plugin-babel";
import replace from '@rollup/plugin-replace';
import eslint from '@rollup/plugin-eslint';
import analyze from 'rollup-plugin-analyzer'
import cleanup from 'rollup-plugin-cleanup';
import typescript from '@rollup/plugin-typescript';

import scss from "rollup-plugin-scss";
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import stylelint from 'rollup-plugin-stylelint';

import pkg from "./package.json";

// const input = ["src/index.js"];
const input = ["src/main.ts"];

const banner = `/*!
* ${pkg.title} v${pkg.version} (${pkg.homepage})
* ${pkg.description}
* Created by ${pkg.author.name} (${pkg.author.url})
* Licensed under ${pkg.license} (${pkg.repository.url}/blob/main/LICENSE)
*/`; 

export default [
    {
        input,
        output: {
          file: `dist/${pkg.name}.mjs`
        },
        plugins: [
            nodeResolve(),
            replace({
                preventAssignment:true
            }),
            scss({
                output: false
            }),
            typescript({ tsconfig: './tsconfig.json' })
        ]
    },
    // UMD Build
    {
        input,
        plugins: [
            nodeResolve(),
            replace({
                preventAssignment:true
            }),
            typescript(),
            babel({
                babelHelpers: "bundled",
            }),
            stylelint({
                fix: false,
                include: ['src/scss/*.scss'],
                quiet: false,
            }),
            scss({
                output: `dist/css/${pkg.name}.css`,
                failOnError: true,
                processor: () => postcss([autoprefixer()]),
            }),
            eslint(),
            cleanup({
                sourcemap: true
            }),
            analyze({summaryOnly: true})
        ],
        output: {
            format: 'umd',
            name: 'jsWizard',
            file: `dist/${pkg.name}.js`,
            banner,
            indent: false,
        },
    },
    // UMD Build Min
    {
        input,
        plugins: [
            nodeResolve(),
            replace({
                preventAssignment:true,
            }),
            typescript(),
            babel({
                babelHelpers: "bundled",
            }),
            scss({
                output: `dist/css/${pkg.name}.min.css`,
                failOnError: true,
                outputStyle: 'compressed',
                sourceMap: true,
                processor: () => postcss([autoprefixer()]),
            }),
            terser({ output: { preamble: banner } })
        ],
        output: {
            format: "umd",
            name: "jsWizard", // this is the name of the global object
            file: `dist/${pkg.name}.min.js`,
            exports: "named",
            esModule: false,
            sourcemap: true,
            indent: false,
        },
    },
    // ESM and CJS
    {
        input,
        plugins: [
            nodeResolve(),        
            replace({
                preventAssignment:true,
            }),
            typescript(),
            scss({
                output: false
            }),
            cleanup({
                sourcemap: true
            }),
        ],
        output: [
            {
                file: `dist/${pkg.name}.esm.js`,
                format: "esm",
                exports: "named",
                banner,
                indent: false,
            },
            {
                file: `dist/${pkg.name}.cjs.js`,
                format: "cjs",
                exports: "named",
                banner,
                indent: false,
            },
        ],
    },
    {
        input,
        output: {
          file: `dist/${pkg.name}.mjs`
        },
        plugins: [
            scss({
                output: false
            }),
            typescript()
        ]
    }
];