
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

const SalesReport = ({ data }) => {


    return (
        <>
            <div className={styles.chartBox}>
                <h4>Daily Sales</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={previewData.salesDaily}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="total" barSize={15} fill={COLORS[0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 2. Cumulative Sales */}
            <div className={styles.chartBox}>
                <h4>Cumulative Sales</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={previewData.salesCumulative}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="cumulative" stroke={COLORS[1]} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>


            {/* 4. Sales by Weekday */}
            <div className={styles.chartBox}>
                <h4>Sales by Weekday</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={previewData.weekdayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="total" barSize={15} fill={COLORS[2]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default SalesReport;