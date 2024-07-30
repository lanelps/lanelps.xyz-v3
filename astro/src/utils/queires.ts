import { media } from "@utils/groq";

export const projectsQuery = `*[_type == "project"]{
    _id,
    slug, 
    title,
    description,
    role,
    collaborators,
    software,
    cover {
        ${media}
    },
    gallery[] {
        _key,
        ${media}
    },
}`;
