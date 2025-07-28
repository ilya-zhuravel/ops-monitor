import {CurrentStatusResponse} from "api/dist/types";
import {Box, Typography} from "@mui/material";
import React from "react";

interface SummaryBarProps {
  status: CurrentStatusResponse;
}

export const SummaryBar = ({status}: SummaryBarProps) => {
  return <Box sx={{ display: 'flex', p: 4, gap: 2, whiteSpace: 'nowrap', flexWrap: 'wrap', justifyContent: 'center' }}>
    <Typography variant="h6">Active Connections: {status.activeConnections}</Typography>
    <Typography variant="h6">Servers count: {status.serverCount}</Typography>
    <Typography variant="h6">CPUs: {status.cpus}</Typography>
    <Typography variant="h6">CPU Load: {status.cpuLoad}%</Typography>
    <Typography variant="h6">Wait: {(status.waitTime / 1000).toFixed(2)}s</Typography>
  </Box>

}
