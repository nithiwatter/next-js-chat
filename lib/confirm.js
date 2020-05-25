import { openConfirmDialogExternal } from '../components/common/Confirmer';

export default function confirm({ title, message, onAnswer }) {
  openConfirmDialogExternal({ title, message, onAnswer });
}
