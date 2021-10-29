import { Button, Card, CardContent, Chip, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ChartRenderer from '../components/ChartRenderer';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Close, DragIndicator } from '@mui/icons-material';
import { Box } from '@mui/system';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardItems = [
    {
        id: 0,
        name: 'Total Quantity Purchased by category',
        vizState: {
            query: {
                measures: ['Orders.count'],
                timeDimensions: [
                    {
                        dimension: 'Orders.createdAt',
                        dateRange: 'This month',
                    },
                ],
                order: {
                    'Orders.count': 'desc',
                },
                dimensions: ['ProductCategories.name'],
                filters: [
                    // {
                    //     member: 'Users.city',
                    //     operator: 'equals',
                    //     values: ['Austin']
                    // }
                ],
            },
            chartType: 'pie',
        },
    },
    {
        id: 1,
        name: 'Total Quantity Purchased by City',
        vizState: {
            query: {
                measures: ['Orders.count'],
                dimensions: ['Users.city'],
                timeDimensions: [
                    {
                        dimension: 'Orders.createdAt',
                        dateRange: 'This month',
                    },
                ],
            },
            chartType: 'bar',
        },
    },
    {
        id: 2,
        name: 'Total Products Purchased by category',
        vizState: {
            query: {
                measures: [
                    "Orders.count"
                ],
                timeDimensions: [
                    {
                        "dimension": "Orders.createdAt",
                        "granularity": "day",
                        "dateRange": "This month"
                    }
                ],
                order: [
                    [
                        "Orders.createdAt",
                        "asc"
                    ]
                ],
                dimensions: [
                    "ProductCategories.name"
                ],
                filters: [

                ]
            },
            chartType: 'bar'
        }
    }
];

const layouts = {
    lg: [
        { i: "0", x: 0, y: 0, h: 3, w: 6 },
        { i: "1", x: 6, y: 0, h: 3, w: 6 },
        { i: "2", x: 0, y: 3, h: 3, w: 6 }
    ]
}

const DateRanges = [
    { title: 'All time', value: undefined },
    { value: 'Today' },
    { value: 'Yesterday' },
    { value: 'This week' },
    { value: 'This month' },
    { value: 'This quarter' },
    { value: 'This year' },
    { value: 'Last 7 days' },
    { value: 'Last 30 days' },
    { value: 'Last week' },
    { value: 'Last month' },
    { value: 'Last quarter' },
    { value: 'Last year' }
];


const cities = [
    { value: 'Austin' },
    { value: 'Chicago' },
    { value: 'Los Angeles' },
    { value: 'Mountain View' },
    { value: 'New York' },
    { value: 'Palo Alto' },
    { value: 'San Francisco' },
    { value: 'Seattle' }
];


const DashboardItem = (props: any) => {
    console.log(props);
    const { item, onDrilldownClick, className } = props;
    return (
        <Card key={item.id} style={{ height: '100%' }}>
            <CardContent style={{ height: '100%', width: '95%' }}>
                <Box display="flex" alignItems="center">
                    <DragIndicator className="drag-indicator" />
                    <Typography color="textSecondary">
                        {item.name}
                    </Typography>
                </Box>
                <ChartRenderer vizState={{ ...item.vizState, drilldownCallback: onDrilldownClick }} />
            </CardContent>
        </Card>
    )
};

const DashboardPage = () => {
    const [drillDownFilter, setDrillDownFilter] = useState<any>([]);
    const [widgets, setWidgets] = useState(DashboardItems);
    const [range, setRange] = useState('Last month');
    const [cityValues, setCityValues] = useState<string[]>([]);

    const handleCityNameChange = (e: SelectChangeEvent<typeof cityValues>) => {
        const { target: { value } } = e;
        console.log(value)
        setCityValues(typeof value === 'string' ? value.split(',') : value);
    };

    useEffect(() => {
        if (cityValues.length > 0) {
            const cityFilter = {
                member: 'Users.city',
                operator: 'equals',
                values: cityValues
            };
            const updatedWidgets = widgets.map(widget => {
                const newWidget = { ...widget };
                if (newWidget.vizState.query.filters) {
                    let isCityFilterApplied = false;
                    newWidget.vizState.query = {
                        ...newWidget.vizState.query,
                        filters: newWidget.vizState.query.filters.map((filter: any) => {
                        const newFilter = { ...filter };
                        const { member, operator } = newFilter;

                        if (member === 'Users.city' && operator === 'equals') {
                            isCityFilterApplied = true;
                            newFilter.values = cityValues;
                        }
                        console.log(newFilter)
                        return newFilter;
                    }) as unknown as never[]
                };
                    if (!isCityFilterApplied) {
                        newWidget.vizState.query = {
                            ...newWidget.vizState.query,
                            filters: [...newWidget.vizState.query.filters, cityFilter as unknown as never]
                        } as any;
                    }
                } else {
                    newWidget.vizState.query = {
                        ...newWidget.vizState.query,
                        filters: [cityFilter as unknown as never]
                    } as any;
                }
                console.log(newWidget)
                return newWidget;
            });
            setWidgets(updatedWidgets)
        } else if (cityValues.length === 0) {
            const updatedWidgets = widgets.map(widget => {
                const newWidget = { ...widget };
                newWidget.vizState.query = {
                    ...newWidget.vizState.query,
                    filters: newWidget.vizState.query?.filters?.filter((f: any) => f.member !== 'Users.city' && f.operator !== 'equals') as unknown as never[]
                } as any;
                return newWidget;
            });
            setWidgets(updatedWidgets)
        }
    }, [cityValues]);

    const onDrilldownClick = (filter: any[]) => {
        if (filter && filter.length > 0) {
            setDrillDownFilter(filter);
            const updatedItems = widgets.map(w => {
                if (w.vizState.query.filters) {
                    return {
                        ...w,
                        vizState: {
                            ...w.vizState,
                            query: {
                                ...w.vizState.query,
                                filters: [
                                    ...w.vizState.query.filters,
                                    ...filter
                                ]
                            }
                        }
                    };
                } else {
                    return {
                        ...w,
                        vizState: {
                            ...w.vizState,
                            query: {
                                ...w.vizState.query,
                                filters: filter
                            }
                        }
                    }
                }
            });
            setWidgets(updatedItems as unknown as any[]);
        }
    };


    const onClearFilter = () => {
        const updatedWidgets = widgets.map(w => ({
            ...w,
            vizState: {
                ...w.vizState,
                query: {
                    ...w.vizState.query,
                    filters: []
                }
            }
        }));

        setWidgets(updatedWidgets as unknown as any[]);
        setDrillDownFilter([]);
    };

    const Filter = () => (
        <Card>
            <CardContent>
                <FormControl size="small" sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="time-range">Range</InputLabel>
                    <Select
                        labelId="time-range"
                        id="time-range"
                        value={range}
                        variant="outlined"
                        onChange={e => { setRange(e.target.value); }}
                    >
                        {DateRanges.map(operator => (
                            <MenuItem key={operator.value} value={operator.value}>
                                {operator.title || operator.value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="city-filter">City</InputLabel>
                    <Select
                        labelId="city-filter"
                        id="city-filter"
                        variant="outlined"
                        label="City"
                        onChange={handleCityNameChange}
                        multiple
                        value={cityValues}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {cities.map(city => (
                            <MenuItem key={city.value} value={city.value}>
                                {city.value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {drillDownFilter && drillDownFilter.length > 0 && <Button startIcon={<Close />} onClick={onClearFilter}>Clear</Button>}
            </CardContent>
        </Card>
    );

    useEffect(() => {
        const updatedItems = widgets.map(w => {
            return {
                ...w,
                vizState: {
                    ...w.vizState,
                    query: {
                        ...w.vizState.query,
                        timeDimensions: [
                            {
                                ...w.vizState.query.timeDimensions[0],
                                dateRange: range
                            }
                        ]
                    }
                }
            };
        });
        setWidgets(updatedItems as unknown as any[]);
    }, [range]);


    const Empty = () => (
        <div
            style={{
                textAlign: 'center',
                padding: 12,
            }}
        >
            <Typography variant="h5" color="inherit">
                There are no charts on this dashboard. Use Playground Build to add one.
            </Typography>
        </div>
    );

    return DashboardItems.length ? (
        <>
            <Filter />
            <ResponsiveGridLayout
                className="layout"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                layouts={layouts}
                onLayoutChange={(layout, layouts) => console.log(layouts, layout)}
                autoSize
                isResizable
                resizeHandles={['se']}
                draggableHandle=".drag-indicator"
            >{widgets.map(item => (
                <div key={item.id}>
                    <DashboardItem
                        item={item}
                        onDrilldownClick={onDrilldownClick}

                    />
                </div>
            ))}</ResponsiveGridLayout>
        </>
    ) : (
        <Empty />
    );
}

export default DashboardPage;
