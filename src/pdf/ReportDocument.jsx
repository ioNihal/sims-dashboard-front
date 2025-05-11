
import React from 'react';
import {
    Document,
    Page,
    View,
    Text,
    StyleSheet,
    Image,
} from '@react-pdf/renderer';

// use only built-in PDF fonts: Helvetica, Times-Roman, Courier, etc.
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 12,
        padding: 20,
        backgroundColor: '#fff5f0',
    },
    title: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 18,
        marginBottom: 8,
        color: '#3d3530',
    },
    meta: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#655d58',
        marginBottom: 12,
    },
    section: { marginBottom: 12 },
    heading: { fontFamily: 'Helvetica-Bold', fontSize: 14, marginBottom: 4 },
    detailRow: {
        fontFamily: 'Helvetica',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    detailLabel: { fontFamily: 'Helvetica-Bold' },
    chartPlaceholder: {
        height: 150,
        border: '1pt solid #d3c6bf',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    chartImage: { width: '100%', height: 200, marginTop: 8 },

});

export function ReportDocument({ report, chartImage  }) {
    const { name, type, dateRange, dataDetails } = report;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>{name || `${type} Report`}</Text>
                <Text style={styles.meta}>
                    Type: {type} • Period:{' '}
                    {new Date(dateRange.start).toLocaleDateString()} –{' '}
                    {new Date(dateRange.end).toLocaleDateString()}
                </Text>

                {dataDetails && (
                    <View style={styles.section}>
                        <Text style={styles.heading}>Summary</Text>
                        {Object.entries(dataDetails).map(([label, val]) => (
                            <View key={label} style={styles.detailRow}>
                                <Text style={styles.detailLabel}>{label}:</Text>
                                <Text>{val}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.heading}>Charts</Text>
                    {chartImage ? (
                        <Image style={styles.chartImage} src={chartImage} />
                    ) : (
                        <Text>No chart image</Text>
                    )}
                </View>
            </Page>
        </Document>
    );
}
