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
    <div className="space-y-8 md:pb-24">
      <div className="text-center space-y-4">
        <div className="relative flex justify-center items-center h-32 md:h-40 my-4 overflow-hidden">
          <div className="z-10 bg-background px-2 sm:px-4 flex items-center justify-center gap-x-8 sm:gap-x-12">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground">
              QRU
            </h1>
            <div className="h-24 md:h-32 flex justify-center gap-x-4">
              <div className="w-2 h-full bg-foreground"></div>
              <div
                className="w-2 h-full animate-road-dashes"
                style={{
                  background:
                    "repeating-linear-gradient(to bottom, hsl(var(--foreground)), hsl(var(--foreground)) 20px, transparent 20px, transparent 40px)",
                }}
              ></div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground">
              UEI
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground -mt-4">
          Selecione o tipo de ocorrência para gerar o relatório
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por ocorrência, código ou PR..."
          className="pl-12 pr-4 h-12 text-base bg-card focus-visible:ring-primary shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
