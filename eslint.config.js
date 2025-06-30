// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import pluginQuery from '@tanstack/eslint-plugin-query'

export default [// Any other config...
...pluginQuery.configs['flat/recommended'], ...storybook.configs["flat/recommended"]];