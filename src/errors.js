const printer = require('./printer')
class CliError extends Error {
  constructor(message, name) {
    super(message)
    this.name = name;
    Error.captureStackTrace(this, CliError);
  }
}

class ApiError extends CliError {
  /**
   * @classdesc An error related to a 400-level response from the API.
   * @constructor
   * @param res the http packet with the response
   */
  constructor(packet) {
    const message = (packet.response.res.text.indexOf('<Description>') >= 0)?
      packet.response.res.text.split('<Description>').pop().split('</Description>')[0]:
      "An unknown error occured."
    super(message, 'Error Code ' + packet.status.toString());
    this.res = packet.response;
    Error.captureStackTrace(this, ApiError);
  }
}

class BadInputError extends CliError {
  /**
   * @classdesc An error related to a bad user input.
   * @constructor
   * @param field the name of the input field which is malformed.
   */
  constructor(message, field) {
    super(message, 'Bad Input');
    this.field = field;
    Error.captureStackTrace(this, BadInputError);
  }
}

/**
 * A wrapper around action functions to handle their errors.
 * @param action the async action function to catch errors for.
 */
const errorHandler = (action) => {
  // IDEA: verbose/debugging can be handled here. Also possibly additional 'tips', where each error has a tip for what you can likely do to fix it (if it's a common error).
  return async (...args) => {
    await action(...args).catch((err) => {
      if (err instanceof BadInputError) {
        return printer.reject(err.name + ":", err.message)
      }
      if (err instanceof ApiError) {
        return printer.error(err.name + ":", err.message);
      }
      throw err;
    });
  }
}

module.exports = {
  CliError: CliError,
  ApiError: ApiError,
  BadInputError: BadInputError,
  errorHandler: errorHandler
}