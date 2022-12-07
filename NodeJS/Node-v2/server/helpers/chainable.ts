export default class OptionalChainable {
  _obj: any;

  constructor(obj) {
    this._obj = obj;
  }

  array(index) {
    if (
      this._obj &&
      // string has length property, to avoid we treat string as array
      typeof this._obj === 'object' &&
      this._obj.length !== undefined &&
      this._obj.length > index
    ) {
      return new OptionalChainable(this._obj[index]);
    } else {
      return new OptionalChainable(null);
    }
  }

  obj(prop) {
    if (this._obj && this._obj[prop] !== undefined) {
      return new OptionalChainable(this._obj[prop]);
    } else {
      return new OptionalChainable(null);
    }
  }

  value() {
    return this._obj;
  }
}
