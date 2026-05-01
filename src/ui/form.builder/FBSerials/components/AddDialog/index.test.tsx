import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount, ReactWrapper } from 'enzyme';
import { Dialog } from '../../../../components/dialogs';
import { Autocomplete } from '../../../../components/forms/fields-next';
import { SERIAL_VALIDATION_DEBOUNCE_MS } from '../../consts';
import { AddDialog } from './index';

jest.mock('../../../../components/dialogs', () => {
  const MockDialog = ({ children }: { children?: JSX.Element }) => children ?? null;

  return { __esModule: true, Dialog: MockDialog, default: MockDialog };
});

jest.mock('../../../../components/forms/fields-next', () => {
  const MockAutocomplete = () => null;

  return { __esModule: true, Autocomplete: MockAutocomplete };
});

jest.mock('../../../../components/forms/fields-next/Autocomplete/Autocomplete', () => ({
  AutocompleteControl: () => null,
}));

jest.mock('../../../../../common/intl', () => ({
  translate: (key: string) => {
    const translations: Record<string, string> = {
      'common.add': 'Add',
      'form.builder.serials.add.dialog.duplicate.serials': 'Duplicate serial numbers in this list',
      'form.builder.serials.add.dialog.invalid.serials': 'Some of the serial numbers already exist',
      'form.builder.serials.add.dialog.validation.failed': 'Unable to validate serial numbers. Please try again.',
    };

    return translations[key] ?? key;
  },
}));

type AddDialogProps = React.ComponentProps<typeof AddDialog>;

const getProps = (overrides: Partial<AddDialogProps> = {}): AddDialogProps => ({
  isOpen: true,
  onCheckExistingSerialNumbers: jest.fn<Promise<string[]>, [string[]]>().mockResolvedValue([]),
  onClose: jest.fn(),
  onConfirm: jest.fn<Promise<void>, [string[]]>().mockResolvedValue(),
  ...overrides,
});

let mockedNow = 0;
let dateNowSpy: jest.SpyInstance<number, []>;

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const advanceValidationTimers = async (ms: number) => {
  await act(async () => {
    mockedNow += ms;
    jest.advanceTimersByTime(ms);
    await flushPromises();
  });
};

const runDebouncedValidation = async (wrapper: ReactWrapper) => {
  await advanceValidationTimers(SERIAL_VALIDATION_DEBOUNCE_MS);
  wrapper.update();
};

const setSerials = async (wrapper: ReactWrapper, serials: string[]) => {
  const onChange = wrapper.find(Autocomplete).prop('onChange') as (_event: unknown, value: string[]) => void;
  await act(async () => {
    onChange(null, serials);
    await flushPromises();
  });
  wrapper.update();
};

const submit = async (wrapper: ReactWrapper) => {
  const onConfirm = wrapper.find(Dialog).prop('onConfirm') as () => Promise<void>;
  await act(async () => {
    await onConfirm();
    await flushPromises();
  });
  wrapper.update();
};

const getConfirmDisabled = (wrapper: ReactWrapper): boolean => {
  const confirmProps = wrapper.find(Dialog).prop('confirmProps') as { disabled?: boolean };
  return Boolean(confirmProps.disabled);
};

const getDialogText = (wrapper: ReactWrapper): string => {
  return wrapper.find(Dialog).children().text();
};

describe('AddDialog serial validation', () => {
  beforeEach(() => {
    mockedNow = 0;
    jest.useFakeTimers();
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => mockedNow);
  });

  afterEach(() => {
    jest.clearAllTimers();
    dateNowSpy.mockRestore();
    jest.useRealTimers();
  });

  it('validates trimmed serials on the fly before allowing create', async () => {
    const onCheckExistingSerialNumbers = jest.fn<Promise<string[]>, [string[]]>().mockResolvedValue([]);
    const onConfirm = jest.fn<Promise<void>, [string[]]>().mockResolvedValue();
    const onClose = jest.fn();
    const wrapper = mount(<AddDialog {...getProps({ onCheckExistingSerialNumbers, onConfirm, onClose })} />);

    await setSerials(wrapper, [' SN-001 ', 'SN-002']);

    expect(getConfirmDisabled(wrapper)).toBe(true);
    expect(onCheckExistingSerialNumbers).not.toHaveBeenCalled();

    await runDebouncedValidation(wrapper);

    expect(onCheckExistingSerialNumbers).toHaveBeenCalledWith(['SN-001', 'SN-002']);
    expect(getConfirmDisabled(wrapper)).toBe(false);

    await submit(wrapper);

    expect(onConfirm).toHaveBeenCalledWith(['SN-001', 'SN-002']);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('skips validation and create for blank input', async () => {
    const onCheckExistingSerialNumbers = jest.fn<Promise<string[]>, [string[]]>().mockResolvedValue([]);
    const onConfirm = jest.fn<Promise<void>, [string[]]>().mockResolvedValue();
    const wrapper = mount(<AddDialog {...getProps({ onCheckExistingSerialNumbers, onConfirm })} />);

    await setSerials(wrapper, [' ', '']);
    await runDebouncedValidation(wrapper);

    expect(getConfirmDisabled(wrapper)).toBe(true);
    expect(onCheckExistingSerialNumbers).not.toHaveBeenCalled();

    await submit(wrapper);

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('blocks create and shows the generic existing-serial error from live validation', async () => {
    const onCheckExistingSerialNumbers = jest
      .fn<Promise<string[]>, [string[]]>()
      .mockResolvedValue(['SN-001']);
    const onConfirm = jest.fn<Promise<void>, [string[]]>().mockResolvedValue();
    const onClose = jest.fn();
    const wrapper = mount(<AddDialog {...getProps({ onCheckExistingSerialNumbers, onConfirm, onClose })} />);

    await setSerials(wrapper, ['sn-001']);
    await runDebouncedValidation(wrapper);

    expect(onCheckExistingSerialNumbers).toHaveBeenCalledWith(['sn-001']);
    expect(getConfirmDisabled(wrapper)).toBe(true);
    expect(getDialogText(wrapper)).toContain('Some of the serial numbers already exist');
    expect(getDialogText(wrapper)).not.toContain('Serial numbers already exist: SN-001');

    await submit(wrapper);

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('keeps duplicate-within-input validation local and case-insensitive', async () => {
    const onCheckExistingSerialNumbers = jest.fn<Promise<string[]>, [string[]]>().mockResolvedValue([]);
    const onConfirm = jest.fn<Promise<void>, [string[]]>().mockResolvedValue();
    const wrapper = mount(<AddDialog {...getProps({ onCheckExistingSerialNumbers, onConfirm })} />);

    await setSerials(wrapper, ['SN-001', 'sn-001']);
    await runDebouncedValidation(wrapper);

    expect(getConfirmDisabled(wrapper)).toBe(true);
    expect(getDialogText(wrapper)).toContain('Duplicate serial numbers in this list');

    await submit(wrapper);

    expect(onCheckExistingSerialNumbers).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('blocks create when live backend validation fails', async () => {
    const onCheckExistingSerialNumbers = jest
      .fn<Promise<string[]>, [string[]]>()
      .mockRejectedValue(new Error('validation failed'));
    const onConfirm = jest.fn<Promise<void>, [string[]]>().mockResolvedValue();
    const onClose = jest.fn();
    const wrapper = mount(<AddDialog {...getProps({ onCheckExistingSerialNumbers, onConfirm, onClose })} />);

    await setSerials(wrapper, ['SN-001']);
    await runDebouncedValidation(wrapper);

    expect(getConfirmDisabled(wrapper)).toBe(true);
    expect(getDialogText(wrapper)).toContain('Unable to validate serial numbers. Please try again.');

    await submit(wrapper);

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('debounces live validation calls and only validates the latest serials', async () => {
    const onCheckExistingSerialNumbers = jest.fn<Promise<string[]>, [string[]]>().mockResolvedValue([]);
    const wrapper = mount(<AddDialog {...getProps({ onCheckExistingSerialNumbers })} />);

    await setSerials(wrapper, ['SN-001']);

    await advanceValidationTimers(SERIAL_VALIDATION_DEBOUNCE_MS - 1);
    wrapper.update();

    expect(onCheckExistingSerialNumbers).not.toHaveBeenCalled();

    await setSerials(wrapper, ['SN-002']);
    await runDebouncedValidation(wrapper);

    expect(onCheckExistingSerialNumbers).toHaveBeenCalledTimes(1);
    expect(onCheckExistingSerialNumbers).toHaveBeenCalledWith(['SN-002']);
  });

  it('ignores stale live validation responses after serials change', async () => {
    let resolveFirstValidation: (serials: string[]) => void = () => undefined;
    const onCheckExistingSerialNumbers = jest
      .fn<Promise<string[]>, [string[]]>()
      .mockImplementationOnce(async () => await new Promise<string[]>(resolve => {
        resolveFirstValidation = resolve;
      }))
      .mockResolvedValueOnce([]);
    const wrapper = mount(<AddDialog {...getProps({ onCheckExistingSerialNumbers })} />);

    await setSerials(wrapper, ['SN-001']);
    await runDebouncedValidation(wrapper);
    expect(onCheckExistingSerialNumbers).toHaveBeenCalledWith(['SN-001']);

    await setSerials(wrapper, ['SN-002']);
    await runDebouncedValidation(wrapper);
    expect(onCheckExistingSerialNumbers).toHaveBeenCalledWith(['SN-002']);
    expect(getConfirmDisabled(wrapper)).toBe(false);

    await act(async () => {
      resolveFirstValidation(['SN-001']);
      await flushPromises();
    });
    wrapper.update();

    expect(getDialogText(wrapper)).not.toContain('Some of the serial numbers already exist');
    expect(getConfirmDisabled(wrapper)).toBe(false);
  });

  it('keeps the existing-serial error visible while a new check is in flight', async () => {
    const onCheckExistingSerialNumbers = jest
      .fn<Promise<string[]>, [string[]]>()
      .mockResolvedValueOnce(['SN-001'])
      .mockResolvedValueOnce(['SN-001']);
    const wrapper = mount(<AddDialog {...getProps({ onCheckExistingSerialNumbers })} />);

    await setSerials(wrapper, ['SN-001']);
    await runDebouncedValidation(wrapper);

    expect(getDialogText(wrapper)).toContain('Some of the serial numbers already exist');

    await setSerials(wrapper, ['SN-001', 'SN-002']);

    expect(getDialogText(wrapper)).toContain('Some of the serial numbers already exist');
    expect(getConfirmDisabled(wrapper)).toBe(true);

    await runDebouncedValidation(wrapper);

    expect(getDialogText(wrapper)).toContain('Some of the serial numbers already exist');
    expect(getConfirmDisabled(wrapper)).toBe(true);
  });

  it('clears the existing-serial error immediately when the offending serial is removed', async () => {
    const onCheckExistingSerialNumbers = jest
      .fn<Promise<string[]>, [string[]]>()
      .mockResolvedValueOnce(['SN-001'])
      .mockResolvedValueOnce([]);
    const wrapper = mount(<AddDialog {...getProps({ onCheckExistingSerialNumbers })} />);

    await setSerials(wrapper, ['SN-001', 'SN-002']);
    await runDebouncedValidation(wrapper);

    expect(getDialogText(wrapper)).toContain('Some of the serial numbers already exist');

    await setSerials(wrapper, ['SN-002']);

    expect(getDialogText(wrapper)).not.toContain('Some of the serial numbers already exist');
    expect(getConfirmDisabled(wrapper)).toBe(true);

    await runDebouncedValidation(wrapper);

    expect(getConfirmDisabled(wrapper)).toBe(false);
  });
});
