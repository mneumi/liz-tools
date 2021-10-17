import pbs from "protocol-buffers-schema"
import { Schema } from "protocol-buffers-schema/types"

export function protoToSchema(protoStr: string): Schema {
  let schema: Schema

  try {
    schema = pbs.parse(protoStr)
  } catch {
    throw new Error("proto 校验失败，请检查 proto 内容")
  }

  return schema
}
