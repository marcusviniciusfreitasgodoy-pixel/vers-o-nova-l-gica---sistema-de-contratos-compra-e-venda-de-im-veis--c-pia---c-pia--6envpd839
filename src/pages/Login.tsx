import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Navigate, Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import defaultLogoUrl from '@/assets/logotipo-negativo-01-eb1e3.png'
import pb from '@/lib/pocketbase/client'

export default function Login() {
  const { user, signIn, loading } = useAuth()
  const [email, setEmail] = useState('marcus@godoyprime.com.br')
  const [password, setPassword] = useState('Skip@Pass')
  const [isLoading, setIsLoading] = useState(false)
  const [branding, setBranding] = useState({
    name: 'GPR - Gerador de Contratos',
    logo: defaultLogoUrl,
  })
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    let mounted = true

    async function fetchBranding() {
      try {
        // Safe handling of optional backend resources during authentication.
        // Unauthenticated access to restricted collections returns 404 in PocketBase.
        // We use try/catch to avoid unhandled promise rejections that crash the app.
        const company = await pb.collection('companies').getFirstListItem('', { requestKey: null })
        if (mounted && company) {
          setBranding((prev) => ({
            name: company.name || prev.name,
            logo: prev.logo,
          }))
        }
      } catch (error) {
        // Silently ignore 404 Not Found to prevent crash, safe fallback is used instead.
      }
    }

    fetchBranding()

    return () => {
      mounted = false
    }
  }, [])

  if (user && !loading && !isLoading) {
    return <Navigate to={from} replace />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sidebar">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const { error } = await signIn(email, password)
    setIsLoading(false)
    if (error) {
      toast.error('Falha ao fazer login. Verifique suas credenciais.')
    }
  }

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4 animate-in fade-in">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/5 backdrop-blur-md text-white mx-auto">
        <CardHeader className="text-center pb-8 pt-8 px-4 sm:px-8">
          <div className="mx-auto mb-8 flex justify-center">
            <img src={branding.logo} alt="Logo" className="h-16 object-contain" />
          </div>
          <CardTitle className="text-2xl text-white font-display font-medium tracking-wide">
            {branding.name}
          </CardTitle>
          <CardDescription className="text-base mt-2 text-white/70">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 focus-visible:ring-primary"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base h-12 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            <div className="text-center text-sm text-white/70 mt-6">
              Não tem uma conta?{' '}
              <Link to="/signup" className="text-primary hover:underline font-semibold">
                Cadastre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
