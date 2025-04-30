
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

const CategoryReport = ({ data }) => {


    return (
        <>
            <div className={styles.chartBox}>
                <h4>Quantity by Category</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.qtyData}>
                        <XAxis dataKey="category" tick={{ fontSize: "0.55rem" }} />
                        <YAxis tick={{ fontSize: "0.55rem" }} />
                        <Tooltip />
                        <Bar dataKey="qty" fill={COLORS[1]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Value by Category */}
            <div className={styles.chartBox}>
                <h4>Value by Category</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.valueData}>
                        <XAxis dataKey="category" tick={{ fontSize: "0.55rem" }} />
                        <YAxis tick={{ fontSize: "0.55rem" }} />
                        <Tooltip />
                        <Bar dataKey="totalValue" fill={COLORS[2]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* SKUs per Category */}
            <div className={styles.chartBox}>
                <h4>Distinct SKUs</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data.skuData}>
                        <XAxis dataKey="category" tick={{ fontSize: "0.55rem" }} />
                        <YAxis tick={{ fontSize: "0.55rem" }} />
                        <Tooltip />
                        <Bar dataKey="skus" fill={COLORS[4]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Avg Days in Stock */}
            <div className={styles.chartBox}>
                <h4>Avg Days in Stock</h4>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data.ageData}>
                        <XAxis dataKey="category" tick={{ fontSize: "0.55rem" }} />
                        <YAxis tick={{ fontSize: "0.55rem" }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="avgDays" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default CategoryReport;