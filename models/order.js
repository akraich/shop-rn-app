import moment from "moment";

export default class {
  constructor(id, items, amount, date) {
    this.id = id;
    this.items = items;
    this.amount = amount;
    this.date = date;
  }
  get readableDate() {
    /*return this.date.toLocaleDateString("en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2digit",
      minute: "2-digit"
    });*/
    return moment(this.date).format("MMMM Do YYYY, hh:mm");
  }
}
