import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import * as React from 'react';

const xLabels = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];

const FrequencyGraph = ({ data }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6">Frequency of Marks</Typography>
      <BarChart
        width={500}
        height={300}
        series={[{ data: data }]}
        xAxis={[
          {
            data: xLabels,
            scaleType: 'band',
            label: 'Marks (Percentage %)',
            tickPlacement: 'end',
            tickLabelPlacement: 'end',
          },
        ]}
        yAxis={[
          {
            label: 'No. of Students',
          },
        ]}
      />
    </Box>
  );
};

export default FrequencyGraph;