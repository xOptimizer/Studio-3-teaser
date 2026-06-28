import LegalPageLayout from '../components/LegalPageLayout';
import TermsContent from '../components/legal/TermsContent';

const TermsPage = ({ onNavigate }) => (
  <LegalPageLayout
    title="Terms of Service"
    subtitle="Last updated: January 18, 2026"
    onNavigate={onNavigate}
  >
    <TermsContent />
  </LegalPageLayout>
);

export default TermsPage;
