import Layout from "@/components/Layout";
import { Category } from "@/models/Category";
import axios from "axios";
import { useEffect, useState } from "react";

export default function categories() {

    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([])

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }


    async function saveCategories(ev) {
        ev.preventDefault();
        await axios.post('/api/categories', { name, parentCategory });
        setName('');
        fetchCategories();
    }

    return (
        <Layout>
            <h1>Catalogo</h1>
            <label>Nova categoria de produto</label>
            <form onSubmit={saveCategories} className="flex gap-1">

                <input
                    className="mb-0"
                    type="text"
                    placeholder="Categoria produto"
                    onChange={ev => setName(ev.target.value)}
                    value={name}
                />

                <select
                    className="mb-0"
                    value={parentCategory}
                    onChange={ev => setParentCategory(ev.target.value)}
                >
                    <option value="">Selecione uma categoria</option>
                    {categories.length > 0 && categories.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="btn-primary py-1">
                    Salvar
                </button>
            </form>

            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Nome das Categorias</td>
                        <td>Categorias parecidas</td>
                    </tr>
                </thead>

                <tbody>
                    {categories.length > 0 && categories.map
                        (Category => (
                            <tr>
                                <td>
                                    {Category.name}
                                </td>
                                <td>
                                    {Category?.parent?.name}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>


        </Layout>
    )
}