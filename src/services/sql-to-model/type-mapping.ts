const typeMappingDefine: { [index: string]: string } = {
  char: "string",
  varchar: "string",
  timestamp: "int64",
  bigint: "int64",
  int: "int32",
  tinyint: "int32",
}

export function typeMapping(t: string): string {
  let result = typeMappingDefine[t]
  if (!result) {
    result = "未定义类型"
  }
  return result
}
