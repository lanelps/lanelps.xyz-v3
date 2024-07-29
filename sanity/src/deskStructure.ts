import {generateDocumentStructure, generateSingletonStructure} from './utils/desk'

const documents = [] as any[]

const DOCUMENT_TYPES_IN_STRUCTURE = [
  // `globals`,
  `media.tag`,
  `homePage`,
  `settings`,
  ...documents.map((document) => document.type),
] as string[]

export default (S) =>
  S.list()
    .title(`Content`)
    .items([
      ...documents.map((document) => generateDocumentStructure(S, document)),
      S.divider(),
      generateSingletonStructure(S, {
        title: `Home`,
        type: `homePage`,
        icon: () => `🏠`,
      }),
      S.divider(),
      generateSingletonStructure(S, {
        title: `Settings`,
        type: `settings`,
        icon: () => `⚙️`,
      }),
      ...S.documentTypeListItems().filter(
        (listItem) => !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId()),
      ),
    ])
