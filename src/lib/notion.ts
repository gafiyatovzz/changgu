import {NOTION_URL, NOTION_V, DB_ID} from '@/lib/constants';

type Tag = string;

type Image = {
    name: string,
    url: string,
}
export type Category = {
    Name: {
        title: {
            text: {
                content: string,
            }
        }[],
    },
    Tags: {
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
    name: {
        title: string,
        type: string,
    },
    images: Image[],
    tags: Tag[],
    isMainCategory: boolean,
};

type ResultContentQuery = {
    properties: Data
}[]

type Data = Category;

async function fetchAPI(body: {}, query= '') {
    const {results} = await fetch(`${NOTION_URL}${query}`, {
        method: 'POST',
        headers: {
            'Notion-Version': NOTION_V,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NOTION_AUTH_TOKEN}`,
        },
        body: JSON.stringify(body),
    })
        .then(response => response.json())
        .catch(err => {
            console.log('Что-то пошло не так при запросе к Notion\n');
            console.error(err)
            throw new Error('Failed to fetch API')
        })

    return results
}

const normalizeDatabaseContentQuery = (result: ResultContentQuery) => result.map(({properties}) => prepareData(properties));

export const prepareData = ({Name, Tags, img, isMainCategory}: Data): PreparedData => {
    const {files: thumbnails} = img;
    return {
        name: {
            title: Name.title[0].text.content,
            type: 'title',
        },
        images: thumbnails.map(item => ({
            url: item.file.url,
            name: item.name,
        })),
        tags: Tags.multi_select.map(tag => tag.name),
        isMainCategory: isMainCategory.checkbox,
    };
};

export async function getDatabaseContentByQuery(query: {}) {
    const result = await fetchAPI(
        {
            filter: query,
        },
        `/databases/${DB_ID}/query`,
    )

    return normalizeDatabaseContentQuery(result);
}
