import t from 'sin/test'

import d from  '../index.js'

const date = new Date('2025-08-24T09:42')
const minute = 60 * 1000
const hour = 60 * minute
const day = 24 * hour
const year = 365 * day

t`Formatting`({
  run: (x, t) => [x, d([t.name])(date)]
},
  t`Basic`(
    t`yyyy-MM-dd HH:mm`('2025-08-24 09:42'),
    t`MMM d, yyyy`('Aug 24, 2025'),
    t`EEEE`('Sunday'),
    t`yy-M-d h:m:s`('25-8-24 9:42:0'),
    t`MMMM EE`('August Sun'),
    t`ww`('34')
  ),
  
  t`Ordinal And Quarters`(
    t`do MMMM yyyy`('24th August 2025'),
    t`Qo yyyy`('3rd 2025'),
    t`QQQQ`('3rd quarter'),
    t`QQQ`('Q3')
  )
)
 
t`Relative`({
  run: (x, y) => [y.name, d`R`(date.getTime() + x, date)]
},
  t`now`(0),
  t`5 minutes ago`(-5 * minute),
  t`1 hour ago`(-hour),
  t`1 day ago`(-day),
  t`2 weeks ago`(-15 * day),
  t`1 year ago`(-year),
  t`2 years ago`(-2 * year),
  
  t`in 10 minutes`(10 * minute),
  t`in 1 hour`(hour),
  t`in 1 day`(day),
  t`in 2 weeks`(15 * day),
  t`in 1 year`(year),
  t`in 2 years`(2 * year)
)

t`Relative implicit now`({
  run: (x, y) => [y.name, d`R`(Date.now() + x)]
},
  t`5 minutes ago`(-5 * minute),
  t`1 hour ago`(-hour),
  t`1 day ago`(-day),
  t`2 weeks ago`(-15 * day),
  t`1 year ago`(-1.2 * year),
  
  t`in 10 minutes`(10 * minute),
  t`in 1 hour`(hour),
  t`in 1 day`(day),
  t`in 2 weeks`(15 * day),
  t`in 1 year`(year),
  t`in 1 year`(1.2 * year)
)

t`Relatives with fallbacks`({
  run: (x, t) => [t.name, d(t.path.slice(-1))(date.getTime() + x, date)]
}, 
  t`R30 yyyy-MM-dd HH:mm`(
    t`5 minutes ago`(-5 * minute),
    t`15 minutes ago`(-15 * minute),
    t`30 minutes ago`(-30 * minute)
  ),
  
  t`R3H yyyy-MM-dd HH:mm`(
    t`1 hour ago`(-hour),
    t`2 hours ago`(-2 * hour),
    t`3 hours ago`(-3 * hour)
  ),
  
  t`R15D yyyy-MM-dd HH:mm`(
    t`1 day ago`(-day),
    t`1 week ago`(-10 * day),
    t`2 weeks ago`(-15 * day)
  ),
  
  t`R180D yyyy-MM-dd`(
    t`1 month ago`(-30 * day),
    t`3 months ago`(-90 * day),
    t`6 months ago`(-180 * day)
  ),
  
  t`R1Y yyyy-MM-dd`(
    t`3 months ago`(-90 * day),
    t`6 months ago`(-180 * day),
    t`1 year ago`(-year)
  ),
  
  t`R2Y yyyy-MM-dd`(
    t`10 months ago`(-320 * day),
    t`1 year ago`(-year),
    t`2 years ago`(-2 * year)
  ),
  
  t`yyyy-MM-dd HH:mm R30M`(
    t`in 10 minutes`(10 * minute),
    t`in 15 minutes`(15 * minute),
    t`in 30 minutes`(30 * minute)
  ),
  
  t`yyyy-MM-dd HH:mm R3H`(
    t`in 1 hour`(hour),
    t`in 2 hours`(2 * hour),
    t`in 3 hours`(3 * hour)
  ),
  
  t`yyyy-MM-dd HH:mm R15D`(
    t`in 1 day`(day),
    t`in 2 days`(2 * day),
    t`in 2 weeks`(15 * day)
  ),
  
  t`yyyy-MM-dd R180D`(
    t`in 1 month`(30 * day),
    t`in 3 months`(3 * 30 * day),
    t`in 6 months`(6 * 30 * day)
  ),
  
  t`yyyy-MM-dd R1Y`(
    t`in 1 month`(30 * day),
    t`in 3 months`(3 * 30 * day),
    t`in 1 year`(year)
  ),
  
  t`yyyy-MM-dd R2Y`(
    t`in 10 months`(320 * day),
    t`in 1 year`(1 * year),
    t`in 2 years`(2 * year)
  )
)