import LoginForm from "@/components/auth/LoginForm"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Footer from "@/components/Footer"
import Title from "@/components/Title"


export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/chat")
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Title />
      <LoginForm />
      <Footer />
    </div>
  )
}
