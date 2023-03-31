// root
import classNames from 'classnames';

// components
import Image from 'next/image';

// images & icons
import arrowDown from '@/images/svg/arrow-down.svg';

// styles
import styles from '@/components/CategoriesList/index.module.scss';

// entities
import {
    getCategoryImageUrl,
    getCategoryName,
    getCategoryFirstImageUrl,
    PreparedData,
} from "@/lib/notion";

type Props = {
    categories: PreparedData[],
}

const CategoriesList = ({
    categories,
}: Props) => {
    return (
        <div className={styles.root}>
            {
                categories.map((item, idx) => <Row key={idx} category={item}/>)
            }
        </div>
    );
}


const Row = ({category}: PreparedData) => {
    const mainCategoryTitle = Object.keys(category)[0];
    const cat = Object.values(category)[0];
    const {title} = getCategoryName({category: cat})
    // const {url, name: altText} = getCategoryFirstImageUrl(properties)

    return (
        <div className={styles.category}>
            <h1 className={styles.name}>{mainCategoryTitle}</h1>
            <hr />
            <p>{title}</p>
        </div>
    )
}

export default CategoriesList;
