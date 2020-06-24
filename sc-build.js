const fs = require('fs')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

function updateTemplate () {
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
}

function updateConfig () {
  if (!fs.existsSync(__dirname + `/sc-${process.env.NODE_ENV}.js`)) return

  const configFile = fs.readFileSync(
    __dirname + `/sc-${process.env.NODE_ENV}.js`
  )
  fs.writeFileSync(__dirname + '/src/config/index.js', configFile)
}

if (process.env.NODE_ENV !== 'development') {
  updateTemplate()
  updateConfig()
}
