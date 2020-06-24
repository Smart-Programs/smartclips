module.exports = {
  purge: ['./src/**/*.svelte'],
  theme: {
    extend: {
      flex: {
        'inverse-auto': '0 0 auto'
      },
      colors: {
        'gray-850': '#222b39'
      }
    }
  },
  variants: {},
  plugins: [require('@tailwindcss/ui')]
}
