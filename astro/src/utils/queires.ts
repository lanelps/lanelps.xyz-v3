import { media, seoSettings, seoPage } from "@utils/groq";

export const feturedProjectsQuery = `*[_type == "project" && featured == true] | order(date desc) {
    _id,
    slug, 
    title,
    description,
    categories,
    collaborators,
    software,
    date,
    cover {
        ${media}
    },
}`;

export const projectsQuery = `*[_type == "project"] | order(date desc) {
    _id,
    slug, 
    title,
    description,
    categories,
    collaborators,
    software,
    date,
    gallery[] {
        _key,
        ${media}
    },
    seo {
        ${seoPage}
    }
}`;

export const settingsQuery = `*[_type == "settings"][0] {
    seo {
        ${seoSettings}
    },
    scripts[] {
        title,
        value,
    }
}`;
