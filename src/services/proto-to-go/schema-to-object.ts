import { Schema } from "protocol-buffers-schema/types"
import { IProtoObject, IEnum, IService, IMessage, IEnums, IServices, IMessages } from "./types"

export function schemaToObject(schema: Schema): IProtoObject {
  return {
    syntax: extractSyntax(schema),
    package: extractPackage(schema),
    imports: extractImports(schema),
    enums: extractEnums(schema),
    services: extractServices(schema),
    messages: extractMessages(schema),
  }
}

function extractSyntax(schema: Schema): number {
  return schema.syntax
}

function extractPackage(schema: Schema): string | null {
  return schema.package
}

function extractImports(schema: Schema): string[] {
  return schema.imports
}

function extractEnums(schema: Schema): IEnums {
  const obj: { [index: string]: IEnum } = {}

  schema.enums.map((item) => {
    obj[item.name] = item
  })

  return obj
}

function extractServices(schema: Schema): IServices {
  if (!schema.services) {
    return null
  }

  const obj: { [index: string]: IService } = {}

  schema.services.map((item) => {
    obj[item.name] = item
  })

  return obj
}

function extractMessages(schema: Schema): IMessages {
  const obj: { [index: string]: IMessage } = {}

  schema.messages.map((item) => {
    obj[item.name] = item
  })

  return obj
}
