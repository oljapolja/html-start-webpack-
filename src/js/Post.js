export default class Post {
  constructor (title, img) {
    this.date = new Date();
    this.title = title;
    this.img = img;
  }

  toString() {
    return JSON.stringify({
      title: this.title,
      date: this.date.toJSON(),
      img: this.img,
    }, null, 2);
  }

  get titleUpperCase() {
    return this.title.toUpperCase();
  }
}