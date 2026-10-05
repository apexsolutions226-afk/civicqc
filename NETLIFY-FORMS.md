# CivicQC — Netlify Forms launch checklist

The six-step booking flow is implemented for Netlify Forms. **No Netlify account, production domain, live inbox or real submission has been connected or verified from this workspace.** Complete the following steps in the site owner's account.

## 1. Deploy the latest build

For a connected Git repository, the included `netlify.toml` uses Node 22, `npm run build` and the `dist` publish directory. For a manual deployment, upload the **contents of the newly built `dist/` folder**, including `netlify-booking-form.html`, `_redirects`, all route folders and assets. Do not upload only the React source or an old build.

## 2. Enable form detection, then redeploy

In the Netlify project's Forms settings, enable **form detection**. Redeploy after enabling it: detection applies to a new deployment, not retroactively. Confirm that the form named **`civicqc-inspection-request`** appears in the Forms dashboard. The static definition registers every field used by the React wizard. [1](https://docs.netlify.com/manage/forms/setup/) [2](https://docs.netlify.com/resources/troubleshooting/troubleshooting-faq/)

Keep `public/netlify-booking-form.html` in the project. When Netlify processes it, it removes its detection attribute and injects a hidden `form-name` input. The booking flow checks for this processed definition before attempting a POST, so a static development server cannot accidentally masquerade as a working submission backend. [1](https://docs.netlify.com/manage/forms/setup/)

## 3. Configure owner notifications

Configure the form's email notifications in the Netlify project to notify **civicqc.consultants@gmail.com**, or another inbox authorised by CivicQC. Form receipt in the dashboard and delivery of an email notification are different things: verify both, and continue monitoring the dashboard and spam submissions. Notification configuration belongs to the Netlify account, not to an invented client-side mail service. [4](https://docs.netlify.com/prompt-templates/netlify/add-a-contact-form/)

## 4. Verify a real submission after deployment

Use your own test details and explicit consent:

1. Open `/book-inspection` on the deployed domain.
2. Select a service, property type/size and preferred date.
3. Enter usable contact/property information and agree to the privacy notice.
4. Review the estimated **professional fee** and any additional laboratory-charge note.
5. Submit once.
6. Confirm the website shows **Inspection Request Submitted** only after the request is accepted.
7. Verify the same request reference and all fields in Netlify Forms, and check the configured notification inbox.
8. Delete the test record when appropriate for your records policy.

The website does not take payment, reserve an appointment or create a final quotation. CivicQC confirms availability, scope and final charges manually.

## Behavior in previews and failures

- **Unprocessed form definition:** no POST is attempted. The visitor sees that online collection is not active and can prepare/send the same request on WhatsApp.
- **Accepted POST:** the page displays `Inspection Request Submitted` and `Our team will contact you to confirm availability and final scope.`
- **Non-success response / network error:** no false success screen. Details remain available to retry or hand off to WhatsApp. A timeout can mean receipt is uncertain; the UI says it could not confirm receipt.
- Multiple submissions are disabled while a request is pending. Retries retain the same client-generated request reference for operator reconciliation.
- The homepage's separate quick-enquiry form remains an explicitly labelled WhatsApp handoff, not a Netlify submission.

## Fields and consent

The static definition and URL-encoded POST payload include the request reference, service ID/name, property type/size, approximate area, preferred date, name, phone, optional email, locality, property address, optional requirements, estimated professional fee, estimate basis, laboratory-charge caveat, consent and honeypot field.

Netlify requires a matching static definition for JavaScript-rendered form fields, along with a matching `form-name` and URL-encoded POST body. Keep both definitions in sync when adding fields. [1](https://docs.netlify.com/manage/forms/setup/) [2](https://docs.netlify.com/resources/troubleshooting/troubleshooting-faq/)

The estimate is client-provided information for an enquiry, **not an authoritative invoice**. Review the scope and published rates before issuing a final quotation. No card details, identity documents, payment details or unnecessary sensitive information should be requested in this form.

## Production URL

Set the actual public HTTPS origin in `.env` before building:

```env
VITE_SITE_URL=https://YOUR-ACTUAL-DOMAIN
```

Replace that placeholder. The build then produces absolute canonical/social URLs and `sitemap.xml`. With no domain configured, static canonical paths remain relative and the client resolves them against its current origin. Rebuild when the final domain changes.

## Testing status

The workspace tests intercept form collection and POST requests to exercise both success and failure paths without submitting real personal information. They verify the payload, client validation, consent, pricing qualifications, preview fallback and accessible status handling. These tests do not prove a live Netlify account's configuration or email deliverability.
