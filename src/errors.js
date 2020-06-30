const printer = require('./printer')
class CliError extends Error {
  constructor(message, name, suggestion='', context={}) {
    super(message)
    this.name = name;
    this.suggestion = suggestion;
    this.context=context;
    Error.captureStackTrace(this, CliError);
  }
}

class ApiError extends CliError {
  /**
   * @classdesc An error related to a 400-level response from the API.
   * @constructor
   * @param packet the http packet with the response
   */
  constructor(packet) {
    const message = (packet.response.res.text.indexOf('<Description>') >= 0)?
      packet.response.res.text.split('<Description>').pop().split('</Description>')[0]:
      "An unknown error occured."
    const suggestion = ''//FIXME handle API error cases
    super(message, 'Error Code ' + packet.status.toString(), suggestion, {res: packet});
    Error.captureStackTrace(this, ApiError);
  }
}

class BadInputError extends CliError {
  /**
   * @classdesc An error related to a bad user input.
   * @constructor
   * @param suggestion An optional suggestion for how to fix this error
   * @param field the name of the input field which is malformed.
   * @param context optional debugging context, not used during production.
   */
  constructor(message, field, suggestion='', context={}) {
    super(message, 'Bad Input', suggestion, context);
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
        return printer.reject(err.name + ":", err.message, '\n' + (err.suggestion||''))
      }
      if (err instanceof ApiError) {
        return printer.error(err.name + ":", err.message, '\n' + (err.suggestion||''));
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
