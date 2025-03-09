import { defineConfig } from '@configurajs/eslint'
import unicorn from 'eslint-plugin-unicorn'

const configs = defineConfig({
  vue: false,
  jsx: false,
})

configs.push({
  plugins: {
    unicorn,
  },
  rules: {
    'unicorn/explicit-length-check': 'error',
  },
})

export default configs
