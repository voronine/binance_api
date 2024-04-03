export const GetStocksBetween = (dateStart, dateEnd) => {

  let interval = this.intervalDays * 24 * 60;
  interval += this.intervalHours * 60;
  interval += this.intervalMinutes;

  let time = this.AddDays(dateStart, 0);
  let v = this.volumeStart;
  let o = this.priceStart;
  let h = o + (Math.random() * this.priceRange);
  let l = o - (Math.random() * this.priceRange);
  let c = l + (Math.random() * (h - l));

  const stock = [];
  while (time.getTime() < dateEnd.getTime()) {
      stock.push({ date: time, open: o, high: h, low: l, close: c, volume: v });

      o = c + ((Math.random() - 0.5) * this.priceRange);
      if (o < 0) {
          o = Math.abs(o) + 2;
      }
      h = o + (Math.random() * this.priceRange);
      l = o - (Math.random() * this.priceRange);
      c = l + (Math.random() * (h - l));
      v = v + ((Math.random() - 0.5) * this.volumeRange);
      if (v < 0) {
          v = Math.abs(v) + 10000;
      }

      o = Math.round(o * 100) / 100;
      h = Math.round(h * 100) / 100;
      l = Math.round(l * 100) / 100;
      c = Math.round(c * 100) / 100;
      v = Math.round(v * 100) / 100;

      time = this.AddMinutes(time, interval);
  }
  // setting data intent for Series Title
  (stock).__dataIntents = {
      close: ["SeriesTitle/Stock Prices"]
  };
  return stock;
}