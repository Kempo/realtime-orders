export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// checkout, click, start_checkout
export function handleEvent({ category, action, label, value }: { category: string, action: string, label?: string, value?: number }) {
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
}