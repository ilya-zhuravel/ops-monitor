import React, {useCallback, useEffect, useState} from 'react';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import {
  Alert,
  AppBar,
  Box,
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
  Typography
} from "@mui/material";
import {socket} from "./socket";
import './App.css';
import {REGIONS} from "./constants";
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {CurrentStatusResponse, type ServerStatusHistory} from "api/src/types";
import {SummaryBar} from "./components/SummaryBar";
import {Charts} from "./components/Charts";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [error, setError] = useState('');
  const [region, setRegion] = useState('');
  const [currentStatus, setCurrentStatus] = useState<CurrentStatusResponse | undefined>();
  const [statusHistory, setStatusHistory] = useState<ServerStatusHistory | undefined>();
  const handleRegionChange = (event: SelectChangeEvent<string>) => {
    const region = event.target.value;
    setRegion(region || '');
  }

  const onStatusUpdate = useCallback((data: CurrentStatusResponse) => {
    setCurrentStatus(data);
  }, []);

  const onStatusHistory = useCallback((data: ServerStatusHistory) => {
    setStatusHistory(data);
  }, []);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    }

    const onDisconnect = () => {
      setIsConnected(false);
    }

    const onError = (err: Error, a: unknown) => {
      setError(err?.message || 'An error occurred');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('exception', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('exception', onError);
    };
  }, []);

  useEffect(() => {
    if (!region) {
      return;
    }

    socket.on('currentStatus', onStatusUpdate);
    socket.on('statusHistory', onStatusHistory);

    socket.emit('setRegion', { region });
    socket.emit('getStatusHistory', { region });

    return () => {
      socket.off('currentStatus', onStatusUpdate);
      socket.off('statusHistory', onStatusHistory);
    }
  }, [region]);

  return (<ThemeProvider theme={darkTheme}>
    <div className="App">
      <div className="App-container">
        <Typography variant="h2">Ops Monitor</Typography>
        <AppBar position="static" color="default">
          <Toolbar sx={{display: 'flex', justifyContent: 'center', gap: 10}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
              <Typography>Monitor Status</Typography>
              {isConnected
                ? <LinkIcon fontSize="small" color="success" />
                : <LinkOffIcon fontSize="small" color="error" />}
            </Box>

            <FormControl sx={{minWidth: 200}}>
              <InputLabel id="region-label">Region</InputLabel>
              <Select
                labelId="region-label"
                id="region-selector"
                value={region}
                label="Region"
                onChange={handleRegionChange}
              >
                {REGIONS.map((region) => (<MenuItem value={region}>{region}</MenuItem>))}
              </Select>
            </FormControl>
          </Toolbar>
        </AppBar>
        {currentStatus && <SummaryBar status={currentStatus} />}
        {error && <Alert severity="warning" sx={{m: 4}} onClose={() => setError('')}>
          {error}
        </Alert>}
        {statusHistory && <Charts history={statusHistory} />}
      </div>
    </div>
  </ThemeProvider>);
}

export default App;
