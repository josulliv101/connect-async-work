const gutter = 8;
const style = {
  root: {
    fontFamily: 'Verdana, sans-serif',
  },
  main: {
    display: 'flex',
    background: 'rgba(0,0,0,.06)',
    boxShadow: '0px 9px 26px -2px rgba(0,0,0,0.38)',
    margin: '10% 20% 32px',
    minWidth: 300,
    fontFamily: 'Verdana, sans-serif',
  },
  nav: {
    background: 'rgba(0,0,0,.09)',
    margin: 0,
    padding: gutter * 2,
    listStyle: 'none',
    minWidth: 200,
    minHeight: 440,
  },
  bd: {
    width: '100%',
    position: 'relative',
    padding: `${gutter*1}px ${gutter*5}px`,
  },
  center: {
    textAlign: 'center',
  },
  link: {
    padding: gutter,
  },
  status: {
    position: 'absolute',
    top: 0,
    right: gutter * 2,
  },
  controls: {
    position: 'relative',
    top: 0,
    textAlign: 'center',
  },
  loadStatus: {
    color: '#999',
    fontWeight: 500,
  }
}
export default style