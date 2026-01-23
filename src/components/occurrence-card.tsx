"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Occurrence } from "@/lib/occurrences";

type OccurrenceCardProps = {
  occurrence: Occurrence;
};

export function OccurrenceCard({ occurrence }: OccurrenceCardProps) {
  const { toast } = useToast();
  const Icon = occurrence.icon;

  const handleClick = () => {
    // TODO: Futuramente, este clique poderá buscar e exibir
    // um relatório detalhado do Firestore e salvar a ocorrência.
    toast({
      title: "Ocorrência Selecionada",
      description: `Você selecionou: ${occurrence.title}`,
    });
  };

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "hover:brightness-110 transition-all duration-200 cursor-pointer group shadow-lg",
        occurrence.cardColor
      )}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3 h-40">
        <div
          className={cn(
            "rounded-full p-4 transition-transform group-hover:scale-110 shadow-md",
            occurrence.color
          )}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
        <p
          className={cn(
            "font-condensed font-bold text-center text-card-foreground",
            occurrence.title.startsWith("TO") ? "text-2xl" : "text-xl"
          )}
        >
          {occurrence.title}
        </p>
      </CardContent>
    </Card>
  );
}
