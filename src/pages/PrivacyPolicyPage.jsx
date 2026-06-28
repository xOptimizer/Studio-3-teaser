import LegalPageLayout from '../components/LegalPageLayout';
import PrivacyPolicyContent from '../components/legal/PrivacyPolicyContent';

const PrivacyPolicyPage = ({ onNavigate }) => (
  <LegalPageLayout
    title="Privacy Policy"
    subtitle="Last updated: January 18, 2026"
    onNavigate={onNavigate}
  >
    <PrivacyPolicyContent />
  </LegalPageLayout>
);

export default PrivacyPolicyPage;
