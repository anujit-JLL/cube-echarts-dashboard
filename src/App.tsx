import React from 'react';
import './App.css';
import cubejs from '@cubejs-client/core';
import WebSocketTransport from '@cubejs-client/ws-transport';
import { CubeProvider } from '@cubejs-client/react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import GridLayout, { Responsive, WidthProvider } from 'react-grid-layout';
import { Box } from '@mui/system';
import { Card, CardContent } from '@mui/material';
import DashboardPage from './pages/DashboardPage';

const API_URL = 'http://localhost:4000';
const CUBEJS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzQwMzM5MzgsImV4cCI6MTYzNDEyMDMzOH0.N9EQha8SXBOITAB8q948jbW3VB8wEWDrhK3A-jKeaCE';
const cubejsApi = cubejs({
  transport: new WebSocketTransport({
    authorization: CUBEJS_TOKEN,
    apiUrl: API_URL.replace('http', 'ws'),
  }),
  apiUrl: API_URL.replace('http', 'ws'),
});

const ResponsiveGridLayout = WidthProvider(Responsive);

function App() {
  const layout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 2 },
    { i: 'b', x: 1, y: 0, w: 3, h: 2 },
    { i: 'c', x: 4, y: 0, w: 1, h: 2 }
  ];
  return (
    <CubeProvider cubejsApi={cubejsApi}>
      <Box height="100vh" width="100vw" style={{ background: '#333' }}>
        {/* <GridLayout className="layout" cols={12} layout={layout} rowHeight={100} margin={[10, 10]} containerPadding={[4, 4]}>
          <div key="a">a</div>
          <div key="b">b</div>
          <div key="c">c</div>
        </GridLayout> */}
          <DashboardPage />
      </Box>
    </CubeProvider>
  );
}

export default App;
