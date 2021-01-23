import { strict } from 'assert';
import { MinMax } from '../Helpers/Interfaces';

class Validator {
  public validate(value: string, params: any[] = []): any {
    const method = `getCorrect${value[0].toUpperCase() + value.slice(1)}`;
    return this[method](...params);
  }

  public getCorrectRange(max: number, min: number): MinMax {
    if (max < min) {
      return { max: min, min: max };
    }
    if (max === min) {
      return { max, min: min - 1 };
    }
    return { max, min };
  }

  public getCorrectStep(step: number, max: number): number {
    if (step >= max) {
      return 1;
    }
    if (step <= 0) {
      return 1;
    }
    return step;
  }

  public getCorrectValue(unCorrectValue: number[] | number, max: number, min: number): number[] {
    // переводим value -> [value] для правильной работы метода getRenderData
    const preValue: number[] = Array.isArray(unCorrectValue) ? unCorrectValue : [unCorrectValue];

    // корректируем value, чтобы не выходил за пределы max и min
    return preValue
      .sort((a, b) => a - b)
      .map((val) => {
        if (val >= max) {
          return max;
        }
        if (val <= min) {
          return min;
        }
        return val;
      });
  }
}

export default Validator;
