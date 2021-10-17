// 下划线转换驼峰
export function underscoreToCamel(str: string): string {
  return str.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

// 驼峰转换下划线
export function camelToUnderscore(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .slice(1)
}

// 驼峰转Pascal
export function camelToPascal(str: string): string {
  return str[0].toUpperCase() + str.slice(1, str.length)
}

// 下划线转Pascal
export function underscoreToPascal(str: string): string {
  return camelToPascal(underscoreToCamel(str))
}
