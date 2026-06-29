const SUPPORT_EMAIL = 'support@studio-3.co';

function SupportEmailLink() {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="font-semibold text-gray-900 underline underline-offset-2 hover:opacity-80"
    >
      {SUPPORT_EMAIL}
    </a>
  );
}

function TermsContent() {
  return (
    <div className="space-y-8 text-gray-900 text-sm md:text-base leading-relaxed">
      <p>
        By using studiosthree.com or purchasing a ticket through our platform, you agree to these
        terms. Please read them before completing your purchase.
      </p>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">1. Tickets and purchases</h2>
        <p className="mb-3">
          All ticket sales are final. We do not offer refunds, exchanges, or transfers unless an event
          is cancelled by Studio 3.
        </p>
        <p>
          Tickets are non-transferable. The name on the order must match a valid government-issued ID
          presented at the door.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">2. Age requirement</h2>
        <p className="mb-3">
          This event is strictly 21+. Valid photo ID is required for entry. Studio 3 reserves the right
          to deny entry to anyone who cannot verify their age or whose ticket cannot be validated.
        </p>
        <p>
          No refund will be issued for denied entry due to age or failure to present valid ID.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">3. Event changes and cancellation</h2>
        <p className="mb-3">
          Studio 3 reserves the right to modify event details (including date, time, venue, lineup,
          and programming) at any time. We will make reasonable efforts to notify ticket holders of
          material changes via the email provided at checkout.
        </p>
        <p>
          In the event of a full cancellation by Studio 3, ticket holders will receive a full refund to
          the original payment method. Refunds will not be issued for partial changes (e.g., artist or DJ
          substitutions, schedule adjustments).
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">4. Entry and conduct</h2>
        <p className="mb-3">
          Studio 3 and Dec on Dragon reserve the right to refuse entry or remove any guest from the event
          at their discretion, including for disruptive, unsafe, or inappropriate behavior. No refund will
          be issued in these circumstances.
        </p>
        <p>
          By attending, you agree to comply with all venue rules and the direction of event staff and
          security.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">5. Photography and recording</h2>
        <p>
          By attending a Studio 3 event, you acknowledge that photography, video, and audio recording
          may take place. You consent to your likeness being captured and used by Studio 3 for
          promotional, editorial, and marketing purposes without compensation.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">6. Limitation of liability</h2>
        <p className="mb-3">
          Third Place Studios LLC is not liable for any injury, loss, or damage (personal or property)
          sustained at or in connection with a Studio 3 event, except where required by law.
        </p>
        <p>
          Our total liability to you for any claim arising from a ticket purchase is limited to the amount
          you paid for that ticket.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">7. Use of our site</h2>
        <p className="mb-2">You agree to use studiosthree.com only for lawful purposes. You may not:</p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Attempt to gain unauthorized access to any part of the platform</li>
          <li>Use the site to distribute spam or malicious content</li>
          <li>Scrape, copy, or reproduce site content without written permission from Studio 3</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate access for anyone who violates these terms.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">8. Intellectual property</h2>
        <p className="mb-3">
          All content on studiosthree.com, including the Studio 3 name, logo, design, and original copy,
          is the property of Third Place Studios LLC. Nothing in these terms grants you a license to use
          our intellectual property without written permission.
        </p>
        <p>
          Artist-submitted content remains the property of the respective artist. Studio 3 does not claim
          ownership over artwork or creative work uploaded to the platform.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">9. Governing law</h2>
        <p>
          These terms are governed by the laws of the State of Texas. Any disputes arising from these
          terms or your use of our platform will be resolved in the courts of Dallas County, Texas.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">10. Changes to these terms</h2>
        <p>
          We may update these terms as the platform evolves. Continued use of the site or platform after
          changes are posted constitutes your acceptance of the updated terms. The effective date at the
          top of this page reflects the most recent version.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">11. Contact</h2>
        <p className="mb-1">Questions about these terms:</p>
        <p className="font-semibold text-gray-900">Third Place Studios LLC, d/b/a Studio 3</p>
        <p>Dallas, TX</p>
        <p>
          <SupportEmailLink />
        </p>
      </section>
    </div>
  );
}

export default TermsContent;
