import {NOTION_URL, NOTION_V, DB_ID} from '@/lib/constants';

type Category = {
    name: {},
    Tags: {
        multi_select: [],
    },
    img: {},
    isMainCategory: {
        checkbox: boolean,
    },
}

type Data = Category[];

async function fetchAPI(body: {}, query= '') {
    const res = await fetch(`${NOTION_URL}${query}`, {
        method: 'POST',
        headers: {
            'Notion-Version': NOTION_V,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NOTION_AUTH_TOKEN}`,
        },
        body: JSON.stringify(body),
    })
    const json = await res.json()

    if (json.errors) {
        console.log('Что-то пошло не так при запросе к Notion\n');
        console.error(json.errors)
        throw new Error('Failed to fetch API')
    }

    return json.results
}

const normalizeDatabaseContentQuery = result => result.map(({properties}) => prepareData(properties));

export const prepareData = ({Name, Tags, img, isMainCategory}: Data) => {
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
