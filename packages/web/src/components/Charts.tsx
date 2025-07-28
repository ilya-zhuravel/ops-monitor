import {ServerStatusHistory} from "api/src/types";
import {Box, Typography} from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import {format} from "date-fns";

interface ChartsProps {
  history: ServerStatusHistory;
}

export const Charts = ({history}: ChartsProps) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%' }}>
      <Box sx={{mx: 2}}>
        <Typography variant="h6">CPU Load</Typography>
        <LineChart
          xAxis={[{
            data: history.data.map(entry => entry.ts),
            valueFormatter: (value: number) => format(value, 'hh:mm'),
          }]}
          series={[
            {
              showMark: false,
              data: history.data.map(entry => entry.cpuLoad),
            },
          ]}
          height={300}
          hideLegend={true}
        />
      </Box>

      <Box sx={{mx: 2}}>
        <Typography variant="h6">Active Connections</Typography>
        <LineChart
          xAxis={[{
            data: history.data.map(entry => entry.ts),
            valueFormatter: (value: number) => format(value, 'hh:mm'),
          }]}
          series={[
            { showMark: false,
              data: history.data.map(entry => entry.activeConnections),
            },
          ]}
          height={300}
          hideLegend={true}
        />
      </Box>

      <Box sx={{mx: 2}}>
        <Typography variant="h6">Waiting time</Typography>
        <LineChart
          xAxis={[{
            data: history.data.map(entry => entry.ts),
            valueFormatter: (value: number) => format(value, 'hh:mm'),
          }]}
          series={[
            { showMark: false,
              data: history.data.map(entry => entry.waitTime),
            },
          ]}
          height={300}
          hideLegend={true}
        />
      </Box>
    </Box>
  );
}
