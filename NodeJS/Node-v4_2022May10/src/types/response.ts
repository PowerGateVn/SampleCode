export class ISuccess {
  data: object;
  message: string;

  constructor(data: object, message: string) {
    this.data = data;
    this.message = message;
  }
}

export class IError {
  data: object;
  message: string;

  constructor(data: object, message: string) {
    this.data = data;
    this.message = message;
  }
}

export class IUnauthorization {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}