export default datie

const regexFuture = /^(.*)\s*R(\d+(?:[HDMY])?)?$/
const regexPast = /^R(\d+(?:[HDMY])?)?\s*(.*)$/
const cache = new Map()
const ordinals = ['', 'st', 'nd', 'rd', 'th']
const ordinal = x => ordinals[x] || ordinals[4]
const sec = [31536000, 2592000, 86400, 3600, 60, 1]

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
    Q: x  => Math.floor(x.getMonth()/3) + 1,
    QQ: x  => pad(f.Q(x)),
    QQQ: x  => 'Q' + f.Q(x),
    QQQQ: x  => f.Q(x) + ordinal(f.Q(x)) + ' quarter',
    S: x => {
      const m = x.getMonth(), d = x.getDate()
      return (m === 2 && d >= 20) || m === 3 || m === 4 || (m === 5 && d < 21) ? 1 :
             (m === 5 && d >= 21) || m === 6 || m === 7 || (m === 8 && d < 23) ? 2 :
             (m === 8 && d >= 23) || m === 9 || m === 10 || (m === 11 && d < 22) ? 3 : 4
    },
    SS: x => pad(f.S(x)),
    SSS: x => X.names.seasons[f.S(x)-1],
    R: x => parseRelative(x)
  }

  return f
}

datie.names = {
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  periods: ['year', 'month', 'day', 'hour', 'minute', 'second'],
  seasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
  get ordinals() { return ordinals },
  set ordinals (o) { o.forEach((x, i) => ordinals.splice(i + 1, 1, x)) }
}

datie.format = format(datie)

function parseFormat(formatStr, X = datie) {
  const fns = []
  let l = 0
  for (let i = 0; i < formatStr.length; i++)
    if (formatStr[i] !== formatStr[i + 1])
      fns.push(X.format[formatStr.slice(l, i + 1)] || formatStr.slice(l, i + 1)), l = i + 1
  return fns
}

function datie(xs) {
  const formatStr = xs[0], key = formatStr
  if (cache.has(key))
    return cache.get(key)

  let fn
    , isPast = regexPast.test(key)
    , isFuture = regexFuture.test(key)

  if (!isPast && !isFuture) {
    const fns = parseFormat(formatStr)
    fn = function (x) {
      x = new Date(x)
      let last
      return fns.map(fn => last = typeof fn === 'function' ? fn(x, last) : fn).join('')
    }
  } else {
    const m = isPast ? formatStr.match(regexPast) : formatStr.match(regexFuture)
    let spec
      , unit
      , fallback
      , threshold = Infinity

    isPast ? (spec = m[1], fallback = m[2]) : (spec = m[2], fallback = m[1])
    if (spec) {
      unit = spec[spec.length - 1]
      const num = isNaN(unit) ? (unit = spec[spec.length - 1], +spec.slice(0, -1)) : (unit = 'm', +spec)
      threshold = num * (
        unit === 'm' ? 60 :
        unit === 'H' ? 3600 :
        unit === 'D' ? 86400 :
        unit === 'M' ? 2592000 : 31536000
      ) * 1000
    }
    const fns = parseFormat(fallback || '')

    fn = function(x) {
      x = new Date(x)
      const diff = new Date() - x, abs = Math.abs(diff)
      // Apply relative formatting only if within threshold and correct direction
      if (isPast && diff >= 0 && abs < threshold || isFuture && diff <= 0 && abs < threshold) {
        return parseRelative(x)
      }

      let last
      return fns.map(fn => last = typeof fn === 'function' ? fn(x, last) : fn).join('')
    }
  }

  cache.set(key, fn)
  return fn
}

function parseRelative(date, reference = new Date()) {
  let ss = Math.floor((reference - new Date(date)) / 1000)
  const future = ss < 0
  ss = Math.abs(ss)

  if (ss < 5)
    return future ? 'in a few seconds' : 'a few seconds ago'

  for (let i = 0, c, u; i < datie.names.periods.length; i++) {
    c = Math.floor(ss / sec[i])
    if (c >= 1) {
      u = datie.names.periods[i] + (c !== 1 ? 's' : '')
      return future ? `in ${c} ${u}` : `${c} ${u} ago`
    }
  }

  return 'now'
}