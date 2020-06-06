const fs = require('fs')

const template = fs.readFileSync(__dirname + '/src/template.html', {
  encoding: 'utf8'
})
const styles = fs.readFileSync(__dirname + '/static/index.css', {
  encoding: 'utf8'
})

fs.writeFileSync(
  __dirname + '/src/template.html',
  template.replace(
    '<link rel="stylesheet" href="index.css" />',
    `<style>${styles}</style>`
  ),
  { encoding: 'utf8' }
)
