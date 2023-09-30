import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Alert from "./Alert";


export default function ProductForm({

    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties
}) {
    const [title, setTitle] = useState(existingTitle);
    const [description, setDescription] = useState(existingDescription);
    const [images, setImages] = useState(existingImages || []);
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState({ assignedProperties } || {})
    const [price, setPrice] = useState(existingPrice || (0));
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [ShowAlert, setShowAlert] = useState(false);
    const router = useRouter();
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);

    async function saveProduct(ev) {

        ev.preventDefault();
        const data = {
            title, description, price, images, category,
            properties: productProperties
        };
        if (_id) {
            await axios.put('/api/products', { ...data, _id });

        } else {


            await axios.post('/api/products', data);

        }
        setGoToProducts(true);

    }
    if (goToProducts) {
        router.push('/products')
    }

    async function UploadImages(ev) {
        console.log(ev);
        const files = ev.target.files
        if (files?.length > 0) {
            setIsUploading(true)
            const data = new FormData();
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data)
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    const removeImage = (indexToRemove) => {
        const updateImages = [...images];

        updateImages.splice(indexToRemove, 1);

        setImages(updateImages);
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        })
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties);

        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    const handleShowAlert = () => {
        setShowAlert(true);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    return (
        <form onSubmit={saveProduct}>

            <label>Nome do produto</label>
            <input
                required
                type="text"
                placeholder="product name:"
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />

            <label>Categoria do produto</label>
            <select value={category}
                onChange={ev => setCategory(ev.target.value)}>
                <option value="">Sem categoria</option>
                {categories.length > 0 && categories.map(Cat => (
                    <option value={Cat._id}>{Cat.name}</option>
                ))}
            </select>

            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div className="flex gap-1">
                    <div>{p.name}</div>
                    <select
                        value={productProperties[p.name]}
                        onChange={ev => { setProductProp(p.name, ev.target.value) }}>
                        {p.values.map(v => (
                            <option value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            ))}

            <label>
                Fotos
            </label>

            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable
                    list={images}
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}
                >
                    {!!images?.length && images.map((link, index) => (
                        <div key={link} className="h-24 relative">
                            <img src={link} className="rounded-lg" alt={`Imagem ${index}`} />
                            <button
                                className="absolute top-0 right-0 p-2 text-white bg-red-500 rounded-full"
                                onClick={() => removeImage(index)}
                            >
                                Remover
                            </button>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label
                    className=" cursor-pointer w-24 h-24 text-center flex 
                    flex-col items-center justify-center text-sm gap-1 text-black-500 rounded-lg
                    bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Enviou
                    </div>
                    <input onChange={UploadImages} type="file" className="hidden" />
                </label>
            </div>



            <label>Descrição</label>
            <textarea
                placeholder="discription"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
                required
            />

            <label>Preço</label>
            <input
                type="text"
                placeholder="Insira o valor do seu produto"
                value={price}
                onChange={(ev) => {
                    const inputValue = ev.target.value;
                    if (inputValue === '') {
                        setPrice('');
                    } else {
                        const numericValue = parseFloat(inputValue);

                        if (!isNaN(numericValue)) {
                            setPrice(numericValue);
                        } else {
                            <Alert message="Este é um alerta formal." onClose={handleCloseAlert} />
                        }
                    }
                }}
            />

            <button
                type="submit"
                className="btn-primary">
                Salvar
            </button>

        </form>

    )
}