import {HttpException, PipeTransform} from "@nestjs/common";

/**
 * An pipe converts string to number
 * If the value is falsy 0 will be returned as default.
 */
export const NUMBER: PipeTransform<string, number> = {
  transform: value => {
    return Number(value || 0);
  }
};

export const JSONP: PipeTransform<string, object> = {
  transform: value => {
    if (typeof value == "string") {
      try {
        return global.JSON.parse(value);
      } catch (error) {
        throw new HttpException(error.message, 400);
      }
    }
    return value;
  }
};

export function DEFAULT<T = unknown>(defaultValue: T | (() => T)): PipeTransform<any, T> {
  return {
    transform: value => {
      return typeof value == "undefined"
        ? typeof defaultValue == "function"
          ? (defaultValue as Function)()
          : defaultValue
        : value;
    }
  };
}

export const BOOLEAN: PipeTransform<string, boolean> = {
  transform: value => {
    return /true|1/i.test(value);
  }
};

export const DATE: PipeTransform<string, Date> = {
  transform: value => {
    return new Date(value);
  }
};

export function ARRAY<T>(coerce: (v: string) => T): PipeTransform<string | string[], T[]> {
  return {
    transform: value => {
      if (!Array.isArray(value)) {
        value = [value];
      }

      return value.map(coerce);
    }
  };
}
