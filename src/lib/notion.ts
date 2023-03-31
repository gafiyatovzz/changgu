import {NOTION_URL, NOTION_V, DB_ID} from '@/lib/constants';

type Tag = string;

type ObjectType = string;

type Image = {
    name: string,
    url: string,
}
export type Category = {
    subItem: {
        id: string,
        type: string,
        relation: {
            id: string,
        }[],
        has_more: boolean
    },
    name: {
        title: {
            text: {
                content: string,
            }
        }[],
    },
    tags: {
        multi_select: {
            name: string
        }[],
    },
    img: {
        files: {
            file: {
                url: string,
            },
            name: string,
        }[],
    },
    isMainCategory: {
        checkbox: boolean,
    },
}

export type PreparedData = {
    type: ObjectType,
    id: string,
    name: {
        title: string,
        type: string,
    },
    images: Image[],
    tags: Tag[],
    isMainCategory: boolean,
    subItems: [],
    parentCategory: string,
};

type ResultContentQuery = {
    properties: Data,
    object: ObjectType,
    id: string,
}[]

type Data = Category;

type FetchData = {
    body?: {},
    path: string,
    method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'
}
async function fetchAPI({body, path = '', method}: FetchData) {
    const results = await fetch(`${NOTION_URL}${path}`, {
        method,
        headers: {
            'Notion-Version': NOTION_V,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NOTION_AUTH_TOKEN}`,
        },
        body: JSON.stringify(body),
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log('Что-то пошло не так при запросе к Notion\n');
            console.error('ERROR>>', err)
            throw new Error('Failed to fetch API')
        })
    return results
}

const normalizeCategoryData = (result: ResultContentQuery) =>
    result.map(({properties, object, id}) => prepareCategoryData({properties, object, id}));
const normalizeSearchResponse = (result: ResultContentQuery) =>
    result.map(({properties, object, id}) => prepareCategoryData({properties, object, id}));

export const prepareCategoryData = ({properties, object, id}: ResultContentQuery): PreparedData => {
    const {name, tags, img, isMainCategory, subItem} = properties;
    const {files: thumbnails} = img ?? {files: []};

    return {
        id,
        subItems: subItem.relation.map(({id}) => id),
        type: object,
        name: {
            title: name.title ? name.title[0].text.content : name.title,
            type: 'title',
        },
        images: thumbnails.map(item => item.name && ({
            url: item.file.url,
            name: item.name,
        })),
        tags: tags.multi_select.length ? tags.multi_select.map(tag => tag.name) : tags.multi_select,
        isMainCategory: isMainCategory.checkbox ?? false,
    };
};

export async function getDatabaseContentByQuery(query: {}) {
    const {results} = await fetchAPI({
        method: 'POST',
        body: {
            filter: query,
        },
        path: `/databases/${DB_ID}/query`,
    })

    return normalizeCategoryData(results);
}

type Result = any;

export const getPageById = async (pageId: string): Promise<Result> => {
    const result = await fetchAPI({
        method: 'GET',
        path: `/pages/${pageId}`,
    })

    return result;
}

// export async function searchDatabaseByQuery(query: string) {
//     return normalizeSearchResponse(await fetchAPI(
//             {
//                 query,
//             },
//             `/search`,
//         )
//     );
// }

export const getCategoryName = ({category}: PreparedData) => category.name;
export const getCategoryImageUrl = ({category}: PreparedData) => category.images;
export const getCategoryFirstImageUrl = ({category}: PreparedData) => category.images[0];
export const getDatabaseIdFromCategory = (category: PreparedData) => category.id;
