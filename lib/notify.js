import { openSnackbarExternal } from '../components/common/Notifier';

export default function notify(obj) {
  // obj.toString() so it is applicable to logging out error object
  openSnackbarExternal({ message: obj.message || obj.toString() });
}
