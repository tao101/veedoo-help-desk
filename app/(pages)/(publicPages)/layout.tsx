import Footer from "@/src/components/footer";
import Header from "@/src/components/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" flex-1 flex flex-col  ">
      <Header withUser={false} user={null} />
      {children}
      <Footer />
    </div>
  );
}
