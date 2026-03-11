import * as React from "react";

interface EmailTemplateProps {
  email: string;
  phone: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  phone,
  message,
}) => (
  <div>
    <h1>New Contact Message</h1>
    <p><strong>Email:</strong> {email}</p>
    {phone && <p><strong>Phone:</strong> {phone}</p>}
    <p><strong>Message:</strong></p>
    <p>{message}</p>
  </div>
);