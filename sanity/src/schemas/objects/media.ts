import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'media',
  title: 'Media',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'altImage',
      validation: (Rule: any) =>
        Rule.custom((field: any, context: any) => {
          if (context.parent.type === 'image' && !field) {
            return 'An image is required'
          }
          return true
        }),
      hidden: ({parent}: any) => parent?.type !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'cloudinary.asset',
      validation: (Rule: any) =>
        Rule.custom((field: any, context: any) => {
          if (context.parent.type === 'video' && !field) {
            return 'An video is required'
          }
          return true
        }),
      hidden: ({parent}: any) => parent?.type !== 'video',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'Center', value: 'center'},
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'full',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
