import babel from "rollup-plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"

export default {
  entry: "index.js",
  format: "cjs",
  plugins: [
      babel({
          babelrc: false,
          presets: ["stage-3"],
          plugins: ["external-helpers"],
      }),

      resolve(),

      commonjs({
          include: [
              "node_modules/**/*.js",
          ],
      }),
  ],
  dest: "docs/bundle.js",
}
