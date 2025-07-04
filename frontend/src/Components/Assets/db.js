import all_product from './all_product.js';
import new_collections from './new_collections.js'
import data from './data.js';
import kids_data from './kids_data.js';
import kids_collections from './kids_collections.js';
import mens_data from './mens_data.js';
import mens_collections from './mens_collections.js';
import womens_data from './womens_data.js';
import womens_collections from './womens_collections.js';

const allData = [
    ...all_product,
    ...new_collections,
    ...data,
    ...kids_data,
    ...kids_collections,
    ...mens_data,
    ...mens_collections,
    ...womens_data,
    ...womens_collections
];

export default allData;