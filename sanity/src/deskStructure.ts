import {generateDocumentStructure, generateSingletonStructure} from './utils/desk'
import type {StructureBuilder, ListItemBuilder, Divider} from 'sanity/structure'

const documents = [] as any[]

const DOCUMENT_TYPES_IN_STRUCTURE = [
  // 'globals',
  'media.tag',
  'mux.videoAsset',
  'homePage',
  'project',
  'settings',
  ...documents.map((document) => document.type),
] as string[]

export default (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      ...documents.map((document) => generateDocumentStructure(S, document)),
      S.divider(),
      generateSingletonStructure(S, {
        title: 'Home',
        type: 'homePage',
        icon: () => '🏠',
      }),
      S.divider(),
      generateDocumentStructure(S, {
        title: 'Projects',
        type: 'project',
        icon: () => '📁',
      }),
      S.divider(),
      generateSingletonStructure(S, {
        title: 'Settings',
        type: 'settings',
        icon: () => '⚙️',
      }),
      ...S.documentTypeListItems().filter(
        (listItem) => !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId() || ''),
      ),
    ])
