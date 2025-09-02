export default datie

const regexFuture = /^(.*)\s*R(\d+(?:[MHDY])?)?$/
const regexPast = /^R(\d+(?:[MHDY])?)?\s*(.*)$/
const cache = new Map()
const ordinals = ['', 'st', 'nd', 'rd', 'th']
const ordinal = x => ordinals[x] || ordinals[4]
const sec = [31536000, 2592000, 604800, 86400, 3600, 60, 1]

function format(X) {
  const weekMS = 604800000
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
    Q: x => Math.floor(x.getMonth()/3) + 1,
    QQ: x => pad(f.Q(x)),
    QQQ: x => 'Q' + f.Q(x),
    QQQQ: x => f.Q(x) + ordinal(f.Q(x)) + ' quarter',
    R: (x, b) => parseRelative(x, b)
  }

  return f
}

datie.names = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  periods: ['year', 'month', 'week', 'day', 'hour', 'minute', 'second'],
  get ordinals() { return ordinals },
  set ordinals (o) { o.forEach((x, i) => ordinals.splice(i + 1, 1, x)) }
}

datie.format = format(datie)

function parseFormat(x, X = datie) {
  const fns = []
  let l = 0
  for (let i = 0; i < x.length; i++)
    if (x[i] !== x[i + 1])
      fns.push(X.format[x.slice(l, i + 1)] || x.slice(l, i + 1)), l = i + 1
  return fns
}

function datie([x]) {
  if (cache.has(x))
    return cache.get(x)
  
  const R = x.indexOf('R')
  
  if (R === -1) {
    const fns = parseFormat(x)
    const fn = function (date) {
      date instanceof Date || (date = new Date(date))
      let last
      return fns.map(fn => last = typeof fn === 'function' ? fn(date, last) : fn).join('')
    }
    cache.set(x, fn)
    return fn
  }
  
  const past = R === 0
      , future = !past || x.length === 1
      , m = past ? x.match(regexPast) : x.match(regexFuture)
  
  let threshold = Infinity

  const spec = m[past ? 1 : 2]
      , fallback = m[past ? 2 : 1]
    
  if (spec) {
    let unit = spec[spec.length - 1]
    const num = isNaN(unit) 
      ? (unit = spec[spec.length - 1], +spec.slice(0, -1)) 
      : (unit = 'M', +spec)
    
    threshold = num * (
      unit === 'M' ? sec[5] :
      unit === 'H' ? sec[4] :
      unit === 'D' ? sec[3] :
      unit === 'W' ? sec[2] :
      sec[0]
    ) * 1000
  }
  
  const fns = parseFormat(fallback || '')

  const fn = function(date, b = new Date()) {
    date instanceof Date || (date = new Date(date))
    b instanceof Date || (b = new Date(b))
    const diff = b - date
        , abs = Math.abs(diff)
    
    if (past && diff >= 0 && abs <= threshold || future && diff <= 0 && abs <= threshold)
      return parseRelative(date, b)

    let last
    return fns.map(fn => last = typeof fn === 'function' ? fn(date, last) : fn).join('')
  }
  
  cache.set(x, fn)
  return fn
}

function parseRelative(date, reference = Date.now()) {
  let ss = Math.floor((reference - new Date(date).getTime()) / 1000)
  const future = ss < 0
  ss = Math.abs(ss)
  if (ss < 5)
    return ss === 0 ? 'now' : ss < 0 ? 'in a few seconds' : 'a few seconds ago'

  for (let i = 0, c, u; i < datie.names.periods.length; i++) {
    if (i === 2 && ss > 3 * sec[2])
      continue
    c = ~~(ss / sec[i])
    if (c >= 1) {
      u = datie.names.periods[i] + (c !== 1 ? 's' : '')
      return future ? `in ${c} ${u}` : `${c} ${u} ago`
    }
  }

  return 'now'
}