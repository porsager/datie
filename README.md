# 🗓 Datie

> Small template string based date formatter for the browser and Node.js.

Follows https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table with the inclusion of `o` suffix to enable eg. `1st, 2nd` etc.

## Usage

Datie takes the format as a tagged template function and then returns a function which accepts the date or a `new Date` compatible string.

```js
import datie from 'datie'

const string = "2020-05-13T08:34:30.911Z"
const date = new Date(string)

datie`d/M-y hh:mm`(string) // 13/5-2020 08:34

// or

datie`d/M-y hh:mm`(date) // 13/5-2020 08:34
```
