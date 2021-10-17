import { Options } from "protocol-buffers-schema/types"

export interface IProtoObject {
  syntax: number
  package: string | null
  imports: string[]
  enums: IEnums
  services: IServices
  messages: IMessages
}

export interface IEnums {
  [index: string]: IEnum
}

export interface IMessages {
  [index: string]: IMessage
}

export type IServices = {
  [index: string]: IService
} | null

export interface IEnumValues {
  [index: string]: {
    value: number
  }
}

export interface IEnum {
  name: string
  values: IEnumValues
}

export interface IField {
  name: string
  type: string
  tag: number
  repeated: boolean
}

export interface IMethod {
  name: string
  input_type: string
  output_type: string
  options: Options
}

export interface IService {
  name: string
  methods: IMethod[]
}

export interface IMessage {
  name: string
  messages: IMessage[]
  enums: IEnum[]
  fields: IField[]
}

export type IVerifyResultType =
  | "syntax"
  | "package"
  | "import"
  | "enum"
  | "enum:zeroValue"
  | "service"
  | "message"

export interface IVerifyResult {
  type: IVerifyResultType
  msg: string
}
