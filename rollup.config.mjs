import stripExports from 'rollup-plugin-strip-exports'

export default {
	input: 'build/mraid.js',
    output: {
        file: 'build/mraid.js'
      },

	plugins: [
        stripExports(),
	]
}
