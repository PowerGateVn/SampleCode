abstract class ErrorResponse {
  int get statusCode;

  String? get error;
}

class ParseErrorResponseException implements Exception {
  final List<Object> errors;
  final List<StackTrace> stackTraces;

  ParseErrorResponseException(this.errors, this.stackTraces);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ParseErrorResponseException &&
          runtimeType == other.runtimeType &&
          errors == other.errors &&
          stackTraces == other.stackTraces;

  @override
  int get hashCode => errors.hashCode ^ stackTraces.hashCode;

  @override
  String toString() =>
      'ParseErrorResponseException{errors: $errors, stackTraces: $stackTraces}';
}