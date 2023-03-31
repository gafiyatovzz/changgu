// root
import classNames from 'classnames';

// components
import Image from 'next/image';

// images & icons
import arrowDown from '@/images/svg/arrow-down.svg';

// styles
import styles from '@/components/CategoriesTab/index.module.scss';

// entities
import {getCategoryName, getCategoryFirstImageUrl, PreparedData} from "@/lib/notion";
import {useSelector} from "react-redux";

type Props = {
    categories: PreparedData[],
}

const CategoriesTab = ({
    categories,
}: Props) => {

    return (
        <div className={styles.root}>
            {
                categories.map((item, idx) => <Tab key={idx} category={item}/>)
            }
        </div>
    );
}


const Tab = (category: PreparedData) => {
    const {title} = getCategoryName(category);
    const firstImageUrl = getCategoryFirstImageUrl(category)
    const {url, name: altText} = firstImageUrl ?? {};

    return (
        <div className={styles.category}>
            <h2 className={styles.name}>{title}</h2>
            <img
                className={styles.image}
                src={url}
                alt={altText}
            />
        </div>
    )
}

export default CategoriesTab;
