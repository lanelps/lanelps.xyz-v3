import { media } from "@utils/groq";

export const projectsQuery = `*[_type == "project"]{
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
    gallery[] {
        _key,
        ${media}
    },
}`;
