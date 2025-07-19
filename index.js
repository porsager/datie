export default datie

const cache = new Map()
const ordinals = ['', 'st', 'nd', 'rd']
const ordinal = x => ordinals[x] || 'th'
const sec = [31536000, 2592000, 604800, 86400, 3600, 60, 1]

function format(X) {
  const weekMS = 1000 * 60 * 60 * 24 * 7
      , pad = x => x > 9 ? x : '0' + x

  const f = {
    y: x => x.getFullYear(),
    yy: x => String(f.y(x)).slice(-2),
    yyyy: x => f.y(x),
    M: x => x.getMonth() + 1,
    MM: x => pad(f.M(x)),
    MMMM: x => X.names.months[x.getMonth()],
    MMM: x => f.MMMM(x).slice(0, 3),
    MMMMM: x => f.MMMM(x)[0],
    d: x => x.getDate(),
    dd: x => pad(f.d(x)),
    e: x => x.getDay(),
    ee: x => pad(f.e(x)),
    EEEE: x => X.names.days[f.e(x)],
    E: x => f.EEEE(x).slice(0, 3),
    EE: x => f.E(x),
    EEE: x => f.E(x),
    EEEEE: x => f.E(x).slice(0, 2),
    EEEEEE: x => f.E(x)[0],
    H: x => x.getHours(),
    HH: x => pad(f.H(x)),
    h: x => f.H(x),
    hh: x => f.HH(x),
    m: x => x.getMinutes(),
    mm: x => pad(f.m(x)),
    s: x => x.getSeconds(),
    ss: x => pad(f.s(x)),
    w: x => {
      x = new Date(x)
      x.setDate(x.getDate() - ((x.getDay() + 6) % 7) + 3)
      const firstThursday = x.getTime()
      x.setMonth(0, 1)
      if (x.getDay() !== 4)
        x.setMonth(0, 1 + ((4 - x.getDay()) + 7) % 7)
      return 1 + Math.ceil((firstThursday - x) / weekMS)
    },
    ww: x => pad(f.w(x)),
    o: (x, p) => ordinal(p % 100 >> 3 ^ 1 && p % 10),
    Q: x  => Math.floor(x.getMonth()/3) + 1,
    QQ: x  => pad(f.Q(x)),
    QQQ: x  => 'Q' + f.Q(x),
    QQQQ: x  => f.Q(x) + ordinal(f.Q(x)) + ' quarter',
    R: x => X.relative(x)
  }

  return f
}

datie.names = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  uot: ['year', 'month', 'week', 'day', 'hour', 'minute', 'second']
}

datie.format = format(datie)

function datie(xs) {
  if (cache.has(xs))
    return cache.get(xs)

  const f = xs[0]
      , fns = []

  let l = 0
  for (let i = 0; i < f.length; i++)
    f[i] !== f[i + 1] && (fns.push(datie.format[f.slice(l, i + 1)] || f.slice(l, i + 1)), l = i + 1)

  const fn = function(x) {
    x = new Date(x)
    let last
    return fns.map(fn => last = typeof fn === 'function' ? fn(x, last) : fn).join('')
  }

  cache.set(xs, fn)
  return fn
}

datie.relative = function(date, reference = new Date()) {

  let ss = Math.floor((reference - new Date(date)) / 1000);
  const future = ss < 0;
  ss = Math.abs(ss)

  if (ss < 5)
    return future ? 'in a few seconds' : 'a few seconds ago'

  for (let i = 0, c, u; i < datie.names.uot.length; i++) {
    c = Math.floor(ss / sec[i]);
    if (c >= 1) {
      u = datie.names.uot[i] + (c !== 1 ? 's' : '')
      return future ? ('in ' + c + ' ' + u) : (c + ' ' + u + ' ago')
    }
  }

  return 'now';
}