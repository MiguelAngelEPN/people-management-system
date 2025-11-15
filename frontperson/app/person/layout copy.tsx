import "../globals.css";
import Sidebar from "@/Component/Sidebar";
import Header from "@/Component/Header";

export const metadata = {
  title: "People System - Panel",
  description: "Administración interna",
};

export default function PersonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="layoutContainer">
          <Sidebar />

          <div className="mainContent">
            <Header />
            <main className="pageInner">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
