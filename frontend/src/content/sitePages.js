export const sitePages = {
  about: {
    title: 'About EasyGo',
    subtitle: 'Premium vehicle rentals, built on trust.',
    sections: [
      {
        heading: 'Our mission',
        body: 'EasyGo connects renters with verified individual hosts and fleet organizations. We focus on transparent pricing, offline-friendly payments, and a smooth handoff from booking to pickup.',
      },
      {
        heading: 'What we offer',
        body: 'Search luxury, sports, SUV, and electric vehicles across cities. Every listing includes clear deposit rules, accessory options, and direct messaging with the host.',
      },
    ],
  },
  careers: {
    title: 'Careers',
    subtitle: 'Help us redefine mobility marketplaces.',
    sections: [
      { heading: 'Open roles', body: 'We are hiring engineers, operations specialists, and customer success leads. Send your resume to careers@easygo.com with the role in the subject line.' },
      { heading: 'Culture', body: 'Remote-friendly, product-focused, and obsessed with renter and host experience.' },
    ],
  },
  blog: {
    title: 'Blog',
    subtitle: 'Tips, guides, and product updates.',
    sections: [
      { heading: 'Latest posts', body: '• How to prepare for your first peer-to-peer rental\n• Fleet hosting checklist for organizations\n• Understanding offline deposits and refunds' },
    ],
  },
  press: {
    title: 'Press',
    subtitle: 'Media resources and announcements.',
    sections: [
      { heading: 'Contact', body: 'For press inquiries email press@easygo.com. Brand assets and logos are available on request.' },
    ],
  },
  help: {
    title: 'Help Center',
    subtitle: 'Answers to common questions.',
    sections: [
      { heading: 'Booking', body: 'Search for a vehicle, choose dates, and submit a request. The host approves before pickup.' },
      { heading: 'Payments', body: 'EasyGo uses offline payment at pickup. Owners mark payment received in their dashboard after handoff.' },
      { heading: 'Need more help?', body: 'Open a support ticket from your dashboard settings or visit the Contact page.' },
    ],
  },
  safety: {
    title: 'Safety Information',
    subtitle: 'How we keep rentals secure.',
    sections: [
      { heading: 'Verification', body: 'Hosts and organizations can submit verification documents. Admins review pending organizations.' },
      { heading: 'On the road', body: 'Always verify license, vehicle condition, and fuel level at pickup. Report issues via support immediately.' },
    ],
  },
  cancellation: {
    title: 'Cancellation Options',
    subtitle: 'Flexible policies by host.',
    sections: [
      { heading: 'Before approval', body: 'You may cancel a pending request from your dashboard before the host approves.' },
      { heading: 'After approval', body: 'Contact the host via messages to agree on changes. Late fees may apply per the rental agreement.' },
    ],
  },
  trust: {
    title: 'Trust & Safety',
    subtitle: 'Community standards for renters and hosts.',
    sections: [
      { heading: 'Reviews', body: 'After your trip, leave a rating on the vehicle page to help the community.' },
      { heading: 'Disputes', body: 'Support tickets are reviewed by our team. Provide booking ID and photos when reporting damage.' },
    ],
  },
  insurance: {
    title: 'Insurance & Protection',
    subtitle: 'Understand coverage before you drive.',
    sections: [
      { heading: 'Deposits', body: 'Security deposits are held offline and refunded when the vehicle is returned in agreed condition.' },
      { heading: 'Host responsibility', body: 'Organizations and individual hosts maintain insurance appropriate for their fleet. Ask for proof at pickup.' },
    ],
  },
  'host-guidelines': {
    title: 'Host Guidelines',
    subtitle: 'Best practices for listing vehicles.',
    sections: [
      { heading: 'Accurate listings', body: 'Keep photos, pricing, and location up to date. Use the fleet dashboard to edit vehicles anytime.' },
      { heading: 'Timely responses', body: 'Approve or decline booking requests quickly and use in-app messages for coordination.' },
    ],
  },
  community: {
    title: 'Community Hub',
    subtitle: 'Connect with hosts and renters.',
    sections: [
      { heading: 'Events', body: 'Monthly virtual meetups for fleet operators and enthusiast hosts.' },
      { heading: 'Forum', body: 'Share maintenance tips and regional driving guides with other EasyGo members.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Last updated September 2026',
    sections: [
      { heading: 'Data we collect', body: 'Account information, booking history, and messages needed to operate the marketplace.' },
      { heading: 'Your choices', body: 'You may request export or deletion of your account by contacting support@easygo.com.' },
    ],
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'Agreement between you and EasyGo',
    sections: [
      { heading: 'Use of platform', body: 'You must provide accurate identity information and comply with local rental laws.' },
      { heading: 'Offline payments', body: 'EasyGo facilitates bookings but does not process card payments for rentals. Payment terms are between renter and host.' },
    ],
  },
  sitemap: {
    title: 'Sitemap',
    subtitle: 'All main pages on EasyGo',
    sections: [
      {
        heading: 'Explore',
        body: 'Home (/), Search (/search), Vehicle details (/vehicles/:id), Book (/book/:id)',
      },
      {
        heading: 'Account',
        body: 'Login (/login), Customer dashboard (/dashboard), Host dashboard (/list), Admin (/admin), Messages (/messages/:bookingId)',
      },
      {
        heading: 'Company & support',
        body: 'About, Careers, Blog, Press, Help, Safety, Cancellation, Trust, Contact, Privacy, Terms',
      },
    ],
  },
  contact: {
    title: 'Contact Us',
    subtitle: 'We are here to help.',
    sections: [
      { heading: 'Email', body: 'support@easygo.com' },
      { heading: 'Phone', body: '+1 (800) 555-0199' },
      { heading: 'Office', body: '100 Market Street, San Francisco, CA' },
    ],
  },
};

export const footerLinks = {
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Careers', to: '/careers' },
    { label: 'Blog', to: '/blog' },
    { label: 'Press', to: '/press' },
  ],
  support: [
    { label: 'Help Center', to: '/help' },
    { label: 'Safety Information', to: '/safety' },
    { label: 'Cancellation Options', to: '/cancellation' },
    { label: 'Trust & Safety', to: '/trust' },
  ],
  hosting: [
    { label: 'List your vehicle', to: '/list' },
    { label: 'Insurance & Protection', to: '/insurance' },
    { label: 'Host Guidelines', to: '/host-guidelines' },
    { label: 'Community Hub', to: '/community' },
  ],
  legal: [
    { label: 'Privacy', to: '/privacy' },
    { label: 'Terms', to: '/terms' },
    { label: 'Sitemap', to: '/sitemap' },
  ],
};
