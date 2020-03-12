const parseDynamoStreamRecord = (
  value: any,
  useBigInt: boolean = false
): any => {
  let result: any = {};
  if (!value) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(val => parseDynamoStreamRecord(val, useBigInt));
  }
  if (typeof value !== "object") {
    return value;
  }
  const keys = Object.keys(value);
  for (const key of keys) {
    switch (key) {
      case "B":
      case "S":
        result = value[key] && value[key].toString();
        break;
      case "BS":
      case "SS":
        result = value[key];
        break;
      case "BOOL":
        result = Boolean(value[key]);
        break;
      case "N":
        result = value[key] && (useBigInt ? BigInt(value[key]) : +value[key]);
        break;
      case "NS":
        result = value[key].map((val: string) =>
          useBigInt ? BigInt(val) : +val
        );
        break;
      case "M":
        result = parseDynamoStreamRecord(value[key], useBigInt);
        break;
      case "L":
        result = value[key].map((val: string) =>
          parseDynamoStreamRecord(val, useBigInt)
        );
        break;
      case "NULL":
        if (value[key]) {
          result = null;
        }
        break;
      default:
        result[key] =
          !!value[key] && typeof value[key] === "object"
            ? parseDynamoStreamRecord(value[key], useBigInt)
            : value[key];
    }
  }
  return result;
};

export { parseDynamoStreamRecord };
