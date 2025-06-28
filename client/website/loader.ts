export default function cloudfrontLoader({ src, width, quality }) {
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`];
  return `https://d7xe6a0v1wpai.cloudfront.net/${src}`;
}
