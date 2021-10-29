import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactECharts from 'echarts-for-react';
import { useCubeQuery } from "@cubejs-client/react";
import { Table, TableBody, TableRow, TableHead, TableCell, CircularProgress } from '@mui/material';


const BarChartRenderer = ({ resultSet, pivotConfig, onDrilldownRequested, isLoading }: any) => {
    // console.log(resultSet.categories(), resultSet.series(), pivotConfig, onDrilldownRequested, isLoading);
    const [seriesData, setSeriesData] = useState([]);

    useEffect(() => {
        const series = resultSet.series();
        if (series.length > 0) {
            const data = series.map((s: { title: any; series: any[]; }) => ({
                type: 'bar',
                name: s.title,
                data: s.series.map(r => r.value),
                stack: true
            }));
            setSeriesData(data);
        }
    }, [resultSet])

    const drilldownHandler = (element: any) => {
        // console.log(element)
      const { dataIndex, seriesIndex } = element;
      const xValues = [resultSet.categories().map((c: { x: any; }) => c.x)[dataIndex]];
      const yValues = resultSet.series().map((s: { key: any; }) => [s.key])[seriesIndex][0].split(',');
      // console.log(yValues)
      if (typeof onDrilldownRequested === 'function') {
          onDrilldownRequested({ xValues, yValues }, { y: ['Orders.status']});
      }
    };

    const chartRef = useRef(null);

    return (
                <ReactECharts
                    ref={chartRef}
                    style={{ height: '80%' }}
                    option={{
                        xAxis: {
                            type: 'category',
                            data: resultSet.categories().map((c: { x: any; }) => c.x)
                        },
                        tooltip: { show: true },
                        yAxis: {},
                        legend: { show: true, bottom: 0 },
                        toolbox: { show: true, feature: { dataZoom: { yAxisIndex: 'none' } } },
                        series: seriesData
                    }}
                    onEvents={{
                        'click': drilldownHandler,
                    }}
                />
    );
};

const LineChartRenderer = ({ resultSet, pivotConfig, onDrilldownRequested, isLoading }: any) => {
    const [seriesData, setSeriesData] = useState([]);

    useEffect(() => {
        const series = resultSet.series();
        if (series.length > 0) {
            const data = series.map((s: { title: any; series: any[]; }) => ({
                type: 'line',
                name: s.title,
                data: s.series.map((r: { value: any; }) => r.value),
                stack: true,
            }));
            setSeriesData(data);
        }
    }, [resultSet])

    return (
                <ReactECharts
                style={{ height: '80%' }}
                    option={{
                        xAxis: {
                            type: 'category',
                            data: resultSet.categories().map((c: { x: any; }) => c.x)
                        },
                        tooltip: { show: true },
                        yAxis: {},
                        legend: { show: true },
                        series: seriesData
                    }}
                    onEvents={{
                        'click': onDrilldownRequested
                    }}
                />
    );
};

const AreaChartRenderer = ({ resultSet, pivotConfig, onDrilldownRequested, isLoading }: any) => {
    const [seriesData, setSeriesData] = useState([]);

    useEffect(() => {
        const series = resultSet.series();
        if (series.length > 0) {
            const data = series.map((s: { title: any; series: any[]; }) => ({
                type: 'line',
                name: s.title,
                data: s.series.map((r: { value: any; }) => r.value),
                stack: true,
                areaStyle: {},
            }));
            setSeriesData(data);
        }
    }, [resultSet]);

    return (
                <ReactECharts
                    option={{
                        xAxis: {
                            type: 'category',
                            data: resultSet.categories().map((c: { x: any; }) => c.x)
                        },
                        tooltip: { show: true },
                        yAxis: {},
                        legend: { show: true },
                        series: seriesData
                    }}
                    style={{ height: '80%' }}
                />
    );
};

const PieChartRenderer = ({ resultSet, pivotConfig, onDrilldownRequested, isLoading }: any) => {
    console.log(resultSet.categories(), resultSet.series(), pivotConfig, onDrilldownRequested, isLoading);
    const [seriesData, setSeriesData] = useState([]);
    useEffect(() => {
        const series = resultSet.series();
        if (series.length > 0) {
            const data = series.map((s: { title: any; series: any[]; }) => ({
                type: 'pie',
                name: s.title,
                data: s.series.map((r: { value: any; x: any; }) => ({ value: r.value, name: r.x })),
                radius: ['40%', '70%']
            }));
            setSeriesData(data);
        }
    }, [resultSet]);

    const drilldownHandler = (element: any) => {
        // console.log(element)
      const { dataIndex, seriesIndex } = element;
      const xValues = [resultSet.categories().map((c: { x: any; }) => c.x)[dataIndex]];
      const yValues = resultSet.series().map((s: { key: any; }) => [s.key])[seriesIndex][0].split(',');
      // console.log(yValues)
      if (typeof onDrilldownRequested === 'function') {
          onDrilldownRequested({ xValues, yValues });
      }
    };
    return (
                <ReactECharts
                    option={{
                        series: seriesData,
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: { show: true, bottom: 0 },
                    }}
                    style={{ height: '80%' }}
                    onEvents={{
                        'click': drilldownHandler
                    }}
                />
    );
}

const TableRenderer = ({ resultSet }: any) => {
    return (
        <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                    {resultSet.tableColumns().map((c: { key: React.Key | null | undefined; title: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
                        <TableCell key={c.key}>{c.title}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {resultSet.tablePivot().map((row: { [x: string]: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                    <TableRow key={index}>
                        {resultSet.tableColumns().map((c: { key: React.Key }) => (
                            <TableCell key={c.key}>{row[c.key]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

const TypeToChartComponent: any = {
    bar: ({ resultSet, pivotConfig, onDrilldownRequested, isLoading }: any) => <BarChartRenderer resultSet={resultSet} pivotConfig={pivotConfig} onDrilldownRequested={onDrilldownRequested} isLoading={isLoading} />,
    table: ({ resultSet }: any) => <TableRenderer resultSet={resultSet} />,
    pie: ({ resultSet, pivotConfig, onDrilldownRequested, isLoading }: any) => <PieChartRenderer resultSet={resultSet} pivotConfig={pivotConfig} onDrilldownRequested={onDrilldownRequested} isLoading={isLoading} />,
    line: ({ resultSet, pivotConfig, onDrilldownRequested, isLoading }: any) => <LineChartRenderer resultSet={resultSet} pivotConfig={pivotConfig} onDrilldownRequested={onDrilldownRequested} isLoading={isLoading} />,
    area: ({ resultSet, pivotConfig, onDrilldownRequested, isLoading }: any) => <AreaChartRenderer resultSet={resultSet} pivotConfig={pivotConfig} onDrilldownRequested={onDrilldownRequested} isLoading={isLoading} />,
};

const renderChart =
    (Component: any) =>
        ({ resultSet, error, ...props }: any) => {
            console.log(props)
            const [drillDownQuery, setDrillDownQuery] = useState({});
            const drillDownResponse = useCubeQuery(
                drillDownQuery,
                {
                skip: !drillDownQuery
                }
            );
            const drilldownCallback = useCallback((val, config) => {
                setDrillDownQuery(resultSet.drillDown(val, config));
                console.log(resultSet.drillDown(val, config))
                props.drilldownCallback(resultSet.drillDown(val, config)?.filters);
            }, [props, resultSet])
            console.log(drillDownResponse, drillDownQuery)
            console.log(drillDownResponse.resultSet && drillDownResponse.resultSet.tablePivot())
            return (resultSet && <Component onDrilldownRequested={drilldownCallback} resultSet={resultSet} {...props} />) ||
                (error && error.toString()) || <CircularProgress />
        };

const ChartRenderer = ({ vizState = {} }: any) => {
    const { query, chartType, ...options } = vizState;
    const component = TypeToChartComponent[chartType] || null;
    const renderProps = useCubeQuery(query);
    return component && renderChart(component)({ ...options, ...renderProps });
}

export default ChartRenderer;
