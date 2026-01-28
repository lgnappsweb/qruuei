"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Search, Link as LinkIcon, AlertTriangle, TrafficCone, FileText, StickyNote, Map, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { occurrences } from "@/lib/occurrences";
import { OccurrenceCard } from "@/components/occurrence-card";
import { searchableData, type SearchableItem } from "@/lib/search";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const categoryIcons: { [key: string]: React.ElementType } = {
  'Ocorrência': AlertTriangle,
  'Código de Ocorrência': FileText,
  'Código de Ação/Providência': FileText,
  'Código de Pane': FileText,
  'Código de Outras Mensagens': FileText,
  'Código de Mensagem': FileText,
  'Código Q (Alfabeto Fonético)': FileText,
  'Relacionamentos': FileText,
  'Ponto de Apoio': Map,
  'Link Útil': LinkIcon,
  'Placa de Regulamentação': TrafficCone,
  'Placa de Advertência': TrafficCone,
  'Placa de Indicação': TrafficCone,
  'Ocorrência Salva': StickyNote,
  'Nota': StickyNote,
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerCaseTerm = term.toLowerCase();
    
    // Define common Portuguese "stop words" to ignore in search
    const stopWords = new Set([
      'a', 'o', 'e', 'é', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na',
      'nos', 'nas', 'um', 'uma', 'uns', 'umas', 'com', 'por', 'para', 'pra',
      'sem', 'sob', 'sobre', 'se', 'seu', 'sua', 'seus', 'suas', 'qual', 'quais',
      'como', 'quando', 'onde', 'quem', 'que', 'quê', 'cujo', 'cuja', 'cujos',
      'cujas', 'usado', 'tipo', 'tipos', 'de', 'ocorrencia', 'ocorrencias',
      'codigo', 'codigos', 'sobre', 'fazer'
    ]);

    // Split search term into individual words (tokens) and filter out stop words
    const searchTokens = lowerCaseTerm
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
      .split(/\s+/)
      .filter(t => t.length > 1 && !stopWords.has(t));

    // If after filtering, there are no valid search tokens, perform a simple "includes" search
    if (searchTokens.length === 0) {
      const fallbackResults = searchableData.filter(item => 
          item.title.toLowerCase().includes(lowerCaseTerm) ||
          item.content.toLowerCase().includes(lowerCaseTerm) ||
          (item.code && item.code.toLowerCase().includes(lowerCaseTerm))
      );
      setSearchResults(fallbackResults);
      return;
    }

    // Score each item in searchableData based on matches
    const scoredResults = searchableData.map(item => {
      let score = 0;
      const title = item.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const content = item.content.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const code = item.code ? item.code.toLowerCase() : '';

      searchTokens.forEach(token => {
        // Higher score for exact code match
        if (code === token) {
            score += 20;
        } else if (code.includes(token)) {
            score += 10;
        }
        // Medium score for title match
        if (title.includes(token)) {
            score += 5;
        }
        // Lower score for content match
        if (content.includes(token)) {
            score += 1;
        }
      });
      
      return { ...item, score };
    })
    .filter(item => item.score > 0) // Keep only items that have a score
    .sort((a, b) => b.score - a.score); // Sort by score descending

    setSearchResults(scoredResults);
  };


  return (
    <div className="space-y-8">
      <div className="relative flex justify-center items-center h-32 my-4">
        <div className="z-10 bg-background px-2 sm:px-4 flex items-center justify-center gap-x-12">
          <h1 className="font-condensed text-7xl font-black tracking-tighter text-foreground">
            QRU
          </h1>
          <div className="h-24 flex justify-center gap-x-1 overflow-hidden -my-4">
            <div className="w-1.5 h-full bg-foreground"></div>
            <div
              className="w-1.5 h-[calc(100%+40px)] animate-road-dashes"
            ></div>
          </div>
          <h1 className="font-condensed text-7xl font-black tracking-tighter text-foreground">
            UEI
          </h1>
        </div>
      </div>
      <p className="text-muted-foreground -mt-4 text-center">
        Selecione o tipo de ocorrência ou busque por qualquer informação.
      </p>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por ocorrência, código, placa, nota..."
          className="pl-12 pr-4 h-12 text-base bg-card focus-visible:ring-primary shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {searchTerm.trim() === "" ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {occurrences.map((occurrence) => (
              <OccurrenceCard key={occurrence.id} occurrence={occurrence} />
            ))}
          </div>
        ) : (
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle>Resultados da Busca</CardTitle>
                    <CardDescription>{searchResults.length} resultado(s) encontrado(s) para "{searchTerm}"</CardDescription>
                </CardHeader>
                <CardContent>
                    {searchResults.length > 0 ? (
                    <ScrollArea className="h-[50vh]">
                        <div className="space-y-4">
                            {searchResults.map((item) => {
                                const Icon = categoryIcons[item.category] || HelpCircle;
                                return (
                                <Link href={item.link} key={item.id} className="block p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                                    <div className="flex items-center gap-4">
                                            <Icon className="h-6 w-6 text-muted-foreground" />
                                        <div className="flex-1">
                                            <p className="font-semibold">{item.title} {item.code && <span className="font-mono text-sm bg-muted p-1 rounded-md">{item.code}</span>}</p>
                                            <p className="text-sm text-muted-foreground">{item.category}</p>
                                            {item.content && <p className="text-sm text-muted-foreground mt-1 truncate">{item.content}</p>}
                                        </div>
                                    </div>
                                </Link>
                                )
                            })}
                        </div>
                    </ScrollArea>
                    ) : (
                        <p className="text-center text-muted-foreground py-12">Nenhum resultado encontrado.</p>
                    )}
                </CardContent>
            </Card>
        )}
    </div>
  );
}
