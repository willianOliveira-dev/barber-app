export class ActionResponse {
  static async fail({
    error,
    message,
    statusCode = 400,
  }: {
    error: string
    message: string
    statusCode?: number
  }) {
    return {
      success: false,
      statusCode,
      message,
      error,
      method: "POST",
      timestamp: new Date(),
    }
  }

  static success<T>({
    data,
    message,
    statusCode = 201,
  }: {
    data: T
    message: string
    statusCode?: number
  }) {
    return {
      success: true,
      statusCode,
      message,
      data,
      error: null,
      method: "POST",
      timestamp: new Date(),
    }
  }
}
