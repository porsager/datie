# 🗓 Datie

Small template string based date formatter for the browser and Node.js. It supports custom specifiers and relative time calculations without external libraries. Datie is lightweight (~1KB minified) and caches formatters for performance.

### LDML Compliance

Follows Unicode LDML date patterns (https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table) with additions:
- `o`: Ordinal suffix (e.g., `1st`, `2nd`) for numbers like day or month.
- `R`: Relative time (e.g., `1 minute ago`, `in 2 days`).

# Usage

Datie uses tagged template literals to define formats, returning a reusable function that accepts a Date object or compatible string. Formatters are cached by string.

```js
import datie from 'datie'

const string = '2020-05-13T08:34:30.911Z'
const date = new Date(string)

datie`d/M-y hh:mm`(string) // '13/5-2020 08:34'
datie`d/M-y hh:mm`(date)    // '13/5-2020 08:34'
```

## Supported Specifiers

Comprehensive list of format specifiers, with descriptions and examples (using July 19, 2025, Saturday, 12:34:56):

- **Year**:
  - `y` / `yyyy`: Full year → '2025'
  - `yy`: Two-digit year → '25'

- **Month**:
  - `M`: Month number (1-12) → '7'
  - `MM`: Padded month (01-12) → '07'
  - `MMM`: Abbreviated month → 'Jul'
  - `MMMM`: Full month → 'July'
  - `MMMMM`: Narrow month (first letter) → 'J'

- **Day**:
  - `d`: Day of month (1-31) → '19'
  - `dd`: Padded day (01-31) → '19'

- **Weekday**:
  - `e`: Weekday number (0=Sun-6=Sat) → '6'
  - `ee`: Padded weekday number → '06'
  - `E` / `EE` / `EEE`: Abbreviated weekday → 'Sat'
  - `EEEE`: Full weekday → 'Saturday'
  - `EEEEE`: Narrow weekday → 'Sa'
  - `EEEEEE`: Shortest weekday → 'S'

- **Hour** (24-hour; `h`/`hh` aliases `H`/`HH`; no AM/PM):
  - `H` / `h`: Hour (0-23) → '12'
  - `HH` / `hh`: Padded hour → '12'

- **Minute**:
  - `m`: Minute (0-59) → '34'
  - `mm`: Padded minute → '34'

- **Second**:
  - `s`: Second (0-59) → '56'
  - `ss`: Padded second → '56'

- **Week** (ISO week, Thursday-based):
  - `w`: Week of year (1-53) → '29'
  - `ww`: Padded week → '29'

- **Quarter**:
  - `Q`: Quarter (1-4) → '3'
  - `QQ`: Padded quarter → '03'
  - `QQQ`: Prefixed quarter → 'Q3'
  - `QQQQ`: Full with ordinal → '3rd quarter'

- **Ordinal Suffix**:
  - `o`: Suffix for prior number (e.g., `do` → '19th', `Qo` → '3rd')

## Relative Time Formatting

Use `R` for relative time vs. current time (`new Date()`). Handles past (`ago`) and future (`in`), with pluralization and `<5s` as `a few seconds ago`/`in a few seconds`. Threshold for `now` is under 5 seconds.

Examples (assuming current time is July 22, 2025, 12:00:00):

```js
const pastDate = new Date('2025-07-22T11:55:00')  // 5 minutes ago
const futureDate = new Date('2025-07-22T12:10:00') // 10 minutes future

datie`R`(pastDate)    // '5 minutes ago'
datie`R`(futureDate)  // 'in 10 minutes'
datie`R`(new Date())  // 'now' (or 'a few seconds ago' if slight offset)
```

## Relative Fallbacks

Combine relative time with a fallback format using thresholds. If the date is within the spec (past or future), show relative; else, use fallback.

- **Syntax**:
  - Past: `R<spec> <fallback>` (e.g., `R1D yyyy-MM-dd`) – Relative if past and within spec.
  - Future: `<fallback> R<spec>` (e.g., `yyyy-MM-dd R1Y`) – Relative if future and within spec.
- **Spec**: `<number>[unit]`; units: `m` (minutes, default), `H` (hours), `D` (days), `M` (months), `Y` (years). No spec = always relative (threshold Infinity).

Examples (current: July 22, 2025, 12:00:00):

```js
// Past fallback
const recentPast = new Date('2025-07-22T11:00:00')  // 1 hour ago
const oldPast = new Date('2025-07-20T12:00:00')     // >1 day ago

datie`R1D yyyy-MM-dd HH:mm`(recentPast)  // '1 hour ago'
datie`R1D yyyy-MM-dd HH:mm`(oldPast)     // '2025-07-20 12:00'

// Future fallback
const nearFuture = new Date('2025-07-22T15:00:00')  // 3 hours future
const farFuture = new Date('2025-08-22T12:00:00')   // >15 days future

datie`yyyy-MM-dd HH:mm R3H`(nearFuture)  // 'in 3 hours'
datie`yyyy-MM-dd HH:mm R3H`(farFuture)   // '2025-08-22 12:00'

// Other specs
datie`yyyy-MM-dd R15D`(farFuture)        // '2025-08-22' (31 days >15D)
datie`yyyy-MM-dd R6M`(new Date('2025-12-22'))  // 'in 5 months'
datie`yyyy-MM-dd R1Y`(new Date('2026-07-22'))  // 'in 1 year'
datie`yyyy-MM-dd R1Y`(new Date('2027-01-01'))  // '2027-01-01' (>1Y)
```

## Localization

Override names for days, months, seasons (relative time fixed in English):

```js
datie.names = {
  days: ['Domingo', 'Lunes', /* Spanish days */],
  months: ['Enero', 'Febrero', /* Spanish months */],
  seasons: ['Primavera', 'Verano', 'Otoño', 'Invierno'],
  ordinals: ['o', 'o', 'o', 'o']  // Custom ordinals (e.g., Spanish)
}
```

> [!NOTE]
> Localization doesn't alter LTR output or handle all global formats. Relative strings remain English.