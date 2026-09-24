import type { Metadata } from 'next';import './globals.css';
export const metadata:Metadata={
  title:'GGCDC | Community Development Platform',
  description:'GGCDC council workspace for community rights, Putu mining commitments and development monitoring',
  icons: {
    icon: [
      { url: './favicon.svg', type: 'image/svg+xml' },
      { url: './favicon.png', type: 'image/png' }
    ],
    apple: './logo.png'
  }
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
