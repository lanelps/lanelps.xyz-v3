import {DocumentIcon} from '@sanity/icons'
import type {ComponentType} from 'react'
import type {StructureBuilder, ListItemBuilder} from 'sanity/structure'

export const generateDocumentStructure = (
  S: StructureBuilder,
  {title, type, icon}: {title: string; type: string; icon?: ComponentType},
): ListItemBuilder => {
  return S.listItem()
    .title(title)
    .icon(icon || DocumentIcon)
    .schemaType(type)
    .child(S.documentTypeList(type).defaultOrdering([{field: 'date', direction: 'desc'}]))
}

export const generateSingletonStructure = (
  S: StructureBuilder,
  {title, type, icon}: {title: string; type: string; icon?: ComponentType},
): ListItemBuilder => {
  return S.listItem()
    .title(title)
    .schemaType(type)
    .icon(icon || DocumentIcon)
    .child(S.editor().title(title).schemaType(type).documentId(type))
}
