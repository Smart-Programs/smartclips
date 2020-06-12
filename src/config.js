import development from './config.development'
import preview from './config.preview'
import production from './config.production'

const configs = {
  development,
  preview,
  production
}

export default configs[process.env.NODE_ENV] || configs.development
