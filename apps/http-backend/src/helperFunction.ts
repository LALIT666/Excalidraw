export function failure(message: string) {
  return {
    success: false,
    message,
  };
}

export function successFunc(data: any) {
  return {
    success: true,
    data,
  };
}

export function serverError() {
  return {
    success: false,
    message: "Internal Server Error",
  };
}
