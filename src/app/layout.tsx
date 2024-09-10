import './globals.css'
import type { Metadata } from 'next'
import React from "react";

export const metadata: Metadata = {
  title: 'TerraFirmaGreg Alloy Calculator',
  description: 'Calculate alloy recipes for TerraFirmaGreg',
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children : React.ReactNode
}>) {
  return (
      <html lang="en">
        <body>{children}</body>
      </html>
  )
}