import {getDatabaseContentByQuery, getPageById, prepareCategoryData, PreparedData} from "@/lib/notion";

export const getMainCategories = async () =>
    await getDatabaseContentByQuery({
        property: 'isMainCategory',
        checkbox: {
            equals: true
        }
    });

export const getItemsFromCategory = async (categories: PreparedData[]) => {
    const filteredSubItems = categories.filter(cat => cat.subItems.length);
    const results = filteredSubItems.map(category => {
        const pages = category.subItems.map(async item => {
            const _page = await getPageById(item).then(data => data);
            const data = prepareCategoryData(_page);
            return {
                parentName: category.parentCategory,
                ...data,
            };
        });

        return Promise.all(pages);
    })

    return Promise.all(results);
}

export const getSubCategories = async (categories: PreparedData[]) => {
    const subItems = categories.reduce((acc, {name, subItems}) => {
        acc[name.title] = subItems
        return acc;
    }, {})

    const results = [];

    for (const parent in subItems) {
        const pages = subItems[parent].reduce(async (acc, id) => {
            const page = await getPageById(id).then(data => data)
            const data = prepareCategoryData(page);
            const name = data.name.title;
            acc = {
                parentCategory: name,
                ...data
            };
            return acc;
        }, {});

        results.push(pages);
    }

    return Promise.all(results);
}

