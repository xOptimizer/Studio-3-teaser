import LegalPageLayout from '../components/LegalPageLayout';
import ContactForm from '../components/ContactForm';

const ContactPage = ({ onNavigate }) => (
  <LegalPageLayout
    title="Contact Us"
    subtitle="Have questions or interested in partnering? Send us a message."
    onNavigate={onNavigate}
  >
    <ContactForm />
  </LegalPageLayout>
);

export default ContactPage;
