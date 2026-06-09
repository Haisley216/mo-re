import mixpanel from 'mixpanel-browser';

mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN as string, {
  track_pageview: false,
  persistence: 'localStorage',
  debug: true,
});

export default mixpanel;
