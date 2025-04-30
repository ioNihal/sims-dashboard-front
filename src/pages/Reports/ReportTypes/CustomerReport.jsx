
import {
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    ResponsiveContainer,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend
} from "recharts";
import styles from "../../../styles/PageStyles/Reports/common.module.css"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#6200ea"];

const CustomerReport = ({ data }) => {



    return (
        <>
            <div className={styles.chartBox}>
                <h4>Daily New Customers</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.dailyNew}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: "0.55rem" }} />
                        <YAxis tick={{ fontSize: "0.55rem" }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke={COLORS[0]} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 2. Daily Active Customers */}
            <div className={styles.chartBox}>
                <h4>Daily Active Customers</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.dailyActive}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: "0.55rem" }} />
                        <YAxis tick={{ fontSize: "0.55rem" }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke={COLORS[1]} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 3. Orders per Customer */}
            <div className={styles.chartBox}>
                <h4>Orders per Customer</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.ordersPerCust}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: "0.55rem" }} />
                        <Tooltip />
                        <Bar dataKey="orders" fill={COLORS[2]} barSize={15} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default CustomerReport;