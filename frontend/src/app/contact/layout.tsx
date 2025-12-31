import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Church Name',
  description: 'Get in touch with us. We\'d love to hear from you!',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
