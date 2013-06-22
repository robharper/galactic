Dates =
  JUnixEpoch: 2440587.5
  msPerDay: 1000*60*60*24

  # Julian date at greenwich, Jan 1 2000 at noon
  J2000: 2451545

  # Julian Date from unix ms since epoch
  unixDateToJulian: (unix) ->
    (unix / msPerDay) + Dates.JUnixEpoch

  # Unix ms since epoch date from julian date
  julianDateToUnix: (julian) ->
    (julian - Dates.JUnixEpoch) * JUnixEpoch.msPerDay

  # Greenwich (Mean) Sidereal Time from Julian Date
  julianDateToGMST: (julian) ->
    (18.697374558 + 24.06570982441908 * (julian-Dates.J2000)) % 24

export = Dates