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
          plugins: [
              "external-helpers",
              ["transform-react-jsx", { pragma:"h" }],
          ],
      }),

      resolve(),

      commonjs({
          include: [
              "node_modules/**/*.js",
          ],
          namedExports: {
            "node_modules/preact/dist/preact.js": [ "h", "render", "Component" ],
          },
      }),
  ],
  dest: "docs/bundle.js",
}
