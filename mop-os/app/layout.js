import "./globals.css";

export const metadata = {
  title: "MOP OS",
  description: "Plataforma interna de MOP Modular Places SAS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
