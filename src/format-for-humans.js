export function humanizeStepArgs(args) {
  return args.length
    ? " " + args.map((arg) => JSON.stringify(arg)).join(", ")
    : "";
}

export function humanizeFunctionName(fn) {
  let functionName = fn.name.toString().replace(/^bound /, "");
  if (!functionName) {
    functionName = fn.toString().replace("() => ", "");
  }
  return functionName.replaceAll("_", " ").replaceAll(/\s+/g, " ");
}
