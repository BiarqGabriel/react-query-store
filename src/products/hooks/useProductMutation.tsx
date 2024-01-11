import { Product, productActions } from "..";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useProductMutation = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: productActions.createProduct,
        onMutate: (data) => {
            //Optimistic product
            const optimisticProduct = {id : Math.random(), ...data};

            //Add optimistic product to cache
            queryClient.setQueryData<Product[]>(["products", {'filterKey': data.category}], (oldData) => {
                if(oldData){
                    return [...oldData, optimisticProduct];
                }
            });
            return {
                optimisticProduct
            }
        },
        onSuccess: (data, _variables, context) => {
            // queryClient.invalidateQueries({
            //     queryKey: ["products", {'filterKey': data.category}],
            // });
            queryClient.setQueryData<Product[]>(["products", {'filterKey': data.category}], (oldData) => {
                if(oldData){
                    return oldData.map((product) => {
                        if(product.id === context?.optimisticProduct.id){
                            return data;
                        }
                        return product;
                    });
                }
            });
        },
        onError: (error, _variables, context) => {
            //Remove optimistic product from cache
            queryClient.setQueryData<Product[]>(["products", {'filterKey': context?.optimisticProduct.category}], (oldData) => {
                if(oldData){
                    return oldData.filter((product) => product.id !== context?.optimisticProduct.id);
                }
            });
        }
        
    });

  return mutation;
};
