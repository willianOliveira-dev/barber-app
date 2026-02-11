import { NextResponse } from "next/server"
import { HttpErrorCode, HttpStatusCode } from "./enums/http-status.enum"
import { HttpErrorName, HttpStatusName } from "./enums/http-status-name.enum"

export class ApiResponse<T> {
  success: boolean
  statusCode: number
  httpStatusName: string
  message?: string
  data?: T
  error?: string
  timestamp: Date
  path?: string
  method?: string

  constructor(
    success: boolean,
    statusCode: number,
    httpStatusName: string,
    message?: string,
    data?: T,
    error?: string,
    path?: string,
    method?: string,
  ) {
    this.success = success
    this.statusCode = statusCode
    this.message = message
    this.httpStatusName = httpStatusName
    this.data = data
    this.error = error
    this.timestamp = new Date()
    this.path = path
    this.method = method
  }

  static success<T>(
    data: T,
    message = "Operação realizada com sucesso",
    statusCode: HttpStatusCode = HttpStatusCode.OK,
    path?: string,
    method?: string,
  ): NextResponse<ApiResponse<T>> {
    const res = new ApiResponse(
      true,
      statusCode,
      HttpStatusName[HttpStatusCode[statusCode] as keyof typeof HttpStatusName],
      message,
      data,
      undefined,
      path,
      method,
    )
    return NextResponse.json(res, { status: statusCode })
  }

  static fail(
    error: string,
    message = "Operação falhou",
    statusCode: HttpErrorCode = HttpErrorCode.BadRequest,
    path?: string,
    method?: string,
  ): NextResponse<ApiResponse<null>> {
    const res = new ApiResponse<null>(
      false,
      statusCode,
      HttpErrorName[HttpErrorCode[statusCode] as keyof typeof HttpErrorName],
      message,
      null,
      error,
      path,
      method,
    )
    return NextResponse.json(res, { status: statusCode })
  }
}
