import LegalPageLayout from '../components/LegalPageLayout';
import TermsContent from '../components/legal/TermsContent';

const TermsPage = ({ onNavigate }) => (
  <LegalPageLayout
    title="Terms of Service"
    subtitle="Third Place Studios LLC, d/b/a Studio 3 · Effective: July 2026"
    onNavigate={onNavigate}
    fullWidth
  >
    <TermsContent />
  </LegalPageLayout>
);

export default TermsPage;
