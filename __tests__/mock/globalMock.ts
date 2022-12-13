/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-empty-function */
import { logger as LogUtil } from '@common/core/logger';

//@ts-ignore
const info = jest.spyOn(LogUtil, 'info');
const debug = jest.spyOn(LogUtil, 'debug');
const error = jest.spyOn(LogUtil, 'error');

beforeAll(() => {
  //@ts-ignore
  info.mockImplementation((_data: any) => {});
  //@ts-ignore
  error.mockImplementation((_data: any) => {});
  //@ts-ignore
  debug.mockImplementation((_data: any) => {});
});
