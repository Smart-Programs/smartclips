const tailwindcss = require('tailwindcss')

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.svelte', './src/**/*.html'],
  defaultExtractor: content => content.match(/[\w-/.:]+(?<!:)/g) || []
})

module.exports = {
  plugins: [
    tailwindcss('./tailwind.js'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
  ]
}
