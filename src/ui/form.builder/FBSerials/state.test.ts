import { FBEndpoint } from '../defaults/FBEndpoint';
import FBSerialsState from './state';

jest.mock('../FBApi/FBApi.request', () => class MockFBRequest {
  public data: unknown;

  public loading = false;

  public url = '';

  public constructor (url = '') {
    this.url = url;
  }

  public set = () => undefined;

  public fetch = () => undefined;

  public setUrl = (url: string) => {
    this.url = url;
  };
});

describe('FBSerialsState.checkExistingLotSerialNumbers', () => {
  it('posts sanitized serials to the company-level validation endpoint', async () => {
    const state = new FBSerialsState();
    const requestSpy = jest
      .spyOn(state.existingSerialNumbersRequest, 'set')
      .mockImplementation(async () => {
        await Promise.resolve();
        return ['SN-001'];
      });

    const result = await state.checkExistingLotSerialNumbers([' SN-001 ', '', 'SN-002']);

    expect(result).toEqual(['SN-001']);
    expect(requestSpy).toHaveBeenCalledWith({
      method: 'post',
      url: FBEndpoint.CheckExistingLotSerialNumbers,
      body: { serialNumbers: ['SN-001', 'SN-002'] },
    });
    expect(requestSpy.mock.calls[0][0]).not.toHaveProperty('urlValues');
  });

  it('skips the validation request when all submitted serials are blank', async () => {
    const state = new FBSerialsState();
    const requestSpy = jest.spyOn(state.existingSerialNumbersRequest, 'set');

    const result = await state.checkExistingLotSerialNumbers([' ', '']);

    expect(result).toEqual([]);
    expect(requestSpy).not.toHaveBeenCalled();
  });
});
