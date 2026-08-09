import emailjs from '@emailjs/browser';
import { getVisitorLocation } from './geo';
export const sendConfirmationEmail = async ({ name, date, time, foods }) => {
  const { VITE_EMAILJS_SERVICE_ID: service, VITE_EMAILJS_TEMPLATE_ID: template, VITE_EMAILJS_PUBLIC_KEY: key, VITE_RECIPIENT_EMAIL: to } = import.meta.env;
  if (!service || !template || !key || !to) throw new Error('EmailJS is not configured. Add the service ID, template ID, and public key to .env.');
  const { ip, location } = await getVisitorLocation();
  return emailjs.send(service, template, { subject: 'Your Best Friend Accepted!', visitor_name: name || 'Someone', selected_date: date, selected_time: time, selected_foods: foods.join(', '), timestamp: new Date().toLocaleString(), visitor_ip: ip, visitor_location: location, to_email: to }, key);
};
