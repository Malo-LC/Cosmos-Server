import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import * as API from '../../api';
import { useClientInfos } from '../../utils/hooks';
import { getFullOrigin } from '../../utils/routes';
import { ServAppIcon } from '../../utils/servapp-icon';
import MiniPlotComponent from '../dashboard/components/mini-plot';
import { FormaterForMetric } from '../dashboard/components/utils';
import { optionsRadial } from './GraphConstants';
import renderAlerts from './renderAlerts';
import TransparentHeader from './TransparentHeader';
import HomeBackground from './HomeBackground';

const HomePage = () => {
  const [servApps, setServApps] = useState([]);
  const [config, setConfig] = useState(null);
  const [coStatus, setCoStatus] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const { role } = useClientInfos();

  const isDark = theme.palette.mode === 'dark';
  const isAdmin = role === '2';

  const blockStyle = {
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle'
  };

  const appColor = isDark
    ? {
        color: 'white',
        background: 'rgba(10,10,10,0.42)'
      }
    : {
        color: 'black',
        background: 'rgba(245,245,245,0.42)'
      };

  const appBorder = isDark ? {} : {};

  const refreshStatus = () => {
    API.getStatus().then((res) => {
      setCoStatus(res.data);
    });
  };

  function getMetrics() {
    if (!isAdmin) return;

    API.metrics
      .get([
        'cosmos.system.cpu.0',
        'cosmos.system.ram',
        'cosmos.system.netTx',
        'cosmos.system.netRx',
        'cosmos.proxy.all.success',
        'cosmos.proxy.all.error'
      ])
      .then((res) => {
        setMetrics((prevMetrics) => {
          let finalMetrics = prevMetrics ? { ...prevMetrics } : {};
          if (res.data) {
            res.data.forEach((metric) => {
              finalMetrics[metric.Key] = metric;
            });

            return finalMetrics;
          }
        });
      });
  }

  const refreshConfig = () => {
    if (isAdmin) {
      API.docker.list().then((res) => {
        setServApps(res.data);
      });
    } else {
      setServApps([]);
    }
    API.config.get().then((res) => {
      setConfig(res.data);
    });
  };

  let routes = config && (config.HTTPConfig.ProxyConfig.Routes || []);

  useEffect(() => {
    refreshConfig();
    refreshStatus();

    let interval = setInterval(() => {
      if (isMd) getMetrics();
    }, 10000);

    if (isMd) getMetrics();

    return () => {
      clearInterval(interval);
    };
  }, []);

  // TODO : make the backend returns these values instead of doing the calculations here
  let latestCPU,
    latestRAM,
    latestRAMRaw,
    maxRAM,
    maxRAMRaw = 0;

  if (isAdmin && metrics) {
    if (
      metrics['cosmos.system.cpu.0'] &&
      metrics['cosmos.system.cpu.0'].Values &&
      metrics['cosmos.system.cpu.0'].Values.length > 0
    )
      latestCPU = metrics['cosmos.system.cpu.0'].Values[metrics['cosmos.system.cpu.0'].Values.length - 1].Value;

    if (
      metrics['cosmos.system.ram'] &&
      metrics['cosmos.system.ram'].Values &&
      metrics['cosmos.system.ram'].Values.length > 0
    ) {
      let formatRAM = metrics && FormaterForMetric(metrics['cosmos.system.ram'], false);
      latestRAMRaw = metrics['cosmos.system.ram'].Values[metrics['cosmos.system.ram'].Values.length - 1].Value;
      latestRAM = formatRAM(metrics['cosmos.system.ram'].Values[metrics['cosmos.system.ram'].Values.length - 1].Value);
      maxRAM = formatRAM(metrics['cosmos.system.ram'].Max);
      maxRAMRaw = metrics['cosmos.system.ram'].Max;
    }
  }

  return (
    <Stack spacing={2} style={{ maxWidth: '1450px', margin: 'auto' }}>
      <HomeBackground />
      <TransparentHeader />

      {isAdmin && coStatus && (
        <Stack style={{ zIndex: 2, padding: '0px 8px' }} spacing={1}>
          {renderAlerts(coStatus, config)}
        </Stack>
      )}

      <Grid2 container spacing={2} style={{ zIndex: 2 }}>
        {isAdmin && coStatus && !coStatus.MonitoringDisabled && (
          <>
            {isMd && !metrics && (
              <>
                <Grid2 item xs={12} sm={6} md={6} lg={3} xl={3} xxl={3} key={'000'}>
                  <Box className="app" style={{ height: '106px', borderRadius: 5, ...appColor }}>
                    <Stack
                      direction="row"
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      style={{ height: '100%' }}>
                      <Stack style={{ paddingLeft: '20px' }} spacing={0}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>CPU</div>
                        <div>-</div>
                        <div>-</div>
                      </Stack>
                      <div style={{ height: '97px' }}>-</div>
                    </Stack>
                  </Box>
                </Grid2>
                <Grid2 item xs={12} sm={6} md={6} lg={3} xl={3} xxl={3} key={'001'}>
                  <Box className="app" style={{ height: '106px', borderRadius: 5, ...appColor }}>
                    <Stack
                      direction="row"
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      style={{ height: '100%' }}>
                      <Stack style={{ paddingLeft: '20px' }} spacing={0}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>RAM</div>
                        <div>avail.: -</div>
                        <div>used: -</div>
                      </Stack>
                      <div style={{ height: '97px' }}>-</div>
                    </Stack>
                  </Box>
                </Grid2>
                <Grid2 item xs={12} sm={6} md={6} lg={3} xl={3} xxl={3} key={'001'}>
                  <Box className="app" style={{ height: '106px', borderRadius: 5, ...appColor }}>
                    <Stack direction="row" justifyContent={'center'} alignItems={'center'} style={{ height: '100%' }}>
                      -
                    </Stack>
                  </Box>
                </Grid2>
                <Grid2 item xs={12} sm={6} md={6} lg={3} xl={3} xxl={3} key={'001'}>
                  <Box className="app" style={{ height: '106px', borderRadius: 5, ...appColor }}>
                    <Stack direction="row" justifyContent={'center'} alignItems={'center'} style={{ height: '100%' }}>
                      -
                    </Stack>
                  </Box>
                </Grid2>
              </>
            )}

            {isMd && metrics && (
              <>
                <Grid2 item xs={12} sm={6} md={6} lg={3} xl={3} xxl={3} key={'000'}>
                  <Box className="app" style={{ height: '106px', borderRadius: 5, ...appColor }}>
                    <Stack
                      direction="row"
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      style={{ height: '100%' }}>
                      <Stack style={{ paddingLeft: '20px' }} spacing={0}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>CPU</div>
                        <div>{coStatus.CPU}</div>
                        <div>{coStatus.AVX ? 'AVX Supported' : 'No AVX Support'}</div>
                      </Stack>
                      <div style={{ height: '97px' }}>
                        <Chart
                          options={optionsRadial(theme)}
                          // series={[parseInt(
                          //     coStatus.resources.ram / (coStatus.resources.ram + coStatus.resources.ramFree) * 100
                          // )]}
                          series={[latestCPU]}
                          type="radialBar"
                          height={120}
                          width={120}
                        />
                      </div>
                    </Stack>
                  </Box>
                </Grid2>
                <Grid2 item xs={12} sm={6} md={6} lg={3} xl={3} xxl={3} key={'001'}>
                  <Box className="app" style={{ height: '106px', borderRadius: 5, ...appColor }}>
                    <Stack
                      direction="row"
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      style={{ height: '100%' }}>
                      <Stack style={{ paddingLeft: '20px' }} spacing={0}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>RAM</div>
                        <div>
                          avail.: <strong>{maxRAM}</strong>
                        </div>
                        <div>
                          used: <strong>{latestRAM}</strong>
                        </div>
                      </Stack>
                      <div style={{ height: '97px' }}>
                        <Chart
                          options={optionsRadial(theme)}
                          // series={[parseInt(
                          //     coStatus.resources.ram / (coStatus.resources.ram + coStatus.resources.ramFree) * 100
                          // )]}
                          series={[parseInt((latestRAMRaw / maxRAMRaw) * 100)]}
                          type="radialBar"
                          height={120}
                          width={120}
                        />
                      </div>
                    </Stack>
                  </Box>
                </Grid2>
                <Grid2 item xs={12} sm={6} md={6} lg={3} xl={3} xxl={3} key={'001'}>
                  <Box className="app" style={{ height: '106px', borderRadius: 5, ...appColor }}>
                    <Stack direction="row" justifyContent={'center'} alignItems={'center'} style={{ height: '100%' }}>
                      <MiniPlotComponent
                        noBackground
                        title="NETWORK"
                        agglo
                        metrics={['cosmos.system.netTx', 'cosmos.system.netRx']}
                        labels={{
                          ['cosmos.system.netTx']: 'trs:',
                          ['cosmos.system.netRx']: 'rcv:'
                        }}
                      />
                    </Stack>
                  </Box>
                </Grid2>
                <Grid2 item xs={12} sm={6} md={6} lg={3} xl={3} xxl={3} key={'001'}>
                  <Box className="app" style={{ height: '106px', borderRadius: 5, ...appColor }}>
                    <Stack direction="row" justifyContent={'center'} alignItems={'center'} style={{ height: '100%' }}>
                      <MiniPlotComponent
                        noBackground
                        title="URLS"
                        agglo
                        metrics={['cosmos.proxy.all.success', 'cosmos.proxy.all.error']}
                        labels={{
                          ['cosmos.proxy.all.success']: 'ok:',
                          ['cosmos.proxy.all.error']: 'err:'
                        }}
                      />
                    </Stack>
                  </Box>
                </Grid2>
              </>
            )}
          </>
        )}

        {config &&
          servApps &&
          routes.map((route) => {
            let skip = route.Mode == 'REDIRECT';
            let containerName;
            let container;
            if (route.Mode == 'SERVAPP') {
              containerName = route.Target.split(':')[1].slice(2);
              container = servApps.find((c) => c.Names.includes('/' + containerName));
              // TOOD: rework, as it prevents users from seeing the apps
              // if (!container || container.State != "running") {
              //     skip = true
              // }
            }

            if (route.HideFromDashboard) skip = true;

            return (
              !skip &&
              coStatus &&
              (coStatus.homepage.Expanded ? (
                <Grid2 item xs={12} sm={6} md={4} lg={3} xl={3} xxl={3} key={route.Name}>
                  <Box className="app app-hover" style={{ padding: 25, borderRadius: 5, ...appColor, ...appBorder }}>
                    <Link to={getFullOrigin(route)} target="_blank" style={{ textDecoration: 'none', ...appColor }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <ServAppIcon container={container} route={route} className="loading-image" width="70px" />
                        <div style={{ minWidth: 0 }}>
                          <h3 style={blockStyle}>{route.Name}</h3>
                          <p style={blockStyle}>{route.Description}</p>
                          <p style={{ ...blockStyle, fontSize: '90%', paddingTop: '3px', opacity: '0.45' }}>
                            {route.Target}
                          </p>
                        </div>
                      </Stack>
                    </Link>
                  </Box>
                </Grid2>
              ) : (
                <Grid2 item xs={6} sm={4} md={3} lg={2} xl={2} xxl={2} key={route.Name}>
                  <Box className="app app-hover" style={{ padding: 25, borderRadius: 5, ...appColor, ...appBorder }}>
                    <Link to={getFullOrigin(route)} target="_blank" style={{ textDecoration: 'none', ...appColor }}>
                      <Stack direction="column" spacing={2} alignItems="center">
                        <ServAppIcon container={container} route={route} className="loading-image" width="70px" />
                        <div style={{ minWidth: 0 }}>
                          <h3 style={blockStyle}>{route.Name}</h3>
                        </div>
                      </Stack>
                    </Link>
                  </Box>
                </Grid2>
              ))
            );
          })}

        {config && routes.length === 0 && (
          <Grid2 item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Box style={{ padding: 10, borderRadius: 5, ...appColor }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <div style={{ minWidth: 0 }}>
                  <h3 style={blockStyle}>No Apps</h3>
                  <p style={blockStyle}>
                    You have no apps configured. Please add some apps in the configuration panel.
                  </p>
                </div>
              </Stack>
            </Box>
          </Grid2>
        )}
      </Grid2>
    </Stack>
  );
};

export default HomePage;
