import {CurrentStatusResponse} from "api/src/types";
import {Box, Paper, styled, Typography} from "@mui/material";
import React from "react";

interface SummaryBarProps {
  status: CurrentStatusResponse;
}

export const SummaryBar = ({status}: SummaryBarProps) => {
  return <Box sx={{ display: 'flex', p: 4, gap: 4, whiteSpace: 'nowrap', flexWrap: 'wrap', justifyContent: 'center' }}>
    <Container elevation={2}>
      <Typography variant="body2" sx={{ mb: 2 }}>Active Connections:</Typography>
      <Typography variant="h6">{status.activeConnections}</Typography>
    </Container>

    <Container elevation={2}>
      <Typography variant="body2" sx={{ mb: 2 }}>Servers count:</Typography>
      <Typography variant="h6">{status.serverCount}</Typography>
    </Container>

    <Container elevation={2}>
      <Typography variant="body2" sx={{ mb: 2 }}>CPUs:</Typography>
      <Typography variant="h6">{status.cpus}</Typography>
    </Container>

    <Container elevation={2}>
      <Typography variant="body2" sx={{ mb: 2 }}>CPU Load:</Typography>
      <Typography variant="h6">{status.cpuLoad}</Typography>
    </Container>

    <Container elevation={2}>
      <Typography variant="body2" sx={{ mb: 2 }}>Wait:</Typography>
      <Typography variant="h6">{(status.waitTime / 1000).toFixed(2)}s</Typography>
    </Container>

  </Box>

}

const Container = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'right',
  color: theme.palette.text.secondary,
  padding: theme.spacing(2),
  minWidth: 120
}));
