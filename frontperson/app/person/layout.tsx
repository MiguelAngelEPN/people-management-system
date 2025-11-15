"use client";
import "../globals.css";
import Sidebar from "@/Component/Sidebar";
import Header from "@/Component/Header";

export default function PersonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <div className="layoutContainer">
          <Sidebar />

          <div className="mainContent">
            <Header />
            <main className="pageInner">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
