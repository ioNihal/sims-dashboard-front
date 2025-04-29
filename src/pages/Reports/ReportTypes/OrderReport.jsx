
import {
    BarChart, Bar,
    LineChart, Line,
    PieChart, Pie, Cell,
    ResponsiveContainer,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend
} from "recharts";

import styles from "../../../styles/PageStyles/Reports/common.module.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#6200ea"];

const OrderReport = ({ data }) => {


    return (
        <>
            <div className={styles.chartBox}>
                <h4>Orders by Status</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={previewData.statusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%" cy="50%"
                            outerRadius={80}
                            label
                        >
                            {previewData.statusData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* 2. Daily Orders */}
            <div className={styles.chartBox}>
                <h4>Daily Orders</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={previewData.daily}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke={COLORS[1]} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 3. Revenue by Status */}
            <div className={styles.chartBox}>
                <h4>Revenue by Status</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={previewData.revenueStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="value" barSize={15} fill={COLORS[2]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </>
    )
}

export default OrderReport;