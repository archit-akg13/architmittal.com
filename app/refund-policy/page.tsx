import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund and Cancellation Policy',
  description: 'Refund and Cancellation Policy for architmittal.com',
}

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-heading font-bold text-3xl text-heading mb-8">Refund and Cancellation Policy</h1>
      <div className="font-body text-body text-sm leading-relaxed space-y-6">
        <p>
          Upon completing a Transaction, you are entering into a legally binding and enforceable agreement with us to purchase the product and/or service. After this point the User may cancel the Transaction unless it has been specifically provided for on the Platform. In which case, the cancellation will be subject to the terms mentioned on the Platform.
        </p>
        <p>
          We shall retain the discretion in approving any cancellation requests and we may ask for additional details before approving any requests.
        </p>
        <p>
          Once you have received the product and/or service, the only event where you can request for a replacement or a return and a refund is if the product and/or service does not match the description as mentioned on the Platform.
        </p>
        <p>
          Any request for refund must be submitted within three days from the date of the Transaction or such number of days prescribed on the Platform, which shall in no event be less than three days.
        </p>
        <p>
          A User may submit a claim for a refund for a purchase made, by raising a ticket or contacting us at <a href="mailto:archit.akg13@gmail.com" className="text-lime hover:underline">archit.akg13@gmail.com</a> and providing a clear and specific reason for the refund request, including the exact terms that have been violated, along with any proof, if required.
        </p>
        <p>
          Whether a refund will be provided will be determined by us, and we may ask for additional details before approving any requests.
        </p>
      </div>
    </div>
  )
}
