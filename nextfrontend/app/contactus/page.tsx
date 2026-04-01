export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Contact Support
          </h2>
          <p className="mt-4 text-center text-sm text-gray-600">
            We are here to help! Reach out to us for any questions regarding your orders or our products.
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="rounded-md shadow-sm -space-y-px space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">Message</label>
              <textarea id="message" name="message" rows={4} required className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="How can we help you?"></textarea>
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
