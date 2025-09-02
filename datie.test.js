import datie from  './index.js';

let testCount = 0
  , passedCount = 0;

const { log } = console

function title(name) {
  log(`\n ⌗\x1b[1m ${name} \x1b[0m`)
}

function test(description) {

  return (result) => {
    testCount++;
    log(`\x1b[1;92m » Format\x1b[0m \x1b[92m${description}\x1b[0m`);
    log(`\x1b[90m » Result\x1b[1;0m ${result}\x1b[0m`)
  }
}


const now = new Date()

title('BASIC DATE FORMATTING');

test('yyyy-MM-dd HH:mm')(datie`yyyy-MM-dd HH:mm`(now));
test('MMM d, yyyy')(datie`MMM d, yyyy`(now));
test('EEEE')(datie`EEEE`(now));
test('yy-M-d h:m:s')(datie`yy-M-d h:m:s`(now));
test('MMMM EE')(datie`MMMM EE`(now));
test('ww')(datie`ww`(now));

title('ORDINAL AND QUARTERS');

test('do MMMM yyyy)')(datie`do MMMM yyyy`(now));
test('Qo yyyy')(datie`Qo yyyy`(now));
test('QQQQ')(datie`QQQQ`(now));
test('QQQ')(datie`QQQ`(now));

title('RELATIVES')
test('R')(datie`R`(now - 5 * 60 * 1000));
test('R')(datie`R`(now - 1 * 3600 * 1000));
test('R')(datie`R`(now - 1 * 86400 * 1000));
test('R')(datie`R`(now - 15 * 86400 * 1000));
test('R')(datie`R`(now - 1 * 365 * 86400 * 1000));
test('R')(datie`R`(now - 2 * 365 * 86400 * 1000));

test('R')(datie`R`(now.getTime() + 10 * 60 * 1000));
test('R')(datie`R`(now.getTime() + 1 * 3600 * 1000));
test('R')(datie`R`(now.getTime() + 1 * 86400 * 1000));
test('R')(datie`R`(now.getTime() + 15 * 86400 * 1000));
test('R')(datie`R`(now.getTime() + 1 * 365 * 86400 * 1000));
test('R')(datie`R`(now.getTime() + 2 * 365 * 86400 * 1000));

title('PAST RELATIVE WITHIN 30 MINUTES');

test('R30 yyyy-MM-dd HH:mm')(datie`R30 yyyy-MM-dd HH:mm`(now - 5 * 60 * 1000));
test('R30 yyyy-MM-dd HH:mm')(datie`R30 yyyy-MM-dd HH:mm`(now - 15 * 60 * 1000));
test('R30 yyyy-MM-dd HH:mm')(datie`R30 yyyy-MM-dd HH:mm`(now - 30 * 60 * 1000));

title('PAST RELATIVE WITHIN 3 HOURS');

test('R3H yyyy-MM-dd HH:mm')(datie`R3H yyyy-MM-dd HH:mm`(now - 1 * 3600 * 1000));
test('R3H yyyy-MM-dd HH:mm')(datie`R3H yyyy-MM-dd HH:mm`(now - 2 * 3600 * 1000));
test('R3H yyyy-MM-dd HH:mm')(datie`R3H yyyy-MM-dd HH:mm`(now - 3 * 3600 * 1000));

title('PAST RELATIVE WITH 15 DAYS');

test('R15D yyyy-MM-dd HH:mm')(datie`R15D yyyy-MM-dd HH:mm`(now - 1 * 86400 * 1000));
test('R15D yyyy-MM-dd HH:mm')(datie`R15D yyyy-MM-dd HH:mm`(now - 10 * 86400 * 1000));
test('R15D yyyy-MM-dd HH:mm')(datie`R15D yyyy-MM-dd HH:mm`(now - 15 * 86400 * 1000));

title('PAST RELATIVE WITHIN 6 MONTHS');

test('R6M yyyy-MM-dd')(datie`R6M yyyy-MM-dd`(now - 1 * 30 * 86400 * 1000));
test('R6M yyyy-MM-dd')(datie`R6M yyyy-MM-dd`(now - 3 * 30 * 86400 * 1000));
test('R6M yyyy-MM-dd')(datie`R6M yyyy-MM-dd`(now - 6 * 30 * 86400 * 1000));

title('PAST RELATIVE WITH 1 YEAR');

test('R1Y yyyy-MM-dd')(datie`R1Y yyyy-MM-dd`(now - 3 * 30 * 86400 * 1000));
test('R1Y yyyy-MM-dd')(datie`R1Y yyyy-MM-dd`(now - 6 * 30 * 86400 * 1000));
test('R1Y yyyy-MM-dd')(datie`R1Y yyyy-MM-dd`(now - 1 * 365 * 86400 * 1000));

title('PAST RELATIVE WITH 2 YEARS');

test('R2Y yyyy-MM-dd')(datie`R2Y yyyy-MM-dd`(now - 1 * 320 * 86400 * 1000));
test('R2Y yyyy-MM-dd')(datie`R2Y yyyy-MM-dd`(now - 1 * 365 * 86400 * 1000));
test('R2Y yyyy-MM-dd')(datie`R2Y yyyy-MM-dd`(now - 2 * 365 * 86400 * 1000));


title('FUTURE RELATIVE OF 30 MINUTES');

test('yyyy-MM-dd HH:mm R30')(datie`yyyy-MM-dd HH:mm R30`(now.getTime() + 10 * 60 * 1000));
test('yyyy-MM-dd HH:mm R30')(datie`yyyy-MM-dd HH:mm R30`(now.getTime() + 15 * 60 * 1000));
test('yyyy-MM-dd HH:mm R30')(datie`yyyy-MM-dd HH:mm R30`(now.getTime() + 30 * 60 * 1000));

title('FUTURE RELATIVE OF 3 HOURS');

test('yyyy-MM-dd HH:mm R3H')(datie`yyyy-MM-dd HH:mm R3H`(now.getTime() + 1 * 3600 * 1000));
test('yyyy-MM-dd HH:mm R3H')(datie`yyyy-MM-dd HH:mm R3H`(now.getTime() + 2 * 3600 * 1000));
test('yyyy-MM-dd HH:mm R3H')(datie`yyyy-MM-dd HH:mm R3H`(now.getTime() + 3 * 3600 * 1000));

title('FUTURE RELATIVE OF 15 DAYS');

test('yyyy-MM-dd HH:mm R15D')(datie`yyyy-MM-dd HH:mm R15D`(now.getTime() + 1 * 86400 * 1000));
test('yyyy-MM-dd HH:mm R15D')(datie`yyyy-MM-dd HH:mm R15D`(now.getTime() + 2 * 86400 * 1000));
test('yyyy-MM-dd HH:mm R15D')(datie`yyyy-MM-dd HH:mm R15D`(now.getTime() + 15 * 86400 * 1000));


title('FUTURE RELATIVE OF 6 MONTHS');

test('yyyy-MM-dd R6M')(datie`yyyy-MM-dd R6M`(now.getTime() + 1 * 30 * 86400 * 1000));
test('yyyy-MM-dd R6M')(datie`yyyy-MM-dd R6M`(now.getTime() + 3 * 30 * 86400 * 1000));
test('yyyy-MM-dd R6M')(datie`yyyy-MM-dd R6M`(now.getTime() + 6 * 30 * 86400 * 1000));

title('FUTURE RELATIVE OF 1 YEAR');

test('yyyy-MM-dd R1Y')(datie`yyyy-MM-dd R1Y`(now.getTime() + 1 * 30 * 86400 * 1000));
test('yyyy-MM-dd R1Y')(datie`yyyy-MM-dd R1Y`(now.getTime() + 3 * 30 * 86400 * 1000));
test('yyyy-MM-dd R1Y')(datie`yyyy-MM-dd R1Y`(now.getTime() + 1 * 365 * 86400 * 1000));

title('FUTURE RELATIVE OF 2 YEARS');

test('yyyy-MM-dd R2Y')(datie`yyyy-MM-dd R2Y`(now.getTime() + 1 * 320 * 86400 * 1000));
test('yyyy-MM-dd R2Y')(datie`yyyy-MM-dd R2Y`(now.getTime() + 1 * 365 * 86400 * 1000));
test('yyyy-MM-dd R2Y')(datie`yyyy-MM-dd R2Y`(now.getTime() + 2 * 365 * 86400 * 1000));

