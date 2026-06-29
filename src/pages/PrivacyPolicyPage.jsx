import LegalPageLayout from '../components/LegalPageLayout';
import PrivacyPolicyContent from '../components/legal/PrivacyPolicyContent';

const PrivacyPolicyPage = ({ onNavigate }) => (
  <LegalPageLayout
    title="Privacy Policy"
    subtitle="Third Place Studios LLC, d/b/a Studio 3 · Effective: July 2026"
    onNavigate={onNavigate}
    fullWidth
  >
    <PrivacyPolicyContent />
  </LegalPageLayout>
);

export default PrivacyPolicyPage;
