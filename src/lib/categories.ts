import {getDatabaseContentByQuery} from "@/lib/notion";

export const getMainCategories = async () =>
    await getDatabaseContentByQuery({
        property: 'isMainCategory',
        checkbox: {
            equals: true
        }
    });

export const getSubCategories = async () =>
    await getDatabaseContentByQuery({
        property: 'Tags',
        multi_select: {
            contains: 'eat',
        }
    });

export const getTitleByName = (item) => item.name.title[0];
