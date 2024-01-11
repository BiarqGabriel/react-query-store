
import { Product, productsApi } from "..";


interface GetProductsOptions {
    filterKey?: string;
}


export const getProducts = async ({ filterKey } : GetProductsOptions): Promise<Product[]> => {

    const filterUrl = filterKey ? `/products?category=${filterKey}` : '/products';
    const {data} = await productsApi.get<Product[]>(filterUrl);

    return data;
};


export const getProductById = async (id : string): Promise<Product> => {


    const {data} = await productsApi.get<Product>(`/products/${id}`);

    return data;
};

export interface ProductLike {
    id?:          number;
    title:       string;
    price:       number;
    description: string;
    category:    string;
    image:       string;
}


export const createProduct = async(product : ProductLike) => {
    const {data} = await productsApi.post<Product>('/products', product);

    return data;
};