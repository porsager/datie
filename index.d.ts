interface TagLiteral extends ReadonlyArray<string> {
  readonly raw: readonly string[];
}

type Interpolate = unknown[];

const datie: {
  /**
   * Date format
   *
   * @example
   * datie`yyyy-MM-dd HH:mm`(new Date()) // -> 2025-07-22 11:20
   */
  (format: TagLiteral, ...interpolate: Interpolate): (date: Date | string | number) => string;
  /**
   * Localisation Overrides
   */
  readonly names: {
    /**
     * Days of the week
     *
     * @default
     * [
     *  'Sunday',
     *  'Monday',
     *  'Tuesday',
     *  'Wednesday',
     *  'Thursday',
     *  'Friday',
     *  'Saturday'
     * ]
     */
    days: [
      Sunday: string,
      Monday: string,
      Tuesday: string,
      Wednesday: string,
      Thursday: string,
      Friday: string,
      Saturday: string
    ];
    /**
     * Months of the year
     *
     * @default
     * [
     *  'January',
     *  'February',
     *  'March',
     *  'April',
     *  'May',
     *  'June',
     *  'July',
     *  'August',
     *  'September',
     *  'October',
     *  'November',
     *  'December'
     * ]
     */
    months: [
      January: string,
      February: string,
      March: string,
      April: string,
      May: string,
      June: string,
      July: string,
      August: string,
      September: string,
      October: string,
      November: string,
      December: string
    ];
    /**
     * Time periods - Sorted by longest to shortest
     *
     * @default
     * [
     *  'year',
     *  'month',
     *  'week',
     *  'day',
     *  'hour',
     *  'minute',
     *  'second'
     * ]
     */
    periods: [
      year: string,
      month: string,
      week: string,
      day: string,
      hour: string,
      minute: string,
      second: string
    ];
    /**
     * Ordinals - Smallest to largest
     *
     * @default
     * [
     *  'st',
     *  'nd',
     *  'rd',
     *  'th'
     * ]
     */
    ordinals: [
      st: string,
      nd: string,
      rd: string,
      th: string
    ]
  }
}

export default datie