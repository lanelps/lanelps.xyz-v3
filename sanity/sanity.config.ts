import {defineConfig, type PluginOptions} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {cloudinarySchemaPlugin} from 'sanity-plugin-cloudinary'
import {muxInput} from 'sanity-plugin-mux-input'

import {schemaTypes} from './src/schemas'
import deskStructure from './src/deskStructure'

const isDev = process.env.NODE_ENV === 'development'
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321/'

export default defineConfig({
  name: 'default',
  title: 'lanelps',

  projectId: 'k2d93j2x',
  dataset: 'staging',

  plugins: [
    structureTool({structure: deskStructure}),
    presentationTool({previewUrl: SANITY_STUDIO_PREVIEW_URL}),
    isDev ? visionTool() : null,
    cloudinarySchemaPlugin(),
    muxInput(),
  ].filter((plugin): plugin is PluginOptions => plugin !== null),
  schema: {
    types: schemaTypes,
  },
})
