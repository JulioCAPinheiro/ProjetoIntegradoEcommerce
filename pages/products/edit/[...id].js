import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

export default function EditProductPage() {
    

    const [productInfo, setProductInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        setIsLoading(true);
        axios.get('/api/products?id=' + id).then(
            response => {
                setProductInfo(response.data);
                setIsLoading(false);
            }
        );
    }, [id])

    return (
        <Layout>
            <h1>Editar produto</h1>
            {isLoading && (

                <Spinner />
            )}
            {productInfo && (
                <ProductForm {...productInfo} />
            )}

        </Layout>
    )
}