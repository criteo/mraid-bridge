import typescript from 'rollup-plugin-typescript2';

export default {
	input: 'src/main.ts',
  output: {
      file: "build/criteo-mraid.js",
      format: "iife",
    },
  plugins: [
    typescript()
    ]
}
