import * as utils from '../utils';

describe('utils.isArray', () => {
  it('should return true if the input is an array', () => {
    expect(utils.isArray([])).toBe(true);
  });

  it('should return false if the input is not an array', () => {
    expect(utils.isArray('not an array')).toBe(false);
  });
});

describe('utils.isFormData', () => {
  it('should return true if the input is FormData', () => {
    expect(utils.isFormData(new FormData())).toBe(true);
  });

  it('should return false if the input is not FormData', () => {
    expect(utils.isFormData('not FormData')).toBe(false);
  });
});

describe('utils.isDate', () => {
  it('should return true if the input is a Date', () => {
    expect(utils.isDate(new Date())).toBe(true);
  });

  it('should return false if the input is not a Date', () => {
    expect(utils.isDate('not a Date')).toBe(false);
  });
});

describe('utils.isObject', () => {
  it('should return true if the input is an Object', () => {
    expect(utils.isObject({})).toBe(true);
  });

  it('should return false if the input is not an Object', () => {
    expect(utils.isObject('not an Object')).toBe(false);
  });
});

describe('utils.isURLSearchParams', () => {
  it('should return true if the input is a URLSearchParams', () => {
    expect(utils.isURLSearchParams(new URLSearchParams())).toBe(true);
  });

  it('should return false if the input is not a URLSearchParams', () => {
    expect(utils.isURLSearchParams('not a URLSearchParams')).toBe(false);
  });
});

describe('utils.isStandardBrowserEnv', () => {
  test.each(['ReactNative', 'NativeScript', 'NS'])(
    'should return false if the navigator product is %s',
    (product) => {
      Object.defineProperty(window, 'navigator', {
        configurable: true,
        writable: true,
        value: { product },
      });
      expect(utils.isStandardBrowserEnv()).toBe(false);
    },
  );

  it('should return true if window and document is defined', () => {
    Object.defineProperty(window, 'navigator', {
      configurable: true,
      writable: true,
      value: { product: 'Chrome' },
    });
    expect(utils.isStandardBrowserEnv()).toBe(true);
  });
});

describe('utils.forEach', () => {
  it('should return early if the input is null or undefined', () => {
    const callback = jest.fn();
    utils.forEach(null, callback);
    utils.forEach(undefined, callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should convert non-object input into an array', () => {
    const callback = jest.fn();
    utils.forEach(5, callback);
    expect(callback).toHaveBeenCalledWith(5, 0, [5]);
  });

  it('should iterate over array values', () => {
    const array = [1, 2, 3];
    const callback = jest.fn();
    utils.forEach(array, callback);
    array.forEach((value, index) => {
      expect(callback).toHaveBeenCalledWith(value, index, array);
    });
  });

  it('should iterate over object keys', () => {
    const object = { a: 1, b: 2, c: 3 };
    const callback = jest.fn();
    utils.forEach(object, callback);
    Object.keys(object).forEach((key) => {
      expect(callback).toHaveBeenCalledWith(object[key], key, object);
    });
  });
});

describe('utils.isUndefined', () => {
  it('should return true if the input is undefined', () => {
    expect(utils.isUndefined(undefined)).toBe(true);
  });

  it('should return false if the input is not undefined', () => {
    expect(utils.isUndefined('not undefined')).toBe(false);
  });
});
