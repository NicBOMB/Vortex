import safeCreateAction from '../../actions/safeCreateAction';

import { Action } from 'redux';

type ShowUrlFunc = (url: string, instructions?: string, subscriber?: string, skippable?: boolean)
  => Action<{ url: string, instructions: string, subscriber: string, skippable: boolean }>;

export const showURL: ShowUrlFunc = safeCreateAction(
  'SHOW_URL',
  (url: string, instructions?: string, subscriber?: string, skippable?: boolean) => (
    { url, instructions, subscriber, skippable: skippable ?? false }
  )
) as any; // FIXME

export const closeBrowser = safeCreateAction('CLOSE_BROWSER');
