/** @type {import('next').NextConfig} */
const nextConfig = {

    
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  matcher: ['/dashboard/:path*'], // faqat dashboard yo‘nalishlari uchun ishlaydi

};


export default nextConfig;
