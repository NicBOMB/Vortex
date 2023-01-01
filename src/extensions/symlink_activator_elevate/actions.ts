import safeCreateAction from '../../actions/safeCreateAction';

export const enableUserSymlinks = safeCreateAction('ENABLE_USER_SYMLINKS',
  (enabled: boolean) => enabled);
