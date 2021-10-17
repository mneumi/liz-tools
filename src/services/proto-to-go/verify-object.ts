import { IProtoObject, IVerifyResult, IVerifyResultType } from "./types"

export function verifyObject(obj: IProtoObject): IVerifyResult[] {
  const ret: IVerifyResult[] = []

  ret.push(...verifySyntax(obj))
  ret.push(...verifyPackage(obj))
  ret.push(...verifyImports(obj))
  ret.push(...verifyEnums(obj))
  ret.push(...verifyServices(obj))

  return ret
}

function verifySyntax(obj: IProtoObject): IVerifyResult[] {
  const syntax = obj.syntax

  const ret: IVerifyResult[] = []
  if (syntax !== 3) {
    ret.push(buildVerifyRsult("syntax", "syntax 必须要为 proto3"))
  }
  return ret
}

function verifyPackage(obj: IProtoObject): IVerifyResult[] {
  const packageName = obj.package

  const ret: IVerifyResult[] = []
  if (!packageName || packageName === "") {
    ret.push(buildVerifyRsult("package", "package 字段不能为空"))
  }
  return ret
}

function verifyImports(obj: IProtoObject): IVerifyResult[] {
  const imports = obj.imports

  const ret: IVerifyResult[] = []

  if (!imports.includes("google.api.http")) {
    ret.push(buildVerifyRsult("import", "没有导入 google.api.http"))
  }

  // TODO: 后续支持 导入其他 proto 文件

  return ret
}

function verifyEnums(obj: IProtoObject): IVerifyResult[] {
  const enums = obj.enums

  const ret: IVerifyResult[] = []

  for (const enumName in enums) {
    // 枚举对象
    const enumItem = enums[enumName]
    // 枚举名
    const enumItemName = enumItem.name

    // 规则1：枚举名称不能含有 _
    if (enumItemName.includes("_")) {
      ret.push(buildVerifyRsult("enum", `枚举名称 ${enumItemName} 不能含有 _`))
    }
    // 规则2：枚举名称不能全大写
    if (enumItemName === enumItemName.toUpperCase()) {
      ret.push(buildVerifyRsult("enum", `枚举名称 ${enumItemName} 不能全是大写字母`))
    }

    // 遍历枚举字段
    for (const fieldName in enumItem.values) {
      // 字段值
      const fieldValue = enumItem.values[fieldName].value

      ret.push(...verifyEnumField(enumItemName, fieldName, fieldValue))
    }
  }

  return ret
}

// 辅助函数：用于校验枚举中的字段
function verifyEnumField(
  enumItemName: string, // 枚举名
  fieldName: string, // 字段名
  fieldValue: number, // 字段值
): IVerifyResult[] {
  const ret: IVerifyResult[] = []

  // 规则3：枚举中字段名称不能含有 _
  if (fieldName.includes("_")) {
    ret.push(buildVerifyRsult("enum", `枚举 ${enumItemName} 中的字段名 ${fieldName} 含有 _`))
  }
  // 规则4：枚举中字段名不能全大写
  if (fieldName.toUpperCase() === fieldName) {
    ret.push(buildVerifyRsult("enum", `枚举 ${enumItemName} 中的字段名 ${fieldName} 不能全大写`))
  }
  // 规则5：枚举中字段值如果是零值，则字段名需要是特定的字符串：NotUsed 或 Unknown
  if (fieldValue === 0) {
    if (fieldName !== "NotUsed" && fieldName !== "Unknown") {
      ret.push(
        buildVerifyRsult(
          "enum:zeroValue",
          `枚举 ${enumItemName} 中的零值字段 ${fieldName} 的名称必须为 NotUsed 或 Unknown（如果想要忽略该校验，则调整编译选项中的 "枚举零值校验" 项）`,
        ),
      )
    }
  }
  // 规则6：枚举的 tag 值不能小于0
  if (fieldValue < 0) {
    ret.push(buildVerifyRsult("enum", `枚举 ${enumItemName} 中的字段 ${fieldName} 的值不能小于0"`))
  }

  return ret
}

function verifyServices(obj: IProtoObject): IVerifyResult[] {
  const services = obj.services
  const messages = obj.messages

  const ret: IVerifyResult[] = []

  if (!services) {
    ret.push(buildVerifyRsult("service", "proto 中没有定义 service"))
    return ret
  }

  for (const serviceName in services) {
    // 一个service对象
    const serviceItem = services[serviceName]

    serviceItem.methods.map((method) => {
      // 检查是否有定义请求类型
      if (!method.input_type) {
        ret.push(buildVerifyRsult("service", `service ${serviceName} 未设置请求 message`))
      } else if (!(messages as Object).hasOwnProperty(method.input_type)) {
        // 检查是否存在请求类型的 message
        ret.push(buildVerifyRsult("service", `message ${method.input_type} 未定义`))
      }

      // 检查是否有定义响应类型
      if (!method.output_type) {
        ret.push(buildVerifyRsult("service", `service ${serviceName} 未设置响应 message`))
      } else if (!(messages as Object).hasOwnProperty(method.output_type)) {
        // 检查是否存在响应类型的 message
        ret.push(buildVerifyRsult("service", `message ${method.output_type} 未定义`))
      }

      // 检查 options 是否含有 google.api.http
      if (!(method.options as Object).hasOwnProperty("google.api.http")) {
        ret.push(buildVerifyRsult("service", `rpc ${method.name} 未定义 option google.api.http`))
      } else {
        const obj = method.options["google.api.http"] as { [index: string]: string }

        for (const key in obj) {
          if (!["get", "post", "body"].includes(key)) {
            ret.push(
              buildVerifyRsult(
                "service",
                `rpc ${method.name} 中 option google.api.http 的键必须为 get | post | body`,
              ),
            )
          } else if (key === "body" && obj[key] !== "*") {
            ret.push(
              buildVerifyRsult("service", `rpc ${method.name} 中 option 的 body 值必须为 "*"`),
            )
          } else if (obj[key].length == 0) {
            ret.push(buildVerifyRsult("service", `rpc ${method.name} 中 option 的 ${key} 不能为空`))
          }
        }
      }
    })
  }

  return ret
}

// 辅助函数：用于校验枚举中的字段

function buildVerifyRsult(type: IVerifyResultType, msg: string): IVerifyResult {
  return { type, msg }
}
