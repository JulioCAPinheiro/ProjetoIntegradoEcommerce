import axios from "axios"
import { useEffect, useState } from "react"
import Spinner from "./Spinner";
import { subHours } from "date-fns";

export default function HomeStatus() {

    const [orders, setOrders] = useState([]);
    const [isloading, setIsloading] = useState(false);

    useEffect(() => {
        setIsloading(true);
        axios.get('/api/orders').then(res => {
            setOrders(res.data);
            setIsloading(false);
        })
    }, []);

    function ordersTotal(orders){
        let sum = 0;
        orders.forEach(order => {
            const {line_items} = order;
            line_items.forEach(li => {
                const lineSum = li.quantity * li.price_data.unit_amount / 100;
                sum+= lineSum;
            })
        })
        return  new Intl.NumberFormat('br-SE', ).format(sum);
    }

    if (isloading) {
        return (
            <div className="my-4">
                <Spinner fullWidth={true} />
            </div>
        )
    }


    const ordersToday = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24));
    const ordersWeek = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24*7));
    const orderMonth = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24*30));
    return (
        <div>
            <h2>Pedidos</h2>
            <div className="tiles-grid">
                <div className="tile">
                    <h3 className="tile-header">Hoje</h3>
                    <div className="tile-number">{ordersToday.length}</div>
                    <div className="tile-desc">Pedidos do dia</div>

                </div>
                <div className="tile">
                    <h3 className="tile-header">Semanas</h3>
                    <div className="tile-number">{ordersWeek.length}</div>
                    <div className="tile-desc">Pedidos da Semana</div>

                </div>
                <div className="tile">
                    <h3 className="tile-header">mês</h3>
                    <div className="tile-number">{orderMonth.length}</div>
                    <div className="tile-desc">Pedidos do Mês</div>

                </div>
            </div>

            <h2>Receita</h2>
            <div className="tiles-grid">
                <div className="tile">
                    <h3 className="tile-header">Lucro </h3>
                    <div className="tile-number">${ordersTotal(ordersToday)}</div>
                    <div className="tile-desc">{ordersToday.length} Pedidos do dia</div>

                </div>
                <div className="tile">
                    <h3 className="tile-header">Lucro</h3>
                    <div className="tile-number">${ordersTotal(ordersWeek)}</div>
                    <div className="tile-desc">{ordersWeek.length} Pedidos da semana</div>

                </div>
                <div className="tile">
                    <h3 className="tile-header">Pedidos do mês</h3>
                    <div className="tile-number">${ordersTotal(orderMonth)}</div>
                    <div className="tile-desc">{orderMonth.length} Pedidos do Mês</div>
                </div>
            </div>
        </div>
    )
}