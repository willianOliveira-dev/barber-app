import { headers } from "next/headers"

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
    const headersList = await headers()
    const path = headersList.get("referer")
    return {
      success: false,
      statusCode,
      message,
      data: null,
      error,
      path,
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
