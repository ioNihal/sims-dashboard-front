
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

const InventoryReport = ({ data }) => {


    return (
        <>
            <div className={styles.chartBox}>
                <h4>Status</h4>
                <ResponsiveContainer width="100%" height={200} style={{position: "grid", placeItems: "center"}} >
                    <PieChart>
                        <Pie data={data.statusData} dataKey="value" nameKey="name" outerRadius="75%" label={{fontSize: "0.6rem"}} >
                            {data.statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}  style={{ outline: 'none' }} />)}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: "0.55rem" }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* 2. Qty by Category Bar */}
            <div className={styles.chartBox}>
                <h4>Qty by Category</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.qtyByCatData} >
                        <XAxis dataKey="category" tick={{ fontSize: "0.55rem" }} />
                        <YAxis tick={{ fontSize: "0.55rem" }} />
                        <Tooltip />
                        <Bar dataKey="qty" fill={COLORS[1]} barSize={15} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 3. Value by Category Bar */}
            <div className={styles.chartBox}>
                <h4>Value by Category</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.valueByCatData}>
                        <XAxis dataKey="category" tick={{ fontSize: "0.55rem" }} />
                        <YAxis tick={{ fontSize: "0.55rem" }} />
                        <Tooltip />
                        <Bar dataKey="total" fill={COLORS[2]} barSize={15}  />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 4. Aging Histogram */}
            <div className={styles.chartBox}>
                <h4>Aging (days)</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.agingData}>
                        <XAxis dataKey="range" tick={{ fontSize: "0.55rem" }} />
                        <YAxis tick={{ fontSize: "0.55rem" }} />
                        <Tooltip />
                        <Bar dataKey="count" fill={COLORS[3]} barSize={15} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default InventoryReport;