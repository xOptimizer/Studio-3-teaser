const PRIVACY_EMAIL = 'privacy@studio-3.co';

function PrivacyEmailLink() {
  return (
    <a href={`mailto:${PRIVACY_EMAIL}`} className="font-semibold text-gray-900 underline underline-offset-2 hover:opacity-80">
      {PRIVACY_EMAIL}
    </a>
  );
}

function PrivacyPolicyContent() {
  return (
    <div className="space-y-8 text-gray-900 text-sm md:text-base leading-relaxed">
      <p>
        We built Studio 3 for creators, so we try to handle your information the way we&apos;d want ours
        handled: with care and without clutter. This policy explains what we collect, why we collect it,
        and how you can control it.
      </p>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">What we collect</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">When you purchase a ticket or register for an event</h3>
            <p>
              We collect your name, email address, and payment information. Payment data is processed by
              a third-party payment provider and is not stored on our servers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">When you create a Studio 3 account</h3>
            <p>We collect your email address to create and manage your account.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">When you visit our site</h3>
            <p>
              We collect standard usage data (IP address, browser type, pages visited, and referring URLs)
              through analytics tools to understand how people use our site and improve it.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">How we use your information</h2>
        <p className="mb-2">We use the information we collect to:</p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Process ticket purchases and send order confirmations</li>
          <li>Authenticate your account and maintain session security</li>
          <li>Send transactional communications related to your account or purchase</li>
          <li>Send event reminders and product announcements you&apos;ve opted into</li>
          <li>Improve our platform, features, and content</li>
        </ul>
        <p className="font-semibold text-gray-900">We do not sell your personal information to third parties.</p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">Sharing your information</h2>
        <p className="mb-3">We share your information only as necessary to operate the platform:</p>

        <div className="space-y-3">
          <p>
            <span className="font-semibold text-gray-900">Payment processors:</span>{' '}
            to handle transaction authorization and fraud prevention
          </p>
          <p>
            <span className="font-semibold text-gray-900">Email and SMS service providers:</span>{' '}
            to deliver transactional and marketing communications you&apos;ve opted into
          </p>
          <p>
            <span className="font-semibold text-gray-900">Analytics providers:</span>{' '}
            to understand site usage; this data is aggregated and not individually identifiable where possible
          </p>
          <p>
            <span className="font-semibold text-gray-900">Legal requirements:</span>{' '}
            if required by law, court order, or to protect the rights and safety of Studio 3 or others
          </p>
        </div>

        <p className="mt-3 font-semibold text-gray-900">We do not share your information with advertisers.</p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">Email communications</h2>
        <p className="mb-3">
          By providing your email address, you may receive transactional messages related to your purchase
          or account (order confirmations, event updates). These cannot be opted out of as they are
          necessary to complete your transaction.
        </p>
        <p className="mb-3">
          If you opt into marketing emails, you can unsubscribe at any time by clicking the unsubscribe
          link in any email or by contacting us at <PrivacyEmailLink />.
        </p>
        <p>
          <span className="font-semibold text-gray-900">CAN-SPAM compliance:</span>{' '}
          All marketing emails include a clear unsubscribe mechanism and our mailing address: Third Place
          Studios LLC, Dallas, TX.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">SMS communications</h2>
        <p className="mb-3">
          By providing your phone number and opting in, you consent to receive text messages from Studio 3
          regarding your event, account, or product updates. Message frequency is limited, typically no
          more than two messages per campaign (e.g., an event reminder and a launch announcement).
        </p>
        <p className="mb-3">
          Standard message and data rates may apply depending on your carrier and plan.
        </p>
        <p className="mb-3">
          <span className="font-semibold text-gray-900">To opt out at any time:</span>{' '}
          Reply STOP to any message from us. You will receive one confirmation message and no further texts.
        </p>
        <p className="mb-3">
          <span className="font-semibold text-gray-900">For help:</span>{' '}
          Reply HELP or contact us at <PrivacyEmailLink />.
        </p>
        <p>
          We do not share your phone number with third parties for their own marketing purposes.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">Cookies and tracking</h2>
        <p className="mb-3">
          Our site uses cookies and similar technologies to maintain session state, remember preferences,
          and understand how visitors interact with our platform. You can control cookie behavior through
          your browser settings, though disabling certain cookies may affect site functionality.
        </p>
        <p>We do not use third-party advertising cookies.</p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">Data retention</h2>
        <p>
          We retain your personal information for as long as your account is active or as needed to provide
          services. If you request deletion, we will remove your data from our active systems, subject to
          any legal obligations requiring retention (such as payment records).
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">Your rights</h2>
        <p className="mb-2">Depending on where you live, you may have the right to:</p>
        <ul className="list-disc pl-5 space-y-1 mb-3">
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Opt out of certain data processing activities</li>
          <li>Receive a copy of your data in a portable format</li>
        </ul>
        <p className="mb-3">
          <span className="font-semibold text-gray-900">California residents:</span>{' '}
          Under the California Consumer Privacy Act (CCPA), you have the right to know what personal
          information we collect, request deletion, and opt out of any sale of your information. We do not
          sell personal information.
        </p>
        <p>
          To exercise any of these rights, contact us at <PrivacyEmailLink />. We will respond within 30 days.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">Children&apos;s privacy</h2>
        <p>
          Studio 3 services are not directed to children under the age of 13, and we do not knowingly
          collect personal information from children under 13. Our ticketed events are 21+ and the platform
          is intended for adult users. If you believe we have inadvertently collected information from a
          child, please contact us at <PrivacyEmailLink /> and we will delete it promptly.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">Changes to this policy</h2>
        <p>
          We may update this policy as our platform evolves. If we make material changes, we will notify
          you via email or a prominent notice on our site before the changes take effect. The effective date
          at the top of this page will always reflect the most recent version.
        </p>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3 text-gray-900">Contact</h2>
        <p className="mb-1">Questions about this policy or your data:</p>
        <p className="font-semibold text-gray-900">Third Place Studios LLC, d/b/a Studio 3</p>
        <p>Dallas, TX</p>
        <p>
          <PrivacyEmailLink />
        </p>
      </section>
    </div>
  );
}

export default PrivacyPolicyContent;
