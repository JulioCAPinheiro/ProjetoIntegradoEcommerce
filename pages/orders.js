import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from '../styles/OrdersPage.module.css';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filterPaid, setFilterPaid] = useState(null);

    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        });
    }, []);

    const filtedOrders = orders.filter(order => {
        if (filterPaid !== null) {
            return order.paid === filterPaid;
        }
        return true;
    })

    return (
        <Layout>
            <h1>Pedidos</h1>

            <div className={styles.filterContainer}>
                <label htmlFor="filterPaid">Filtrar por Status de Pagamento:</label>
                <select
                    id="filterPaid"
                    className={`${styles.select} ${filterPaid === null ? styles.all : ''}`}
                    value={filterPaid === null ? "" : filterPaid.toString()}
                    onChange={(e) => setFilterPaid(e.target.value === '' ? null : e.target.value === 'true')}
                >
                    <option value="">Todos</option>
                    <option value="true">Pagos</option>
                    <option value="false">Não Pagos</option>
                </select>
            </div>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Pagos</th>
                        <th>Recebedor</th>
                        <th>Produtos</th>
                    </tr>
                </thead>
                <tbody>
                    {filtedOrders.length > 0 && filtedOrders.map(order => (
                        <tr key={order._id}>
                            <td>{(new Date(order.createdAt)).toLocaleString()}
                            </td>
                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                {order.paid ? 'SIM' : 'NÃO'}
                            </td>
                            <td>
                                {order.name} {order.email}<br />
                                {order.city} {order.postalCode} {order.country}<br />
                                {order.streetAddress}
                            </td>
                            <td>
                                {order.line_items.map(l => (
                                    <>
                                        {l.price_data?.product_data.name} x
                                        {l.quantity}<br />
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}