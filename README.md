# 🗓 Datie

Small template string based date formatter for the browser and Node.js. It supports custom specifiers and relative time calculations without external libraries.

### LDML

Follows unicode LDML date patterns (https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table) with 2 additional inclusions:

- `o` suffix to enable eg. `1st, 2nd` etc
- `R` relative timing, eg: `1 minute ago, 2 days ago` etc

# Usage

Datie takes the format as a tagged template function and then returns a function which accepts the date or a `new Date` compatible string. Formatters are cached by string for reuse.

```js
import datie from 'datie'

const string = "2020-05-13T08:34:30.911Z"
const date = new Date(string)

datie`d/M-y hh:mm`(string) // 13/5-2020 08:34

// or

datie`d/M-y hh:mm`(date) // 13/5-2020 08:34
```

## Supported Specifiers

See the below comprehensive list of all format specifiers, with descriptions and examples (using date: July 19, 2025, Saturday, 12:34:56):

- **Year**:
  - `y`: Full year (e.g., 2025) → '2025'
  - `yy`: Two-digit year (e.g., 25) → '25'
  - `yyyy`: Full year (same as `y`) → '2025'

- **Month**:
  - `M`: Month number (1-12) → '7'
  - `MM`: Padded month (01-12) → '07'
  - `MMM`: Abbreviated month name → 'Jul'
  - `MMMM`: Full month name → 'July'
  - `MMMMM`: Narrow month name (first letter) → 'J'

- **Day**:
  - `d`: Day of month (1-31) → '19'
  - `dd`: Padded day (01-31) → '19'

- **Weekday**:
  - `e`: Weekday number (0=Sunday to 6=Saturday) → '6'
  - `ee`: Padded weekday number (00-06) → '06'
  - `E`: Abbreviated weekday (same as `EE`/`EEE`) → 'Sat'
  - `EE`: Abbreviated weekday → 'Sat'
  - `EEE`: Abbreviated weekday → 'Sat'
  - `EEEE`: Full weekday name → 'Saturday'
  - `EEEEE`: Narrow weekday (first two letters, or adjusted) → 'Sa'
  - `EEEEEE`: Shortest weekday (first letter) → 'S'

- **Hour** (24-hour format; `h`/`hh` alias to `H`/`HH` for simplicity, no AM/PM support):
  - `H`: Hour (0-23) → '12'
  - `HH`: Padded hour (00-23) → '12'
  - `h`: Hour (same as `H`) → '12'
  - `hh`: Padded hour (same as `HH`) → '12'

- **Minute**:
  - `m`: Minute (0-59) → '34'
  - `mm`: Padded minute (00-59) → '34'

- **Second**:
  - `s`: Second (0-59) → '56'
  - `ss`: Padded second (00-59) → '56'

- **Week** (ISO week number, starting Thursday-based for year alignment):
  - `w`: Week of year (1-53) → '29' (for 2025-07-19)
  - `ww`: Padded week (01-53) → '29'

- **Quarter**:
  - `Q`: Quarter number (1-4) → '3'
  - `QQ`: Padded quarter (01-04) → '03'
  - `QQQ`: Quarter with 'Q' prefix → 'Q3'
  - `QQQQ`: Full quarter with ordinal → '3rd quarter'

- **Ordinal Suffix**:
  - `o`: Adds ordinal suffix ('st', 'nd', 'rd', 'th') to the previous numeric value (e.g., in 'do' or 'Mo') → Use with day/month: 'do' → '19th'

## Relative Time Formatting

Integrate relative time with the `R` specifier or use the dedicated method (`datie.relative`). It will calculate time differences with pluralization, handling past/future, and a `now` threshold (`< 5` seconds).

Assuming date is within `10` number

- `a few seconds ago`
- `10 seconds ago`
- `10 minutes ago`
- `10 hours ago`
- `10 days ago`
- `10 months ago`
- `10 years ago`

**Using Specifier**

Always relative to current time (`new Date()`).

```js
datie`R`(date)
```

**Using Method**

Allows custom reference date to be passed as 2nd parameter

```js
datie.reference(date, new Date())
```

**Example**

```js
datie`R`(new Date(Date.now() - 3600000)); // '1 hour ago' (assuming now is current)

datie.relative('2025-07-18T12:00:00Z', new Date('2025-07-19T12:00:00Z')); // '1 day ago'
datie.relative('2025-07-20T12:00:00Z', new Date('2025-07-19T12:00:00Z')); // 'in 1 day'
```