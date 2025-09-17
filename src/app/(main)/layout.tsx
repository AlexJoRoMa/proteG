import Navigation from "@/components/molecules/navigation";
import Footer from "@/components/molecules/footer";
import ButtonFixed from "@/components/atoms/ButtonSticky";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
      <ButtonFixed />
    </>
  );
}