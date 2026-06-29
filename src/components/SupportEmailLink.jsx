import { SUPPORT_EMAIL } from '../constants/support';

function SupportEmailLink({ className = 'font-semibold underline underline-offset-2 hover:opacity-80' }) {
  return (
    <a href={`mailto:${SUPPORT_EMAIL}`} className={className}>
      {SUPPORT_EMAIL}
    </a>
  );
}

export default SupportEmailLink;
