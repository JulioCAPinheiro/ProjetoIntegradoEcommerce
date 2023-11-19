import Layout from '@/components/Layout';
import Spinner from '@/components/Spinner';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { withSwal } from 'react-sweetalert2';
import { prettyDate } from '@/lib/date';

function AdminsPage({ swal }) {

    const [email, setEmail] = useState();
    const [adminsEmail, setAdminEmail] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    function addAdmin(ev) {
        ev.preventDefault();
        axios.post('/api/admins', { email }).then(res => {
            console.log(res.data);
            swal.fire({
                title: "Administrador Criado",
                icon: "Sucesso"
            })
            setEmail('');
            loadADmins();
        }).catch(err => {
            swal.fire({
                title: "Algo deu errado !",
                text:err.response.data.message,
                icon: "error"
            })
        });
    }

    function loadADmins() {
        setIsLoading(true);
        axios.get('/api/admins').then(res => {
            setAdminEmail(res.data);
            setIsLoading(false);
        });
    }

    function deleteAdmin(_id, email) {
        swal.fire({
            title: 'Você tem certeza ?',
            text: `Você deseja apagar ${email}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sim, Apagar!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                axios.delete('/api/admins?_id=' + _id).then(() => {
                    swal.fire({
                        title: "Administrador apagado",
                        icon: "success"
                    })
                    loadADmins();
                });
            }
        });


    }

    function editAdmin() {

    }

    useEffect(() => {
        loadADmins();
    }, [])

    return (
        <Layout>
            <h1>Administradores</h1>
            <h2>Adicionar novo Administrador</h2>

            <form onSubmit={addAdmin}>
                <div className='flex gap-2'>
                    <input
                        type="text"
                        className='mb-0'
                        placeholder='Google Email'
                        onChange={ev => setEmail(ev.target.value)}
                        value={email} />
                    <button
                        type='submit'
                        className='btn-primary py-1' >
                        Salvar
                    </button>
                </div>
            </form>

            <h2>Administradores Existentes</h2>
            <table className='basic'>
                <thead>
                    <tr>
                        <th className='text-left'>ADMING GOOGLE EMAIL</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={2}>
                                <div className='py-4'>
                                    <Spinner fullwidth={true} />
                                </div>
                            </td>
                        </tr>
                    )}
                    {adminsEmail.length > 0 && adminsEmail.map(adminEmail => (
                        <tr>
                            <td>
                                {adminEmail.email}
                            </td>
                            <td>
                                {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
                            </td>
                            <td>
                                <button onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)} type="" className='btn-default'>Apagar</button>
                            </td>
                            <td>
                                <button onClick={editAdmin} type='' className="btn-primary mr-1">Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({ swal }) => (
    <AdminsPage swal={swal} />
));