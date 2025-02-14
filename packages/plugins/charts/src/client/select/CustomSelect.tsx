import { LoadingOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { connect, mapProps, mapReadPretty } from '@formily/react';
import { isValid } from '@formily/shared';
import { Icon } from '@nocobase/client';
import type { SelectProps } from 'antd';
import { Popover, Select as AntdSelect } from 'antd';
import React from 'react';
import { lang } from '../locale';
import { ReadPretty } from './ReadPretty';

type Props = SelectProps<any, any> & { objectValue?: boolean; onChange?: (v: any) => void; multiple: boolean };

const isEmptyObject = (val: any) => !isValid(val) || (typeof val === 'object' && Object.keys(val).length === 0);

const { Option, OptGroup } = AntdSelect;
const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes((input || '').toLowerCase());

const InternalSelect = connect(
  (props: Props) => {
    const { ...others } = props;
    const { options, ...othersProps } = { ...others };
    const mode = props.mode || props.multiple ? 'multiple' : undefined;
    const group1 = options.filter((option) => option.group === 2);
    const group2 = options.filter((option) => option.group === 1);
    return (
      <AntdSelect
        showSearch
        filterOption={filterOption}
        allowClear
        {...othersProps}
        onChange={(changed) => {
          props.onChange?.(changed === undefined ? null : changed);
        }}
        mode={mode}
      >
        <OptGroup label={lang('Basic charts')}>
          {group1.map((option) => (
            <Option value={option.key} label={lang(option.title)}>
              <Popover
                placement={'right'}
                zIndex={99999999999}
                content={() => (
                  <span>
                    {lang(option?.description)
                      ?.split(',')
                      .map((item) => (
                        <div>{item}</div>
                      ))}
                  </span>
                )}
                trigger="hover"
              >
                <div
                  className={css`
                    display: flex;
                    gap: 4px;
                    align-items: center;
                  `}
                >
                  <Icon type={option.iconId} />
                  <span role="img" aria-label={lang(option.title)}>
                    {lang(option.title)}
                  </span>
                </div>
              </Popover>
            </Option>
          ))}
        </OptGroup>
        <OptGroup label={lang('More charts')}>
          {group2.map((option) => (
            <Option value={option.key} label={lang(option.title)}>
              <Popover
                placement={'right'}
                zIndex={99999999999}
                content={() => (
                  <span>
                    {lang(option?.description)
                      ?.split(',')
                      .map((item) => (
                        <div>{item}</div>
                      ))}
                  </span>
                )}
                trigger="hover"
              >
                <div
                  className={css`
                    display: flex;
                    gap: 4px;
                    align-items: center;
                  `}
                >
                  <Icon type={option.iconId} />
                  <span role="img" aria-label={lang(option.title)}>
                    {lang(option.title)}
                  </span>
                </div>
              </Popover>
            </Option>
          ))}
        </OptGroup>
      </AntdSelect>
    );
  },
  mapProps(
    {
      dataSource: 'options',
      loading: true,
    },
    (props, field) => {
      return {
        ...props,
        suffixIcon: field?.['loading'] || field?.['validating'] ? <LoadingOutlined /> : props?.suffixIcon,
      };
    },
  ),
  mapReadPretty(ReadPretty),
);

export const CustomSelect = InternalSelect as unknown as typeof InternalSelect & {
  ReadPretty: typeof ReadPretty;
};

CustomSelect.ReadPretty = ReadPretty;

export default CustomSelect;
