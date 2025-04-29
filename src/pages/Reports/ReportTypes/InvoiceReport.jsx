
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

const InvoiceReport = ({ data }) => {


    return (
        <>
            <div className={styles.chartBox}>
                <h4>Invoices by Status</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>previewData
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

            {/* 2. Daily Invoice Count */}
            <div className={styles.chartBox}>
                <h4>Daily Invoice Count</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={previewData.dailyCount}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke={COLORS[1]} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 3. Daily Revenue */}
            <div className={styles.chartBox}>
                <h4>Daily Revenue</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={previewData.dailyRev}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="total" fill={COLORS[2]} barSize={15} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </>
    )
}

export default InvoiceReport;