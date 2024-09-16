export class ResponseModel {
    constructor({ statusCode = 404, error = null, data = null }) {
      this.success = false;
      this.statusCode = statusCode;
      if (statusCode >= 200 && statusCode <= 299) this.success = true;
      this.error = error;
      this.data = data;
    }
  }
  