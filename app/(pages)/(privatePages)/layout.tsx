import { validateRequest } from "@/app/actions/auth/validateRequest";
import Footer from "@/src/components/footer";
import Header from "@/src/components/header";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let { user } = await validateRequest();

  return (
    <div className=" flex-1 flex flex-col  ">
      <Header withUser={true} user={user} />
      {children}
      <Footer />
    </div>
  );
}
