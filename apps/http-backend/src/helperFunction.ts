export function failure(message: string) {
  return {
    success: false,
    message,
  };
}

export function successFunc(message: any) {
  return {
    success: true,
    message,
  };
}

export function serverError() {
  return {
    success: false,
    message: "Internal Server Error",
  };
}
