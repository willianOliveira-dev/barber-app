import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import { env } from "@/src/config/env"

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
})

interface UploadToCloudinaryParams {
  buffer: Buffer
  folder: string
  publicId: string
}

export function uploadToCloudinary({
  buffer,
  folder,
  publicId,
}: UploadToCloudinaryParams): Promise<UploadApiResponse> {
  const uploadStream = new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          transformation: { quality: "auto", fetch_format: "auto" },
          overwrite: true,
          public_id: `${folder}_${publicId}`,
        },
        (error, result) => {
          if (error) return reject(error)
          if (!result)
            return reject(new Error("Resultado de upload indefinido"))
          resolve(result)
        },
      )
      .end(buffer)
  })
  return uploadStream
}
