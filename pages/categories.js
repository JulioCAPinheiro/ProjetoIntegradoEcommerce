import Layout from "@/components/Layout";
import { Category } from "@/models/Category";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import Spinner from '@/components/Spinner';

function Categories({ swal }) {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    function fetchCategories() {
        setIsLoading(true);
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
            setIsLoading(false);
        })
    }


    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(','),
            })),
        };
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({ name, values }) => ({
                name,
                values: values.join(',')
            }))
        );
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Você tem certeza ?',
            text: `Você deseja apagar ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, Apagar!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category;
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        });
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }];
        });
    }

    function handlePropertynameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            const newProperties = [...prev];
            return newProperties.filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        })
    }

    return (
        <Layout>
            <h1>Catalogo</h1>
            <label>
                {editedCategory
                    ? `Editando Categorias ${editedCategory.name}`
                    : 'Criando uma nova categoria'}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex ga-=1">
                    <input
                        type="text"
                        placeholder="Categoria produto"
                        onChange={ev => setName(ev.target.value)}
                        value={name}
                        required
                    />

                    <select
                        value={parentCategory}
                        onChange={ev => setParentCategory(ev.target.value)}
                    >
                        <option value="">Selecione uma categoria</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-1">
                    <label className="block">Propriedades</label>
                    <button
                        onClick={addProperty}
                        type="button"
                        className="btn-default py-0 text-sm mb-2">
                        Adicionar nova propriedade
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input
                                type="text"
                                className="mb-0"
                                value={property.name}
                                onChange={ev => handlePropertynameChange(index, property, ev.target.value)}
                                placeholder="Nome das propriedades(Exemplo: cor)" />
                            <input
                                className="mb-0"
                                onChange={ev =>
                                    handlePropertyValuesChange
                                        (
                                            index,
                                            property,
                                            ev.target.value
                                        )}
                                type="text"
                                value={property.values}
                                placeholder="Values, comma separeted" />
                            <button
                                onClick={() => removeProperty(index)}
                                className="btn-default"
                                type="button">
                                Remover
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties([]);
                            }}
                            className="btn-default">Cancelar</button>
                    )}
                    <button type="submit"
                        className="btn-primary py-1">
                        Salvar
                    </button>
                </div>

            </form>
            {!editedCategory && (
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
                                <tr key={Category._id}>
                                    <td>
                                        {Category.name}
                                    </td>
                                    <td>
                                        {Category?.parent?.name}
                                    </td>

                                    <td>
                                        <button onClick={() => editCategory(Category)} className="btn-default mr-1">
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => deleteCategory(Category)}
                                            className="btn-red" Editar>Apagar</button>
                                    </td>
                                </tr>

                            ))}

                    </tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={2}>
                                <div className='py-4'>
                                    <Spinner fullwidth={true} />
                                </div>
                            </td>
                        </tr>
                    )}
                </table>
            )}
        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));