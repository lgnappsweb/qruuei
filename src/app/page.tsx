"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { occurrences } from "@/lib/occurrences";
import { OccurrenceCard } from "@/components/occurrence-card";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOccurrences = occurrences.filter((occurrence) =>
    occurrence.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          QRU | PRIORIDADE
        </h1>
        <p className="text-muted-foreground mt-2">
          Selecione o tipo de ocorrência para gerar o relatório
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por ocorrência, código ou PR..."
          className="pl-12 pr-4 h-12 text-base bg-card border-0 focus-visible:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-24">
        {filteredOccurrences.map((occurrence) => (
          <OccurrenceCard key={occurrence.id} occurrence={occurrence} />
        ))}
        {filteredOccurrences.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            Nenhuma ocorrência encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
