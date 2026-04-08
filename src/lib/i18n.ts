// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = target[key];
      
      if (isObject(sourceValue) && targetValue !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        output[key as keyof T] = deepMerge(targetValue, sourceValue) as any;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        output[key as keyof T] = sourceValue as any;
      }
    });
  }
  
  return output;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}
