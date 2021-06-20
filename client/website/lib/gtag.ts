export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export function handleEvent(category, label) {
  (window as any).gtag('send', 'event', {
    eventCategory: category,
    eventAction: 'click',
    eventLabel: label,
    transport: 'beacon'
  });
}