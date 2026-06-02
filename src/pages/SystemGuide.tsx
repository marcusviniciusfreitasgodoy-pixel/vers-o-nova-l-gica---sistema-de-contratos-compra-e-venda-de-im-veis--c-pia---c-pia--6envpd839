import { useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search, BookOpen, Scale } from 'lucide-react'
import { toast } from 'sonner'

export default function SystemGuide() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSawSearch] = useState(false)

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSawSearch(true)
    try {
      const res = await pb.send('/backend/v1/search/legal-knowledge', {
        method: 'POST',
        body: JSON.stringify({ query: query.trim(), k: 10 }),
      })
      setResults(res.items || [])
    } catch (err) {
      console.error(err)
      toast.error('Erro ao buscar na base jurídica.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl animate-in fade-in space-y-6">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
          <BookOpen className="h-8 w-8 text-primary" />
          Guia do Sistema e Base Jurídica
        </h1>
        <p className="text-muted-foreground">
          Pesquise por legislação, jurisprudência, boas práticas, cláusulas e checklists utilizando
          nossa busca semântica inteligente.
        </p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Como funciona a cláusula de arrependimento em promessas de compra e venda?"
                className="pl-10 h-11 text-base"
              />
            </div>
            <Button type="submit" className="h-11 px-8" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pesquisar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && (
        <div className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Scale className="h-5 w-5 text-indigo-500" />
            Resultados da Pesquisa
          </h2>

          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center p-12 border rounded-xl bg-slate-50 border-dashed">
              <p className="text-muted-foreground">Nenhum resultado encontrado para a sua busca.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((item, i) => (
                <Card
                  key={item.id || i}
                  className="overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <CardHeader className="bg-slate-50/50 pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg text-slate-800">{item.title}</CardTitle>
                      <Badge variant="outline" className="capitalize whitespace-nowrap bg-white">
                        {item.category?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
                      {item.content}
                    </p>
                    {item.code && (
                      <div className="mt-4 p-3 bg-slate-100 rounded-md border border-slate-200">
                        <code className="text-xs text-slate-800 font-mono">{item.code}</code>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
