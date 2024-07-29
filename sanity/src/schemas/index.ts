// singletons
import homePage from './singletons/homePage'
import settings from './singletons/settings'

const singletons = [homePage, settings] as any[]

// documents

const documents = [] as any[]

// sections

const sections = [] as any[]

// objects
import altImage from './objects/altImage'
import scriptInline from './objects/scriptInline'
import scriptSrc from './objects/scriptSrc'
import seoPage from './objects/seo/page'
import seoSettings from './objects/seo/settings'

const objects = [altImage, scriptInline, scriptSrc, seoPage, seoSettings] as any[]

export const schemaTypes = [...singletons, ...documents, ...sections, ...objects]
